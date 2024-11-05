import {
    SIRIUS_ELEMENT,
    SIRIUS_ELEMENT_ATTRIBUTES,
    SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES,
    SiriusElement
} from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";
import {SIRIUS_ICON, SIRIUS_ICON_ATTRIBUTES, SiriusIcon} from "./SiriusIcon.js";
import {SIRIUS_LABEL_ATTRIBUTES, SiriusLabel} from "./SiriusLabel.js";

/** Sirius checkbox constants */
export const SIRIUS_CHECKBOX = deepFreeze({
    NAME: "SiriusCheckbox",
    TAG: "sirius-checkbox",
    CSS_VARS: {
        GAP: '--gap',
        PADDING: "--padding",
        BACKGROUND_COLOR: "--background-color",
        CHECKBOX_ORDER: "--checkbox-order",
        CHECKBOX_BACKGROUND_COLOR: "--checkbox-background-color",
        CHECKBOX_BORDER_COLOR: "--checkbox-border-color",
        CHECKBOX_BORDER_LINE_STYLE: "--checkbox-border-line-style",
        CHECKBOX_BORDER_RADIUS: "--checkbox-border-radius",
        CHECKBOX_BORDER_WIDTH: "--checkbox-border-width",
        CHECKBOX_ICON_PADDING: "--checkbox-icon-padding",
    },
    CLASSES: {
        CHECKBOX_CONTAINER: 'checkbox-container',
        ICON_CONTAINER: 'icon-container',
        LABEL_CONTAINER: 'label-container',
        CHECKED: 'checked',
        DISABLED: 'disabled',
    }
})

/** Sirius checkbox attributes */
export const SIRIUS_CHECKBOX_ATTRIBUTES = deepFreeze({
    CHECKED: "checked",
    GAP: "gap",
    PADDING: "padding",
    BACKGROUND_COLOR: "background-color",
    ICON_WIDTH: "icon-width",
    ICON_HEIGHT: "icon-height",
    ICON_FILL: "icon-fill",
    ICON_ANIMATION_DURATION: 'icon-animation-duration',
    ICON_CHECKED_ANIMATION: "icon-checked-animation",
    ICON_UNCHECKED_ANIMATION: "icon-unchecked-animation",
    CHECKBOX_ORDER: "checkbox-order",
    CHECKBOX_BACKGROUND_COLOR: "checkbox-background-color",
    CHECKBOX_BORDER_COLOR: "checkbox-border-color",
    CHECKBOX_BORDER_PADDING: "checkbox-border-padding",
    CHECKBOX_BORDER_LINE_STYLE: "checkbox-border-line-style",
    CHECKBOX_BORDER_RADIUS: "checkbox-border-radius",
    CHECKBOX_BORDER_WIDTH: "checkbox-border-width",
    LABEL_HIDDEN: "label-hidden",
    LABEL_CAPTION: "label-caption",
    LABEL_CAPTION_BACKGROUND_COLOR: "label-caption-background-color",
    LABEL_CAPTION_COLOR: "label-caption-color",
    LABEL_CAPTION_FONT_FAMILY: "label-caption-font-family",
    LABEL_CAPTION_FONT_SIZE: "label-caption-font-size",
    LABEL_CAPTION_PADDING: "label-caption-padding",
})

/** Sirius label checkbox default values */
export const SIRIUS_CHECKBOX_ATTRIBUTES_DEFAULT = deepFreeze({
    [SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_CAPTION]: "",
    [SIRIUS_CHECKBOX_ATTRIBUTES.CHECKED]: "false",
})

/** Sirius class that represents a checkbox component */
export class SiriusCheckbox extends SiriusElement {
    #parentElement = null;
    #children=[]
    #checkboxContainerElement = null;
    #labelContainerElement = null;
    #labelElement = null;
    #iconContainerElement = null;
    #iconElement = null;

    /**
     * Create a Sirius checkbox element
     * @param {Object} properties - The properties of the Sirius checkbox
     */
    constructor(properties) {
        super(properties, SIRIUS_CHECKBOX.NAME);
    }

    /** Define observed attributes */
    static get observedAttributes() {
        return [...SiriusElement.observedAttributes,...Object.values(SIRIUS_CHECKBOX_ATTRIBUTES)];
    }

    /** Get the label container element
     * @returns {HTMLElement} - Label container element
     */
    get labelContainerElement() {
        return this.#labelContainerElement;
    }

    /** Get the label element
     * @returns {SiriusLabel} - Label element
     */
    get labelElement() {
        return this.#labelElement;
    }

