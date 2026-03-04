'use strict';

import { LayerBase } from "./LayerBase.js";

// DrawLayer - слой для свободного рисования
// вся логика рисования унаследована от LayerBase
export class DrawLayer extends LayerBase {
    constructor(canvas, ctx, id) {
        super(canvas, ctx, id, 'draw');
    }
}