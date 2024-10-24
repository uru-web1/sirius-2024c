import {SIRIUS_TYPES, SiriusElement, SIRIUS_ELEMENT} from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Sirius label constants */
export const SIRIUS_LABEL = deepFreeze({
    NAME: "SiriusLabel",
    TAG: "sirius-label",
    ATTRIBUTES: {
        CAPTION: {NAME: "caption", DEFAULT: "", TYPE: SIRIUS_TYPES.STRING},
        CAPTION_STYLE: { NAME: "caption-style", DEFAULT: null, TYPE: [SIRIUS_TYPES.OBJECT, SIRIUS_TYPES.STRING] },
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
    #loadAttributes() {
        
        // Check if the element has attributes
        if (!this._attributes)
            this.logger.log("No attributes");

        Object.keys(this._attributes).forEach(attributeName => {

            // Get the attribute value
            const attributeValue = this._attributes[attributeName]


            // Check if the attribute value is null
            if (!attributeValue) return;
            
            switch (attributeName) {
                
                case SIRIUS_ELEMENT.ATTRIBUTES.STYLE.NAME:

                    if (typeof attributeValue === SIRIUS_TYPES.STRING) {
                        this.elementContainer.style.cssText = attributeValue;
                        return;
                    }

                    for (let styleName in attributeValue) {
                        this.elementContainer.style[styleName] = attributeValue[styleName];
                    }
                    break;
                    
                case SIRIUS_LABEL.ATTRIBUTES.CAPTION_STYLE.NAME:

                    if (typeof attributeValue === SIRIUS_TYPES.STRING) {
                        this.captionElement.style.cssText = attributeValue;
                        return;
                    }

                    for (let styleName in attributeValue) {
                        this.captionElement.style[styleName] = attributeValue[styleName];
                    }
                break;

                case SIRIUS_ELEMENT.ATTRIBUTES.EVENTS.NAME:
                    // TO BE IMPLEMENTED
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
        this.elementContainer = this._templateContent.firstChild;
        this.captionElement = this.elementContainer.firstElementChild;
        this.shadowRoot.appendChild(this.elementContainer);

        // Load attributes
        this.#loadAttributes();
    }
}

// Register custom element
customElements.define(SIRIUS_LABEL.TAG, SiriusLabel);