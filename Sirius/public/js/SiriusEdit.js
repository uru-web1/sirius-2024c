import {SIRIUS_ELEMENT_ATTRIBUTES, SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES, SiriusElement,} from "../js/SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Sirius Edit constants */
export const SIRIUS_EDIT = deepFreeze({
    NAME: "SiriusEdit",
    TAG: "sirius-edit",
    CSS_VARIABLES: {
        INPUT_BACKGROUND: '--sirius-edit--input-background',
        INPUT_FONT_SIZE: '--sirius-edit--input-font-size',
        INPUT_FONT_COLOR: '--sirius-edit--input-color-font',

        LABEL_BACKGROUND: '--sirius-edit--labeline-background-color',
        LABEL_FONT_COLOR: '--sirius-edit--labeline-color-font',
        LABEL_BORDER_COLOR: '--sirius-edit--labeline-color-border',
        LABEL_FONT_COLOR_ONFOCUS: '--sirius-edit--labeline-color-font-onfocus',
        LABEL_BORDER_COLOR_ONFOCUS: '--sirius-edit--labeline-color-border-onfocus',

    },
    CLASSES: {
        EDIT_CONTAINER: "edit-container",
        EDIT_AREA: "edit-area",
        EDIT_AREA_INPUT: "text",
        EDIT_LABEL: "labelline",
        EDIT_REQUIRED: "required",
    }
})

/** Sirius Edit attributes */
export const SIRIUS_EDIT_ATTRIBUTES = deepFreeze({
    WIDTH: "width",
    HEIGHT: "height",
    INPUT_COLOR: "input-background",
    INPUT_FONT_SIZE: "input-font-size",
    INPUT_FONT_COLOR: "input-font-color",

    LABEL_BACKGROUND: "label-color",
    LABEL_FONT_COLOR: "label-font-color",
    LABEL_BORDER_COLOR: "label-border-color",
    LABEL_FONT_COLOR_ONFOCUS: "label-font-color-onfocus",
    LABEL_BORDER_COLOR_ONFOCUS: "label-border-color-onfocus",
    LABEL_CAPTION: "label-caption",
})

/** Sirius Edit attributes default values
 * If an attribute is not present in the object, the default value is null
 * */
export const SIRIUS_EDIT_ATTRIBUTES_DEFAULT = deepFreeze({
    [SIRIUS_EDIT_ATTRIBUTES.WIDTH]: "24px",
    [SIRIUS_EDIT_ATTRIBUTES.HEIGHT]: "24px",
    [SIRIUS_EDIT_ATTRIBUTES.LABEL_CAPTION]: "Enter your name",
})

export class SiriusEdit extends SiriusElement {
    // Container elements
    #editContainerElement = null;

    constructor(properties) {
        super(properties, SIRIUS_EDIT.NAME);
        this.#build().then;
        this.lol()
    }

    lol() {
        console.log(0);
    }

