import { SiriusElement } from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

// Constantes para el PopupMenu
export const POPUP_MENU = deepFreeze({
    NAME: "PopupMenu",
    TAG: "popup-menu",
    CSS_VARS: {
        WIDTH: "--menu-width",
        BACKGROUND: "--menu-background",
        OPTION_COLOR: "--option-color",
        OPTION_HOVER: "--option-hover-color",
        ANIMATION_DURATION: "--animation-duration",
    },
    CLASSES: {
        MENU_CONTAINER: "menu-container",
        MENU_OPTION: "menu-option",
        FIXED_OPTION: "menu-fixed-option",
        BACK_BUTTON: "menu-back-button",
        SLIDE_IN: "slide-in",
        SLIDE_OUT: "slide-out",
    },
});

export class PopupMenu extends SiriusElement {
    #menuContainerElement = null;
    #currentLevel = 0; // Nivel actual del menú
    #optionLevels = []; // Arreglo de niveles de opciones
    #fixedOptions = []; // Opciones fijas al final del menú
    #animationDuration = 300; // Duración en ms para las animaciones
    #optionLevelMap = new Map(); // Mapa de niveles con opciones

    constructor(properties) {
        super(properties, POPUP_MENU.NAME);
    }

    static get observedAttributes() {
        return [...SiriusElement.observedAttributes];
    }

    addOption(option) {
        if (!this.#optionLevelMap.has(option.level)) {
            let listOpt = new Map();
            listOpt.level = option.level;
            listOpt.priorLevel = option.priorLevel;
            listOpt.panel = document.createElement("div");
            listOpt.panel.className = "PopupMenu_Option_Container";
            listOpt.set(option.id, option);
            this.#optionLevelMap.set(option.level, listOpt);
        } else {
            let olm = this.#optionLevelMap.get(option.level);
            olm.set(option.id, option);
        }
        return this;
    }

    addFixedOption(option) {
        this.#fixedOptions.push(option);
    }

    #renderOptions() {
        const options = this.#optionLevelMap.get(this.#currentLevel)?.values() || [];
        const fixedOptionsHTML = this.#fixedOptions.map(
            (option) => `<div class="${POPUP_MENU.CLASSES.FIXED_OPTION}">${option}</div>`
        ).join("");

        return [...options]
            .map(
                (option) =>
                    `<div class="${POPUP_MENU.CLASSES.MENU_OPTION}" data-action="${option.action}" data-next-level="${option.nextLevel}">
                        ${option.text}
                    </div>`
            )
            .join("") + fixedOptionsHTML;
    }

    #getTemplate() {
        const backButton = this.#currentLevel > 0
            ? `<div class="${POPUP_MENU.CLASSES.BACK_BUTTON}">Back</div>`
            : "";
    
        const optionsHTML = this.#renderOptions();
        return `
            <div class="${POPUP_MENU.CLASSES.MENU_CONTAINER}">
                ${backButton}
                ${optionsHTML}
            </div>
        `;
    }

    async #animateMenu(changeLevel) {
        this.#menuContainerElement.classList.add(POPUP_MENU.CLASSES.SLIDE_OUT);
        await new Promise((resolve) => setTimeout(resolve, this.#animationDuration));
        this.#currentLevel += changeLevel;
        this.#updateMenu();
        this.#menuContainerElement.classList.remove(POPUP_MENU.CLASSES.SLIDE_OUT);
        this.#menuContainerElement.classList.add(POPUP_MENU.CLASSES.SLIDE_IN);
        await new Promise((resolve) => setTimeout(resolve, this.#animationDuration));
        this.#menuContainerElement.classList.remove(POPUP_MENU.CLASSES.SLIDE_IN);
    }

    #showOptions(level) {
        this.#currentLevel = level; // Actualizar el nivel actual
        const options = this.#optionLevelMap.get(level)?.values() || [];
        const fixedOptionsHTML = this.#fixedOptions.map(
            (option) => `<div class="${POPUP_MENU.CLASSES.FIXED_OPTION}">${option}</div>`
        ).join("");

        // Renderizar las opciones del nivel actual
        const optionsHTML = [...options]
            .map(
                (option) =>
                    `<div class="${POPUP_MENU.CLASSES.MENU_OPTION}" data-action="${option.action}" data-next-level="${option.nextLevel}">
                        ${option.text}
                    </div>`
            )
            .join("") + fixedOptionsHTML;

        const backButton = level > 0
            ? `<div class="${POPUP_MENU.CLASSES.BACK_BUTTON}">Back</div>`
            : "";

        this.shadowRoot.innerHTML = `
            <div class="${POPUP_MENU.CLASSES.MENU_CONTAINER}">
                ${backButton}
                ${optionsHTML}
            </div>
        `;
    }

    #onOptionClick(event) {
        const optionElement = event.target.closest(`.${POPUP_MENU.CLASSES.MENU_OPTION}`);
        if (optionElement) {
            const action = optionElement.dataset.action;
            const nextLevel = parseInt(optionElement.dataset.nextLevel, 10);

            if (nextLevel !== null && !isNaN(nextLevel)) {
                this.#showOptions(nextLevel); // Mostrar el nivel siguiente directamente
            } else {
                this.dispatchEvent(new CustomEvent("option-selected", { detail: { action } }));
            }
        }
    }

    async #onBackClick() {
        if (this.#currentLevel > 0) {
            this.#showOptions(this.#currentLevel - 1); // Volver al nivel anterior
        }
    }

    async #updateMenu() {
        this.shadowRoot.innerHTML = this.#getTemplate();
    }

    async connectedCallback() {
        if (!this.shadowRoot) {
            this.attachShadow({ mode: "open" });
        }

        this.#menuContainerElement = document.createElement("div");
        this.#menuContainerElement.classList.add(POPUP_MENU.CLASSES.MENU_CONTAINER);

        // Render inicial
        this.shadowRoot.innerHTML = "";
        this.shadowRoot.appendChild(this.#menuContainerElement);

        this.shadowRoot.addEventListener("click", async (event) => {
            if (event.target.classList.contains(POPUP_MENU.CLASSES.BACK_BUTTON)) {
                await this.#onBackClick();
            } else {
                this.#onOptionClick(event);
            }
        });

        await this._loadAndAdoptStyles();
        this.#showOptions(0); // Mostrar el menú principal
        this.dispatchBuiltEvent();
    }
}

customElements.define(POPUP_MENU.TAG, PopupMenu);
