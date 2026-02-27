// константы проекта (один источник правды)
'use strict';

export const SELECTORS = {
    stageStack: '.stage__stack',
    toolColor: '.tool-color',
    toolSize: '.tool-size',
    toolBtns: '.tool-btn',
    layerList: '.layers-panel__list',
    layerBtns: '.layer-btn',
    undoBtn: '[data-action="undo"]',
    redoBtn: '[data-action="redo"]',
};

// максимальное колтчество шагов истории
export const HISTORY_LIMIT = 30;