import { SiriusElement } from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";
import { SiriusIcon } from "./SiriusIcon.js"; // Importación del SiriusIcon

export const SIRIUS_COMBOBOX = deepFreeze({
    NAME: "SiriusCombobox",
    TAG: "sirius-combobox",
    CSS_VARS: {
        WIDTH: "--combobox-width",
        BORDER_COLOR: "--combobox-border-color",
        BACKGROUND: "--combobox-background",
        TEXT_COLOR: "--combobox-text-color",
        OPTION_HOVER: "--combobox-option-hover",
    },
    CLASSES: {
        CONTAINER: "combobox-container",
        PLACEHOLDER: "combobox-placeholder",
        ICON: "combobox-icon",
        OPTIONS: "combobox-options",
        OPTION: "combobox-option",
        HIDDEN: "hidden",
    },
});

export class SiriusCombobox extends SiriusElement {
    #placeholderElement = null;
    #optionsContainer = null;
    #iconElement = null;

    constructor(properties) {
        super(properties, SIRIUS_COMBOBOX.NAME);
        this._options = [];
    }

    static get observedAttributes() {
        return ["placeholder", "options"];
    }

    get options() {
        return this._options;
    }

    set options(value) {
        if (Array.isArray(value)) {
            this._options = value;
            this.#renderOptions();
        }
    }

    #getTemplate() {
        return `
            <div class="${SIRIUS_COMBOBOX.CLASSES.CONTAINER}">
                <div class="${SIRIUS_COMBOBOX.CLASSES.PLACEHOLDER}">
                    <span>${this.getAttribute("placeholder") || "Select an option"}</span>
                    <sirius-icon class="${SIRIUS_COMBOBOX.CLASSES.ICON}" icon="arrow" fill="black" height="20px" width="24px" id="icon-1"></sirius-icon>
                </div>
                <div class="${SIRIUS_COMBOBOX.CLASSES.OPTIONS} ${SIRIUS_COMBOBOX.CLASSES.HIDDEN}"></div>
            </div>
        `;
    }

    async connectedCallback() {
        if (!this.shadowRoot) {
            this.attachShadow({ mode: "open" }); // Crear shadow DOM
        }

        const innerHTML = this.#getTemplate();
        this.shadowRoot.innerHTML = innerHTML;

        // Inicializar elementos
        this._containerElement = this.shadowRoot.querySelector(`.${SIRIUS_COMBOBOX.CLASSES.CONTAINER}`);
        this.#placeholderElement = this._containerElement?.querySelector(`.${SIRIUS_COMBOBOX.CLASSES.PLACEHOLDER}`);
        this.#iconElement = this._containerElement?.querySelector(`.${SIRIUS_COMBOBOX.CLASSES.ICON}`);
        this.#optionsContainer = this._containerElement?.querySelector(`.${SIRIUS_COMBOBOX.CLASSES.OPTIONS}`);

        if (!this._containerElement || !this.#placeholderElement || !this.#optionsContainer || !this.#iconElement) {
            console.error("Error: No se pudieron inicializar los elementos requeridos en SiriusCombobox.");
            return;
        }

        // Agregar eventos
        this.#placeholderElement.addEventListener("click", () => this.#toggleOptions());
        this.#renderOptions();
        await this._loadAndAdoptStyles();

        // Despachar evento indicando que el componente está listo
        this.dispatchEvent(new CustomEvent("combobox-built", { detail: { element: this } }));
    }

    #renderOptions() {
        if (!this.#optionsContainer) return;

        this.#optionsContainer.innerHTML = this._options
            .map(option => `<div class="${SIRIUS_COMBOBOX.CLASSES.OPTION}" tabindex="0">${option}</div>`)
            .join("");

        this.#optionsContainer.querySelectorAll(`.${SIRIUS_COMBOBOX.CLASSES.OPTION}`).forEach(option => {
            option.addEventListener("click", () => this.#selectOption(option.textContent));
        });
    }

    #toggleOptions() {
        const isHidden = this.#optionsContainer.classList.contains(SIRIUS_COMBOBOX.CLASSES.HIDDEN);
        if (isHidden) {
            this.#optionsContainer.classList.remove(SIRIUS_COMBOBOX.CLASSES.HIDDEN);
            this.#iconElement.setAttribute("rotation", "180"); // Rotar ícono
        } else {
            this.#optionsContainer.classList.add(SIRIUS_COMBOBOX.CLASSES.HIDDEN);
            this.#iconElement.setAttribute("rotation", "0"); // Resetear rotación
        }
    }

    #selectOption(value) {
        this.#placeholderElement.querySelector("span").textContent = value;
        this.#optionsContainer.classList.add(SIRIUS_COMBOBOX.CLASSES.HIDDEN);
        this.#iconElement.setAttribute("rotation", "0"); // Resetear rotación
        this.dispatchEvent(new CustomEvent("option-selected", { detail: { value } }));
    }
}

customElements.define(SIRIUS_COMBOBOX.TAG, SiriusCombobox);
