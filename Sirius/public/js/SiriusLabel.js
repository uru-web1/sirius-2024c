import {SIRIUS_ELEMENT_ATTRIBUTES, SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES, SiriusElement} from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Sirius label constants */
export const SIRIUS_LABEL = deepFreeze({
    NAME: "SiriusLabel",
    TAG: "sirius-label",
    CLASSES: {
        LABEL_CONTAINER: 'label-container',
        CAPTION_CONTAINER: 'caption-container',
    }
});

/** Sirius label attributes */
export const SIRIUS_LABEL_ATTRIBUTES = deepFreeze({
    CAPTION: "caption",
    CAPTION_POSITION: "caption-position",
    CAPTION_COLOR: "caption-color",
    CAPTION_FONT: "caption-font"
})

/** Sirius label attributes default values */
export const SIRIUS_LABEL_ATTRIBUTES_DEFAULT = deepFreeze({
    [SIRIUS_LABEL_ATTRIBUTES.CAPTION]: "Please enter a caption",
    [SIRIUS_LABEL_ATTRIBUTES.CAPTION_POSITION]: "center",
    [SIRIUS_LABEL_ATTRIBUTES.CAPTION_COLOR]: "black",
    [SIRIUS_LABEL_ATTRIBUTES.CAPTION_FONT]: "Arial"
})

/** Sirius class that represents a label component */
export class SiriusLabel extends SiriusElement {
    #labelContainerElement = null
    #captionContainerElement = null

    /**
     * Create a Sirius label element
     * @param {object} properties - Element properties
     */
    constructor(properties) {
        super(properties, SIRIUS_LABEL.NAME);
    }

    /** Define observed attributes
     * @returns {string[]} - Observed attributes
     * */
    static get observedAttributes() {
        return [...SiriusElement.observedAttributes, ...Object.values(SIRIUS_LABEL_ATTRIBUTES)];
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

    /** Get the caption position
     * @returns {string} - Position
     */
    get captionPosition() {
        return this.getAttribute(SIRIUS_LABEL_ATTRIBUTES.CAPTION_POSITION);
    }

    /** Set the caption position
     * @param {string} position - Position
     */
    set captionPosition(position) {
        this.setAttribute(SIRIUS_LABEL_ATTRIBUTES.CAPTION_POSITION, position);
    }

    /** Get the caption color
     * @returns {string} - Color
     */
    get captionColor() {
        return this.getAttribute(SIRIUS_LABEL_ATTRIBUTES.CAPTION_COLOR);
    }

    /** Set the caption color
     * @param {string} color - Color
     */
    set captionColor(color) {
        this.setAttribute(SIRIUS_LABEL_ATTRIBUTES.CAPTION_COLOR, color);
    }

    /** Get the caption font
     * @returns {string} - Font
     */
    get captionFont() {
        return this.getAttribute(SIRIUS_LABEL_ATTRIBUTES.CAPTION_FONT);
    }

    /** Set the caption font
     * @param {string} font - Font
     */
    set captionFont(font) {
        this.setAttribute(SIRIUS_LABEL_ATTRIBUTES.CAPTION_FONT, font);
    }

    /** Get the label container element
     * @returns {HTMLElement} - Label container element
     */
    get labelContainerElement() {
        return this.#labelContainerElement
    }

    /** Get the caption container element
     * @returns {HTMLElement} - Caption container element
     */
    get captionContainerElement() {
        return this.#captionContainerElement
    }

    /** Set on built label container element callback
     * @param {function(HTMLElement): void} callback - Callback
     */
    set _onBuiltLabelContainerElement(callback) {
        this.onBuilt = () => {
            if (this._checkElement(this.labelContainerElement))
                callback(this.labelContainerElement);
        }
    }

    /** Set on built caption container element callback
     * @param {function(HTMLElement): void} callback - Callback
     */
    set _onBuiltCaptionContainerElement(callback) {
        this.onBuilt = () => {
            if (this._checkElement(this.captionContainerElement))
                callback(this.captionContainerElement);
        }
    }

    /** Private method to set the caption
     * @param {string} caption - Caption
     */
    #setCaption(caption) {
        this._onBuiltCaptionContainerElement = element =>
            element.innerHTML = caption;
    }

