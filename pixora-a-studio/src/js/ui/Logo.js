'use strict';

// Logo - SVG-логотип приложения
export class Logo {

    static render($container) {
        // console.log('Logo render:', $container);
        $container.innerHTML = `
            <svg viewBox="0 0 210 75"
                xmlns="http://www.w3.org/2000/svg">
                <g fill="#b8f5b8" stroke="#7fd3ff">
                    <text x="5" y="44"
                        font-size="52"
                        font-weight="700"
                        font-family="Segoe UI"
                        stroke-width="3">Pixor</text>
                    <text x="5" y="68"
                        font-size="33"
                        font-family="Great Vibes, cursive"
                        stroke-width="1">Studio</text>
                </g>
                <text x="133" y="64"
                    font-size="80"
                    font-weight="700"
                    font-family="Great Vibes, cursive"
                    fill="#b8f5b8"
                    stroke="#7fd3ff"
                    stroke-width="0.1">A.</text>
            </svg>
        `;
    }
}