    #getTemplate() {
        const labelCaption = this.labelCaption || 'Touch Me'
        return `<div class=${SIRIUS_EDIT.CLASSES.EDIT_CONTAINER}>
                    <div class="${SIRIUS_EDIT.CLASSES.EDIT_AREA}">
                        <input type="${SIRIUS_EDIT.CLASSES.EDIT_AREA_INPUT}" ${SIRIUS_EDIT.CLASSES.EDIT_REQUIRED}>
                        <div class="${SIRIUS_EDIT.CLASSES.EDIT_LABEL}">${labelCaption}</div>
                    </div>
                </div>`;
    }

    /** Get icon width attribute
     * @returns {string} - Icon width attribute
     */
    get Width() {
        return this.getAttribute(SIRIUS_EDIT_ATTRIBUTES.WHIDTH);
    }

    /** Set icon width attribute
     * @param {string} value - Icon width attribute
     */
    set Width(value) {
        this.setAttribute(SIRIUS_EDIT_ATTRIBUTES.WIDTH, value);
    }

    /** Get icon width attribute
     * @returns {string} - Icon width attribute
     */
    get Height() {
        return this.getAttribute(SIRIUS_EDIT_ATTRIBUTES.HEIGHT);
    }

    /** Set icon width attribute
     * @param {string} value - Icon width attribute
     */
    set Height(value) {
        this.setAttribute(SIRIUS_EDIT_ATTRIBUTES.HEIGHT, value);
    }

    /** Get icon width attribute
     * @returns {string} - Icon width attribute
     */
    get InputColor() {
        return this.getAttribute(SIRIUS_EDIT_ATTRIBUTES.INPUT_COLOR);
    }

    /** Set icon width attribute
     * @param {string} value - Icon width attribute
     */
    set InputColor(value) {
        this.setAttribute(SIRIUS_EDIT_ATTRIBUTES.INPUT_COLOR, value);
    }

    /** Get icon width attribute
     * @returns {string} - Icon width attribute
     */
    get FontSize() {
        return this.getAttribute(SIRIUS_EDIT_ATTRIBUTES.INPUT_FONT_SIZE);
    }

    /** Set icon width attribute
     * @param {string} value - Icon width attribute
     */
    set FontSize(value) {
        this.setAttribute(SIRIUS_EDIT_ATTRIBUTES.INPUT_FONT_SIZE, value);
    }

    /** Get icon width attribute
     * @returns {string} - Icon width attribute
     */
    get FontColor() {
        return this.getAttribute(SIRIUS_EDIT_ATTRIBUTES.INPUT_FONT_SIZE);
    }

    /** Set icon width attribute
     * @param {string} value - Icon width attribute
     */
    set FontColor(value) {
        this.setAttribute(SIRIUS_EDIT_ATTRIBUTES.INPUT_FONT_SIZE, value);
    }

    /** Get icon width attribute
     * @returns {string} - Icon width attribute
     */
    get LabelColor() {
        return this.getAttribute(SIRIUS_EDIT_ATTRIBUTES.LABEL_BACKGROUND);
    }

    /** Set icon width attribute
     * @param {string} value - Icon width attribute
     */
    set LabelColor(value) {
        this.setAttribute(SIRIUS_EDIT_ATTRIBUTES.LABEL_BACKGROUND, value);
    }

    /** Get icon width attribute
     * @returns {string} - Icon width attribute
     */
    get LabelFontColor() {
        return this.getAttribute(SIRIUS_EDIT_ATTRIBUTES.LABEL_BACKGROUND);
    }

    /** Set icon width attribute
     * @param {string} value - Icon width attribute
     */
    set LabelFontColor(value) {
        this.setAttribute(SIRIUS_EDIT_ATTRIBUTES.LABEL_BACKGROUND, value);
    }

    /** Get icon width attribute
     * @returns {string} - Icon width attribute
     */
    get LabelBorderColor() {
        return this.getAttribute(SIRIUS_EDIT_ATTRIBUTES.LABEL_BORDER_COLOR);
    }

    /** Set icon width attribute
     * @param {string} value - Icon width attribute
     */
    set LabelBorderColor(value) {
        this.setAttribute(SIRIUS_EDIT_ATTRIBUTES.LABEL_BORDER_COLOR, value);
    }

    /** Get icon width attribute
     * @returns {string} - Icon width attribute
     */
    get LabelBoderColorOnFocus() {
        return this.getAttribute(SIRIUS_EDIT_ATTRIBUTES.LABEL_BORDER_COLOR_ONFOCUS);
    }

    /** Set icon width attribute
     * @param {string} value - Icon width attribute
     */
    set LabelBoderColorOnFocus(value) {
        this.setAttribute(SIRIUS_EDIT_ATTRIBUTES.LABEL_BORDER_COLOR_ONFOCUS, value);
    }

    /** Get icon width attribute
     * @returns {string} - Icon width attribute
     */
    get LabelFontColorOnFocus() {
        return this.getAttribute(SIRIUS_EDIT_ATTRIBUTES.LABEL_FONT_COLOR_ONFOCUS);
    }

    /** Set icon width attribute
     * @param {string} value - Icon width attribute
     */
    set LabelFontColorOnFocus(value) {
        this.setAttribute(SIRIUS_EDIT_ATTRIBUTES.LABEL_FONT_COLOR_ONFOCUS, value);
    }

    /** Get icon container element
     * @returns {HTMLElement|null} - Icon container element
     * */
    get editContainerElement() {
        return this.#editContainerElement;
    }

    /** Define observed attributes
     * @returns {string[]} - Observed attributes
     * */
    static get observedAttributes() {
        return [...SiriusElement.observedAttributes, ...Object.values(SIRIUS_EDIT_ATTRIBUTES)]
    }

    #setInputBackgroundColor(color) {
        if (color)
            this._setCSSVariable(SIRIUS_EDIT.CSS_VARIABLES.INPUT_BACKGROUND, color);
    }

    #setInputFontSize(size) {
        if (size)
            this._setCSSVariable(SIRIUS_EDIT.CSS_VARIABLES.INPUT_FONT_SIZE, size)
    }

    #setInputFontColor(color) {
        if (color)
            this._setCSSVariable(SIRIUS_EDIT.CSS_VARIABLES.INPUT_FONT_COLOR, color)
    }

    #setLabelBackgroundColor(color) {
        if (color)
            this._setCSSVariable(SIRIUS_EDIT.CSS_VARIABLES.LABEL_BACKGROUND, color)
    }

    #setLabelFontColor(color) {
        if (color)
            this._setCSSVariable(SIRIUS_EDIT.CSS_VARIABLES.LABEL_FONT_COLOR, color)
    }

    #setLabelBorderColor(color) {
        if (color)
            this._setCSSVariable(SIRIUS_EDIT.CSS_VARIABLES.LABEL_BORDER_COLOR, color)
    }

    // Private method to update the label font color on focus
    #updateLabelFontColorOnFocus(value) {
        this._setCSSVariable(SIRIUS_EDIT.CSS_VARIABLES.LABEL_FONT_COLOR_ONFOCUS, value);
    }

    // Private method to update the label border color on focus
    #updateLabelBorderColorOnFocus(value) {
        this._setCSSVariable(SIRIUS_EDIT.CSS_VARIABLES.LABEL_BORDER_COLOR_ONFOCUS, value);
    }

    // Private method to update the label caption
    #updateLabelCaption(value) {
        const label = this.shadowRoot.querySelector('.labelline');
        if (label) {
            label.textContent = value;
        }
    }

    async #build() {

        // Load Sirius checkbox HTML attributes
        this._loadAttributes({
            instanceProperties: this._properties,
            attributes: SIRIUS_EDIT_ATTRIBUTES,
            //attributesDefault: SIRIUS_EDIT_ATTRIBUTES_DEFAULT
        });

        // Load the CSS style sheets and add them to the shadow DOM
        await this._loadAndAdoptStyles();

        // Get HTML inner content
        const innerHTML = this.#getTemplate();

        // Create the HTML template
        await this._createTemplate(innerHTML);

        // Add Edit to the shadow DOM
        this.#editContainerElement = this._containerElement = this._templateContent.firstChild;
        this.shadowRoot.appendChild(this.containerElement);

        // Dispatch the built event
        this.dispatchBuiltEvent();
        console.log(innerHTML)
    }

    /** Private method to set the checkbox container style
     * @param {string} style - Style attribute value
     */
    #setStyle(style) {
        if (!style)
            return

        // Add the style attribute to the element when built
        this._setStyle = () => this._setStyleAttributes(style, this.checkboxContainerElement);
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

            case SIRIUS_EDIT_ATTRIBUTES.INPUT_COLOR:
                this.#setInputBackgroundColor(newValue)
                break;

            case SIRIUS_EDIT_ATTRIBUTES.INPUT_FONT_SIZE:
                this.#setInputFontSize(newValue)
                break;

            case SIRIUS_EDIT_ATTRIBUTES.INPUT_FONT_COLOR:
                this.#setInputFontColor(newValue)
                break;

            case SIRIUS_EDIT_ATTRIBUTES.LABEL_BACKGROUND:
                this.#setLabelBackgroundColor(newValue)
                break;

            case SIRIUS_EDIT_ATTRIBUTES.LABEL_FONT_COLOR:
                this.#setLabelFontColor(newValue)
                break;

            case SIRIUS_EDIT_ATTRIBUTES.LABEL_BORDER_COLOR:
                this.#setLabelBorderColor(newValue)
                break;

            case SIRIUS_EDIT_ATTRIBUTES.LABEL_FONT_COLOR_ONFOCUS:
                this.#updateLabelFontColorOnFocus(newValue);
                break;
            case SIRIUS_EDIT_ATTRIBUTES.LABEL_BORDER_COLOR_ONFOCUS:
                this.#updateLabelBorderColorOnFocus(newValue);
                break;
            case SIRIUS_EDIT_ATTRIBUTES.LABEL_CAPTION:
                this.#updateLabelCaption(newValue);
                break

            default:
                this._onInjectedLogger = () => this.logger.error(`Unregistered attribute: ${name}`);
                break;
        }
    }

    /** Attribute change callback
     * @param {string} name - Attribute name
     * @param {string} oldValue - Old attribute value
     * @param {string} newValue - New attribute value
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // Call the attribute change pre-handler
        const {formattedValue, shouldContinue} = this._attributeChangePreHandler(name, oldValue, newValue);
        if (!shouldContinue) return;

        // Call the attribute change handler
        this.onBuilt = () => this.#attributeChangeHandler(name, oldValue, formattedValue);
    }

}

// Register custom element
customElements.define(SIRIUS_EDIT.TAG, SiriusEdit);