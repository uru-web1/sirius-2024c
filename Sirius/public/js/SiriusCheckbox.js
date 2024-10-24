import {SIRIUS_TYPES, SiriusElement} from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Sirius checkbox constants */
export const SIRIUS_CHECKBOX = deepFreeze({
    NAME: "SiriusCheckbox",
    TAG: "sirius-checkbox",
    ATTRIBUTES: {
        LABEL: {NAME: "label", DEFAULT: "", TYPE: SIRIUS_TYPES.STRING},
        CHECKED: {NAME: "checked", DEFAULT: false, TYPE: SIRIUS_TYPES.BOOLEAN},
        DISABLED: {NAME: "disabled", DEFAULT: false, TYPE: SIRIUS_TYPES.BOOLEAN},
    },
    CLASSES: {
        CONTAINER: 'checkbox-container',
        LABEL: 'checkbox-label',
        INPUT: 'checkbox-input',
    }
});

/** Sirius class that represents a checkbox component */
export class SiriusCheckbox extends SiriusElement {
    /**
     * Create a Sirius checkbox element
     * @param {Object} props - The properties of the Sirius checkbox
     */
    constructor(props) {
        super(props, SIRIUS_CHECKBOX.NAME);

        // Load Sirius checkbox HTML attributes
        this._loadAttributes({
            htmlAttributes: SIRIUS_CHECKBOX.ATTRIBUTES,
            properties: props
        });

        // Attach shadow DOM
        this.attachShadow({mode: "open"});
    }

    /** Get the template for the Sirius checkbox
     * @returns {string} - Template
     */
    #getTemplate() {
        return `<div class="${SIRIUS_CHECKBOX.CLASSES.CONTAINER}">
                    <input type="checkbox" class="${SIRIUS_CHECKBOX.CLASSES.INPUT}" ${this._attributes[SIRIUS_CHECKBOX.ATTRIBUTES.CHECKED.NAME] ? 'checked' : ''} ${this._attributes[SIRIUS_CHECKBOX.ATTRIBUTES.DISABLED.NAME] ? 'disabled' : ''}>
                    <label class="${SIRIUS_CHECKBOX.CLASSES.LABEL}">${this._attributes[SIRIUS_CHECKBOX.ATTRIBUTES.LABEL.NAME]}</label>
                </div>`;
    }

    /** Lifecycle method called when the component is connected to the DOM
     */
    async connectedCallback() {
        // Create the CSS stylesheet and add it to the shadow DOM
        await this._getStyles(SIRIUS_CHECKBOX.NAME);
        this.shadowRoot.adoptedStyleSheets = [this._sheet];

        // Get HTML inner content
        const innerHTML = this.#getTemplate();
        if (!innerHTML) {
            this.logger.error('Failed to create template');
            return;
        }

        // Create the HTML template
        await this._createTemplate(innerHTML);

        // Add checkbox to the shadow DOM
        this.checkboxElement = this._templateContent.firstChild;
        this.shadowRoot.appendChild(this.checkboxElement);
    }
}

// Register custom element
customElements.define(SIRIUS_CHECKBOX.TAG, SiriusCheckbox);