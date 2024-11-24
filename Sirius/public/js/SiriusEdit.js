import {SIRIUS_ELEMENT_ATTRIBUTES, SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES, SiriusElement,} from "../js/SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";
import {SIRIUS_ICON_ATTRIBUTES, SiriusIcon} from "./SiriusIcon.js";

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
        LABEL_Y_POSITION: '--sirius-edit--labeline-y',

        WIDTH: '--sirius-edit--container-whidth',
        HEIGHT: '--sirius-edit--container-height',
    },
    CLASSES: {
        EDIT_CONTAINER: "edit-container",
        EDIT_AREA: "edit-area",
        EDIT_LABEL:"labelline",
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
    INPUT_TYPE: "input-type",

    LABEL_BACKGROUND: "label-color",
    LABEL_FONT_COLOR: "label-font-color",
    LABEL_BORDER_COLOR: "label-border-color",
    LABEL_FONT_COLOR_ONFOCUS: "label-font-color-onfocus",
    LABEL_BORDER_COLOR_ONFOCUS: "label-border-color-onfocus",
    LABEL_CAPTION: "label-caption",
    LABEL_Y_POSITION: "label-y-position",

    ICON_EYE: "icon-eye",
    ICON_EYE_CLOSE: "icon-eye-close",
    ICON_ARROW_UP: "icon-arrow-up",
    ICON_ARROW_DOWN: "icon-arrow-down",
    ICON_POSITION_RIGHT: "icon-position-right",
    ICON_POSITION_TOP: "icon-position-top",
})

export class SiriusEdit extends SiriusElement {
    siriusIcon = null;
    #editContainerElement = null;

    constructor(properties) {
        super(properties, SIRIUS_EDIT.NAME);
        this.#build().then;
    }

    #getTemplate() {
        const labelCaption = this.labelCaption || 'Touch Me'
        const inputType = this.inputType || 'text';

