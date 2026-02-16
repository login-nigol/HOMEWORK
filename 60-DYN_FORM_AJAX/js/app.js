'use strict';

// === константы ===

const FORM_ACTION = 'https://fe.it-academy.by/TestForm.php';
const FORM_DEF_1_URL = 'https://fe.it-academy.by/Examples/dyn_form_ajax/formDef1.json';
const FORM_DEF_2_URL = 'https://fe.it-academy.by/Examples/dyn_form_ajax/formDef2.json';

// === DOM-селекторы ===

const formsRootEl = document.getElementById('formsRoot');

// === функции ===

// jqXHR - объект ответа запроса
// jqXHR.status, jqXHR.responseText, jqXHR.readyState
function errorHandler(jqXHR, statusStr, errorStr) {
    console.error(statusStr, errorStr);
    formsRootEl.textContent = `ошибка загрузки форм. Смотри консоль`;
}

function loadFormDef(url, callback) {
    $.ajax(url, {
        type: 'GET',
        dataType: 'json',
        success: callback,
        error: errorHandler
    });
}

function init() {

    // первый AJAX-запрос
    loadFormDef(FORM_DEF_1_URL, function (def1) {
        
        const form1 = document.createElement('form');
        form1.className = 'form';
        form1.action = FORM_ACTION;
        form1.method = 'POST';

        buildForm(form1, def1);
        formsRootEl.append(form1);

        // второй AJAX-запрос
        loadFormDef(FORM_DEF_2_URL, function(def2) {

            const form2 = document.createElement('form');
            form2.className = 'form';
            form2.action = FORM_ACTION;
            form2.method = 'POST';
            
            buildForm(form2, def2);
            formsRootEl.append(form2);
        });
    });
}

// === запуск ===

init();