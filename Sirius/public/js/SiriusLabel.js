import {SIRIUS_ELEMENT, SIRIUS_TYPES, SiriusElement} from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Sirius label constants */
export const SIRIUS_LABEL = deepFreeze({
    NAME: "SiriusLabel",
    TAG: "sirius-label",
    ATTRIBUTES: {
        CAPTION: {NAME: "caption", DEFAULT: "", TYPE: SIRIUS_TYPES.STRING},
    },
    CAPTION_ATTRIBUTES: {
        POSITION: {NAME: "caption-position", DEFAULT: "center", TYPE: SIRIUS_TYPES.STRING},
        COLOR: {NAME: "caption-color", DEFAULT: "black", TYPE: SIRIUS_TYPES.STRING},
        FONT: {NAME: "caption-font", DEFAULT: "Arial", TYPE: SIRIUS_TYPES.STRING}
    },
    CLASSES: {
        LABEL: 'label-container',
        CAPTION: 'caption',
    }
});

/** Sirius class that represents a label component */
export class SiriusLabel extends SiriusElement {
    /**
     * Create a Sirius label element
     * @param {object} props - Element properties
     */
    constructor(props) {
        super(props, SIRIUS_LABEL.NAME);

        // Load Sirius Label HTML attributes
        this._loadAttributes({
            htmlAttributes: SIRIUS_LABEL.ATTRIBUTES,
            properties: props
        });

        // Load Sirius Label caption attributes
        this._loadAttributes({
            htmlAttributes: SIRIUS_LABEL.CAPTION_ATTRIBUTES,
            properties: props
        });
    }

    /** Get the template for the Sirius label
     * @returns {string} - Template
     * */
    #getTemplate() {
        return `<div class="${SIRIUS_LABEL.CLASSES.LABEL}">
                    <span class ="${SIRIUS_LABEL.CLASSES.CAPTION}">${this.#getCaption()}</span>
                </div>`;
    }

    /** Get the caption of the label
     * @returns {*} - Label caption
     */
    #getCaption() {
        return this._attributes[SIRIUS_LABEL.ATTRIBUTES.CAPTION.NAME];
    }

    /** Load the attributes of the Sirius label */
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
                    // Check if the attribute value is a string
                    if (typeof attributeValue === SIRIUS_TYPES.STRING) {
                        this.containerElement.style.cssText = attributeValue;

                        // Remove the style attribute of the component
                        this.removeAttribute(SIRIUS_ELEMENT.ATTRIBUTES.STYLE.NAME);

                        return;
                    }

                    // Check if the attribute value is an object
                    for (let styleName in attributeValue) {
                        this.containerElement.style[styleName] = attributeValue[styleName];
                    }
                    break;

                case SIRIUS_ELEMENT.ATTRIBUTES.EVENTS.NAME:
                    // Add event listeners to the element
                    for (let event in attributeValue) {
                        this.captionElement.addEventListener(event, attributeValue[event])
                    }
                    break;

                // case attributeName.startsWith("on"):
                //     console.log("Event attribute: ", attributeName);

                //     break;

                case SIRIUS_LABEL.CAPTION_ATTRIBUTES.POSITION.NAME:
                    // Set the text alignment of the caption
                    this.containerElement.style.textAlign = attributeValue;

                    break;

                case SIRIUS_LABEL.CAPTION_ATTRIBUTES.COLOR.NAME:
                    // Set the color of the caption
                    this.captionElement.style.color = attributeValue;
                    break;

                case SIRIUS_LABEL.CAPTION_ATTRIBUTES.FONT.NAME:
                    // Set the font family
                    this.captionElement.style.fontFamily = attributeValue.toLowerCase();
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
        // Create the CSS stylesheet and add it to the shadow DOM
        await this._loadElementStyles()

        // Get HTML inner content
        const innerHTML = this.#getTemplate();

        // Create the HTML template
        await this._createTemplate(innerHTML);

        // Add label to the shadow DOM
        this.containerElement = this._templateContent.firstChild;
        this.captionElement = this.containerElement.firstElementChild;

        this.shadowRoot.appendChild(this.containerElement);

        // Load attributes
        this.#loadAttributes();
    }
}

// Register custom element
customElements.define(SIRIUS_LABEL.TAG, SiriusLabel);