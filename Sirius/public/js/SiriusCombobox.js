import { SiriusElement } from "./SiriusElement.js";
import { SiriusIcon } from "./SiriusIcon.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Sirius Combobox constants */
export const SIRIUS_COMBOBOX = deepFreeze({
    NAME: "SiriusCombobox",
    TAG: "sirius-combobox",
    ATTRIBUTES: {
        PLACEHOLDER: { NAME: "placeholder", DEFAULT: "Select an option", TYPE: "string" },
        OPTIONS: { NAME: "options", DEFAULT: [], TYPE: "array" },
        TEXT: { NAME: "text", DEFAULT: "Field", TYPE: "string" }
    },
    CLASSES: {
        CONTAINER: 'sirius-combobox-container',
        INPUT_WRAPPER: 'sirius-combobox-input-wrapper',
        INPUT: 'sirius-combobox-input',
        ICON: 'sirius-combobox-icon',
        DROPDOWN: 'sirius-combobox-dropdown',
        OPTION: 'sirius-combobox-option',
        LABEL: 'sirius-combobox-label'
    }
});

export class SiriusCombobox extends SiriusElement {
    constructor(props) {
        super(props, SIRIUS_COMBOBOX.NAME);

        // Asegurar el placeholder predeterminado si no se pasa como prop
        this._attributes[SIRIUS_COMBOBOX.ATTRIBUTES.PLACEHOLDER.NAME] =
            props?.placeholder || this.getAttribute(SIRIUS_COMBOBOX.ATTRIBUTES.PLACEHOLDER.NAME) ||
            SIRIUS_COMBOBOX.ATTRIBUTES.PLACEHOLDER.DEFAULT;

        // Cargar opciones desde props o atributo HTML
        this._attributes[SIRIUS_COMBOBOX.ATTRIBUTES.OPTIONS.NAME] = this._parseOptions(
            props?.options || this.getAttribute(SIRIUS_COMBOBOX.ATTRIBUTES.OPTIONS.NAME)
        );

        // Cargar el texto de la etiqueta
        const text = props?.text || this.getAttribute(SIRIUS_COMBOBOX.ATTRIBUTES.TEXT.NAME);
        this._attributes[SIRIUS_COMBOBOX.ATTRIBUTES.TEXT.NAME] = text || SIRIUS_COMBOBOX.ATTRIBUTES.TEXT.DEFAULT;

        this._selectedOption = null; // Almacena la opción seleccionada
        this._createComboboxTemplate(); // Construir estructura HTML
    }

    /**
     * Método auxiliar para parsear opciones en array
     */
    _parseOptions(options) {
        try {
            return typeof options === 'string' ? JSON.parse(options) : options || [];
        } catch (error) {
            console.error("Error parsing options:", error);
            return SIRIUS_COMBOBOX.ATTRIBUTES.OPTIONS.DEFAULT;
        }
    }

