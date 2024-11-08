import {
    SIRIUS_ELEMENT,
    SIRIUS_ELEMENT_ATTRIBUTES,
    SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES,
    SiriusElement
} from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";
import {SIRIUS_ICON_ATTRIBUTES, SiriusIcon} from "./SiriusIcon.js";
import {SiriusLabel} from "./SiriusLabel.js";

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
    },
    CLASSES: {
        CHECKBOX_CONTAINER: 'checkbox-container',
        ICON_CONTAINER: 'icon-container',
        LABEL_CONTAINER: 'label-container',
        DISABLED: 'disabled',
    }
})

/** Sirius checkbox attributes */
export const SIRIUS_CHECKBOX_ATTRIBUTES = deepFreeze({
    STATUS: "status",
    GAP: "gap",
    PADDING: "padding",
    BACKGROUND_COLOR: "background-color",
    ICON_WIDTH: "icon-width",
    ICON_HEIGHT: "icon-height",
    ICON_FILL: "icon-fill",
    ICON_ANIMATION_DURATION: 'icon-animation-duration',
    ICON_CHECKED_ANIMATION: "icon-checked-animation",
    ICON_UNCHECKED_ANIMATION: "icon-unchecked-animation",
    ICON_PADDING: "icon-padding",
    CHECKBOX_ORDER: "checkbox-order",
    CHECKBOX_BACKGROUND_COLOR: "checkbox-background-color",
    CHECKBOX_BORDER_COLOR: "checkbox-border-color",
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
    DATA_CHILDREN:'data-children'
})

/** Sirius label checkbox default values */
export const SIRIUS_CHECKBOX_ATTRIBUTES_DEFAULT = deepFreeze({
    [SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_CAPTION]: "",
    [SIRIUS_CHECKBOX_ATTRIBUTES.STATUS]: "unchecked",
})

