'use strict';

import {
    $stageStack, $toolColor, $toolSize, $toolBtns, $toolFile,
    $layerBtns, $layerList, $undoBtn, $redoBtn,
    $panelToggle, $layersPanel,
    $exportBtn,
    $saveBtn,
    $loadBtn
} from "./dom.js";
import { LayersPanelUi } from "./ui/LayersPanelUi.js";
import { Stage } from "./core/renderer/Stage.js";
import { History } from "./core/History.js";
import { BrushTool } from "./core/tools/BrushTool.js";
import { EraserTool } from "./core/tools/EraserTool.js";
import { MoveTool } from "./core/tools/MoveTool.js";
import { ExportService } from "./core/ExportService.js";
import { StorageService } from "./core/StorageService.js";


// === Инициализация ===

// точка входа - создаём сцену и историю
const stage = new Stage($stageStack);
const history = new History();

// создаём слой для рисования
const drawLayer = stage.addLayer({ type: 'draw'});

// создаём инструменты (пока на первом слое)
const tools = {
    brush: new BrushTool(drawLayer, history),
    eraser: new EraserTool(drawLayer, history),
    move: new MoveTool(drawLayer,history)
};
    
// текущий активный инструмент
let activeTool = tools.brush;
activeTool.activate();

// === вспомогательная функция: переключение активного инструмента
function switchTool(toolName) {
    // если уже активен ничего не делаем
    if ( tools[toolName] === activeTool ) return;
    
    // деактивируем старый слой, активируем новый
    activeTool.deactivate();
    activeTool = tools[toolName];
    activeTool.activate();
    
    // обновляем подсветку кнопок
    $toolBtns.forEach((b) => b.classList.remove('tool-btn--active'));
    document.querySelector(`[data-tool="${toolName}"]`).classList.add('tool-btn--active');
}

// вспомогательная функция: пепреключение слоя для всех инструментов
function switchLayerForTools(newLayer) {
    tools.brush.setLayer(newLayer);
    tools.eraser.setLayer(newLayer);
    tools.move.setLayer(newLayer);
    
}

// панель слоёв - колбэк при смене актвного слоя
const layersPanel = new LayersPanelUi(stage, $layerList, $layerBtns, (newLayer) => {
    // переключаем все инструменты на новый слой
    switchLayerForTools(newLayer);

    // автоопределение инструмента по типу слоя
    if ( newLayer.type === 'image' && activeTool !== tools.move ) {
        switchTool('move');
    } else if ( newLayer.type === 'draw' && activeTool === tools.move ) {
        switchTool('brush');
    }
});

// отрисовывает начальный список слоёв
layersPanel.render();

// === Обработчики ===

// переключение инструментов по клику
$toolBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        switchTool(e.currentTarget.dataset.tool);
    });
});

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
    const imageLayer = stage.addLayer({ type: 'image'});
    await imageLayer.loadFromFile(file);

    switchLayerForTools(imageLayer);
    switchTool('move');
    layersPanel.render();
});

// смена цвета кисти
$toolColor.addEventListener('input', (e) => {
    tools.brush.color = e.target.value;
});

// смена размера активного инструмента
$toolSize.addEventListener('input', (e) => {
    activeTool.size = Number(e.target.value);
});

// undo/redo кнопки
$undoBtn.addEventListener('click', () => history.undo(stage));
$redoBtn.addEventListener('click', () => history.redo(stage));

// undo/redo клавиатура
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

// сворачивание панели слоёв
$panelToggle.addEventListener('click', () => {
    // на мобиле выдвигаем/прячем панель
    if ( window.innerWidth <= 768 ) {
        $layersPanel.classList.toggle('layers-panel--open');
    } else {
        // на десктопе - сворачивание/разворачивание
        $layersPanel.classList.toggle('layers-panel--collapsed');
    }
});

// === экспорт PNG ===
$exportBtn.addEventListener('click', () => {
        ExportService.exportPNG(stage);
    });

// === сохранение проекта ===
$saveBtn.addEventListener('click', () => {
    StorageService.save(stage);
});

// === загрузка проекта ===
$loadBtn.addEventListener('click', async () => {
    console.log('до загрузки:', stage.layers.length);
    const loaded = await StorageService.load(stage);
    console.log('после загрузки:', stage.layers.length);

    if ( loaded ) {
        // обновляем проект
        layersPanel.render();

        // переключаем инструменты на активный слой
        switchLayerForTools(stage.activeLayer);
    }
});

// console.log(drawLayer.id, stage.layers.length);