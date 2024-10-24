import {SIRIUS_TYPES, SiriusElement} from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Sirius label constants */
export const SIRIUS_LABEL = deepFreeze({
    NAME: "SiriusLabel",
    TAG: "sirius-label",
    ATTRIBUTES: {
        CAPTION: {NAME: "caption", DEFAULT: "", TYPE: SIRIUS_TYPES.STRING},
        TYPE: {NAME: "type", DEFAULT: "", TYPE: SIRIUS_TYPES.STRING},
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
        this.shadowRoot.appendChild(this.elementContainer);
    }
}

// Register custom element
customElements.define(SIRIUS_LABEL.TAG, SiriusLabel);