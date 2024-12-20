import {SIRIUS_ELEMENT_ATTRIBUTES, SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES, SiriusElement} from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Sirius label constants */
export const SIRIUS_LABEL = deepFreeze({
    NAME: "SiriusLabel",
    TAG: "sirius-label",
    CSS_VARIABLES: {
        CAPTION_TEXT_ALIGN: "--sirius-label--text-align",
        CAPTION_BACKGROUND_COLOR: "--sirius-label--background-color",
        CAPTION_COLOR: "--sirius-label--color",
        CAPTION_FONT_FAMILY: "--sirius-label--font-family",
        CAPTION_FONT_SIZE: "--sirius-label--font-size",
        CAPTION_PADDING: "--sirius-label--padding"
    },
    CLASSES: {
        LABEL_CONTAINER: 'label-container',
        CAPTION_CONTAINER: 'caption-container',
    }
});

/** Sirius label attributes */
export const SIRIUS_LABEL_ATTRIBUTES = deepFreeze({
    CAPTION: "caption",
    CAPTION_TEXT_ALIGN: "caption-text-align",
    CAPTION_BACKGROUND_COLOR: "caption-background-color",
    CAPTION_COLOR: "caption-color",
    CAPTION_FONT_FAMILY: "caption-font-family",
    CAPTION_FONT_SIZE: "caption-font-size",
    CAPTION_PADDING: "caption-padding"
})

