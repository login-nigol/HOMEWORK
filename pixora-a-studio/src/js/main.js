'use strict';

// === Импорты ===

import {
    $logo,$menuBtn, $dropdown,
    $stage, $stageStack, 
    $toolColor, $toolSize, $toolBtns, $toolFile,
    $layerBtns, $layerList,
    $panelToggle, $layersPanel,
    $muteBtn, $stickersBtn,
    $zoomInBtn, $zoomOutBtn, $undoBtn, $redoBtn,
    $rotateLeftBtn, $rotateRightBtn, $scaleUpBtn, $scaleDownBtn,
} from "./dom.js";

// UI-модули
import { LayersPanelUi } from "./ui/LayersPanelUi.js";
import { ShareLoader } from "./ui/ShareLoader.js";
import { TransformHandler } from "./ui/TransformHandler.js";
import { GalleryUi } from "./ui/GalleryUi.js";
import { IconLoader } from "./ui/IconLoader.js";
import { CanvasDialog } from "./ui/CanvasDialog.js";
import { WelcomeScreen } from "./ui/WelcomeScreen.js";
import { Logo } from "./ui/Logo.js";
import { ToolbarActions } from "./ui/ToolbarActions.js";
import { GestureHandler } from "./ui/GestureHandler.js";

// core-модули
import { Stage } from "./core/renderer/Stage.js";
import { History } from "./core/History.js";
import { BrushTool } from "./core/tools/BrushTool.js";
import { EraserTool } from "./core/tools/EraserTool.js";
import { MoveTool } from "./core/tools/MoveTool.js";

import { SoundService } from "./services/SoundService.js";
import { ProgressService } from "./services/ProgressService.js";

// === PWA установка ===

let _installPrompt = null; // сохраняем событие beforeinstallprompt

// === Константы зума ===

const ZOOM_STEP = 0.05; // шаг зума (5%)
const ZOOM_MIN = 0.3;  // минимальный масштаб (30%)
const ZOOM_MAX = 3;    // максимальный масштаб (300%)

// флаг - приложение готово к работе (после init)
let isReady = false;

// === Создание экзепляров (не зависят от размера холста)

// точка входа - экземпляры
const stage = new Stage($stageStack);
const history = new History();
const sound = new SoundService();

// === Инструменты (создаём поле первого слоя в createNewProject) ===

let tools ={};

// текущий активный инструмент
let activeTool = null;

// === Вспомогательные функции ===

// --- переключение активного инструмента
function switchTool(toolName) {
    // если инструмента не существует - выходим
    if ( !tools[toolName] ) return;

    // если уже активен ничего не делаем
    if ( tools[toolName] === activeTool ) return;
    
    // деактивируем старый слой, активируем новый
    activeTool.deactivate();
    activeTool = tools[toolName];
    activeTool.activate();
    
    // обновляем подсветку кнопок
    $toolBtns.forEach((b) => b.classList.remove('tool-btn--active'));
    document.querySelector(`[data-tool="${toolName}"]`)
        .classList.add('tool-btn--active');

    // синхронизируем ползунок с размеро нового инструмента
    if ( activeTool.size !== undefined ) {
        activeTool.size = Number($toolSize.value);
        // console.log('size:', activeTool.size, '$toolSize.value:', $toolSize.value);
    }

    // звук переключения
    sound.playToolSwitch();
}

// --- пепреключение слоя для всех инструментов
function switchLayerForTools(newLayer) {
    // перебираем все инструменты и переключаем слой
    Object.values(tools).forEach(tool => tool.setLayer(newLayer));
    
}

// --- добавление image-слоя из файла (переиспользуется в file, drop)
async function addImageLayer(file) {
    const imageLayer = stage.addLayer({ type: 'image'});
    await imageLayer.loadFromFile(file);
    switchLayerForTools(imageLayer);
    switchTool('move');
    layersPanel.render();
}

// --- создание нового проекта
async function createNewProject() {
    // console.log('createNewProject вызван');
    // console.trace('createNewProject вызван');
    const dialogResult = await CanvasDialog.show();
    // console.log('CanvasDialog result:', dialogResult);
    // console.log('result:', result);
    if ( !dialogResult ) return null;

    const { w, h } = dialogResult;

    // очищаем сцену - удаляем все слои
    while ( stage.layers.length > 0 ) {
        stage.removeLayer(stage.layers[0]);
    }

    // сбрасываем счётчик
    stage.layerIndex = 0;

    // обновляем размер контейнера
    $stageStack.style.width = w + 'px';
    $stageStack.style.height = h + 'px';

    // создаём первый пустой слой
    const drawLayer = stage.addLayer({ type: 'draw'});

    // создаём/пересоздаём инструменты
    tools.brush = new BrushTool(drawLayer, history, sound);
    tools.eraser = new EraserTool(drawLayer, history, sound);
    tools.move = new MoveTool(drawLayer, history, sound);

    activeTool = tools.brush;
    activeTool.activate();
    
    switchLayerForTools(drawLayer);
    // switchTool('brush');
    layersPanel.render();

    return true;
}

