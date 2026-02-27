// константы проекта (один источник правды)
'use strict';

export const SELECTORS = {
    stageStack: '.stage__stack',

    toolColor: '.tool-color',
    toolSize: '.tool-size',
    toolBtns: '.tool-btn',
    toolFile: '.tool-file',

    layerBtns: '.layer-btn',
    layerList: '.layers-panel__list',

    undoBtn: '[data-action="undo"]',
    redoBtn: '[data-action="redo"]',
    
    panelToggle: '.layers-panel__toggle',
    layersPanel: '.layers-panel',
};

// максимальное колтчество шагов истории
export const HISTORY_LIMIT = 30;