/** Sirius label attributes default values */
export const SIRIUS_LABEL_ATTRIBUTES_DEFAULT = deepFreeze({
    [SIRIUS_LABEL_ATTRIBUTES.CAPTION]: "Please enter a caption",
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

        // Build the SiriusLabel
        this.#build().then();
    }

    /** Define observed attributes
     * @returns {string[]} - Observed attributes
     * */
    static get observedAttributes() {
        return [...SiriusElement.observedAttributes, ...Object.values(SIRIUS_LABEL_ATTRIBUTES)];
    }

    /** Get the template for the Sirius label
     * @returns {string} - Template
     * */
    #getTemplate() {
        return `<div class="${SIRIUS_LABEL.CLASSES.LABEL_CONTAINER}">
                    <div class ="${SIRIUS_LABEL.CLASSES.CAPTION_CONTAINER}">
                        ${this.caption}
                    </div>
                </div>`;
    }

    /** Build the SiriusLabel */
    async #build() {
        // Load Sirius Label attributes
        this._loadAttributes({
            instanceProperties: this._properties,
            attributes: SIRIUS_LABEL_ATTRIBUTES,
            attributesDefault: SIRIUS_LABEL_ATTRIBUTES_DEFAULT
        });

        // Create the CSS stylesheet and add it to the shadow DOM
        await this._loadAndAdoptStyles()

        // Get HTML inner content
        const innerHTML = this.#getTemplate();

        // Create the HTML template
        await this._createTemplate(innerHTML);

        // Add label to the shadow DOM
        this.#labelContainerElement = this._containerElement = this._templateContent.firstChild;
        this.#captionContainerElement = this.labelContainerElement.firstElementChild;
        this.shadowRoot.appendChild(this.containerElement);

        // Dispatch the built event
        this.dispatchBuiltEvent();
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

    /** Get the caption text align
     * @returns {string} - Text alignment
     */
    get captionTextAlign() {
        return this.getAttribute(SIRIUS_LABEL_ATTRIBUTES.CAPTION_TEXT_ALIGN);
    }

    /** Set the caption text align
     * @param {string} textAlignment - Text alignment
     */
    set captionTextAlign(textAlignment) {
        this.setAttribute(SIRIUS_LABEL_ATTRIBUTES.CAPTION_TEXT_ALIGN, textAlignment);
    }

    /** Get the caption background color
     * @returns {string} - Background color
     */
    get captionBackgroundColor() {
        return this.getAttribute(SIRIUS_LABEL_ATTRIBUTES.CAPTION_BACKGROUND_COLOR);
    }

    /** Set the caption background color
     * @param {string} bgColor - Background color
     */
    set captionBackgroundColor(bgColor) {
        this.setAttribute(SIRIUS_LABEL_ATTRIBUTES.CAPTION_BACKGROUND_COLOR, bgColor);
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

    /** Get the caption font family
     * @returns {string} - Font family
     */
    get captionFontFamily() {
        return this.getAttribute(SIRIUS_LABEL_ATTRIBUTES.CAPTION_FONT_FAMILY);
    }

    /** Set the caption font family
     * @param {string} fontFamily - Font family
     */
    set captionFontFamily(fontFamily) {
        this.setAttribute(SIRIUS_LABEL_ATTRIBUTES.CAPTION_FONT_FAMILY, fontFamily);
    }

    /** Get the caption font family
     * @returns {string} - Font family
     */
    get captionFontSize() {
        return this.getAttribute(SIRIUS_LABEL_ATTRIBUTES.CAPTION_FONT_SIZE);
    }

    /** Set the caption font size
     * @param {string} fontSize - Font size
     */
    set captionFontSize(fontSize) {
        this.setAttribute(SIRIUS_LABEL_ATTRIBUTES.CAPTION_FONT_SIZE, fontSize);
    }

    /** Get the caption padding
     * @returns {string} - Padding
     */
    get captionPadding() {
        return this.getAttribute(SIRIUS_LABEL_ATTRIBUTES.CAPTION_PADDING);
    }

    /** Set the caption padding
     * @param {string} padding - Padding
     */
    set captionPadding(padding) {
        this.setAttribute(SIRIUS_LABEL_ATTRIBUTES.CAPTION_PADDING, padding);
    }

    /** Private method to set the caption
     * @param {string} caption - Caption
     */
    #setCaption(caption) {
        if (caption)
            this.onBuilt = () => this.captionContainerElement.innerHTML = caption;
    }

    /** Private method to set the caption text align
     * @param {string} textAlignment - Text alignment
     */
    #setCaptionTextAlign(textAlignment) {
        if (textAlignment)
            this._setCSSVariable(SIRIUS_LABEL.CSS_VARIABLES.CAPTION_TEXT_ALIGN, textAlignment)
    }

    /** Private method to set the caption background color
     * @param {string} bgColor - Background color
     */
    #setCaptionBackgroundColor(bgColor) {
        if (bgColor)
            this._setCSSVariable(SIRIUS_LABEL.CSS_VARIABLES.CAPTION_BACKGROUND_COLOR, bgColor)
    }

    /** Private method to set the caption color
     * @param {string} color - Color
     */
    #setCaptionColor(color) {
        if (color)
            this._setCSSVariable(SIRIUS_LABEL.CSS_VARIABLES.CAPTION_COLOR, color)
    }

    /** Private method to set the caption font family
     * @param {string} fontFamily - Font family
     */
    #setCaptionFontFamily(fontFamily) {
        if (fontFamily)
            this._setCSSVariable(SIRIUS_LABEL.CSS_VARIABLES.CAPTION_FONT_FAMILY, fontFamily)
    }

    /** Private method to set the caption font size
     * @param {string} fontSize - Font size
     */
    #setCaptionFontSize(fontSize) {
        if (fontSize)
            this._setCSSVariable(SIRIUS_LABEL.CSS_VARIABLES.CAPTION_FONT_SIZE, fontSize)
    }

    /** Private method to set the caption padding
     * @param {string} padding - Padding
     */
    #setCaptionPadding(padding) {
        if (padding)
            this._setCSSVariable(SIRIUS_LABEL.CSS_VARIABLES.CAPTION_PADDING, padding)
    }

    /** Private method to set the caption container style
     * @param {string} style - Style attribute value
     */
    #setStyle(style) {
        if (style)
            this._setStyle = () => this._setStyleAttributes(style, this.captionContainerElement);
    }

    /** Set the events property to the caption container element
     * @param {object} events - Events property
     */
    set events(events) {
        if (events)
            this.onBuilt = () => this._setEvents(events, this.captionContainerElement);
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

            case SIRIUS_ELEMENT_ATTRIBUTES.STYLE:
                this.#setStyle(newValue);
                break;

            case SIRIUS_LABEL_ATTRIBUTES.CAPTION:
                this.#setCaption(newValue);
                break;

            case SIRIUS_LABEL_ATTRIBUTES.CAPTION_TEXT_ALIGN:
                this.#setCaptionTextAlign(newValue);
                break;

            case SIRIUS_LABEL_ATTRIBUTES.CAPTION_BACKGROUND_COLOR:
                this.#setCaptionBackgroundColor(newValue);
                break;

            case SIRIUS_LABEL_ATTRIBUTES.CAPTION_COLOR:
                this.#setCaptionColor(newValue);
                break;

            case SIRIUS_LABEL_ATTRIBUTES.CAPTION_FONT_FAMILY:
                this.#setCaptionFontFamily(newValue);
                break;

            case SIRIUS_LABEL_ATTRIBUTES.CAPTION_FONT_SIZE:
                this.#setCaptionFontSize(newValue);
                break;

            case SIRIUS_LABEL_ATTRIBUTES.CAPTION_PADDING:
                this.#setCaptionPadding(newValue);
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
}

// Register custom element
customElements.define(SIRIUS_LABEL.TAG, SiriusLabel);