import { SiriusElement } from "./SiriusElement.js"; 
import { SiriusIcon } from "./SiriusIcon.js"; 
import { SiriusCheckbox } from "./SiriusCheckbox.js"; 
import deepFreeze from "./utils/deep-freeze.js"; 

/** Define constants used in SiriusCheckCombobox */
export const SIRIUS_CHECKCOMBOBOX = deepFreeze({
    NAME: "SiriusCheckCombobox", 
    TAG: "sirius-checkcombobox", 
    ATTRIBUTES: { // Default attributes for the combobox
        PLACEHOLDER: { NAME: "placeholder", DEFAULT: "Select an option", TYPE: "string" },
        OPTIONS: { NAME: "options", DEFAULT: [], TYPE: "array" },
        TEXT: { NAME: "text", DEFAULT: "Field", TYPE: "string" }
    },
    CLASSES: { // CSS classes for different parts of the combobox
        CONTAINER: 'sirius-checkcombobox-container',
        INPUT_WRAPPER: 'sirius-checkcombobox-input-wrapper',
        INPUT: 'sirius-checkcombobox-input',
        ICON: 'sirius-checkcombobox-icon',
        DROPDOWN: 'sirius-checkcombobox-dropdown',
        OPTION: 'sirius-checkcombobox-option',
        SELECT_ALL: 'sirius-checkcombobox-select-all',
        CHECKBOX: 'sirius-checkcombobox-checkbox',
        LABEL: 'sirius-checkcombobox-label'
    }
});

// Define the SiriusCheckCombobox component class extending SiriusElement
export class SiriusCheckCombobox extends SiriusElement {
    // Constructor to initialize component with properties and default values
    constructor(props) {
        super(props, SIRIUS_CHECKCOMBOBOX.NAME); // Call parent constructor

        // Initialize options from properties or attributes, with fallback to default
        let options = props?.options || this.getAttribute(SIRIUS_CHECKCOMBOBOX.ATTRIBUTES.OPTIONS.NAME);
        options = options ? JSON.parse(options) : SIRIUS_CHECKCOMBOBOX.ATTRIBUTES.OPTIONS.DEFAULT;
        this._attributes[SIRIUS_CHECKCOMBOBOX.ATTRIBUTES.OPTIONS.NAME] = options;

        // Initialize text attribute with a default if not provided
        const text = props?.text || this.getAttribute(SIRIUS_CHECKCOMBOBOX.ATTRIBUTES.TEXT.NAME);
        this._attributes[SIRIUS_CHECKCOMBOBOX.ATTRIBUTES.TEXT.NAME] = text || SIRIUS_CHECKCOMBOBOX.ATTRIBUTES.TEXT.DEFAULT;

        this._selectedOption = ""; // Track currently selected option
        this._createComboboxTemplate(); // Set up HTML structure for the combobox
    }

    // Asynchronously creates the HTML template for the combobox
    async _createComboboxTemplate() {
        const { PLACEHOLDER, OPTIONS } = SIRIUS_CHECKCOMBOBOX.ATTRIBUTES;

        // Generate HTML for each option with a checkbox
        const optionsHTML = this._attributes[OPTIONS.NAME].map(
            (option, index) => `
            <div class="${SIRIUS_CHECKCOMBOBOX.CLASSES.OPTION}" data-value="${option}">
                <span>${option}</span>
                <sirius-checkbox id="${this._attributes.id.replace("combo", "")}-${index}" class="${SIRIUS_CHECKCOMBOBOX.CLASSES.CHECKBOX}"></sirius-checkbox>
            </div>
            `
        ).join("");

        // HTML for the "Select All" option at the top of the dropdown
        const selectAllHTML = `
            <div class="${SIRIUS_CHECKCOMBOBOX.CLASSES.SELECT_ALL}" data-value="select-all">
                <span>Select All</span>
                <sirius-checkbox id="${this._attributes.id.replace("combo", "")}-select-all" class="${SIRIUS_CHECKCOMBOBOX.CLASSES.CHECKBOX}"></sirius-checkbox>
            </div>
        `;

        // HTML for the label text of the combobox
        const textHTML = this._attributes[SIRIUS_CHECKCOMBOBOX.ATTRIBUTES.TEXT.NAME];

        // Complete HTML structure of the combobox component
        const comboboxHTML = `
            <div id="${this._attributes.id}-container" class="${SIRIUS_CHECKCOMBOBOX.CLASSES.CONTAINER}">
                <label class="${SIRIUS_CHECKCOMBOBOX.CLASSES.LABEL}">${textHTML}</label>
                <div class="${SIRIUS_CHECKCOMBOBOX.CLASSES.INPUT_WRAPPER}">
                    <input type="text" placeholder="${this._attributes[PLACEHOLDER.NAME] || PLACEHOLDER.DEFAULT}" class="${SIRIUS_CHECKCOMBOBOX.CLASSES.INPUT}" readonly>
                    <sirius-icon id="${this._attributes.id}-arrow" class="${SIRIUS_CHECKCOMBOBOX.CLASSES.ICON}" icon="arrow" width="20" height="20" rotate="down" fill="black"></sirius-icon>
                </div>
                <div class="${SIRIUS_CHECKCOMBOBOX.CLASSES.DROPDOWN}" style="display: none;">
                    ${selectAllHTML}
                    ${optionsHTML}
                </div>
            </div>
        `;

        // Create and attach the template to the shadow DOM
        await this._createTemplate(comboboxHTML);
        this.containerElement = this._templateContent.querySelector(`#${this._attributes.id}-container`);
        this.inputElement = this.containerElement.querySelector(`.${SIRIUS_CHECKCOMBOBOX.CLASSES.INPUT}`);
        this.dropdownElement = this.containerElement.querySelector(`.${SIRIUS_CHECKCOMBOBOX.CLASSES.DROPDOWN}`);
        this.arrowIcon = this.containerElement.querySelector(`#${this._attributes.id}-arrow`);
        this.selectAllCheckbox = this.containerElement.querySelector(`.${SIRIUS_CHECKCOMBOBOX.CLASSES.SELECT_ALL} .${SIRIUS_CHECKCOMBOBOX.CLASSES.CHECKBOX}`);

        // Append template content and apply styles
        this.shadowRoot.appendChild(this._templateContent);
        await this._loadElementStyles(SIRIUS_CHECKCOMBOBOX.NAME);
        this.dispatchBuiltEvent(); // Dispatch event indicating component is built

        this._addEventListeners(); // Add necessary event listeners for interaction
    }