// --- применяем зум
let zoomLevel = 1;

function applyZoom() {    
    // console.log('applyZoom:', zoomLevel, $stageStack.style.transform);
    // console.log('before:', zoomLevel, 'calc:', zoomLevel - ZOOM_STEP);
    $stageStack.style.transform = `scale(${zoomLevel})`;
    $stageStack.style.transformOrigin = 'center center';
}

// === Панель слоёв ===

// --- колбэк при смене актвного слоя
const layersPanel = new LayersPanelUi(stage, $layerList, $layerBtns, (newLayer) => {
    // переключаем все инструменты на новый слой
    switchLayerForTools(newLayer);

    // автоопределение инструмента по типу слоя
    if ( newLayer.type === 'image' && activeTool !== tools.move ) {
        switchTool('move');
    } else if ( newLayer.type === 'draw' && activeTool === tools.move ) {
        switchTool('brush');
    }
}, sound);

// --- галерея стикеров и разукрашек
const gallery = new GalleryUi(
    stage, layersPanel,
    switchLayerForTools,
    switchTool
);

// === Обработчики: PWA установка ===

// браузер сигнализирует что приложение можно установить
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // не показываем автоматический баннер
    _installPrompt = e; // сохраняем событие

    // показываем кнопку установкии
    document.querySelector('[data-action="install-app"]')
        .removeAttribute('hidden');
});

// === Инициализация приложения ===

async function init() {
    // загружаем SVG-спрайт иконок
    await IconLoader.load();

    // инициализируем модалку прогресса
    ProgressService.init();

    // console.log('показываем welcome');
    // console.log('$logo:', $logo);
    Logo.render($logo);
    
    // показываем приветственный экран
    // await WelcomeScreen.show($stage);

    // если в URL есть параметр шаринга - пропускам приветствие
    const params = new URLSearchParams(window.location.search);
    const hasSharedProject = params.has('project') || params.has('view');

    if ( hasSharedProject ) {
        // загружаем шареный проект - ShareLoader уже вызван выше
        await ShareLoader.checkUrl(stage, layersPanel, switchLayerForTools);

        // инициализируем инструменты на старом слое
        const activeLayer = stage.activeLayer;
        tools.brush = new BrushTool(activeLayer, history, sound);
        tools.eraser = new EraserTool(activeLayer, history, sound);
        tools.move = new MoveTool(activeLayer, history, sound);
        activeTool = tools.brush;
        activeTool.activate();

        return; // показываем приветствие и не создаём новый проект
    }

    // обычный старт - приветствие + диалог
    let projectCreated = null;
    while ( !projectCreated ) {
        await WelcomeScreen.show($stage);
        projectCreated = await createNewProject();
    }
}

// === Обработчики: инструменты ===

// переключение инструментов по клику
$toolBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        switchTool(e.currentTarget.dataset.tool);
    });
});

// смена цвета кисти
$toolColor.addEventListener('input', (e) => {
    tools.brush.color = e.target.value;
});

// смена размера активного инструмента
$toolSize.addEventListener('input', (e) => {
    activeTool.size = Number(e.target.value);
});

// открытие галереи стикеров
$stickersBtn.addEventListener('click', () =>
    gallery.show('stickers'));


// === Обработчики: загрузка изображений ===

// загрузка картинки через input[type="file"]
$toolFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if ( !file ) return;

    // загружаем файл в слой
    await addImageLayer(file);

    // сбрасываем input чтобы можно было загрузить то же файл повторно
    e.target.value = '';
});


// === Обработчики: drag & drop - картинки на canvas ===

// разрешаем сброс (иначе браузер откроет файл)
$stageStack.addEventListener('dragover', (e) => {
    e.preventDefault();
});

// drop - загружаем файл в новый слой
$stageStack.addEventListener('drop', async (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    if ( !file || !file.type.startsWith('image/')) return;
    // загружаем файл в слой
    await addImageLayer(file);
});


// === ОБработчики: undo/redo ===

