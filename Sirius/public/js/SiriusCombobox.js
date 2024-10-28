import { SiriusElement } from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Sirius Combobox constants */
export const SIRIUS_COMBOBOX = deepFreeze({
    NAME: "SiriusCombobox",
    TAG: "sirius-combobox",
    ATTRIBUTES: {
        PLACEHOLDER: { NAME: "placeholder", DEFAULT: "Select an option", TYPE: "string" },
        OPTIONS: { NAME: "options", DEFAULT: [], TYPE: "array" },
    },
    CLASSES: {
        CONTAINER: 'sirius-combobox-container',
        INPUT: 'sirius-combobox-input',
        DROPDOWN: 'sirius-combobox-dropdown',
        OPTION: 'sirius-combobox-option'
    }
});

class SiriusCombobox extends SiriusElement {
    constructor(props) {
        super(props, SIRIUS_COMBOBOX.NAME);

        // Comprobar si las opciones se pasaron en el HTML como atributo
        let options = props?.options || this.getAttribute(SIRIUS_COMBOBOX.ATTRIBUTES.OPTIONS.NAME);
        options = options ? JSON.parse(options) : SIRIUS_COMBOBOX.ATTRIBUTES.OPTIONS.DEFAULT;

        // Asignar las opciones validadas al atributo interno
        this._attributes[SIRIUS_COMBOBOX.ATTRIBUTES.OPTIONS.NAME] = options;

        this._selectedOption = "";
        this._createComboboxTemplate();
    }

    async _createComboboxTemplate() {
        const { PLACEHOLDER, OPTIONS } = SIRIUS_COMBOBOX.ATTRIBUTES;

        // Generar opciones en dropdown
        const optionsHTML = this._attributes[OPTIONS.NAME].map(
            (option) => `<div class="${SIRIUS_COMBOBOX.CLASSES.OPTION}" data-value="${option}">${option}</div>`
        ).join("");

        // Template para el combobox
        const comboboxHTML = `
            <div id="${this._attributes.id}-container" class="${SIRIUS_COMBOBOX.CLASSES.CONTAINER}">
                <input type="text" placeholder="${this._attributes[PLACEHOLDER.NAME] || PLACEHOLDER.DEFAULT}" class="${SIRIUS_COMBOBOX.CLASSES.INPUT}" readonly>
                <div class="${SIRIUS_COMBOBOX.CLASSES.DROPDOWN}">
                    ${optionsHTML}
                </div>
            </div>
        `;

        await this._createTemplate(comboboxHTML);

        this.containerElement = this._templateContent.querySelector(`#${this._attributes.id}-container`);
        this.inputElement = this.containerElement.querySelector(`.${SIRIUS_COMBOBOX.CLASSES.INPUT}`);
        this.dropdownElement = this.containerElement.querySelector(`.${SIRIUS_COMBOBOX.CLASSES.DROPDOWN}`);

        this.shadowRoot.appendChild(this._templateContent);
        await this._loadElementStyles(SIRIUS_COMBOBOX.NAME);
        this.dispatchBuiltEvent();

        // Attach event listeners
        this._addEventListeners();
    }

    _addEventListeners() {
        // Toggle dropdown
        this.inputElement.addEventListener("click", () => {
            const isHidden = this.dropdownElement.style.display === 'none' || !this.dropdownElement.style.display;
            this.dropdownElement.style.display = isHidden ? 'block' : 'none';
        });

        // Select an option
        this.dropdownElement.addEventListener("click", (event) => {
            const optionElement = event.target.closest(`.${SIRIUS_COMBOBOX.CLASSES.OPTION}`);
            if (optionElement) {
                this._selectedOption = optionElement.dataset.value;
                this.inputElement.value = this._selectedOption;
                this.dropdownElement.style.display = 'none';
                this.dispatchEvent(new CustomEvent("option-selected", { detail: { selectedOption: this._selectedOption } }));
            }
        });
    }

    get selectedOption() {
        return this._selectedOption;
    }

    set options(newOptions) {
        this._attributes[SIRIUS_COMBOBOX.ATTRIBUTES.OPTIONS.NAME] = Array.isArray(newOptions) ? newOptions : [];
        this._updateDropdownOptions();
    }

    _updateDropdownOptions() {
        this.dropdownElement.innerHTML = this._attributes[SIRIUS_COMBOBOX.ATTRIBUTES.OPTIONS.NAME].map(
            (option) => `<div class="${SIRIUS_COMBOBOX.CLASSES.OPTION}" data-value="${option}">${option}</div>`
        ).join("");
    }

    addToBody() {
        document.body.appendChild(this);
    }
}

customElements.define(SIRIUS_COMBOBOX.TAG, SiriusCombobox);
export default SiriusCombobox;
