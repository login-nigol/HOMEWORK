// константы проекта (один источник правды)
'use strict';

export const SELECTORS = {
    stage: '.stage',
    stageStack: '.stage__stack',

    // лого
    logo: '.toolbar__title',

    toolColor: '.tool-color',
    toolSize: '.tool-size',
    toolBtns: '.tool-btn',
    toolFile: '.tool-file',

    rotateLeftBtn: '[data-action="rotate-left"]',
    rotateRightBtn: '[data-action="rotate-right"]',
    scaleUpBtn: '[data-action="scale-up"]',
    scaleDownBtn: '[data-action="scale-down"]',

    layerBtns: '.layer-btn',
    layerList: '.layers-panel__list',

    // масштаб холста
    zoomInBtn: '[data-action="zoom-in"]',
    zoomOutBtn: '[data-action="zoom-out"]',
    // история
    undoBtn: '[data-action="undo"]',
    redoBtn: '[data-action="redo"]',

    exportBtn: '[data-action="export"]',
    loadBtn: '[data-action="load"]',
    saveBtn: '[data-action="save"]',

    newBtn: '[data-action="new"]',

    shareProjectBtn: '[data-action="share-project"]',
    shareImageBtn: '[data-action="share-image"]',

    mutebtn: '[data-action="mute"]',
    
    panelToggle: '.layers-panel__toggle',
    layersPanel: '.layers-panel',

};

// максимальное колтчество шагов истории
export const HISTORY_LIMIT = 30;