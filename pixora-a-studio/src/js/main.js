'use strict';

import { $stageStack  } from "./dom.js";
import { Stage } from "./core/renderer/Stage.js";
import { DrawLayer } from "./core/layers/DrawLayer.js"
import { BrushTool } from "./core/tools/BrushTool.js";

// точка входа - создаём сцену
const stage = new Stage($stageStack)

// создаём слой для рисования
const layerData = stage.addLayer({ width:1200, height: 800, type: 'draw'});

// создаём DrawLayer и передаём canvas и ctx
const drawLayer = new DrawLayer(layerData.canvas, layerData.ctx);

// создаём кисть и активируем на слое
const bruch = new BrushTool(drawLayer);
bruch.activate();

console.log(layerData.id, stage.layers.length);