/** Sirius class that represents a checkbox component */
export class SiriusCheckbox extends SiriusElement {
    #parentElement = null;
    #children = []
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
        return [...SiriusElement.observedAttributes, ...Object.values(SIRIUS_CHECKBOX_ATTRIBUTES)];
    }

    /** Get the checkbox container element
     * @returns {HTMLElement|null} - Checkbox container element
     */
    get checkboxContainerElement() {
        return this.#checkboxContainerElement;
    }

    /** Get the label container element
     * @returns {HTMLElement|null} - Label container element
     */
    get labelContainerElement() {
        return this.#labelContainerElement;
    }

    /** Get the label element
     * @returns {SiriusLabel|null} - Label element
     */
    get labelElement() {
        return this.#labelElement;
    }

    /** Get the icon container element
     * @returns {HTMLElement|null} - Icon container element
     */
    get iconContainerElement() {
        return this.#iconContainerElement;
    }

    /** Get the icon element
     * @returns {SiriusIcon|null} - Icon element
     */
    get iconElement() {
        return this.#iconElement;
    }

    /** Get parent element
     * @returns {SiriusCheckbox|null} - Parent element
     */
    get parentElement() {
        return this.#parentElement;
    }

    /** Get children elements
     * @returns {SiriusCheckbox[]} - Children elements
     */
    get children() {
        return this.#children;
    }

    /** Get status attribute
     * @returns {string} - Status attribute
     */
    get status() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.STATUS);
    }

    /** Set status attribute
     * @param {string} value - Status attribute
     */
    set status(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.STATUS, value);
    }

    /** Toggle the status attribute */
    toggleStatus() {
        this.status = this.status === "checked" ? "unchecked" : "checked";
    }

    /** Set the status attribute for the children elements
     * @param {string} status - Status attribute
     */
    #setChildrenStatus(status) {
        if (!this.children || !status) return;

        // Set the status attribute for the children elements
        this.children.forEach(child => child.status = status === "checked" ? "checked" : "unchecked");
    }

    /** Check the children elements status attribute value */
    #checkChildrenStatus() {
        if (!this.children) return;

        // Check the children elements status attribute
        const numberChildren = this.children.length;
        const childrenStatus = this.children.map(child => child.status)
        let numberChildrenChecked = childrenStatus.reduce((acc, value) => {
            if (value === "checked") return acc + 1;
            return acc
        }, 0)

        // Set the checked attribute value
        if (numberChildrenChecked === 0) this.status = "unchecked";
        else if (numberChildrenChecked === numberChildren) this.status = "checked";
        else this.status = "indeterminate";
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

    /** Get icon padding attribute
     * @returns {string} - Icon padding attribute
     */
    get iconPadding() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.ICON_PADDING);
    }

    /** Set icon padding attribute
     * @param {string} value - Icon padding attribute
     */
    set iconPadding(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.ICON_PADDING, value);
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

    /** Private method to set the status attribute
     * @param {string} status - Status attribute value
     */
    #setStatus(status) {
        if (!status) return

        // Update the icon element
        if (status === "unchecked")
            this.onBuilt = () => this.iconElement.hide = "true";

        else if (status === "checked")
            this.onBuilt = () => {
                this.iconElement.hide = "false";
                this.iconElement.icon = "check-mark";
            }

        else if (status === "indeterminate")
            this.onBuilt = () => {
                this.iconElement.hide = "false";
                this.iconElement.icon = "indeterminate";
            }

        else {
            this.logger.error(`Invalid status attribute value: ${status}`);
            return;
        }

        // Update the children elements
        if (status !== "indeterminate" && this.children)
            this.#setChildrenStatus(status);

        // Trigger parent element to check children status
        if (this.parentElement) this.parentElement.#checkChildrenStatus();
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
            this.onBuilt = () => this.iconElement.width = width;
    }

    /** Private method to set the icon height
     * @param {string} height - Icon height attribute value
     */
    #setIconHeight(height) {
        if (height)
            this.onBuilt = () => this.iconElement.height = height;
    }

    /** Private method to set the icon fill color
     * @param {string} fill - Icon fill attribute value
     */
    #setIconFill(fill) {
        if (fill)
            this.onBuilt = () => this.iconElement.fill = fill;
    }

    /** Private method to set the icon padding
     * @param {string} padding - Icon padding attribute value
     */
    #setIconPadding(padding) {
        if (padding)
            this.onBuilt = () => this.iconElement.padding = padding;
    }

    /** Private method to set the icon animation duration
     * @param {string} duration - Icon animation duration attribute value
     */
    #setIconAnimationDuration(duration) {
        if (duration)
            this.onBuilt = () => this.iconElement.animationDuration = duration
    }

    /** Private method to set the icon checked animation
     * @param {string} animation - Icon checked animation attribute value
     */
    #setIconCheckedAnimation(animation) {
        if (animation)
            this.onBuilt = () => this.iconElement.showAnimation = animation;
    }

    /** Private method to set the icon unchecked animation
     * @param {string} animation - Icon unchecked animation attribute value
     */
    #setIconUncheckedAnimation(animation) {
        if (animation)
            this.onBuilt = () => this.iconElement.hidingAnimation = animation;
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
        this.onBuilt = () => {
            if (hide === 'true' || hide === '')
                this.labelContainerElement.classList.add(SIRIUS_ELEMENT.CLASSES.HIDDEN);
            else
                this.labelContainerElement.classList.remove(SIRIUS_ELEMENT.CLASSES.HIDDEN);
        }
    }

    /** Private method to set the label caption
     * @param {string} caption - Label caption attribute value
     */
    #setLabelCaption(caption) {
        if (caption)
            this.onBuilt = () => this.labelElement.caption = caption;
    }

    /** Private method to set the label caption background color
     * @param {string} color - Label caption background color attribute value
     */
    #setLabelCaptionBackgroundColor(color) {
        if (color)
            this.onBuilt = () => this.labelElement.captionBackgroundColor = color;
    }

    /** Private method to set the label caption color
     * @param {string} color - Label caption color attribute value
     */
    #setLabelCaptionColor(color) {
        if (color)
            this.onBuilt = () => this.labelElement.captionColor = color;
    }

    /** Private method to set the label caption font family
     * @param {string} fontFamily - Label caption font family attribute value
     */
    #setLabelCaptionFontFamily(fontFamily) {
        if (fontFamily)
            this.onBuilt = () => this.labelElement.captionFontFamily = fontFamily;
    }

    /** Private method to set the label caption font size
     * @param {string} fontSize - Label caption font size attribute value
     */
    #setLabelCaptionFontSize(fontSize) {
        if (fontSize)
            this.onBuilt = () => this.labelElement.captionFontSize = fontSize;
    }

    /** Private method to set the label caption padding
     * @param {string} padding - Label caption padding attribute value
     */
    #setLabelCaptionPadding(padding) {
        if (padding)
            this.onBuilt = () => this.labelElement.captionPadding = padding;
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

    /** Set the events property to the icon element
     * @param {object} events - Events property
     */
    set events(events) {
        if (!events)
            return

        // Add the events property to the element when built
        this.onBuilt = () => this.iconElement.events = events;
    }

    /** Add checkbox children elements
     * @param {SiriusCheckbox} elements - Children elements
     */
    addChildrenElements(...elements) {
        if (!elements)
            return
    
        elements.forEach(element => {
            if (!element) return;
            
            // Check if it's a checkbox element
            if (!(element instanceof SiriusCheckbox)) {
                this.logger.error("Element is not a SiriusCheckbox element");
                return;
            }
    
            // Check if the parent element is already set
            if (element.#parentElement !== null) {
                element.logger.error(`Parent element already set for element with id ${element.id}. Remove the current parent element before setting a new one.`);
                return;
            }
    
            // Check if the element is already a child
            if (this.#children.includes(element)) {
                this.logger.error(`Element with id ${element.id} is already a child of parent with id ${this.id}.`);
                return;
            }
            
            // Set the parent element and add the child element
            element.#parentElement = this;
            this.#children.push(element);

        });
    }

    /** Remove checkbox children elements
     * @param {SiriusCheckbox} elements - Children elements
     */
    removeChildrenElements(...elements) {
        if (!elements) return;

        elements.forEach(element => {
            if (!element) return;

            // Check if it's a checkbox element
            if (!(element instanceof SiriusCheckbox)) {
                this.logger.error("Element is not a SiriusCheckbox element");
                return;
            }

            // Check if the parent element is the current element
            if (element.#parentElement !== this) {
                this.logger.error(`Parent element is not the current element. Cannot remove the child element '${element.id}'`);
                return;
            }

            // Remove the parent element and remove the child element
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

            case SIRIUS_CHECKBOX_ATTRIBUTES.STATUS:
                this.#setStatus(formattedValue);
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

            case SIRIUS_CHECKBOX_ATTRIBUTES.ICON_PADDING:
                this.#setIconPadding(formattedValue);
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
            
            case SIRIUS_CHECKBOX_ATTRIBUTES.DATA_CHILDREN:
                const children=document.getElementById(formattedValue)
                                
                this.addChildrenElements(children)
                break;

            default:
                this._onInjectedLogger = () => this.logger.error(`Unregistered attribute: ${name}`);
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
        const iconId = this._getDerivedId("icon")
        const labelId = this._getDerivedId("label")

        // Get the required keys
        const idKey = SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID
        const hideKey = SIRIUS_ELEMENT_ATTRIBUTES.HIDE
        const iconKey = SIRIUS_ICON_ATTRIBUTES.ICON
        const statusKey = SIRIUS_CHECKBOX_ATTRIBUTES.STATUS

        // Create SiriusIcon element
        this.#iconElement = new SiriusIcon({
            [idKey]: iconId,
            [iconKey]: "check-mark",
            [hideKey]: SIRIUS_CHECKBOX_ATTRIBUTES_DEFAULT[statusKey] === "unchecked" ? "true" : "false"
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
        this.#iconContainerElement = this.#checkboxContainerElement.firstElementChild;
        this.#labelContainerElement = this.#checkboxContainerElement.lastElementChild;
        this.shadowRoot.appendChild(this.containerElement);

        // Add icon and label to the checkbox container
        this.#iconContainerElement.appendChild(this.iconElement);
        this.#labelContainerElement.appendChild(this.labelElement);

        // Add event listeners
        this.iconElement.events = {
            "click": () => this.toggleStatus()
        }

        // Dispatch the built event
        this.dispatchBuiltEvent();
    }
}

// Register custom element
customElements.define(SIRIUS_CHECKBOX.TAG, SiriusCheckbox);