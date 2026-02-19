'use strict';

import { SELECTORS } from "./constants.js";

// DOM-селекторы (в одном месте)
export const $stageStack = document.querySelector(SELECTORS.stageStack);

if ( !$stageStack ) {
    throw new Error(`Не найден элемент: ${SELECTORS.stageStack}`);
}