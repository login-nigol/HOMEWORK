'use strict';

import { SELECTORS } from "./constants.js";

// DOM-селекторы (в одном месте)
export const $stageStack = document.querySelector(SELECTORS.stageStack);

export const $toolColor = document.querySelector(SELECTORS.toolColor);
export const $toolSize = document.querySelector(SELECTORS.toolSize);
export const $toolBtns = document.querySelectorAll(SELECTORS.toolBtns);

export const $layerBtns = document.querySelectorAll(SELECTORS.layerBtns);
export const $layerList = document.querySelector(SELECTORS.layerList);

export const $undoBtn = document.querySelector(SELECTORS.undoBtn);
export const $redoBtn = document.querySelector(SELECTORS.redoBtn);

if ( !$stageStack ) {
    throw new Error(`Не найден элемент: ${SELECTORS.stageStack}`);
}