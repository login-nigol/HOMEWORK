'use strict';

// IconLoader - загружает SVG-спрайт и вставляет в body
// после загрузки все иконки доступны через <use href="#icon-id">
export class IconLoader {
     
    static async load(url = './assets/icons.svg') {
        try {
            // загружаем SVG через fetch
            const response = await fetch(url);
            if ( !response.ok )
                throw new Error('Не удалось загрузить иконки');

            const svgText = await response.text();

            // создаём контейнер и вставляем в начало body
            const div = document.createElement('div');
            div.style.display = 'none';
            div.innerHTML = svgText;
            document.body.prepend(div);
                
        } catch (error) {
            console.error('IconLoader:', error);
        }
    }
}