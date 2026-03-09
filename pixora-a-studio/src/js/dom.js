'use strict';

import { SELECTORS } from "./constants.js";

// DOM-селекторы (в одном месте)
export const $stageStack = document.querySelector(SELECTORS.stageStack);

export const $toolColor = document.querySelector(SELECTORS.toolColor);
export const $toolSize = document.querySelector(SELECTORS.toolSize);
export const $toolBtns = document.querySelectorAll(SELECTORS.toolBtns);
export const $toolFile = document.querySelector(SELECTORS.toolFile);

export const $rotateLeftBtn = document.querySelector(SELECTORS.rotateLeftBtn);
export const $rotateRightBtn = document.querySelector(SELECTORS.rotateRightBtn);
export const $scaleUpBtn = document.querySelector(SELECTORS.scaleUpBtn);
export const $scaleDownBtn = document.querySelector(SELECTORS.scaleDownBtn);

export const $stickersBtn = document.querySelector('[data-tool="stickers"]');

export const $layerBtns = document.querySelectorAll(SELECTORS.layerBtns);
export const $layerList = document.querySelector(SELECTORS.layerList);

export const $exportBtn = document.querySelector(SELECTORS.exportBtn);
export const $saveBtn = document.querySelector(SELECTORS.saveBtn);
export const $loadBtn = document.querySelector(SELECTORS.loadBtn);

export const $shareProjectBtn = document.querySelector(SELECTORS.shareProjectBtn);
export const $shareImageBtn = document.querySelector(SELECTORS.shareImageBtn);

export const $undoBtn = document.querySelector(SELECTORS.undoBtn);
export const $redoBtn = document.querySelector(SELECTORS.redoBtn);

export const $panelToggle = document.querySelector(SELECTORS.panelToggle);
export const $layersPanel = document.querySelector(SELECTORS.layersPanel);


if ( !$stageStack ) {
    throw new Error(`Не найден элемент: ${SELECTORS.stageStack}`);
}