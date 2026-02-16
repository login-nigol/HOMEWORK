// js/tests.js

// Мини-тесты
// 1. что jQuery подключен
// 2. что buildForm существует
// 3. что AJAX реально загружает JSON

function runTests() {
    console.log('=== Запуск тестов ===');

    // тест 1: подключён ли jQuery
    console.assert(typeof $ !== 'undefined', 'jQuery не подключён');
    console.log('jQuery подключён');

    // тест 2: существует ли buildForm
    console.assert(typeof buildForm === 'function', 'buildForm не подключён');
    console.log('buildForm доступен');

    // тест 3: AJAX возвращает массив
    $.ajax(FORM_DEF_1_URL, {
        type: 'GET',
        dataType: 'json',

        success: function (data1) {
            console.assert(Array.isArray(data1), 'formDef1: JSON не является массивом');
            console.assert(data1.length > 0, 'formDef1: Массив пустой');
            console.log('formDef1: Текстовые данные:', data1);

            // второй запрос только после первого
            $.ajax(FORM_DEF_2_URL, {
                type: 'GET',
                dataType: 'json',

                success: function (data2) {
                    console.assert(Array.isArray(data2), 'formDef2: JSON не является массивом');
                    console.assert(data2.length > 0, 'formDef2: Массив пустой');
                    console.log('formDef2: Текстовые данные:', data2);            
                },

                error: function (jqXHR, statusStr, errorStr) {
                    console.error('Ошибка AJAX formDef2:', statusStr, errorStr);
                }
            });
        },

        error: function (jqXHR, statusStr, errorStr) {
            console.error('Ошибка AJAX formDef1:', statusStr, errorStr);
        }

    });
}

runTests();