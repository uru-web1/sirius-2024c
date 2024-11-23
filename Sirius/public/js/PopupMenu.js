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
            listOpt.priorLevel = option.priorLevel; // Asociar priorLevel con el nivel
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
        this.#fixedOptions.push(option); // Agregar la opción fija al array
    }

    #renderOptions() {
        const options = this.#optionLevelMap.get(this.#currentLevel)?.values() || [];
        const optionsHTML = [...options]
            .map(
                (option) =>
                    `<div class="${POPUP_MENU.CLASSES.MENU_OPTION}" data-action="${option.action}" data-next-level="${option.nextLevel}" data-prior-level="${option.priorLevel}">
                        ${option.text}
                    </div>`
            )
            .join("");

        // Renderizar opciones fijas al final
        const fixedOptionsHTML = this.#fixedOptions
            .map(
                (option) =>
                    `<div class="${POPUP_MENU.CLASSES.FIXED_OPTION}" data-action="${option.action}">
                        ${option.text}
                    </div>`
            )
            .join("");

        return optionsHTML + fixedOptionsHTML;
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

    #showOptions(level) {
        this.#currentLevel = level; // Actualizar el nivel actual
        this.shadowRoot.innerHTML = this.#getTemplate();
    }

    async #onBackClick() {
        const currentOptions = this.#optionLevelMap.get(this.#currentLevel);
        if (currentOptions && currentOptions.priorLevel !== undefined) {
            this.#showOptions(currentOptions.priorLevel); // Regresar al nivel especificado en priorLevel
        } else if (this.#currentLevel > 0) {
            this.#showOptions(this.#currentLevel - 1); // Comportamiento de respaldo
        }
    }

    #onOptionClick(event) {
        const optionElement = event.target.closest(`.${POPUP_MENU.CLASSES.MENU_OPTION}`);
        if (optionElement) {
            const action = optionElement.dataset.action;
            const nextLevel = parseInt(optionElement.dataset.nextLevel, 10);

            if (nextLevel !== null && !isNaN(nextLevel)) {
                this.#showOptions(nextLevel);
            } else {
                this.dispatchEvent(new CustomEvent("option-selected", { detail: { action } }));
            }
        }
    }

    async connectedCallback() {
        if (!this.shadowRoot) {
            this.attachShadow({ mode: "open" });
        }

        this.#menuContainerElement = document.createElement("div");
        this.#menuContainerElement.classList.add(POPUP_MENU.CLASSES.MENU_CONTAINER);

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
        this.#showOptions(0);
        this.dispatchBuiltEvent();
    }
}

customElements.define(POPUP_MENU.TAG, PopupMenu);