        return `<div class=${SIRIUS_EDIT.CLASSES.EDIT_CONTAINER}>
                    <div class="${SIRIUS_EDIT.CLASSES.EDIT_AREA}">
                        <input type="${inputType}" ${SIRIUS_EDIT.CLASSES.EDIT_REQUIRED}>
                        
                        <div class="${SIRIUS_EDIT.CLASSES.EDIT_LABEL}">${labelCaption}</div>
                    </div>
                </div>`;
    }

        // Getter and setter for ICON_EYE
        get iconEye() {
            return this.getAttribute(SIRIUS_EDIT_ATTRIBUTES.ICON_EYE) || 'eye';
        }
    
        set iconEye(value) {
            this.setAttribute(SIRIUS_EDIT_ATTRIBUTES.ICON_EYE, value);
        }
    
        // Getter and setter for ICON_EYE_CLOSE
        get iconEyeClose() {
            return this.getAttribute(SIRIUS_EDIT_ATTRIBUTES.ICON_EYE_CLOSE) || 'eye-close';
        }
    
        set iconEyeClose(value) {
            this.setAttribute(SIRIUS_EDIT_ATTRIBUTES.ICON_EYE_CLOSE, value);
        }
    
        // Getter and setter for ICON_ARROW_UP
        get iconArrowUp() {
            return this.getAttribute(SIRIUS_EDIT_ATTRIBUTES.ICON_ARROW_UP) || 'arrow--up';
        }
    
        set iconArrowUp(value) {
            this.setAttribute(SIRIUS_EDIT_ATTRIBUTES.ICON_ARROW_UP, value);
        }
    
        // Getter and setter for ICON_ARROW_DOWN
        get iconArrowDown() {
            return this.getAttribute(SIRIUS_EDIT_ATTRIBUTES.ICON_ARROW_DOWN) || 'arrow--down';
        }
    
        set iconArrowDown(value) {
            this.setAttribute(SIRIUS_EDIT_ATTRIBUTES.ICON_ARROW_DOWN, value);
        }
    
        // Getter and setter for ICON_POSITION_RIGHT
        get iconPositionRight() {
            return this.getAttribute(SIRIUS_EDIT_ATTRIBUTES.ICON_POSITION_RIGHT) || '10px';
        }
    
        set iconPositionRight(value) {
            this.setAttribute(SIRIUS_EDIT_ATTRIBUTES.ICON_POSITION_RIGHT, value);
        }
    
        // Getter and setter for ICON_POSITION_TOP
        get iconPositionTop() {
            return this.getAttribute(SIRIUS_EDIT_ATTRIBUTES.ICON_POSITION_TOP) || '20px';
        }
    
        set iconPositionTop(value) {
            this.setAttribute(SIRIUS_EDIT_ATTRIBUTES.ICON_POSITION_TOP, value);
        }

    /** Get icon width attribute
     * @returns {string} - Icon width attribute
     */
    get Width() {
        return this.getAttribute(SIRIUS_EDIT_ATTRIBUTES.WIDTH);
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

    #setYPosition(position) {
        if(position){
            this._setCSSVariable(SIRIUS_EDIT.CSS_VARIABLES.LABEL_Y_POSITION, position);
        }
    }

    #setWidth(width) {
        if (width)
            this._setCSSVariable(SIRIUS_EDIT.CSS_VARIABLES.WIDTH, width);
    }

    #setHeight(height) {
        if (height)
            this._setCSSVariable(SIRIUS_EDIT.CSS_VARIABLES.HEIGHT, height);
    }

    #setInputBackgroundColor(color){
        if(color) 
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

    // Private method to update the input type
    #updateInputType(value) {
        const input = this.shadowRoot.querySelector('input');
        if (input) {
            input.type = value;
        }

        switch (value) {
            case 'password':
                this.#handlePasswordType(input);
                break;
            case 'number':
                this.#handleNumberType(input);
                break;
            default:
                this.#removeIcons();
                break;
        }

        this.setAttribute(SIRIUS_EDIT_ATTRIBUTES.INPUT_TYPE, value);
    }

    // Private method to handle password type input
    #handlePasswordType(input) {
        const div = this.shadowRoot.querySelector('.edit-area');
        if (!this.siriusIcon) {
            this.siriusIcon = new SiriusIcon({
                [SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID]: `${Math.random()}`,
                [SIRIUS_ICON_ATTRIBUTES.ICON]: this.iconEyeClose,
                style: `position: absolute; right: ${this.iconPositionRight}; top: ${this.iconPositionTop}; z-index: 12222;`
            });
        }

        if (!div.querySelector('sirius-icon')) {
            div.appendChild(this.siriusIcon);
            this.siriusIcon.addEventListener('click', () => {
                const icon = this.siriusIcon.getAttribute(SIRIUS_ICON_ATTRIBUTES.ICON);
                if (icon === this.iconEyeClose) {
                    this.siriusIcon.setAttribute(SIRIUS_ICON_ATTRIBUTES.ICON, this.iconEye);
                    input.type = 'text';
                } else {
                    this.siriusIcon.setAttribute(SIRIUS_ICON_ATTRIBUTES.ICON, this.iconEyeClose);
                    input.type = 'password';
                }
            });
        }
    }

    // Private method to update icons
    #updateIcons() {
        const inputType = this.inputType;
        if (inputType === 'password') {
            this.#handlePasswordType(this.shadowRoot.querySelector('input'));
        } else if (inputType === 'number') {
            this.#handleNumberType(this.shadowRoot.querySelector('input'));
        }
    }

    // Private method to handle number type input
    #handleNumberType(input) {
        const div = this.shadowRoot.querySelector('.edit-area');
        if (!this.siriusIcon) {
            this.siriusIcon = new SiriusIcon({
                [SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID]: `${Math.random()}`,
                [SIRIUS_ICON_ATTRIBUTES.ICON]: this.iconArrowUp,
                style: `position: absolute; right: ${this.iconPositionRight}; top: ${this.iconPositionTop}; z-index: 12222;`
            });
            this.siriusIcon2 = new SiriusIcon({
                [SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID]: `${Math.random()}`,
                [SIRIUS_ICON_ATTRIBUTES.ICON]: this.iconArrowDown,
                style: `position: absolute; right: ${this.iconPositionRight}; top: calc(${this.iconPositionTop} + 20px); z-index: 12222;`
            });
        }

        if (!div.querySelector('sirius-icon')) {
            div.appendChild(this.siriusIcon);
            div.appendChild(this.siriusIcon2);

            input.value = 0;

            this.siriusIcon.addEventListener('click', () => {
                input.value = parseInt(input.value) + 1;
            });

            this.siriusIcon2.addEventListener('click', () => {
                input.value = parseInt(input.value) - 1;
            });
        }
    }

    // Private method to remove icons
    #removeIcons() {
        const icons = this.shadowRoot.querySelectorAll('sirius-icon');
        icons.forEach(icon => icon.remove());
    }

    async #build(){

        // Load Sirius checkbox HTML attributes
        this._loadAttributes({
            instanceProperties: this._properties,
            attributes: SIRIUS_EDIT_ATTRIBUTES,
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

            case SIRIUS_EDIT_ATTRIBUTES.INPUT_TYPE:
                this.#updateInputType(newValue);
                break;
            
            case SIRIUS_EDIT_ATTRIBUTES.WIDTH:
                this.#setWidth(newValue);
                break;

            case SIRIUS_EDIT_ATTRIBUTES.HEIGHT:
                this.#setHeight(newValue);
                break;

            case SIRIUS_EDIT_ATTRIBUTES.LABEL_Y_POSITION:
                this.#setYPosition(newValue);
                break;

            case SIRIUS_EDIT_ATTRIBUTES.ICON_POSITION_RIGHT:
            case SIRIUS_EDIT_ATTRIBUTES.ICON_POSITION_TOP:
            case SIRIUS_EDIT_ATTRIBUTES.ICON_EYE:
            case SIRIUS_EDIT_ATTRIBUTES.ICON_EYE_CLOSE:
            case SIRIUS_EDIT_ATTRIBUTES.ICON_ARROW_UP:
            case SIRIUS_EDIT_ATTRIBUTES.ICON_ARROW_DOWN:
                this.#updateIcons();
                break;

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