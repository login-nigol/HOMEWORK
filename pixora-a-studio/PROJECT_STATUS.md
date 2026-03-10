# Pixora A. Studio — статус проекта

## Ссылки
- GitHub репо: https://github.com/login-nigol/HOMEWORK
- GitHub Pages: https://login-nigol.github.io/HOMEWORK/pixora-a-studio/src/

## Правила работы

- После каждого завершённого функционала — пуш на GitHub

---

## Что сделано

- [x] базовая HTML-разметка (toolbar, stage, panel)
- [x] main.css (layout, grid, адаптив в процессе)
- [x] constants.js, dom.js, main.js

- [x] Stage.js — создание canvas-слоёв
- [x] DrawLayer.js — слой для рисования
- [x] BrushTool.js — кисть с Pointer Events API
- [x] Рисование мышью/тачем/стилусом на canvas

- [x] ToolBase — базовый класс инструментов
- [x] BrushTool / EraserTool — наследование от ToolBase
- [x] Панель инструментов (кисть, ластик, цвет, размер)
- [x] Переключение инструментов с деактивацией

- [x] LayerBase — базовый класс слоёв (убрали дублирование)
- [x] ImageLayer — загрузка картинки, трансформации, drag&drop
- [x] MoveTool — перемещение картинки
- [x] Панель слоёв: список, активный, скрыть/показать, удалить, порядок

- [x] Undo/redo с горячими клавишами
- [x] Исправлен баг: _isActive флаг вместо !!_onPointerDown

- [x] ExportService — экспорт PNG (склейка слоёв)
- [x] StorageService — сохранение/загрузка проекта в localStorage

- [x] ExportService.mergeCanvas — переиспользуемая склейка слоёв
- [x] ShareService — шаринг через AjaxStringStorage2 (AJAX POST)
- [x] ShareLoader — загрузка по URL (?view= / ?project=)
- [x] TransformHandler — поворот/масштаб image-слоя
- [x] Адаптив: медиа-запрос ≤768px, панель слоёв выезжает справа
- [x] Рефакторинг main.js — разделение по модулям
- [x] switchLayerForTools — рефакторинг через Object.values(tools)

- [x] Баги исправлены: ShareLoader опечатки, EraserTool sound, playSave
- [x] ProgressService — модалка прогресса (XHR upload.onprogress)
- [x] js/services/ — отдельная папка для сервисов
- [x] StickerServiceSvg — загрузка SVG-спрайтов через fetch (AJAX)
- [x] stickers.svg + coloring.svg — SVG-спрайты (symbol+use)
- [x] GalleryUi — панель галереи стикеров и разукрашек
- [x] gallery.css — вынесен в отдельный файл

- [x] IconLoader.js — загрузка SVG-спрайта через fetch, вставка в DOM
- [x] Все кнопки заменены с эмодзи на SVG-иконки
- [x] CSS разбит на модули: buttons.css, tools.css, layers.css, progress.css
- [x] Цветовая схема кнопок через data-action/data-tool селекторы
- [x] Hover/active анимации кнопок (scale, border, background transition)

- [x] ExportService — белый фон при экспорте PNG
- [x] StorageService — исправлена загрузка image-слоёв (layer.image)
- [x] StickerServiceSvg — растеризация SVG в canvas (сохранение работает)
- [x] CanvasDialog — диалог выбора размера холста (портрет/ландшафт)
- [x] Кнопка "Новый проект" с диалогом
- [x] Кнопка Mute звука с переключением иконки
- [x] Зум холста кнопками +/- (transform: scale)
- [x] Закрытие панели слоёв кликом вне неё (мобиле)
- [x] view.html — прогресс загрузки, зарезервировано место под картинку
- [x] layers.css — анимация сворачивания панели (transition: width)
- [x] dialog.css — стили модалки выбора холста

- [x] WelcomeScreen — приветственный экран при старте (js/ui/WelcomeScreen.js, styles/welcome.css)
- [x] Горячие клавиши: Ctrl+M новый проект
- [x] Рефакторинг main.js — addImageLayer(), createNewProject(), init(), isReady флаг
- [x] Зум холста кнопками +/- (transform: scale) — main.js


