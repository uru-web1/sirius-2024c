import { SIRIUS_TYPES, SiriusElement } from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";
// Definición de constantes para el radio
// Definición de constantes para el radio 
export const SIRIUS_RADIO = deepFreeze({
    NAME: "SiriusRadio",
    TAG: "sirius-radio",
    ATTRIBUTES: {
        LABEL: { NAME: "label", DEFAULT: "", TYPE: SIRIUS_TYPES.STRING },
        CHECKED: { NAME: "checked", DEFAULT: false, TYPE: SIRIUS_TYPES.BOOLEAN },
        DISABLED: { NAME: "disabled", DEFAULT: false, TYPE: SIRIUS_TYPES.BOOLEAN },
        GROUP: { NAME: "group", DEFAULT: "", TYPE: SIRIUS_TYPES.STRING },
    },
    CLASSES: {
        CONTAINER: 'radio-container',
        LABEL: 'radio-label',
        INPUT: 'radio-input',
        SVG: 'radio-svg',
    }
});

// Clase para el elemento SiriusRadio
export class SiriusRadio extends SiriusElement {
        // Registro de los radios por grupo
        static radioGroups = {};

    constructor(props) {
        super(props, SIRIUS_RADIO.NAME);
        this._attributes = {
            id: props.id || `sirius-radio-${Math.random().toString(36).substr(2, 9)}`,
            label: props.label || SIRIUS_RADIO.ATTRIBUTES.LABEL.DEFAULT,
            checked: props.checked !== undefined ? props.checked : SIRIUS_RADIO.ATTRIBUTES.CHECKED.DEFAULT,
            disabled: props.disabled !== undefined ? props.disabled : SIRIUS_RADIO.ATTRIBUTES.DISABLED.DEFAULT,
            group: props.group || SIRIUS_RADIO.ATTRIBUTES.GROUP.DEFAULT,
        };

        // Agregar este radio al grupo correspondiente
        if (!SiriusRadio.radioGroups[this._attributes.group]) {
            SiriusRadio.radioGroups[this._attributes.group] = [];
        }
        SiriusRadio.radioGroups[this._attributes.group].push(this);

        this._loadAttributes({
            htmlAttributes: SIRIUS_RADIO.ATTRIBUTES,
            properties: props
        });
    }

    async connectedCallback() {
        // Cargar estilos y crear plantilla
        await this._loadElementStyles('./SiriusRadio');
        const innerHTML = this.#getTemplate();
        await this._createTemplate(innerHTML);
        this.shadowRoot.appendChild(this._templateContent);

        // Manejo de eventos
        const input = this.shadowRoot.querySelector('input[type="radio"]');
        input?.addEventListener('click', () => this.toggleRadio());
        this.shadowRoot.querySelector('.radio-svg')?.addEventListener('click', () => this.toggleRadio());

        this.dispatchBuiltEvent();
    }

    toggleRadio() {
        const input = this.shadowRoot.querySelector(`#${this._attributes.id}-input`);
        if (input) {
            const wasChecked = input.checked;
            input.checked = !wasChecked;
            this._attributes.checked = input.checked;
            this.updateSVG();

            // Si el radio se selecciona, deseleccionar otros en el mismo grupo
            if (this._attributes.checked) {
                SiriusRadio.deselectOtherRadios(this._attributes.group, this);
            }
            this.dispatchEvent(new Event('change'));
        }
    }

    static deselectOtherRadios(groupName, selectedRadio) {
        const radiosInGroup = SiriusRadio.radioGroups[groupName];
        radiosInGroup.forEach((radio) => {
            if (radio !== selectedRadio) {
                radio.deselectRadio();
            }
        });
    }

    deselectRadio() {
        this._attributes.checked = false;
        const input = this.shadowRoot.querySelector('input[type="radio"]');
        if (input) {
            input.checked = false;
        }
        this.updateSVG();
    }

    updateSVG() {
        const svgContainer = this.shadowRoot.querySelector('.radio-svg');
        svgContainer.innerHTML = this.#getSVG();
    }

    #getSVG() {
        return `
            <svg width="50" height="50" class="radio-svg">
                ${this._attributes.checked 
                    ? `<circle cx="25" cy="25" r="9" fill="none" stroke="black" stroke-width="3"></circle>
                       <circle cx="25" cy="25" r="6" fill="black"></circle>`
                    : `<circle cx="25" cy="25" r="9" fill="none" stroke="black" stroke-width="3"></circle>`}
            </svg>`;
    }

    get isSelected() {
        return this._attributes[SIRIUS_RADIO.ATTRIBUTES.CHECKED.NAME];
    }
    #getTemplate() {
        return `
            <div class="${SIRIUS_RADIO.CLASSES.CONTAINER}">
                <input 
                    type="radio" 
                    id="${this._attributes.id}-input" 
                    class="${SIRIUS_RADIO.CLASSES.INPUT}" 
                    ${this._attributes.disabled ? 'disabled' : ''} 
                    ${this._attributes.checked ? 'checked' : ''}>
                <div class="${SIRIUS_RADIO.CLASSES.SVG}">
                    ${this.#getSVG()}
                </div>
                <label class="${SIRIUS_RADIO.CLASSES.LABEL}" for="${this._attributes.id}-input">
                    ${this._attributes.label}
                </label>
            </div>`;
    }

    // Añade el radio al body
    addToBody() {
        document.body.appendChild(this);
    }

    // Muestra el radio
    show() {
        this.containerElement.classList.remove('hidden');
    }

    // Esconde el radio
    hide() {
        this.containerElement.classList.add('hidden');
    }

    // Centra la pantalla
    centerScreen() {
        this.containerElement.classList.add('center-screen');
    }

    // Quita el centrado de la pantalla
    removeCenterScreen() {
        this.containerElement.classList.remove('center-screen');
    }
}

customElements.define(SIRIUS_RADIO.TAG, SiriusRadio);