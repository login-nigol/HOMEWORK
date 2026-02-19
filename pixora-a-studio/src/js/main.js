'use strict';

import { $stageStack  } from "./dom.js";
import { Stage } from "./core/Stage.js";

// точка входа
const stage = new Stage($stageStack)

// MVP: создаём один слой (пока фиксированый размер)
// stage.addLayer({ width: 1200, height: 800 });

const layer = stage.addLayer({ width:1200, height: 800, type: 'draw'});
layer.ctx.fillStyle = 'red';
layer.ctx.fillRect(50, 50, 150, 100);

console.log(layer.id, stage.layers.length);