    /** Get the icon container element
     * @returns {HTMLElement} - Icon container element
     */
    get iconContainerElement() {
        return this.#iconContainerElement;
    }

    /** Get the icon element
     * @returns {SiriusIcon} - Icon element
     */
    get iconElement() {
        return this.#iconElement;
    }

    /** Get parent element
     * @returns {SiriusCheckbox} - Parent element
     */
    get parentElement() {
        return this.#parentElement;
    }

    /** Set parent element
     * @param {SiriusCheckbox} element - Parent element
     */
    set parentElement(element) {
        if (this.#parentElement!==null){
            this.logger.error("Parent element already set. Remove the current parent element before setting a new one.");
            return;
        }

        this.#parentElement = element;
    }

    /** Get children elements
     * @returns {Array<SiriusCheckbox>} - Children elements
     */
    get children() {
        return this.#children;
    }

    /** Get checked attribute
     * @returns {string} - Checked attribute
     */
    get checked() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.CHECKED);
    }

    /** Set checked attribute
     * @param {string} value - Checked attribute
     */
    set checked(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.CHECKED, value);
    }

    /** Toggle the checked attribute */
    toggleChecked() {
        this.checked = this.checked === "true" ? "false" : "true";
    }

    /** Get gap attribute
     * @returns {string} - Gap attribute
     */
    get gap() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.GAP);
    }

    /** Set gap attribute
     * @param {string} value - Gap attribute
     */
    set gap(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.GAP, value);
    }

    /** Get padding attribute
     * @returns {string} - Padding attribute
     */
    get padding() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.PADDING);
    }

    /** Set padding attribute
     * @param {string} value - Padding attribute
     */
    set padding(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.PADDING, value);
    }

    /** Get background color attribute
     * @returns {string} - Background color attribute
     */
    get backgroundColor() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.BACKGROUND_COLOR);
    }

    /** Set background color attribute
     * @param {string} value - Background color attribute
     */
    set backgroundColor(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.BACKGROUND_COLOR, value);
    }

    /** Get icon width attribute
     * @returns {string} - Icon width attribute
     */
    get iconWidth() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.ICON_WIDTH);
    }

    /** Set icon width attribute
     * @param {string} value - Icon width attribute
     */
    set iconWidth(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.ICON_WIDTH, value);
    }

    /** Get icon height attribute
     * @returns {string} - Icon height attribute
     */
    get iconHeight() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.ICON_HEIGHT);
    }

    /** Set icon height attribute
     * @param {string} value - Icon height attribute
     */
    set iconHeight(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.ICON_HEIGHT, value);
    }

    /** Get icon fill attribute
     * @returns {string} - Icon fill attribute
     */
    get iconFill() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.ICON_FILL);
    }

    /** Set icon fill attribute
     * @param {string} value - Icon fill attribute
     */
    set iconFill(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.ICON_FILL, value);
    }

    /** Get icon animation duration attribute
     * @returns {string} - Icon animation duration attribute
     */
    get iconAnimationDuration() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.ICON_ANIMATION_DURATION);
    }

    /** Set icon animation duration attribute
     * @param {string} value - Icon animation duration attribute
     */
    set iconAnimationDuration(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.ICON_ANIMATION_DURATION, value);
    }

    /** Get icon checked animation attribute
     * @returns {string} - Icon checked animation attribute
     */
    get iconCheckedAnimation() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.ICON_CHECKED_ANIMATION);
    }

    /** Set icon checked animation attribute
     * @param {string} value - Icon checked animation attribute
     */
    set iconCheckedAnimation(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.ICON_CHECKED_ANIMATION, value);
    }

    /** Get icon unchecked animation attribute
     * @returns {string} - Icon unchecked animation attribute
     */
    get iconUncheckedAnimation() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.ICON_UNCHECKED_ANIMATION);
    }

    /** Set icon unchecked animation attribute
     * @param {string} value - Icon unchecked animation attribute
     */
    set iconUncheckedAnimation(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.ICON_UNCHECKED_ANIMATION, value);
    }

    /** Get checkbox order attribute
     * @returns {string} - Checkbox order attribute
     */
    get checkboxOrder() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_ORDER);
    }

    /** Set checkbox order attribute
     * Set <=-1 for the checkbox to appear before the label, >=1 for the checkbox to appear after the label
     * @param {string} value - Checkbox order attribute
     */
    set checkboxOrder(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_ORDER, value);
    }

    /** Get checkbox background color attribute
     * @returns {string} - Checkbox background color attribute
     */
    get checkboxBackgroundColor() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BACKGROUND_COLOR);
    }

    /** Set checkbox background color attribute
     * @param {string} value - Checkbox background color attribute
     */
    set checkboxBackgroundColor(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BACKGROUND_COLOR, value);
    }

    /** Get checkbox border color attribute
     * @returns {string} - Checkbox border color attribute
     */
    get checkboxBorderColor() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BORDER_COLOR);
    }

    /** Set checkbox border color attribute
     * @param {string} value - Checkbox border color attribute
     */
    set checkboxBorderColor(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BORDER_COLOR, value);
    }

    /** Get checkbox border padding attribute
     * @returns {string} - Checkbox border padding attribute
     */
    get checkboxBorderPadding() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BORDER_PADDING);
    }

    /** Set checkbox border padding attribute
     * @param {string} value - Checkbox border padding attribute
     */
    set checkboxBorderPadding(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BORDER_PADDING, value);
    }

    /** Get checkbox border line style attribute
     * @returns {string} - Checkbox border line style attribute
     */
    get checkboxBorderLineStyle() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BORDER_LINE_STYLE);
    }

    /** Set checkbox border line style attribute
     * @param {string} value - Checkbox border line style attribute
     */
    set checkboxBorderLineStyle(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BORDER_LINE_STYLE, value);
    }

    /** Get checkbox border radius attribute
     * @returns {string} - Checkbox border radius attribute
     */
    get checkboxBorderRadius() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BORDER_RADIUS);
    }

    /** Set checkbox border radius attribute
     * @param {string} value - Checkbox border radius attribute
     */
    set checkboxBorderRadius(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BORDER_RADIUS, value);
    }

    /** Get checkbox border width attribute
     * @returns {string} - Checkbox border width attribute
     */
    get checkboxBorderWidth() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BORDER_WIDTH);
    }

    /** Set checkbox border width attribute
     * @param {string} value - Checkbox border width attribute
     */
    set checkboxBorderWidth(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BORDER_WIDTH, value);
    }

    /** Get label hidden attribute
     * @returns {string} - Label hidden attribute
     */
    get labelHidden() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_HIDDEN);
    }

    /** Set label hidden attribute
     * @param {string} value - Label hidden attribute
     */
    set labelHidden(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_HIDDEN, value);
    }

    /** Get label caption attribute
     * @returns {string} - Label caption attribute
     */
    get labelCaption() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_CAPTION);
    }

    /** Set label caption attribute
     * @param {string} value - Label caption attribute
     */
    set labelCaption(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_CAPTION, value);
    }

    /** Get label caption background color attribute
     * @returns {string} - Label caption background color attribute
     */
    get labelCaptionBackgroundColor() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_CAPTION_BACKGROUND_COLOR);
    }

    /** Set label caption background color attribute
     * @param {string} value - Label caption background color attribute
     */
    set labelCaptionBackgroundColor(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_CAPTION_BACKGROUND_COLOR, value);
    }

    /** Get label caption color attribute
     * @returns {string} - Label caption color attribute
     */
    get labelCaptionColor() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_CAPTION_COLOR);
    }

    /** Set label caption color attribute
     * @param {string} value - Label caption color attribute
     */
    set labelCaptionColor(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_CAPTION_COLOR, value);
    }

    /** Get label caption font family attribute
     * @returns {string} - Label caption font family attribute
     */
    get labelCaptionFontFamily() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_CAPTION_FONT_FAMILY);
    }

    /** Set label caption font family attribute
     * @param {string} value - Label caption font family attribute
     */
    set labelCaptionFontFamily(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_CAPTION_FONT_FAMILY, value);
    }

    /** Get label caption font size attribute
     * @returns {string} - Label caption font size attribute
     */
    get labelCaptionFontSize() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_CAPTION_FONT_SIZE);
    }

    /** Set label caption font size attribute
     * @param {string} value - Label caption font size attribute
     */
    set labelCaptionFontSize(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_CAPTION_FONT_SIZE, value);
    }

    /** Get label caption padding attribute
     * @returns {string} - Label caption padding attribute
     */
    get labelCaptionPadding() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_CAPTION_PADDING);
    }

    /** On built checkbox container element
     * @param {function(HTMLElement): void} callback - Callback
     */
    set _onBuiltCheckboxContainerElement(callback) {
        this._onBuiltContainerElement = callback
    }

    /** On built icon element
     * @param {function(SiriusIcon): void} callback - Callback
     */
    set _onBuiltIconElement(callback) {
        this.onBuilt = () => {
            if (this._checkElement(this.iconElement))
                callback(this.iconElement);
        }
    }

    /** On built label container element
     * @param {function(HTMLElement): void} callback - Callback
     */
    set _onBuiltLabelContainerElement(callback) {
        this.onBuilt = () => {
            if (this._checkElement(this.labelContainerElement))
                callback(this.labelContainerElement);
        }
    }

    /** On built label element
     * @param {function(SiriusLabel): void} callback - Callback
     */
    set _onBuiltLabelElement(callback) {
        this.onBuilt = () => {
            if (this._checkElement(this.labelElement))
                callback(this.labelElement);
        }
    }

    /** Private method to set the checked attribute
     * @param {string} checked - Checked attribute value
     */
    #setChecked(checked) {
        if (checked)
            this._onBuiltIconElement = (element) => element.hidden = this.checked==="true"?"false":"true";
    }

    /** Private method to set the gap attribute
     * @param {string} gap - Gap attribute value
     */
    #setGap(gap) {
        if (gap)
            this._setCSSVariable(SIRIUS_CHECKBOX.CSS_VARS.GAP, gap);
    }

    /** Private method to set the padding attribute
     * @param {string} padding - Padding attribute value
     */
    #setPadding(padding) {
        if (padding)
            this._setCSSVariable(SIRIUS_CHECKBOX.CSS_VARS.PADDING, padding);
    }

    /** Private method to set the background color attribute
     * @param {string} backgroundColor - Background color attribute value
     */
    #setBackgroundColor(backgroundColor) {
        if (backgroundColor)
            this._setCSSVariable(SIRIUS_CHECKBOX.CSS_VARS.BACKGROUND_COLOR, backgroundColor);
    }

    /** Private method to set the icon width
     * @param {string} width - Icon width attribute value
     */
    #setIconWidth(width) {
        if (width)
            this._onBuiltIconElement = (element) => element.iconWidth = width;
    }

    /** Private method to set the icon height
     * @param {string} height - Icon height attribute value
     */
    #setIconHeight(height) {
        if (height)
            this._onBuiltIconElement = (element) => element.iconHeight = height;
    }

    /** Private method to set the icon fill color
     * @param {string} fill - Icon fill attribute value
     */
    #setIconFill(fill) {
        if (fill)
            this._onBuiltIconElement = (element) => element.iconFill = fill;
    }

    /** Private method to set the icon animation duration
     * @param {string} duration - Icon animation duration attribute value
     */
    #setIconAnimationDuration(duration) {
        if (duration)
            this._onBuiltIconElement = (element) => element.animationDuration = duration
    }

    /** Private method to set the icon checked animation
     * @param {string} animation - Icon checked animation attribute value
     */
    #setIconCheckedAnimation(animation) {
        if (animation)
            this._onBuiltIconElement = (element) => element.showAnimation = animation;
    }

    /** Private method to set the icon unchecked animation
     * @param {string} animation - Icon unchecked animation attribute value
     */
    #setIconUncheckedAnimation(animation) {
        if (animation)
            this._onBuiltIconElement = (element) => element.hidingAnimation = animation;
    }

    /** Private method to set the checkbox order
     * @param {string} order - Checkbox order attribute value
     */
    #setCheckboxOrder(order) {
        if (order)
            this._setCSSVariable(SIRIUS_CHECKBOX.CSS_VARS.CHECKBOX_ORDER, order);
    }

    /** Private method to set the checkbox background color
     * @param {string} color - Checkbox background color attribute value
     */
    #setCheckboxBackgroundColor(color) {
        if (color)
            this._setCSSVariable(SIRIUS_CHECKBOX.CSS_VARS.CHECKBOX_BACKGROUND_COLOR, color);
    }

    /** Private method to set the checkbox border color
     * @param {string} color - Checkbox border color attribute value
     */
    #setCheckboxBorderColor(color) {
        if (color)
            this._setCSSVariable(SIRIUS_CHECKBOX.CSS_VARS.CHECKBOX_BORDER_COLOR, color);
    }

    /** Private method to set the checkbox border padding
     * @param {string} padding - Checkbox border padding attribute value
     */
    #setCheckboxBorderPadding(padding) {
        if (padding)
            this._setCSSVariable(SIRIUS_CHECKBOX.CSS_VARS.CHECKBOX_BORDER_PADDING, padding);
    }

    /** Private method to set the checkbox border line style
     * @param {string} style - Checkbox border line style attribute value
     */
    #setCheckboxBorderLineStyle(style) {
        if (style)
            this._setCSSVariable(SIRIUS_CHECKBOX.CSS_VARS.CHECKBOX_BORDER_LINE_STYLE, style);
    }

    /** Private method to set the checkbox border radius
     * @param {string} radius - Checkbox border radius attribute value
     */
    #setCheckboxBorderRadius(radius) {
        if (radius)
            this._setCSSVariable(SIRIUS_CHECKBOX.CSS_VARS.CHECKBOX_BORDER_RADIUS, radius);
    }

    /** Private method to set the checkbox border width
     * @param {string} width - Checkbox border width attribute value
     */
    #setCheckboxBorderWidth(width) {
        if (width)
            this._setCSSVariable(SIRIUS_CHECKBOX.CSS_VARS.CHECKBOX_BORDER_WIDTH, width);
    }

    /** Private method to set the label hidden attribute
     * @param {string} hide - Label hidden attribute value
     */
    #setLabelHidden(hide) {
        this._onBuiltLabelContainerElement = (element) => {
            if (hide === 'true' || hide === '')
                this._hide({element})
            else
                this._show(element)
        }
    }

    /** Private method to set the label caption
     * @param {string} caption - Label caption attribute value
     */
    #setLabelCaption(caption) {
        if (caption)
            this._onBuiltLabelElement = (element) => element.caption = caption;
    }

    /** Private method to set the label caption background color
     * @param {string} color - Label caption background color attribute value
     */
    #setLabelCaptionBackgroundColor(color) {
        if (color)
            this._onBuiltLabelElement = (element) => element.backgroundColor = color;
    }

    /** Private method to set the label caption color
     * @param {string} color - Label caption color attribute value
     */
    #setLabelCaptionColor(color) {
        if (color)
            this._onBuiltLabelElement = (element) => element.color = color;
    }

    /** Private method to set the label caption font family
     * @param {string} fontFamily - Label caption font family attribute value
     */
    #setLabelCaptionFontFamily(fontFamily) {
        if (fontFamily)
            this._onBuiltLabelElement = (element) => element.fontFamily = fontFamily;
    }

    /** Private method to set the label caption font size
     * @param {string} fontSize - Label caption font size attribute value
     */
    #setLabelCaptionFontSize(fontSize) {
        if (fontSize)
            this._onBuiltLabelElement = (element) => element.fontSize = fontSize;
    }

    /** Private method to set the label caption padding
     * @param {string} padding - Label caption padding attribute value
     */
    #setLabelCaptionPadding(padding) {
        if (padding)
            this._onBuiltLabelElement = (element) => element.padding = padding;
    }

    /** Private method to set the checkbox container style
     * @param {string} style - Style attribute value
     */
    #setStyle(style) {
        if (!style)
            return

        // Add the style attribute to the element when built
        this._setStyle(() => {
            this._onBuiltCheckboxContainerElement = (element) => this._setStyleAttributes(style, element);
        })
    }

    /** Set the events property to the icon element
     * @param {object} events - Events property
     */
    set events(events) {
        if (!events)
            return

        // Add the events property to the element when built
        this._onBuiltIconElement = (element) => this._setEvents(events, element);
    }

    /** Add checkbox children elements
     * @param {SiriusCheckbox} elements - Children elements
     */
    addChildrenElements(...elements) {
        if (!elements)
            return

        elements.forEach(element => {
            if (!element) return;

            element.parentElement = this;
            this.#children.push(element);
        })
    }

    /** Remove checkbox children elements
     * @param {SiriusCheckbox} elements - Children elements
     */
    removeChildrenElements(...elements) {
        if (!elements) return;

         elements.forEach(element => {
            if (!element) return;

            element.#parentElement = null;
            this.#children = this.#children.filter(child => child !== element);
        })
    }

    /** Get the template for the Sirius checkbox
     * @returns {string} - Template
     */
    #getTemplate() {
        // Get the checkbox classes
        const checkboxContainerClasses = [SIRIUS_CHECKBOX.CLASSES.CHECKBOX_CONTAINER];
        const iconContainerClasses = [SIRIUS_CHECKBOX.CLASSES.ICON_CONTAINER];
        const labelContainerClasses = [SIRIUS_CHECKBOX.CLASSES.LABEL_CONTAINER]

        return `<div class="${checkboxContainerClasses.join(' ')}">
                    <div class="${iconContainerClasses.join(' ')}">
                    </div>
                    <div class="${labelContainerClasses.join(' ')}">
                    </div>
                </div>`;
    }

    /** Attribute change callback
     * @param {string} name - Attribute name
     * @param {string} oldValue - Old attribute value
     * @param {string} newValue - New attribute value
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

            case SIRIUS_CHECKBOX_ATTRIBUTES.CHECKED:
                this.#setChecked(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.GAP:
                this.#setGap(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.PADDING:
                this.#setPadding(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.BACKGROUND_COLOR:
                this.#setBackgroundColor(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.ICON_WIDTH:
                this.#setIconWidth(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.ICON_HEIGHT:
                this.#setIconHeight(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.ICON_FILL:
                this.#setIconFill(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.ICON_ANIMATION_DURATION:
                this.#setIconAnimationDuration(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.ICON_CHECKED_ANIMATION:
                this.#setIconCheckedAnimation(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.ICON_UNCHECKED_ANIMATION:
                this.#setIconUncheckedAnimation(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_ORDER:
                this.#setCheckboxOrder(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BACKGROUND_COLOR:
                this.#setCheckboxBackgroundColor(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BORDER_COLOR:
                this.#setCheckboxBorderColor(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BORDER_PADDING:
                this.#setCheckboxBorderPadding(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BORDER_LINE_STYLE:
                this.#setCheckboxBorderLineStyle(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BORDER_RADIUS:
                this.#setCheckboxBorderRadius(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BORDER_WIDTH:
                this.#setCheckboxBorderWidth(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_HIDDEN:
                this.#setLabelHidden(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_CAPTION:
                this.#setLabelCaption(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_CAPTION_BACKGROUND_COLOR:
                this.#setLabelCaptionBackgroundColor(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_CAPTION_COLOR:
                this.#setLabelCaptionColor(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_CAPTION_FONT_FAMILY:
                this.#setLabelCaptionFontFamily(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_CAPTION_FONT_SIZE:
                this.#setLabelCaptionFontSize(formattedValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_CAPTION_PADDING:
                this.#setLabelCaptionPadding(formattedValue);
                break;

            default:
                this.logger.error(`Unregistered attribute: ${name}`);
                break;
        }
    }

    /** Lifecycle method called when the component is connected to the DOM
     */
    async connectedCallback() {
        // Call the parent connectedCallback
        await super.connectedCallback();

        // Load Sirius checkbox HTML attributes
        this._loadAttributes({
            instanceProperties: this._properties,
            attributes: SIRIUS_CHECKBOX_ATTRIBUTES,
            defaultAttributes: SIRIUS_CHECKBOX_ATTRIBUTES_DEFAULT
        });

        // Create the CSS style sheets and add them to the shadow DOM
        await this._loadAndAdoptStyles();

        // Create derived IDs
        const iconId = `${this.id}__icon`;
        const labelId = `${this.id}__label`;

        // Get the required keys
        const idKey = SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID
        const hideKey = SIRIUS_ELEMENT_ATTRIBUTES.HIDE
        const iconKey =SIRIUS_ICON_ATTRIBUTES.ICON
        const checkedKey = SIRIUS_CHECKBOX_ATTRIBUTES.CHECKED

        // Create SiriusIcon element
        this.#iconElement = new SiriusIcon({
            [idKey]: iconId,
            [iconKey]: "check-mark",
            [hideKey]: SIRIUS_CHECKBOX_ATTRIBUTES_DEFAULT[checkedKey] === "false" ? "true" : "false"
        })

        // Create SiriusLabel element
        this.#labelElement = new SiriusLabel({
            [idKey]: labelId,
        })

        // Get HTML inner content
        const innerHTML = this.#getTemplate();

        // Create the HTML template
        await this._createTemplate(innerHTML);

        // Add checkbox to the shadow DOM
        this.#checkboxContainerElement = this._containerElement = this._templateContent.firstChild;
        this.#iconContainerElement= this.#checkboxContainerElement.firstElementChild;
        this.#labelContainerElement = this.#checkboxContainerElement.lastElementChild;

        // Add icon and label to the checkbox container
        this.#iconContainerElement.appendChild(this.iconElement);
        this.#labelContainerElement.appendChild(this.labelElement);
        this.shadowRoot.appendChild(this.containerElement);

        // Add event listeners
        this.iconElement.events = {
            "click": () => this.toggleChecked()
        }

        // Dispatch the built event
        this.dispatchBuiltEvent();
    }
}

// Register custom element
customElements.define(SIRIUS_CHECKBOX.TAG, SiriusCheckbox);