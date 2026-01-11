'use strict'; // строгий режим

// старт после полной загрузки страницы ( включая картинки )
window.addEventListener('load', () => {
  const images = document.querySelectorAll('img');

  let drag = null; // какая картинка тащится
  let shiftX = 0; // точка захвата внутри картинки x, y
  let shiftY = 0;
  let topZ = 0; 

  // отключаем нативный(встроенный) HTML5 drag&drop у картинки
  // не покажет "призрак" картинки
  images.forEach((img, i) => {
    img.ondragstart = () => false;

    // getBoundingClientRect — метод для получения текущих координат элемента
    // относительно окна браузера
    const rect = img.getBoundingClientRect();

    // переводим текущую координату картинки из окна в страницу
    const pageLeft = rect.left + window.scrollX;
    const pageTop = rect.top + window.scrollY;

    // имитирует присутствие картинки в потоке документа
    // span - лёгкий элемент, по умолчанию строчный, легко превратить в inline-block
    const placeholder = document.createElement('span');
    // делаем его участвующим в потоке и позволяющим задать размеры
    placeholder.style.display = 'inline-block';
    // задаём точно такие же размеры, как у картинки
    placeholder.style.width = rect.width + 'px';
    placeholder.style.height = rect.height + 'px';

    // вставляем плейсхолдер перед картинкой в DOM
    img.before(placeholder);

    // фиксируем размер картинки, чтобы при absolute не было "пересчёта"
    // img.style.width = rect.width + 'px';
    // img.style.height = rect.height + 'px';

    // переводим в абсолют и ставим ровно туда же
    img.style.position = 'absolute';
    img.style.left = pageLeft + 'px';
    img.style.top = pageTop + 'px';

    // задаём стартовый порядок слоёв
    const z = i + 1;
    img.style.zIndex = z;
    topZ = z;

    img.style.cursor = 'grab';

    // вешаем обработчик начала перетаскивания
    // false - используем фазу всплытия, что бы начать drag сразу при нажатии
    img.addEventListener('mousedown', onDown, false);
  });

  // ловим движение/отпускание на документе
  document.addEventListener('mousemove', onMove, false);
  document.addEventListener('mouseup', onUp, false);

  // ================= ФУНКЦИИ =================
  
  function onDown(eo) {
    eo = eo || window.event;

    // currentTarget — элемент, на котором висит обработчик
    drag = eo.currentTarget;

    // вычисляем смещение курсора внутри картинки
    // pageX/Y — позиция мыши на странице, offsetLeft/Top — позиция картинки
    shiftX = eo.pageX - drag.offsetLeft;
    shiftY = eo.pageY - drag.offsetTop;

    // поднимаем активную картинку выше всех остальных
    drag.style.zIndex = String(++topZ);

    // курсор на время перетаскивания
    drag.style.cursor = 'grabbing';

    // отменяем стандартное поведение браузера
    eo.preventDefault();
  }

  function onMove(eo) {
    // иначе будет ошибка до первого mousedown
    if (!drag) return;
    eo = eo || window.event;

    // двигаем ровно настолько, насколько двинулась мышь
    const newLeft = eo.pageX - shiftX;
    const newTop = eo.pageY - shiftY;
    drag.style.left = newLeft + 'px';
    drag.style.top = newTop + 'px';
  }

  function onUp() {
    if (!drag) return;    
    drag.style.cursor = 'grab';
    drag = null;
  }
});