    // Add event listeners for input and dropdown interaction
    _addEventListeners() {
        // Toggle dropdown visibility and arrow rotation when input is clicked
        this.inputElement.addEventListener("click", () => {
            const isHidden = this.dropdownElement.style.display === 'none' || !this.dropdownElement.style.display;
            this.dropdownElement.style.display = isHidden ? 'block' : 'none';
            this.arrowIcon.iconRotation = isHidden ? 'up' : 'down';
        });

        // Event listener for selecting individual options or "Select All" in the dropdown
        this.dropdownElement.addEventListener("click", (event) => {
            const optionElement = event.target.closest(`.${SIRIUS_CHECKCOMBOBOX.CLASSES.OPTION}`);
            const selectAllElement = event.target.closest(`.${SIRIUS_CHECKCOMBOBOX.CLASSES.SELECT_ALL}`);
            
            if (selectAllElement) {
                this._toggleSelectAll(); // Toggle all options
            } else if (optionElement) {
                this._toggleOptionSelection(optionElement); // Toggle individual option
            }
            this._updateSelectAllStatus(); // Update "Select All" checkbox based on selections
        });
    }

    // Toggle selection state for all options
    _toggleSelectAll() {
        const isChecked = !this.selectAllCheckbox.shadowRoot.querySelector('input').checked;
        this._setAllOptionsChecked(isChecked);
    }

    // Check or uncheck all options based on the parameter and update input display text
    _setAllOptionsChecked(checked) {
        const optionCheckboxes = this.dropdownElement.querySelectorAll(`.${SIRIUS_CHECKCOMBOBOX.CLASSES.CHECKBOX}`);
        optionCheckboxes.forEach(checkbox => checkbox.shadowRoot.querySelector('input').checked = checked);
        this._updateInputText(); // Update input text to show selected options
    }

    // Toggle the selection of an individual option and update input display text
    _toggleOptionSelection(optionElement) {
        const checkbox = optionElement.querySelector(`.${SIRIUS_CHECKCOMBOBOX.CLASSES.CHECKBOX}`).shadowRoot.querySelector('input');
        checkbox.checked = !checkbox.checked;
        this._updateInputText(); // Update input text to reflect selected options
    }

    // Update the input text to list all selected options
    _updateInputText() {
        const selectedOptions = Array.from(this.dropdownElement.querySelectorAll(`.${SIRIUS_CHECKCOMBOBOX.CLASSES.OPTION}`))
            .filter(option => option.querySelector(`.${SIRIUS_CHECKCOMBOBOX.CLASSES.CHECKBOX}`).shadowRoot.querySelector('input').checked)
            .map(option => option.dataset.value);

        this.inputElement.value = selectedOptions.join(', '); // Display selected options in input
    }

    // Update the "Select All" checkbox based on the selection status of individual options
    _updateSelectAllStatus() {
        const allChecked = Array.from(this.dropdownElement.querySelectorAll(`.${SIRIUS_CHECKCOMBOBOX.CLASSES.OPTION} .${SIRIUS_CHECKCOMBOBOX.CLASSES.CHECKBOX}`))
            .every(checkbox => checkbox.shadowRoot.querySelector('input').checked);
        this.selectAllCheckbox.shadowRoot.querySelector('input').checked = allChecked;
    }
}

// Define custom element if not already defined
if (!customElements.get(SIRIUS_CHECKCOMBOBOX.TAG)) {
    customElements.define(SIRIUS_CHECKCOMBOBOX.TAG, SiriusCheckCombobox);
}
