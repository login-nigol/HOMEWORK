'use strict';

import { SELECTORS } from "./constants.js";

// DOM-селекторы (в одном месте)
export const $stageStack = document.querySelector(SELECTORS.stageStack);
export const $toolColor = document.querySelector(SELECTORS.toolColor);
export const $toolSize = document.querySelector(SELECTORS.toolSize);
export const $toolBtns = document.querySelectorAll(SELECTORS.toolBtn);

if ( !$stageStack ) {
    throw new Error(`Не найден элемент: ${SELECTORS.stageStack}`);
}