    /**
     * Genera el HTML del combobox y su estructura en el shadow DOM.
     */
    async _createComboboxTemplate() {
        const { PLACEHOLDER, OPTIONS } = SIRIUS_COMBOBOX.ATTRIBUTES;

        // Generar el HTML para las opciones
        const optionsHTML = this._attributes[OPTIONS.NAME].map(
            (option) => `<div class="${SIRIUS_COMBOBOX.CLASSES.OPTION}" data-value="${option}">${option}</div>`
        ).join("");

        const textHTML = this._attributes[SIRIUS_COMBOBOX.ATTRIBUTES.TEXT.NAME];

        // Estructura HTML del combobox
        const comboboxHTML = `
            <div id="${this._attributes.id}-container" class="${SIRIUS_COMBOBOX.CLASSES.CONTAINER}">
                <label class="${SIRIUS_COMBOBOX.CLASSES.LABEL}">${textHTML}</label>
                <div class="${SIRIUS_COMBOBOX.CLASSES.INPUT_WRAPPER}">
                    <input type="text" placeholder="${this._attributes[PLACEHOLDER.NAME]}" 
                           class="${SIRIUS_COMBOBOX.CLASSES.INPUT} placeholder-color" readonly>
                    <sirius-icon id="${this._attributes.id}-arrow" class="${SIRIUS_COMBOBOX.CLASSES.ICON}" 
                                 icon="arrow" width="20" height="20" rotate="down" fill="black"></sirius-icon>
                </div>
                <div class="${SIRIUS_COMBOBOX.CLASSES.DROPDOWN}" style="display: none;">
                    ${optionsHTML}
                </div>
            </div>
        `;

        // Insertar la plantilla
        await this._createTemplate(comboboxHTML);
        this.containerElement = this._templateContent.querySelector(`#${this._attributes.id}-container`);
        this.inputElement = this.containerElement.querySelector(`.${SIRIUS_COMBOBOX.CLASSES.INPUT}`);
        this.dropdownElement = this.containerElement.querySelector(`.${SIRIUS_COMBOBOX.CLASSES.DROPDOWN}`);
        this.arrowIcon = this.containerElement.querySelector(`#${this._attributes.id}-arrow`);

        // Actualizar el valor del input al placeholder inicial
        this.inputElement.value = this._selectedOption || this._attributes[PLACEHOLDER.NAME];

        this.shadowRoot.appendChild(this._templateContent);
        await this._loadElementStyles(SIRIUS_COMBOBOX.NAME);
        this.dispatchBuiltEvent();

        this._addEventListeners();
    }

    /**
     * Agrega listeners para manejar el dropdown y selección de opciones.
     */
    _addEventListeners() {
        // Evento para mostrar/ocultar el dropdown
        this.inputElement.addEventListener("click", () => {
            const isHidden = this.dropdownElement.style.display === 'none' || !this.dropdownElement.style.display;
            this.dropdownElement.style.display = isHidden ? 'block' : 'none';
            this.arrowIcon.iconRotation = isHidden ? 'up' : 'down';
        });

        // Evento para seleccionar una opción del dropdown
        this.dropdownElement.addEventListener("click", (event) => {
            const optionElement = event.target.closest(`.${SIRIUS_COMBOBOX.CLASSES.OPTION}`);
            if (optionElement) {
                // Actualiza y guarda la opción seleccionada
                this._selectedOption = optionElement.dataset.value;
                this.inputElement.value = this._selectedOption;
                this.dropdownElement.style.display = 'none';
                this.arrowIcon.iconRotation = 'down';

                // Remover el color del placeholder
                this.inputElement.classList.remove('placeholder-color');

                // Dispara un evento personalizado para la selección
                this.dispatchEvent(new CustomEvent("option-selected", { detail: { selectedOption: this._selectedOption } }));
            }
        });
    }

    /**
     * Getter para obtener la opción seleccionada.
     */
    get selectedOption() {
        return this._selectedOption;
    }

    /**
     * Setter para configurar nuevas opciones.
     */
    set options(newOptions) {
        this._attributes[SIRIUS_COMBOBOX.ATTRIBUTES.OPTIONS.NAME] = Array.isArray(newOptions) ? newOptions : [];
        this._updateDropdownOptions();
    }

    /**
     * Actualiza las opciones del dropdown.
     */
    _updateDropdownOptions() {
        this.dropdownElement.innerHTML = this._attributes[SIRIUS_COMBOBOX.ATTRIBUTES.OPTIONS.NAME].map(
            (option) => `<div class="${SIRIUS_COMBOBOX.CLASSES.OPTION}" data-value="${option}">${option}</div>`
        ).join("");
    }

    /**
     * Añade el combobox al DOM.
     */
    addToBody() {
        document.body.appendChild(this);
    }
}

customElements.define(SIRIUS_COMBOBOX.TAG, SiriusCombobox);
