import { SiriusElement } from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

export const SIRIUS_POPUP_MENU = deepFreeze({
    NAME: "SiriusPopupMenu",
    TAG: "sirius-popup-menu",
    CSS_VARS: {
        MENU_WIDTH: "--popup-menu-width",
        MENU_BACKGROUND: "--popup-menu-bg",
        BUTTON_COLOR: "--popup-button-color",
    },
    CLASSES: {
        MENU_CONTAINER: "menu-container",
        MENU: "menu",
        MENU_ITEM: "menu-item",
        BUTTON: "popup-button",
    },
});

export class SiriusPopupMenu extends SiriusElement {
    #menuContainerElement = null;
    #buttonElement = null;
    #menuElement = null;

    constructor(properties) {
        super(properties, SIRIUS_POPUP_MENU.NAME);
    }

    static get observedAttributes() {
        return [...SiriusElement.observedAttributes];
    }

    #toggleMenu() {
        if (this.#menuElement.classList.contains("visible")) {
            this.#menuElement.classList.remove("visible");
        } else {
            this.#menuElement.classList.add("visible");
        }
    }

    #getTemplate() {
        const containerClasses = [SIRIUS_POPUP_MENU.CLASSES.MENU_CONTAINER];
        const buttonClasses = [SIRIUS_POPUP_MENU.CLASSES.BUTTON];
        const menuClasses = [SIRIUS_POPUP_MENU.CLASSES.MENU];

        return `
            <div class="${containerClasses.join(" ")}">
                <button class="${buttonClasses.join(" ")}">Menu</button>
                <div class="${menuClasses.join(" ")}">
                    <div class="${SIRIUS_POPUP_MENU.CLASSES.MENU_ITEM}">Option 1</div>
                    <div class="${SIRIUS_POPUP_MENU.CLASSES.MENU_ITEM}">Option 2</div>
                </div>
            </div>
        `;
    }

    async connectedCallback() {
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }

        // Crear la plantilla
        const innerHTML = this.#getTemplate();
        this.shadowRoot.innerHTML = innerHTML;

        // Obtener elementos del shadow DOM
        this.#menuContainerElement = this.shadowRoot.querySelector(`.${SIRIUS_POPUP_MENU.CLASSES.MENU_CONTAINER}`);
        this.#buttonElement = this.#menuContainerElement.querySelector(`.${SIRIUS_POPUP_MENU.CLASSES.BUTTON}`);
        this.#menuElement = this.#menuContainerElement.querySelector(`.${SIRIUS_POPUP_MENU.CLASSES.MENU}`);

        // Agregar evento de clic
        this.#buttonElement.addEventListener("click", () => this.#toggleMenu());

        // Agregar el estilo
        await this._loadAndAdoptStyles();

        // Despachar evento de construcción
        this.dispatchBuiltEvent();
    }
}

customElements.define(SIRIUS_POPUP_MENU.TAG, SiriusPopupMenu);
