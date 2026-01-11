'use strict'; // строгий режим

// старт после полной загрузки страницы ( включая картинки )
window.addEventListener('load', () => {
  const images = document.querySelectorAll('img');

  let drag = null; // какая картинка тащится
  let shiftX = 0; // точка захвата внутри картинки
  let shiftY = 0;
  let topZ = 0; 

  // замеряем координаты всех картинок
  const imgsPosition = [];

  images.forEach((img, i) => {
    const rect = img.getBoundingClientRect();
    imgsPosition[i] = {
      left: rect.left + window.scrollX,
      top: rect.top + window.screenY
    };
  });

  // переводим картинки в absolute
  images.forEach((img, i) => {
    img.ondragstart = () => false; // отключаем нативный drag&drop

    // переводим в абсолют и ставим ровно туда же
    img.style.position = 'absolute';
    img.style.left = imgsPosition[i].left + 'px';
    img.style.top = imgsPosition[i].top + 'px';

    // задаём стартовый порядок слоёв
    img.style.zIndex = String(++topZ);
    img.style.cursor = 'grab';

    // вешаем обработчик начала перетаскивания
    img.addEventListener('mousedown', onDown, false);
  });

  
  // ================= ФУНКЦИИ =================
  
  function onDown(eo) {
    eo = eo || window.event;
    // элемент, на котором висит обработчик
    drag = eo.currentTarget;
    
    // вычисляем смещение курсора внутри картинки
    // pageX/Y — позиция мыши на странице, offsetLeft/Top — позиция картинки
    shiftX = eo.pageX - drag.offsetLeft;
    shiftY = eo.pageY - drag.offsetTop;
    
    drag.style.zIndex = String(++topZ); // поднять над всеми
    drag.style.cursor = 'grabbing';
    
    // подписываем ТОЛЬКО на время перетаскивания
    document.addEventListener('mousemove', onMove, false);
    document.addEventListener('mouseup', onUp, false);

    // отменяем стандартное поведение браузера
    eo.preventDefault();
  }

  function onMove(eo) {
    // иначе будет ошибка до первого mousedown
    if (!drag) return;
    eo = eo || window.event;

    // двигаем ровно настолько, насколько двинулась мышь
    drag.style.left = ( eo.pageX - shiftX ) + 'px';
    drag.style.top = ( eo.pageY - shiftY ) + 'px';
  }

  function onUp() {
    if (!drag) return;    

    drag.style.cursor = 'grab';
    drag = null;

    // снимаем обработчики — производительно
    document.removeEventListener('mousemove', onMove, false);
    document.removeEventListener('mouseup', onUp, false);
  }
});