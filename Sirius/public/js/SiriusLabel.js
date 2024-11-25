import SiriusElement, {
    SIRIUS_ELEMENT,
    SIRIUS_ELEMENT_ATTRIBUTES,
    SIRIUS_ELEMENT_PROPERTIES,
    SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES
} from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

/** SiriusLabel constants */
export const SIRIUS_LABEL = deepFreeze({
    NAME: "SiriusLabel",
    TAG: "sirius-label",
    CLASSES: {
        LABEL_CONTAINER: 'label-container',
        CAPTION_CONTAINER: 'caption-container',
    }
});

/** SiriusLabel attributes */
export const SIRIUS_LABEL_ATTRIBUTES = deepFreeze({
    CAPTION: "caption",
})

/** SiriusLabel attributes default values */
export const SIRIUS_LABEL_ATTRIBUTES_DEFAULT = deepFreeze({
    [SIRIUS_LABEL_ATTRIBUTES.CAPTION]: "Please enter a caption",
})

/** Sirius class that represents a label component */
export default class SiriusLabel extends SiriusElement {
    // Container elements
    #labelContainerElement = null
    #captionContainerElement = null

    /**
     * Create a SiriusLabel element
     * @param {object} properties - Element properties
     */
    constructor(properties) {
        super({...properties, [SIRIUS_ELEMENT_PROPERTIES.NAME]: SIRIUS_LABEL.NAME});

        // Build the SiriusLabel
        this.#build(properties).then();
    }

    /** Define observed attributes
     * @returns {string[]} - Observed attributes
     * */
    static get observedAttributes() {
        return [...SiriusElement.observedAttributes, ...Object.values(SIRIUS_LABEL_ATTRIBUTES)];
    }

    /** Get the template for the SiriusLabel
     * @returns {string} - Template
     * */
    #getTemplate() {
        // Get the label classes
        const labelContainerClasses = [SIRIUS_LABEL.CLASSES.LABEL_CONTAINER];
        const captionContainerClasses = [SIRIUS_ELEMENT.CLASSES.MAIN_ELEMENT, SIRIUS_LABEL.CLASSES.CAPTION_CONTAINER];

        return `<div class="${labelContainerClasses.join(' ')}">
                    <div class ="${captionContainerClasses.join(' ')}">
                        ${this.caption}
                    </div>
                </div>`;
    }

    /** Build the SiriusLabel
     * @param {object} properties - Element properties
     * @returns {Promise<void>} - Promise
     * */
    async #build(properties) {
        // Load Sirius Label attributes
        this._loadAttributes({
            instanceProperties: properties,
            attributes: SIRIUS_LABEL_ATTRIBUTES,
            attributesDefault: SIRIUS_LABEL_ATTRIBUTES_DEFAULT
        });

        // Create the CSS stylesheet and add it to the shadow DOM
        await this._loadAndAdoptStyles()

        // Get HTML inner content
        const innerHTML = this.#getTemplate();

        // Create the label container element
        const container = await this._createContainerElementTemplate(innerHTML);
        this.#labelContainerElement = this._containerElement = container
        this.#captionContainerElement = this.labelContainerElement.firstElementChild;

        // Add the container element to the shadow DOM
        this.shadowRoot.appendChild(this.containerElement);

        // Set properties
        this.events = this._events;

        // Dispatch the built event
        this._dispatchBuiltEvent();
    }

    /** Get the label container element
     * @returns {HTMLElement|null} - Label container element
     */
    get labelContainerElement() {
        return this.#labelContainerElement
    }

    /** Get the caption container element
     * @returns {HTMLElement|null} - Caption container element
     */
    get captionContainerElement() {
        return this.#captionContainerElement
    }

    /** Get the caption
     * @returns {string} - Caption
     */
    get caption() {
        return this.getAttribute(SIRIUS_LABEL_ATTRIBUTES.CAPTION);
    }

    /** Set the caption
     * @param {string} caption - Caption
     */
    set caption(caption) {
        this.setAttribute(SIRIUS_LABEL_ATTRIBUTES.CAPTION, caption);
    }

    /** Private method to set the caption
     * @param {string} caption - Caption
     */
    #setCaption(caption) {
        if (caption)
            this.onBuilt = () => this.captionContainerElement.innerHTML = caption;
    }

    /** Private method to handle attribute changes
     * @param {string} name - Attribute name
     * @param {string} oldValue - Old value
     * @param {string} newValue - New value
     */
    #attributeChangeHandler(name, oldValue, newValue) {
        switch (name) {
            case SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID:
                this._setId(newValue);
                break;

            case SIRIUS_ELEMENT_ATTRIBUTES.TRANSITION_DURATION:
                this._setTransitionDuration(newValue);
                break;

            case SIRIUS_ELEMENT_ATTRIBUTES.STYLES:
                this._setStyles(newValue);
                break;

            case SIRIUS_ELEMENT_ATTRIBUTES.STYLES_ON_HOVER:
                this._setStylesOnHover(newValue);
                break;

            case SIRIUS_ELEMENT_ATTRIBUTES.STYLES_ON_ACTIVE:
                this._setStylesOnActive(newValue);
                break;

            case SIRIUS_LABEL_ATTRIBUTES.CAPTION:
                this.#setCaption(newValue);
                break;

            default:
                this._onInjectedLogger = () => this.logger.error(`Unregistered attribute: ${name}`);
                break;
        }
    }

    /** Attribute change callback
     * @param {string} name - Attribute name
     * @param {string} oldValue - Old value
     * @param {string} newValue - New value
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // Call the attribute change pre-handler
        const {formattedValue, shouldContinue} = this._attributeChangePreHandler(name, oldValue, newValue);
        if (!shouldContinue) return;

        // Call the on attribute change handler
        this.onBuilt = () => this.#attributeChangeHandler(name, oldValue, formattedValue);
    }

    /** Set the events property to the caption container element
     * @param {object} events - Events property
     */
    set events(events) {
        if (events)
            this.onBuilt = () => this._setEvents(events, this.captionContainerElement);
    }
}

// Register custom element
customElements.define(SIRIUS_LABEL.TAG, SiriusLabel);