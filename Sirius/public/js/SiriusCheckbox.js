import {SIRIUS_ELEMENT, SIRIUS_TYPES, SiriusElement} from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Sirius checkbox constants */
export const SIRIUS_CHECKBOX = deepFreeze({
    NAME: "SiriusCheckbox",
    TAG: "sirius-checkbox",
    ATTRIBUTES: {
        LABEL: {NAME: "label", DEFAULT: false, TYPE: [SIRIUS_TYPES.BOOLEAN, SIRIUS_TYPES.STRING]},
        CAPTION: {NAME: "caption", DEFAULT: "Valor", TYPE: SIRIUS_TYPES.STRING},
        CHECKED: {NAME: "checked", DEFAULT: false, TYPE: SIRIUS_TYPES.BOOLEAN},
        DISABLED: {NAME: "disabled", DEFAULT: false, TYPE: SIRIUS_TYPES.BOOLEAN},
        CHECKMARK_COLOR: {NAME: "checkmark-color", DEFAULT: "black", TYPE: SIRIUS_TYPES.STRING},
    },
    CLASSES: {
        CONTENT: 'checkbox-content',
        CONTAINER: 'checkbox-container',
        CHECKED: 'checked',
        DISABLED: 'disabled',
        ICON: 'icon-container',
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

        //Get the attributes of the element

        const idInstance = this._attributes[SIRIUS_ELEMENT.ATTRIBUTES.ID.NAME].split('-')[1];
        const showLabel = this._attributes[SIRIUS_CHECKBOX.ATTRIBUTES.LABEL.NAME];
        const caption = this._attributes[SIRIUS_CHECKBOX.ATTRIBUTES.CAPTION.NAME];
        const checkmarkColor = this._attributes[SIRIUS_CHECKBOX.ATTRIBUTES.CHECKMARK_COLOR.NAME];

        return `<div class="${SIRIUS_CHECKBOX.CLASSES.CONTAINER}">
                    <div class="${SIRIUS_CHECKBOX.CLASSES.CONTENT}">
                        <div class="${SIRIUS_CHECKBOX.CLASSES.ICON}">
                            <sirius-icon fill="${checkmarkColor}" height="24" width="24" icon="check" id="icon-${idInstance}" onclick="toggleHidden()"></sirius-icon>
                        </div>
                        ${showLabel ? `<sirius-label caption="${caption}" id="label-${idInstance}";"></sirius-label>` : ''}
                    </div>
                </div>`;
    }

    /** Lifecycle method called when the component is connected to the DOM
     */
    #loadAttributes() {
        // Check if the element has attributes
        if (!this._attributes)
            this.logger.log("No attributes");

        Object.keys(this._attributes).forEach(attributeName => {
            // Get the attribute value
            const attributeValue = this._attributes[attributeName]

            // Check if the attribute value is null
            if (!attributeValue) return;

            // Check if the attribute value is an object
            switch (attributeName) {

                case SIRIUS_ELEMENT.ATTRIBUTES.STYLE.NAME:
                    if (typeof attributeValue === SIRIUS_TYPES.STRING) {
                        this.containerElement.style.cssText = attributeValue;

                        // Remove the style attribute of the component
                        // this.removeAttribute(SIRIUS_ELEMENT.ATTRIBUTES.STYLE.NAME);

                        return;
                    }

                    for (let styleName in attributeValue)
                        this.containerElement.style[styleName] = attributeValue[styleName];
                    break;

                case SIRIUS_ELEMENT.ATTRIBUTES.EVENTS.NAME:
                    for (let event in attributeValue)
                        this.containerElement.addEventListener(event, attributeValue[event])
                    break;

                default:
                    // this.logger.log(`Unregistered attribute: ${attributeName}`);
                    break;
            }
        })
    }

    /** Lifecycle method called when the component is connected to the DOM
     */
    async connectedCallback() {
        // Load attributes
        this.#loadAttributes();

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