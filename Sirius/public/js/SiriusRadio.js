import { SIRIUS_TYPES, SiriusElement } from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

// Configuración del componente SiriusRadio
export const SIRIUS_RADIO = deepFreeze({
    NAME: "SiriusRadio",
    TAG: "sirius-radio",
    ATTRIBUTES: {
        LABEL: { NAME: "label", DEFAULT: "", TYPE: SIRIUS_TYPES.STRING },
        SELECTED: { NAME: "selected", DEFAULT: false, TYPE: SIRIUS_TYPES.BOOLEAN },
        DISABLED: { NAME: "disabled", DEFAULT: false, TYPE: SIRIUS_TYPES.BOOLEAN },
    },
    CLASSES: {
        CONTAINER: "radio-container",
        LABEL: "radio-label",
        INPUT: "radio-input",
        SELECTED: "selected",
        DISABLED: "disabled",
    }
});

// Componente SiriusRadio
export class SiriusRadio extends SiriusElement {
    constructor(props) {
        super(props, SIRIUS_RADIO.NAME);

        // Carga los atributos del radio
        this._loadAttributes({
            htmlAttributes: SIRIUS_RADIO.ATTRIBUTES,
            properties: props
        });
    }

    // Template del radio
    #getTemplate() {
        const inputClasses = [SIRIUS_RADIO.CLASSES.INPUT];

        if (this._attributes[SIRIUS_RADIO.ATTRIBUTES.DISABLED.NAME])
            inputClasses.push(SIRIUS_RADIO.CLASSES.DISABLED);

        if (this._attributes[SIRIUS_RADIO.ATTRIBUTES.SELECTED.NAME])
            inputClasses.push(SIRIUS_RADIO.CLASSES.SELECTED);

        return `<div class="${SIRIUS_RADIO.CLASSES.CONTAINER}">
                    <input type="radio" class="${inputClasses.join(" ")}" name="radio-group" ${this._attributes[SIRIUS_RADIO.ATTRIBUTES.SELECTED.NAME] ? "checked" : ""} ${this._attributes[SIRIUS_RADIO.ATTRIBUTES.DISABLED.NAME] ? "disabled" : ""}>
                    <label class="${SIRIUS_RADIO.CLASSES.LABEL}">
                        ${this._attributes[SIRIUS_RADIO.ATTRIBUTES.LABEL.NAME]}
                    </label>
                </div>`;
    }

    async connectedCallback() {
        await this._loadElementStyles();  // Aplica los estilos
        const innerHTML = this.#getTemplate();  // Obtén el contenido HTML
        await this._createTemplate(innerHTML);  // Crea el template

        // Agrega el radio al shadow DOM
        this.containerElement = this._templateContent.firstChild;
        this.shadowRoot.appendChild(this.containerElement);

        this.dispatchBuiltEvent();  // Lanza el evento de construido
    }
}

// Registra el elemento personalizado
customElements.define(SIRIUS_RADIO.TAG, SiriusRadio);
