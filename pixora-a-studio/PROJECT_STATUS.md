# Pixora A. Studio — статус проекта

## Ссылки
- GitHub репо: https://github.com/login-nigol/HOMEWORK
- GitHub Pages: https://login-nigol.github.io/HOMEWORK/pixora-a-studio/src/

## Правила работы
- После каждого завершённого функционала — пуш на GitHub
- Петя проверяет структуру репо по ссылке после каждого пуша

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

## В работе

## Следующий шаг
Последнее — полировка:

- Звук (Web Audio API) + вибро (Vibration API)
- Галерея стикеров (AJAX-загрузка ресурсов)
- Прогресс загрузки
- CSS-анимации (hover, появление слоёв)
- Тестирование кроссбраузерность

---

## Договорённости
- CSS: один файл main.css с логическими секциями (не @import)
- JS: строгий порядок — константы → DOM → функции → обработчики
- Адаптив: десктоп → мобайл
- canvas стили через CSS-класс .layer (не инлайн)

---

## Критерии оценки (прогресс)
| Анимация | CSS transitions: сворачивание панели слоёв (desktop), выезд панели справа (mobile), поворот кнопки toggle — main.css. Следующий шаг: hover-анимации кнопок, анимация на Canvas | 15% |
| Мультимедиа | Canvas-рисование, кисть/ластик — DrawLayer.js, трансформация изображений (translate, rotate, scale) — ImageLayer.js, склейка слоёв для экспорта — ExportService.js, undo/redo (getImageData/putImageData) — History.js. Следующий шаг: звук (Web Audio API) + виброотклик (Vibration API) | 20% |
| Интерактивность | Pointer Events (мышь/тач/стилус), переключение инструментов, color picker, range input, drag&drop изображений, undo/redo + горячие клавиши, трансформация кнопками (поворот/масштаб) — main.js, ToolBase.js, TransformHandler.js. Следующий шаг: жесты на тачскрине | 40% |
| Коммуникации | AJAX POST через fetch к AjaxStringStorage2: шаринг картинки (INSERT/READ), шаринг проекта (INSERT/READ), загрузка по URL-параметрам — ShareService.js, ShareLoader.js. Следующий шаг: прогресс загрузки, галерея стикеров через AJAX | 40% |
| Адаптивность | Резиновая вёрстка до 90em (CSS Grid, em). Медиа-запрос ≤768px: workspace в одну колонку, панель слоёв выезжает справа (transform + transition), tools-panel с прокруткой — main.css. Следующий шаг: тестирование на устройствах | 30% |
| Самостоятельный JS | ООП, наследование, модули ES6. Классы: ToolBase → BrushTool/EraserTool/MoveTool, LayerBase → DrawLayer/ImageLayer, Stage, History, LayersPanelUi, ExportService, StorageService, ShareService, ShareLoader, TransformHandler. Константы — constants.js, DOM — dom.js | 60% |
| Кроссбраузерность | Тестируется: Windows 11 (Chrome), Samsung Galaxy S25 (Chrome), iPad Air (Safari). Следующий шаг: Edge, Firefox | 10% |

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
- [ ] Звук + вибро
- [x] Адаптив + кроссбраузерность

### Фаза 2 — после сдачи (продакшн)
- [ ] Трасформация картинокмышкой
- [ ] Шаринг проекта через сервер
- [ ] Библиотека штампов/фрагментов
- [ ] Продвинутые кисти и фильтры
- [ ] Полноценный мобильный UX (жесты, стилус)
- [ ] Публичный запуск как самостоятельный продукт