$undoBtn.addEventListener('click', () => {
    history.undo(stage);
    sound.playUndo();
});

$redoBtn.addEventListener('click', () => {
    history.redo(stage);
    sound.playRedo();
});


// === Обработчики: зума ===

$zoomInBtn.addEventListener('click', () => {
    if ( zoomLevel >= ZOOM_MAX ) return;
    // *100 & /100 - избегаем погрешности float
    zoomLevel = Math.round((zoomLevel + ZOOM_STEP) * 100) / 100;
    applyZoom();
});

$zoomOutBtn.addEventListener('click', () => {
    // console.log('zoom out', zoomLevel, ZOOM_MIN);
    if ( zoomLevel <= ZOOM_MIN ) return;
    zoomLevel = Math.round((zoomLevel - ZOOM_STEP) * 100) / 100;
    applyZoom();
});


// === Обработчики: горячие клавиши ===

// создать новый проект
document.addEventListener('keydown', (e) => {

    // console.log('key:', e.key, 'ctrl:', e.ctrlKey);

    // Ctrl+M - новый проект (только после завершения init)
    if ( e.ctrlKey && (e.key === 'm' || e.key === 'ь') ) {
        e.preventDefault();
        if ( isReady ) createNewProject();
    // Ctrl+shift+Z - redo (проверяем первым, иначе поймает Ctrl+Z)
    } else if ( e.ctrlKey && e.shiftKey && e.key === 'Z') {
        e.preventDefault();
        history.redo(stage);
    // Ctrl+Z - undo
    } else if ( e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        history.undo(stage);    
    }
});

// === Обработчики: mute ===

$muteBtn.addEventListener('click', () =>{
    sound.enabled = !sound.enabled;

    // меняем кнопку
    const use = $muteBtn.querySelector('use');
    if ( sound.enabled ){
        use.setAttribute('href', '#icon-bullhorn');
        $muteBtn.classList.remove('muted');
    } else {
        use.setAttribute('href', '#icon-bullhorn-mute');
        $muteBtn.classList.add('muted');
    }
});

// === Обработчики: бургер меню ===

$menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    $dropdown.classList.toggle('toolbar__dropdown--open');
});

// --- закрываем по клику всне её
document.addEventListener('click', (e) => {
    if ( !$dropdown.contains(e.target)) {
        $dropdown.classList.remove('toolbar__dropdown--open')
    }
});

// === Обработчики: панели слоёв ===

// --- сворачивание панели
$panelToggle.addEventListener('click', () => {
    // сворачивание панели по кнопке toggle
    if ( window.innerWidth <= 768 ) {
        $layersPanel.classList.toggle('layers-panel--open');
    } else {
        $layersPanel.classList.toggle('layers-panel--collapsed');
    }
});

// --- закрываем панель по клику вне её
document.addEventListener('click', (e) => {
    if ( window.innerWidth > 768 ) return;
    if ( !$layersPanel.classList.contains('layers-panel--open') ) return;

    // если клик внутри панели - не закрываем
    if ( $layersPanel.contains(e.target) ) return;
    $layersPanel.classList.remove('layers-panel--open');

    // блокируем первый поиндаун на холсте (once - сам снимается)
    $stageStack.addEventListener('pointerdown', (ev) => {
        ev.stopImmediatePropagation();
    }, { once: true, capture: true });
});

// === Инициализация модулей ===

// --- трансформации image-слоя (поворот, масштаб)
TransformHandler.init(
    stage,
    $rotateLeftBtn, $rotateRightBtn,
    $scaleUpBtn, $scaleDownBtn
);

// === Жесты на тачскрине (pan + pitch-scale) ===
new GestureHandler(
    $stageStack,
    // onZoom - получаем новый зум, применяем с ограничениями
    (newZoom) => {
        zoomLevel = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, newZoom));
        applyZoom();
    },
    // getZoom - возвращаем текущий зум
    () => zoomLevel
);

// === Обработчики: кнопок тулбара через делегирование
ToolbarActions.init({
    stage, sound, layersPanel,
    switchLayerForTools,
    createNewProject,
    getInstallPrompt: () => _installPrompt, // getter
    setInstallPrompt: (v) => { _installPrompt = v }, // setter
});

// --- проверяем URL на шаринг-параметры призагрузке страницы
// ShareLoader.checkUrl(
//     stage, 
//     layersPanel, 
//     switchLayerForTools
// );

// === Запуск ===

init().then(() => {
    isReady = true; // приложение готово

    // console.log('activeLayer:', stage.activeLayer);
});

