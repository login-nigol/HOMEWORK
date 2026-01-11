'use strict'; // строгий режим

// старт после загрузки DOM, получаем список картинок - images
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img');

  let drag = null; // какая картинка тащится
  let shiftX = 0; // точка захвата внутри картинки x, y
  let shiftY = 0;
  let topZ = images.length; // стартовое значение z-index (чтобы поднимать выше всех)

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

    // placeholder - заглушка
    // имитирует присутствие картинки в потоке документа
    // чтобы остальные элементы не сдвигались
    // span - лёгкий элемент, по умолчанию строчный, легко превратить в inline-block
    const placeholder = document.createElement('span');
    // делаем его участвующим в потоке и позволяющим задать размеры
    placeholder.style.display = 'inline-block';
    // задаём точно такие же размеры, как у картинки
    placeholder.style.width = rect.width + 'px';
    placeholder.style.height = rect.height + 'px';

    // вставляем плейсхолдер перед картинкой в DOM
    img.before(placeholder);
    // запомнили плейсхолдер этой картинки
    img._ph = placeholder;

    // фиксируем размер картинки, чтобы при absolute не было "пересчёта"
    // img.style.width = rect.width + 'px';
    // img.style.height = rect.height + 'px';

    // переводим в абсолют и ставим ровно туда же
    img.style.position = 'absolute';
    img.style.left = pageLeft + 'px';
    img.style.top = pageTop + 'px';

    // задаём стартовый порядок слоёв
    // img.style.zIndex = i + 1, браузер сам приведёт к строке
    img.style.zIndex = String(i + 1);
    // меняем курсор для наглядности
    img.style.cursor = 'grab';

    // вешаем обработчик начала перетаскивания
    // false - используем фазу всплытия, что бы начать drag сразу при нажатии
    img.addEventListener('mousedown', onDown, false);
  });

  // ловим движение/отпускание на документе
  document.addEventListener('mousemove', onMove, false);
  document.addEventListener('mouseup', onUp, false);

  // добавим корзину (опционально)
  const bin = document.createElement('div');

  bin.style.position = 'fixed';
  bin.style.right = '3em';
  bin.style.bottom = '3em';
  bin.style.width = '10em';
  bin.style.height = '10em';

  bin.style.backgroundImage = "url('img/bin.png')";
  bin.style.backgroundRepeat = 'no-repeat';
  bin.style.backgroundSize = 'contain';
  bin.style.backgroundPosition = 'center';

  bin.style.zIndex = '10000';
  bin.style.transition = 'transform 0.15s ease';

  document.body.appendChild(bin);

  // ================= ФУНКЦИИ =================
  function onDown(eo) {
    eo = eo || window.event;

    // сохраняем ссылку на ту картинку, на которой нажали
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

    // визуальный фидбек для корзины
    const binRect = bin.getBoundingClientRect();
    const imgRect = drag.getBoundingClientRect();

    const isOverBin =
      imgRect.right > binRect.left &&
      imgRect.left < binRect.right &&
      imgRect.bottom > binRect.top &&
      imgRect.top < binRect.bottom;

    // увеличиваем/возвращаем размер
    bin.style.transform = isOverBin ? 'scale(1.15)' : 'scale(1)';
  }

  function onUp(eo) {
    if (!drag) return;
    eo = eo || window.event;

    const released = drag; // запомнили, что отпускали
    drag = null;

    // сбрасываем корзину
    bin.style.transform = 'scale(1)';
    released.style.cursor = 'grab';

    // границы корзины и текущей картинки
    const binRect = bin.getBoundingClientRect();
    const imgRect = released.getBoundingClientRect();

    // проверка пересечения (картинка "попала" в корзину)
    const inBin =
      imgRect.right > binRect.left &&
      imgRect.left < binRect.right &&
      imgRect.bottom > binRect.top &&
      imgRect.top < binRect.bottom;

    if (inBin) {
      if (released._ph) released._ph.remove();
      released.remove();
    }
  }
});