'use strict';

// === Импорты ===

import {
    $stageStack, $toolColor, $toolSize, $toolBtns, $toolFile,
    $layerBtns, $layerList,
    $panelToggle, $layersPanel,
    $exportBtn, $saveBtn, $loadBtn,
    $shareImageBtn, $shareProjectBtn, $newBtn,
    $stickersBtn, $undoBtn, $redoBtn,
    $rotateLeftBtn, $rotateRightBtn, $scaleUpBtn, $scaleDownBtn,
} from "./dom.js";

// UI-модули
import { LayersPanelUi } from "./ui/LayersPanelUi.js";
import { ShareLoader } from "./ui/ShareLoader.js";
import { TransformHandler } from "./ui/TransformHandler.js";
import { GalleryUi } from "./ui/GalleryUi.js";
import { IconLoader } from "./ui/IconLoader.js";

// core-модули
import { Stage } from "./core/renderer/Stage.js";
import { History } from "./core/History.js";
import { BrushTool } from "./core/tools/BrushTool.js";
import { EraserTool } from "./core/tools/EraserTool.js";
import { MoveTool } from "./core/tools/MoveTool.js";

import { ExportService } from "./services/ExportService.js";
import { StorageService } from "./services/StorageService.js";
import { ShareService } from "./services/ShareService.js";

import { SoundService } from "./services/SoundService.js";
import { ProgressService } from "./services/ProgressService.js";


// === Инициализация ===

// загружаем SVG-спрайт иконок
await IconLoader.load();

// точка входа - экземпляры
const stage = new Stage($stageStack);
const history = new History();
const sound = new SoundService();
ProgressService.init(); // инициализируем модалку прогресса

// создаём первый слой для рисования
const drawLayer = stage.addLayer({ type: 'draw' });

// создаём инструменты (привязаны к первому слою)
const tools = {
    brush: new BrushTool(drawLayer, history, sound),
    eraser: new EraserTool(drawLayer, history, sound),
    move: new MoveTool(drawLayer,history, sound)
};
    
// текущий активный инструмент
let activeTool = tools.brush;
activeTool.activate();

// === вспомогательные функции ===

// переключение активного инструмента
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
    document.querySelector(`[data-tool="${toolName}"]`).classList.add('tool-btn--active');

    // звук переключения
    sound.playToolSwitch();
}

// пепреключение слоя для всех инструментов
function switchLayerForTools(newLayer) {
    // перебираем все инструменты и переключаем слой
    Object.values(tools).forEach(tool => tool.setLayer(newLayer));
    
}

// === панель слоёв ===

// колбэк при смене актвного слоя
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

// отрисовывает начальный список слоёв
layersPanel.render();

// галерея стикеров и разукрашек
const gallery = new GalleryUi(
    stage, layersPanel,
    switchLayerForTools,
    switchTool
);

// === Инициализация модулей ===

// трансформации image-слоя (поворот, масштаб)
TransformHandler.init(
    stage,
    $rotateLeftBtn, $rotateRightBtn,
    $scaleUpBtn, $scaleDownBtn
);

// проверяем URL на шаринг-параметры призагрузке страницы
ShareLoader.checkUrl(stage, layersPanel, switchLayerForTools);

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
$stickersBtn.addEventListener('click', () => gallery.show('stickers'));

// === Обработчики: загрузка изображений ===

// загрузка картинки через input[type="file"]
$toolFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if ( !file ) return;

    // создаём image-слой и загркжаем файл
    const imageLayer = stage.addLayer({ type: 'image' });

    // загружаем файл в слой
    await imageLayer.loadFromFile(file);
    
    // переключаем инструменты на новый слой
    switchLayerForTools(imageLayer);
    
    // для картики автоматически включаем move
    switchTool('move');
    
    // обновляем папнель слоёв
    layersPanel.render();
    
    // сбрасываем input чтобы можно было загрузить то же файл повторно
    e.target.value = '';
});

