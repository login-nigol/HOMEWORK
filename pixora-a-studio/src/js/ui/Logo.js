'use srict';

// Logo - SVG-логотип приложения
export class Logo {

    static render($container) {
        $container.innerHTML = `
            <svg width="420" height="140" viewBox="0 0 420 140"
                xmlns="http://www.w3.org/2000/svg">
                <g fill="#b8f5b8" stroke="#7fd3ff">
                    <text x="20" y="60"
                        font-size="52"
                        font-weight="700"
                        font-family="Segoe UI"
                        stroke-width="3">Pixora</text>
                    <text x="25" y="100"
                        font-size="26"
                        font-family="Segoe UI"
                        stroke-width="2">Studio</text>
                </g>
                <text x="210" y="103"
                    font-size="120"
                    font-family="Great Vibes, cursive"
                    fill="#b8f5b8"
                    stroke="#7fd3ff"
                    stroke-width="4">A</text>
            </svg>
        `;
    }
}