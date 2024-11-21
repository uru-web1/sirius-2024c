import { SiriusElement } from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

// Constantes para el Switch
export const SIRIUS_SWITCH = deepFreeze({
    NAME: "SiriusSwitch",
    TAG: "sirius-switch",
    CSS_VARS: {
        WIDTH: "--switch-width",
        HEIGHT: "--switch-height",
        BACKGROUND_ON: "--switch-bg-on",
        BACKGROUND_OFF: "--switch-bg-off",
        BUTTON_COLOR: "--switch-button-color",
    },
    CLASSES: {
        SWITCH_CONTAINER: "switch-container",
        SWITCH_BUTTON: "switch-button",
    },
});

export class SiriusSwitch extends SiriusElement {
    #switchContainerElement = null;
    #switchButtonElement = null;

    #isChecked = false; // Estado del switch

    constructor(properties) {
        super(properties, SIRIUS_SWITCH.NAME);
    }

    static get observedAttributes() {
        return [...SiriusElement.observedAttributes];
    }

    get isChecked() {
        return this.#isChecked;
    }

    set isChecked(value) {
        this.#isChecked = value;
        this.#updateSwitchState();
    }

    #updateSwitchState() {
        if (this.#isChecked) {
            this.#switchContainerElement.classList.add("checked");
        } else {
            this.#switchContainerElement.classList.remove("checked");
        }
    }

    #toggleSwitch() {
        this.isChecked = !this.isChecked;
        this.dispatchEvent(
            new CustomEvent("switch-toggled", {
                detail: { isChecked: this.isChecked },
            })
        );
    }

    #getTemplate() {
        const containerClasses = [SIRIUS_SWITCH.CLASSES.SWITCH_CONTAINER];
        const buttonClasses = [SIRIUS_SWITCH.CLASSES.SWITCH_BUTTON];

        return `
            <div class="${containerClasses.join(" ")}">
                <div class="${buttonClasses.join(" ")}"></div>
            </div>
        `;
    }

    async connectedCallback() {
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });  // Crear shadow DOM si no está presente
        }

        // Crear la plantilla
        const innerHTML = this.#getTemplate();
        this.shadowRoot.innerHTML = innerHTML;

        // Obtener elementos del shadow DOM
        this.#switchContainerElement = this.shadowRoot.querySelector(`.${SIRIUS_SWITCH.CLASSES.SWITCH_CONTAINER}`);
        this.#switchButtonElement = this.#switchContainerElement.querySelector(`.${SIRIUS_SWITCH.CLASSES.SWITCH_BUTTON}`);

        // Agregar evento de clic
        this.#switchContainerElement.addEventListener("click", () => this.#toggleSwitch());

        // Agregar el estilo
        await this._loadAndAdoptStyles();

        // Estado inicial
        this.#updateSwitchState();

        // Despachar evento de construcción
        this.dispatchBuiltEvent();
    }
}

customElements.define(SIRIUS_SWITCH.TAG, SiriusSwitch);
