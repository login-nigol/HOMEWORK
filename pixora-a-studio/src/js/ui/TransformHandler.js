'use strict';

// TransformHandler - обработчики кнопок трансформации
// поворот и масштаб для image-слоёв
export class TransformHandler {

    // шаг поворота (15 градусов в радианах)
    static ROTATE_STEP = Math.PI / 12;

    // шаг масштаба
    static SCALE_STEP = 0.1;

    // навешиваем обработчики на кнопки
    static init(stage, $rotateLeftBtn, $rotateRightBtn, $scaleUpBtn, $scaleDownBtn) {

        $rotateLeftBtn.addEventListener('click', () => {
            TransformHandler._transform(stage, (layer) => {
                layer.rotation -= TransformHandler.ROTATE_STEP;
            });
        });

        $rotateRightBtn.addEventListener('click', () => {
            TransformHandler._transform(stage, (layer) => {
                layer.rotation += TransformHandler.ROTATE_STEP;
            });
        });

        $scaleUpBtn.addEventListener('click' , () => {
            TransformHandler._transform(stage, (layer) => {
                layer.scale += TransformHandler.SCALE_STEP;
            });
        });

        $scaleDownBtn.addEventListener('click', () => {
            TransformHandler._transform(stage, (layer) => {
                // не даём уменьшить до нуля
                if ( layer.scale > TransformHandler.SCALE_STEP ) {
                    layer.scale -= TransformHandler.SCALE_STEP;
                }
            });
        });
    }

    // общая логика: проверяем слой, применяем трансформацию, перерисовываем
    static _transform(stage, action) {
        const layer = stage.activeLayer;
        if ( !layer || layer.type !== 'image' ) return;

        action(layer);
        layer.render();
    }
}