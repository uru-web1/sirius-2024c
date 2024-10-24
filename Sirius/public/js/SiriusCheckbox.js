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
        CHECKED: 'checked',
        DISABLED: 'disabled',
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
    }

    /** Get the template for the Sirius checkbox
     * @returns {string} - Template
     */
    #getTemplate() {
        // Checkbox input classes
        const inputClasses = [SIRIUS_CHECKBOX.CLASSES.CONTAINER];

        // Add classes based on the checkbox attributes
        if (this._attributes[SIRIUS_CHECKBOX.ATTRIBUTES.DISABLED.NAME])
            inputClasses.push(SIRIUS_CHECKBOX.CLASSES.DISABLED);

        if (this._attributes[SIRIUS_CHECKBOX.ATTRIBUTES.CHECKED.NAME])
            inputClasses.push(SIRIUS_CHECKBOX.CLASSES.CHECKED);

        return `<div class="${SIRIUS_CHECKBOX.CLASSES.CONTAINER}">
                    <input type="checkbox" class="${inputClasses.join(' ')}">
                    <label class="${SIRIUS_CHECKBOX.CLASSES.LABEL}">
                        ${this._attributes[SIRIUS_CHECKBOX.ATTRIBUTES.LABEL.NAME]}
                    </label>
                </div>`;
    }

    /** Lifecycle method called when the component is connected to the DOM
     */
    async connectedCallback() {
        // Create the CSS style sheets and add them to the shadow DOM
        await this._loadElementStyles();

        // Get HTML inner content
        const innerHTML = this.#getTemplate();

        // Create the HTML template
        await this._createTemplate(innerHTML);

        // Add checkbox to the shadow DOM
        this.containerElement = this._templateContent.firstChild;
        this.shadowRoot.appendChild(this.containerElement);

        // Dispatch the built event
        this.dispatchBuiltEvent();
    }
}

// Register custom element
customElements.define(SIRIUS_CHECKBOX.TAG, SiriusCheckbox);