import {SIRIUS_ELEMENT, SIRIUS_TYPES, SiriusElement} from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";
import {SIRIUS_ICON} from "./SiriusIcon.js";

/** Sirius checkbox constants */
export const SIRIUS_CHECKBOX = deepFreeze({
    NAME: "SiriusCheckbox",
    TAG: "sirius-checkbox",
    CHECKMARK_ATTRIBUTES: {
        WIDTH: {NAME: "checkmark-width", DEFAULT: "24px", TYPE: SIRIUS_TYPES.STRING},
        HEIGHT: {NAME: "checkmark-height", DEFAULT: "24px", TYPE: SIRIUS_TYPES.STRING},
        FILL: {NAME: "checkmark-fill", DEFAULT: "black", TYPE: SIRIUS_TYPES.STRING},
    },
    CHECKBOX_ATTRIBUTES: {
        BACKGROUND_COLOR: {NAME: "background-color", DEFAULT: "white", TYPE: SIRIUS_TYPES.STRING},
        BORDER_COLOR: {NAME: "border-color", DEFAULT: "black", TYPE: SIRIUS_TYPES.STRING},
        BORDER_PADDING: {NAME: "border-padding", DEFAULT: "2px", TYPE: SIRIUS_TYPES.STRING},
        BORDER_RADIUS: {NAME: "border-radius", DEFAULT: "2px", TYPE: SIRIUS_TYPES.STRING},
        BORDER_WIDTH: {NAME: "border-width", DEFAULT: "1px", TYPE: SIRIUS_TYPES.STRING},
    },
    LABEL_ATTRIBUTES: {
        SHOW: {NAME: "show", DEFAULT: false, TYPE: SIRIUS_TYPES.BOOLEAN},
        CAPTION: {NAME: "caption", DEFAULT: "Please enter a caption", TYPE: SIRIUS_TYPES.STRING},
    },
    ATTRIBUTES: {
        CHECKED: {NAME: "checked", DEFAULT: false, TYPE: SIRIUS_TYPES.BOOLEAN},
        DISABLED: {NAME: "disabled", DEFAULT: false, TYPE: SIRIUS_TYPES.BOOLEAN},
    },
    CLASSES: {
        CONTENT: 'checkbox-content',
        CONTAINER: 'checkbox-container',
        CHECKED: 'checked',
        DISABLED: 'disabled',
        ICON: 'icon-container',
    }
})

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

    /** Get dimensions
     * @returns {object} - Icon dimensions
     */
    _getDimensions() {
        // Get the width and height keys
        const widthKey = SIRIUS_ICON.CHECKBOX_ATTRIBUTES.WIDTH.NAME;
        const heightKey = SIRIUS_ICON.CHECKBOX_ATTRIBUTES.HEIGHT.NAME;

        // Get attributes values
        const width = this._attributes[widthKey];
        const height = this._attributes[heightKey];

        return {width, height};
    }

    /** Get the template for the Sirius checkbox
     * @returns {string} - Template
     */
    #getTemplate() {
        //Get the attributes of the element
        const showLabel = this._attributes[SIRIUS_CHECKBOX.LABEL_ATTRIBUTES.SHOW.NAME];
        const caption = this._attributes[SIRIUS_CHECKBOX.ATTRIBUTES.CAPTION.NAME];
        const checkmarkColor = this._attributes[SIRIUS_CHECKBOX.CHECKBOX_ATTRIBUTES.FILL.NAME];

        // Get the width and height of the icon
        const {width, height} = this._getDimensions();

        return `<div class="${SIRIUS_CHECKBOX.CLASSES.CONTAINER}">
                    <div class="${SIRIUS_CHECKBOX.CLASSES.CONTENT}">
                        <div class="${SIRIUS_CHECKBOX.CLASSES.ICON}">
                            <sirius-icon fill="${checkmarkColor}" height=${height} width=${width} icon="check" id="${this.elementId}__icon" onclick="toggleHidden()"></sirius-icon>
                        </div>
                        ${showLabel ? `<sirius-label caption="${caption}" id="${this.elementId}__label""></sirius-label>` : ''}
                    </div>
                </div>`;
    }

    /** Lifecycle method called when the component is connected to the DOM
     */
    #loadAttributes() {
        this.onBuilt = () => {
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
                        this._loadStyleAttribute(attributeValue, this.containerElement);
                        break;

                    case SIRIUS_ELEMENT.ATTRIBUTES.EVENTS.NAME:
                        this._loadEventsAttribute(attributeValue, this.containerElement);
                        break;

                    default:
                        // this.logger.log(`Unregistered attribute: ${attributeName}`);
                        break;
                }
            })
        }
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