    /** Private method to set the caption position
     * @param {string} position - Position
     */
    #setCaptionPosition(position) {
        this._onBuiltCaptionContainerElement = element =>
            element.style.textAlign = position;
    }

    /** Private method to set the caption color
     * @param {string} color - Color
     */
    #setCaptionColor(color) {
        this._onBuiltCaptionContainerElement = element =>
            element.style.color = color;
    }

    /** Private method to set the caption font
     * @param {string} font - Font
     */
    #setCaptionFont(font) {
        this._onBuiltCaptionContainerElement = element =>
            element.style.fontFamily = font;
    }

    /** Private method to set style attribute
     * @param {string} style - Style attribute value
     */
    #setStyle(style) {
        if (!style)
            return

        // Add the style attribute to the element when built
        this._setStyle(() => {
            this._onBuiltCaptionContainerElement = (element) => this._setStyleAttributes(style, element);
        })
    }

    /** Set the events property
     * @param {object} events - Events property
     */
    set events(events) {
        if (!events)
            return

        // Add the events property to the element when built
        this._onBuiltCaptionContainerElement = (element) => this._setEvents(events, element);
    }

    /** Get the template for the Sirius label
     * @returns {string} - Template
     * */
    #getTemplate() {
        return `<div class="${SIRIUS_LABEL.CLASSES.LABEL_CONTAINER}">
                    <span class ="${SIRIUS_LABEL.CLASSES.CAPTION_CONTAINER}">
                        ${this.caption}
                    </span>
                </div>`;
    }

    /** Attribute change callback
     * @param {string} name - Attribute name
     * @param {string} oldValue - Old value
     * @param {string} newValue - New value
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // Call the pre-attribute changed callback
        const {formattedValue, shouldContinue} = this._preAttributeChangedCallback(name, oldValue, newValue);
        if (!shouldContinue) return;


        switch (name) {
            case SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID:
                this._setId(formattedValue);
                break;

            case SIRIUS_ELEMENT_ATTRIBUTES.STYLE:
                this.#setStyle(formattedValue);
                break;

            case SIRIUS_LABEL_ATTRIBUTES.CAPTION:
                this.#setCaption(formattedValue);
                break;

            case SIRIUS_LABEL_ATTRIBUTES.CAPTION_POSITION:
                this.#setCaptionPosition(formattedValue);
                break;

            case SIRIUS_LABEL_ATTRIBUTES.CAPTION_COLOR:
                this.#setCaptionColor(formattedValue);
                break;

            case SIRIUS_LABEL_ATTRIBUTES.CAPTION_FONT:
                this.#setCaptionFont(formattedValue);
                break;

            default:
                this.logger.error(`Unregistered attribute: ${name}`);
                break;
        }
    }

    /** Lifecycle method called when the component is connected to the DOM
     */
    async connectedCallback() {
        // Call the parent connected callback
        await super.connectedCallback()

        // Load Sirius Label attributes
        this._loadAttributes({
            instanceProperties: this._properties,
            attributes: SIRIUS_LABEL_ATTRIBUTES,
            defaultValues: SIRIUS_LABEL_ATTRIBUTES_DEFAULT
        });

        // Create the CSS stylesheet and add it to the shadow DOM
        await this._loadAndAdoptStyles()

        // Get HTML inner content
        const innerHTML = this.#getTemplate();

        // Create the HTML template
        await this._createTemplate(innerHTML);

        // Add label to the shadow DOM
        this._containerElement = this._templateContent.firstChild;
        this.#labelContainerElement = this._containerElement
        this.#captionContainerElement = this._containerElement.firstElementChild;
        this.shadowRoot.appendChild(this.containerElement);

        // Dispatch the built event
        this.dispatchBuiltEvent();
    }
}

// Register custom element
customElements.define(SIRIUS_LABEL.TAG, SiriusLabel);