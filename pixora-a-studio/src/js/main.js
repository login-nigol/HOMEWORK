'use strict';

import {
    $stageStack, $toolColor, $toolSize, $toolBtns,
    $layerBtns, $layerList, $undoBtn, $redoBtn,
    $panelToggle, $layersPanel
} from "./dom.js";
import { LayersPanelUi } from "./ui/LayersPanelUi.js";
import { Stage } from "./core/renderer/Stage.js";
import { History } from "./core/History.js";
import { BrushTool } from "./core/tools/BrushTool.js";
import { EraserTool } from "./core/tools/EraserTool.js";


// === Инициализация ===

// точка входа - создаём сцену
const stage = new Stage($stageStack);
const history = new History();

// создаём слой для рисования
const drawLayer = stage.addLayer({ type: 'draw'});

const layersPanel = new LayersPanelUi(stage, $layerList, $layerBtns, (newLayer) => {
    // переключаем инструменты на новый слой
    tools.brush.setLayer(newLayer);
    tools.eraser.setLayer(newLayer);
});
layersPanel.render(); // отрисовывает первый слой

// создаём инструменты с историей
const tools = {
    brush: new BrushTool(drawLayer, history),
    eraser: new EraserTool(drawLayer, history),
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

// смена цвета кисти
$toolColor.addEventListener('input', (e) => {
    tools.brush.color = e.target.value;
});

// смена размера (для инсрументов)
$toolSize.addEventListener('input', (e) => {
    activeTool.size = Number(e.target.value);
});

// сворачивание панели слоёв
$panelToggle.addEventListener('click', () => {
    $layersPanel.classList.toggle('layers-panel--collapsed');
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

console.log(drawLayer.id, stage.layers.length);