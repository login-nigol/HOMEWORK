'use strict';

import {
    $stageStack, $toolColor, $toolSize, $toolBtns, $toolFile,
    $layerBtns, $layerList, $undoBtn, $redoBtn,
    $panelToggle, $layersPanel
} from "./dom.js";
import { LayersPanelUi } from "./ui/LayersPanelUi.js";
import { Stage } from "./core/renderer/Stage.js";
import { History } from "./core/History.js";
import { BrushTool } from "./core/tools/BrushTool.js";
import { EraserTool } from "./core/tools/EraserTool.js";
import { MoveTool } from "./core/tools/MoveTool.js";


// === Инициализация ===

// точка входа - создаём сцену
const stage = new Stage($stageStack);
const history = new History();

// создаём слой для рисования
const drawLayer = stage.addLayer({ type: 'draw'});

// панель слоёв - Колбэк при смене активного слоя
const layersPanel = new LayersPanelUi(stage, $layerList, $layerBtns, (newLayer) => {
    // переключаем инструменты на новый слой
    tools.brush.setLayer(newLayer);
    tools.eraser.setLayer(newLayer);
    tools.move.setLayer(newLayer);

    // автоопределение инструмента по типу слоя
    if ( newLayer.type === 'image' && activeTool !== tools.move ) {
        activeTool.deactivate();
        activeTool = tools.move;
        activeTool.activate();
        $toolBtns.forEach((b) => b.classList.remove('tool-btn--active'));
        document.querySelector('[data-tool="move"]').classList.add('tool-btn--active');
    } else if ( newLayer.type === 'draw' && activeTool === tools.move ) {
        activeTool.deactivate();
        activeTool = tools.brush;
        activeTool.activate();
        $toolBtns.forEach((b) => b.classList.remove('tool-btn--active'));
        document.querySelector('[data-tool="brush"]').classList.add('tool-btn--active');
    }
});
layersPanel.render(); // отрисовывает первый слой

// создаём инструменты с историей
const tools = {
    brush: new BrushTool(drawLayer, history),
    eraser: new EraserTool(drawLayer, history),
    move: new MoveTool(drawLayer,history)
};

// текущий активный инструмент
let activeTool = tools.brush;
activeTool.activate();

// === Обработчики ===

// переключение инструментов
$toolBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const toolName = e.currentTarget.dataset.tool;

        // если кликнули на уже активный - ничего не делаем
        if ( tools[toolName] === activeTool ) return;

        // деактивируем старый, активируем новый
        activeTool.deactivate();
        activeTool = tools[toolName];
        activeTool.activate();

        // переключаем визуальный класс
        $toolBtns.forEach((b) => b.classList.remove('tool-btn--active'));
        e.currentTarget.classList.add('tool-btn--active');
    });
});

// загрузка картинки - создаём ImageLayer
$toolFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if ( !file ) return;

    // создаём слой-картинку
    const imageLayer = stage.addLayer({ type: 'image' });

    // загружаем файл в слой
    await imageLayer.loadFromFile(file);

    // переключаем инструменты на новый слой
    tools.brush.setLayer(imageLayer);
    tools.eraser.setLayer(imageLayer);
    tools.move.setLayer(imageLayer);

    // автоматически включаем move для картинки
    activeTool.deactivate();
    activeTool = tools.move;
    activeTool.activate();

    // обновляем визуал кнопок
    $toolBtns.forEach((b) => b.classList.remove('tool-btn--active'));
    document.querySelector('[data-tool="move"]').classList.add('tool-btn--active');

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

    const imageLayer = stage.addLayer({ type: 'image'});
    await imageLayer.loadFromFile(file);

    tools.brush.setLayer(imageLayer);
    tools.eraser.setLayer(imageLayer);
    tools.move.setLayer(imageLayer);

    activeTool.deactivate();
    activeTool = tools.move;
    activeTool.activate();

    $toolBtns.forEach((b) => b.classList.remove('tool-btn--active'));
    document.querySelector('[data-tool="move"]').classList.add('tool-btn--active');

    layersPanel.render();
});

// смена цвета кисти
$toolColor.addEventListener('input', (e) => {
    tools.brush.color = e.target.value;
});

// смена размера (для инсрументов)
$toolSize.addEventListener('input', (e) => {
    activeTool.size = Number(e.target.value);
});

// undo/redo кнопки
$undoBtn.addEventListener('click', () => history.undo(stage));
$redoBtn.addEventListener('click', () => history.redo(stage));

// undo/redo клавиатура
document.addEventListener('keydown', (e) => {
    if ( e.ctrlKey && e.shiftKey && e.key === 'Z') {
        e.preventDefault();
        history.redo(stage);
    } else if ( e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        history.undo(stage);
    }
});

// сворачивание панели слоёв
$panelToggle.addEventListener('click', () => {
    $layersPanel.classList.toggle('layers-panel--collapsed');
});

console.log(drawLayer.id, stage.layers.length);