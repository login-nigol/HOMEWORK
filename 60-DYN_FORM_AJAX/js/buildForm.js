// js/buildForm.js
'use strict';

function buildForm(formEl, fields) {
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        
        // submit отдельной строкой (кнопка)
        if ( field.kind === "submit" ) {
            const actionEl = document.createElement('div');
            actionEl.className = 'form__actions';

            const btnEl = document.createElement('input');
            btnEl.type = "submit";
            btnEl.value = field.caption;

            actionEl.append(btnEl);
            formEl.append(actionEl);
            continue;
        }

        // обычная строка
        const rowEl = document.createElement('div');
        rowEl.className = 'form__row';

        const labelEl = document.createElement('label');
        labelEl.textContent = field.label;

        const controlEl = createControl(field);

        // связка label -> input (где возмжно)
        if ( controlEl.id ) {
            labelEl.htmlFor = controlEl.id;
        }

        rowEl.append(labelEl, controlEl);
        formEl.append(rowEl);
    }
}

function createControl(field) {
    // создаю уникальный id для элемента
    // если есть name - использую его, если нет - генерирую случайную hex-строку 
    // с префиксом f_, без него могут быть непонятки с CSS-селекторами
    // .toString(16) - перевод в hex, .slice(2) - убираю 0.
    const id = `f_${field.name || Math.random().toString(16).slice(2)}`;

    switch (field.kind) {
        case 'longtext':
        case 'shorttext': {
            const inputEl = document.createElement('input');
            inputEl.type = 'text';
            inputEl.name = field.name;
            inputEl.id = id;
            return inputEl;
        }
        
        case 'number': {
            const inputEl = document.createElement('input');
            inputEl.type = 'number';
            inputEl.name = field.name;
            inputEl.id = id;
            return inputEl;
        }

        case 'check': {
            const inputEl = document.createElement('input');
            inputEl.type = 'checkbox';
            inputEl.name = field.name;
            inputEl.id = id;
            return inputEl;
        }

        case 'memo': {
            const textareaEl = document.createElement('textarea');
            textareaEl.name = field.name;
            textareaEl.id = id;
            textareaEl.rows = 4;
            return textareaEl;
        }

        case 'dropdown': {
            const selectEl = document.createElement('select');
            selectEl.name = field.name;
            selectEl.id = id;

            for (let v = 0; v < field.variants.length; v++) {
                const opt = field.variants[v];
                const optEl = document.createElement('option');
                optEl.value = opt.value;
                optEl.textContent = opt.text;
                selectEl.append(optEl);
            }
            return selectEl;
        }

        case 'radio': {
            const wrapEl = document.createElement('div');

            for (let v = 0; v < field.variants.length; v++) {
                const opt = field.variants[v];
                

                const itemEl = document.createElement('label');
                // itemEl.style.marginRight = '1em';

                const radioEl = document.createElement('input');
                radioEl.type = 'radio';
                radioEl.name = field.name;
                radioEl.value = opt.value;
                radioEl.id = `${id}_${opt.value}`; // уникальный id для каждой кнопки

                itemEl.htmlFor = radioEl.id; // клик по тексту = выбор кнопки
                itemEl.append(radioEl, document.createTextNode('' + opt.text));

                wrapEl.append(itemEl);
            }
            return wrapEl;
        }
    
        default: {
            // если пришел неизвестный тип поля(ошибка в JSON или новая логика),
            // вывожу заглушку, чтобы не ломать форму
            const stub = document.createElement('div');
            stub.textContent = `Неизвестный kind: ${field.kind}`;
            return stub;
        }
    }
}

// чтобы app.js видел функцию
window.buildForm = buildForm;