// drag & drop картинки на canvas
$stageStack.addEventListener('dragover', (e) => {
    e.preventDefault();
});

$stageStack.addEventListener('drop', async (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    if ( !file || !file.type.startsWith('image/')) return;

    // та же лоника что и в chage - создаём слой, загружаем, переключаем
    const imageLayer = stage.addLayer({ type: 'image' });
    await imageLayer.loadFromFile(file);

    switchLayerForTools(imageLayer);
    switchTool('move');
    layersPanel.render();
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

// document.querySelector('[data-action="undo"]')
//     .addEventListener('click', () => {
//         history.undo(stage);
//         sound.playUndo();
//     });

// document.querySelector('[data-action="redo"]')
//     .addEventListener('click', () => {
//         history.redo(stage);
//         sound.playRedo();
//     });


// === Обработчики: undo/redo клавиатура ===

document.addEventListener('keydown', (e) => {
    // Ctrl+shift+Z - redo (проверяем первым, иначе поймает Ctrl+Z)
    if ( e.ctrlKey && e.shiftKey && e.key === 'Z') {
        e.preventDefault();
        history.redo(stage);
    // Ctrl+Z - undo
    } else if ( e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        history.undo(stage);
    }
});

// === Обработчики: файловые операции ===

// экспорт PNG
$exportBtn.addEventListener('click', () => {
    ExportService.exportPNG(stage);
    sound.playExport();
});

// сохранение проекта в localStorage
$saveBtn.addEventListener('click', () => {
    StorageService.save(stage);
    sound.playSave();
});

// загрузка проекта из localStorage
$loadBtn.addEventListener('click', async () => {
    const loaded = await StorageService.load(stage);
    
    if ( loaded ) {
        // обновляем проект
        layersPanel.render();
        
        // переключаем инструменты на активный слой
        switchLayerForTools(stage.activeLayer);
    }
});

// очищаем/создаём сцену - новый проект
$newBtn.addEventListener('click', () => {
    if ( !confirm
        ('Начать новый проект? Несохранённые данные будут потеряны.') 
    ) return;

    // удаляем все слои
    while ( stage.layers.length > 0 ) {
        stage.removeLayer(stage.layers[0]);
    }

    // сбрасываем счётчик
    stage.layerIndex = 0;

    // создаём первый пустой слой
    const drawLayer = stage.addLayer({ type: 'draw'});
    switchLayerForTools(drawLayer);
    switchTool('brush');
    layersPanel.render();
});

// == Обработчики: шаринг ===

// пооделиться картинкой - открываем PNG в новой вкладке
$shareImageBtn.addEventListener('click', async () => {
    try {
        const url =
        await ShareService.shareImage(stage);
        await navigator.clipboard.writeText(url);
        alert('Ссылка на картинку скопирована: ' + url);
    } catch (error) {
        alert('Ошибка: ' + error.message);
    }
});

// поделиться проектом (с редактированием)
$shareProjectBtn.addEventListener('click', async () => {
    try {
        const url =
        await ShareService.shareProject(stage);
        await navigator.clipboard.writeText(url);
        alert('Ссылка на проект скопирована: ' + url);
    } catch (error) {
        alert('Ошибка: ' + error.message);
    }
});

// === Обработчики: панели слоёв ===

// свораяивание панели
$panelToggle.addEventListener('click', () => {
    // сворачивание панели по кнопке toggle
    if ( window.innerWidth <= 768 ) {
        $layersPanel.classList.toggle('layers-panel--open');
    } else {
        $layersPanel.classList.toggle('layers-panel--collapsed');
    }
});

// закрываем панель по клику всне её
document.addEventListener('click', (e) => {
    if ( window.innerWidth > 768 ) return;
    if ( !$layersPanel.classList.contains('layers-panel--open') ) return;
    // если клик внутри панели - не закрываем
    if ( $layersPanel.contains(e.target) ) return;

    $layersPanel.classList.remove('layers-panel--open');
});

// console.log(drawLayer.id, stage.layers.length);