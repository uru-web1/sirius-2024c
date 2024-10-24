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

        // Attach shadow DOM
        this.attachShadow({mode: "open"});
    }

    /** Get the template for the Sirius label
     * @returns {string} - Template
     * */
    #getTemplate() {

        return `<div class="${SIRIUS_LABEL.CLASSES.LABEL}">
                    <span class ="${SIRIUS_LABEL.CLASSES.CAPTION}">${this.#getCaption()}</span>
                </div>`;
    }

    #getCaption() {
        return this._attributes[SIRIUS_LABEL.ATTRIBUTES.CAPTION.NAME];
    }

    /** Lifecycle method called when the component is connected to the DOM
     */
    async connectedCallback() {

        // Create the CSS stylesheet and add it to the shadow DOM
        await this._getStyles(SIRIUS_LABEL.NAME);
        this.shadowRoot.adoptedStyleSheets = [this._sheet];

        // Get HTML inner content
        const innerHTML = this.#getTemplate();
        if (!innerHTML) {
            this.logger.error('Failed to create template');
            return;
        }

        // Create the HTML template
        await this._createTemplate(innerHTML);

        // Add label to the shadow DOM
        this.labelElement = this._templateContent.firstChild;
        this.shadowRoot.appendChild(this.labelElement);
    }

}

// Register custom element
customElements.define(SIRIUS_LABEL.TAG, SiriusLabel);