## В работе

## Следующий шаг
- Важно, пушим после добавления каждой фичи!!! (чаще)

🔴 Критические баги

стек центрировать в стейдже
на таче двойной клик по панелям выделяет элементы, нужно запретить
тройной клик по кнопкам увеличивает масштаб браузера, исправить!
0 — прокрутка в толпанель по х при узком экране
33 — как создать ярлык на рабочемстоле/мобиле?
3 — поделиться ссылкой на приложение
222 — лого в мобиле
7 — резиновый холст (canvas ломается при ресайзе)

🟡 Важные доработки

галерея: стикеры вставлять крупнее
холст: зум + прокрутка для навигации

🟢 Новый функционал

4 — меню шаринга (WhatsApp, Telegram, email...)
6 — ластик на image-слоях (большой рефакторинг — после сдачи)

## Договорённости
- JS: строгий порядок — константы → DOM → функции → обработчики
- Адаптив: десктоп → мобайл
- canvas стили через CSS-класс .layer (не инлайн)

---

## Критерии оценки (прогресс)
| Критерий | Что реализовано | Прогресс |
|---|---|---|
| Анимация | CSS transitions: сворачивание панели (desktop), выезд справа (mobile), поворот toggle, hover/active кнопок (scale + border + background). Далее: плавное появление слоёв, анимация на мобиле | 70% |
| Мультимедиа | Canvas-рисование, кисть/ластик, трансформации изображений, склейка слоёв, undo/redo, SoundService (Web Audio API + Vibration API) | 80% |
| Интерактивность | Pointer Events, инструменты, color picker, range, drag&drop, undo/redo + hotkeys, трансформация кнопками, галерея стикеров. Далее: жесты тачскрин | 80% |
| Коммуникации | shareImage → view.html?key=, shareProject → index.html?project=, ShareLoader, ProgressService (XHR upload.onprogress), StickerServiceSvg (fetch SVG-спрайтов), GalleryUi | 80% |
| Адаптивность | CSS Grid, em-единицы, медиа-запрос ≤768px, панель слоёв выезжает. Далее: тестирование на устройствах | 80% |
| Самостоятельный JS | ООП, наследование, ES6-модули. Классы: ToolBase→Brush/Eraser/MoveTool, LayerBase→DrawLayer/ImageLayer, Stage, History, LayersPanelUi, ExportService, StorageService, ShareService, ShareLoader, TransformHandler, SoundService, ProgressService, StickerServiceSvg, GalleryUi, IconLoader, view.js | 85% |
| Кроссбраузерность | Windows 11 Chrome, Samsung Galaxy S25 Chrome, iPad Air Safari. Далее: Edge, Firefox | 80% |

---

## Дедлайн
- Сдача проекта: 14 марта 2026
- Цель до сдачи: покрыть все критерии оценки на 8-10

## Roadmap

### Фаза 1 — MVP (до 14 марта)
- [x] Canvas-редактор: слой-рисунок (ImageLayer)
- [x] Панель слоёв: список, скрыть/показать, удалить, порядок
- [x] Сохранить/загрузить проект (JSON, localStorage)
- [x] Экспорт PNG
- [x] Звук (Web Audio API) + вибро (Vibration API)
- [x] Адаптив + кроссбраузерность
- [x] Шаринг картинки → отдельная страница просмотра
- [x] Шаринг проекта → редактор
- [x] Прогресс загрузки
- [x] Галерея стикеров
- [x] CSS-анимации hover
- [x] Тестирование Edge, Firefox

### Фаза 2 — после сдачи (продакшн)
- [ ] Трасформация картинок мышкой
- [x] Шаринг проекта через сервер
- [ ] Библиотека штампов/фрагментов
- [ ] Продвинутые кисти и фильтры
- [ ] Полноценный мобильный UX (жесты, стилус)
- [ ] Публичный запуск как самостоятельный продукт
