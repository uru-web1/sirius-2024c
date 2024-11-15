import {
    SIRIUS_ELEMENT,
    SIRIUS_ELEMENT_ATTRIBUTES,
    SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES,
    SiriusElement
} from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";
import {SIRIUS_ICON_ATTRIBUTES, SiriusIcon} from "./SiriusIcon.js";
import sirius from "./Sirius.js";

/** Sirius checkbox constants */
export const SIRIUS_CHECKBOX = deepFreeze({
    NAME: "SiriusCheckbox",
    TAG: "sirius-checkbox",
    CSS_VARIABLES: {
        GAP: '--sirius-checkbox--container-gap',
        PADDING: "--sirius-checkbox--container-padding",
        BACKGROUND_COLOR: "--sirius-checkbox--container-background-color",
        CHECKBOX_ORDER: "--sirius-checkbox--order",
        CHECKBOX_BACKGROUND_COLOR: "--sirius-checkbox--background-color",
        CHECKBOX_BORDER_COLOR: "--sirius-checkbox--border-color",
        CHECKBOX_BORDER_LINE_STYLE: "--sirius-checkbox--border-line-style",
        CHECKBOX_BORDER_RADIUS: "--sirius-checkbox--border-radius",
        CHECKBOX_BORDER_WIDTH: "--sirius-checkbox--border-width",
    },
    SLOTS: {
        LABEL: "label"
    },
    CLASSES: {
        CHECKBOX_CONTAINER: 'checkbox-container',
        ICON_CONTAINER: 'icon-container',
        LABEL_CONTAINER: 'label-container',
        LABEL: 'label',
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
    PARENT_ID: 'parent-id'
})

/** Sirius checkbox default values */
export const SIRIUS_CHECKBOX_ATTRIBUTES_DEFAULT = deepFreeze({
    [SIRIUS_CHECKBOX_ATTRIBUTES.STATUS]: "unchecked",
    [SIRIUS_CHECKBOX_ATTRIBUTES.ICON_PADDING]: "2px",
})

/** Sirius class that represents a checkbox component */
export class SiriusCheckbox extends SiriusElement {
    #parentElement = null;
    #children = []
    #checkboxContainerElement = null;
    #labelContainerElement = null;
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
        return Object.freeze([...this.#children]);
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

    /** Set parent ID attribute
     * @param {string} value - Parent ID attribute
     */
    set parentId(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.PARENT_ID, value);
    }

    /** Get parent ID attribute
     * @returns {string} - Parent ID attribute
     */
    get parentId() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.PARENT_ID);
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
            this._setCSSVariable(SIRIUS_CHECKBOX.CSS_VARIABLES.GAP, gap);
    }

    /** Private method to set the padding attribute
     * @param {string} padding - Padding attribute value
     */
    #setPadding(padding) {
        if (padding)
            this._setCSSVariable(SIRIUS_CHECKBOX.CSS_VARIABLES.PADDING, padding);
    }

    /** Private method to set the background color attribute
     * @param {string} backgroundColor - Background color attribute value
     */
    #setBackgroundColor(backgroundColor) {
        if (backgroundColor)
            this._setCSSVariable(SIRIUS_CHECKBOX.CSS_VARIABLES.BACKGROUND_COLOR, backgroundColor);
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
            this._setCSSVariable(SIRIUS_CHECKBOX.CSS_VARIABLES.CHECKBOX_ORDER, order);
    }

    /** Private method to set the checkbox background color
     * @param {string} color - Checkbox background color attribute value
     */
    #setCheckboxBackgroundColor(color) {
        if (color)
            this._setCSSVariable(SIRIUS_CHECKBOX.CSS_VARIABLES.CHECKBOX_BACKGROUND_COLOR, color);
    }

    /** Private method to set the checkbox border color
     * @param {string} color - Checkbox border color attribute value
     */
    #setCheckboxBorderColor(color) {
        if (color)
            this._setCSSVariable(SIRIUS_CHECKBOX.CSS_VARIABLES.CHECKBOX_BORDER_COLOR, color);
    }

    /** Private method to set the checkbox border line style
     * @param {string} style - Checkbox border line style attribute value
     */
    #setCheckboxBorderLineStyle(style) {
        if (style)
            this._setCSSVariable(SIRIUS_CHECKBOX.CSS_VARIABLES.CHECKBOX_BORDER_LINE_STYLE, style);
    }

    /** Private method to set the checkbox border radius
     * @param {string} radius - Checkbox border radius attribute value
     */
    #setCheckboxBorderRadius(radius) {
        if (radius)
            this._setCSSVariable(SIRIUS_CHECKBOX.CSS_VARIABLES.CHECKBOX_BORDER_RADIUS, radius);
    }

    /** Private method to set the checkbox border width
     * @param {string} width - Checkbox border width attribute value
     */
    #setCheckboxBorderWidth(width) {
        if (width)
            this._setCSSVariable(SIRIUS_CHECKBOX.CSS_VARIABLES.CHECKBOX_BORDER_WIDTH, width);
    }

    /** Private method to the parent ID
     * @param {string} parentId - Parent ID attribute value
     */
    #setParentId(parentId) {
        if (!parentId) {
            this.#removeParentElement()
            return
        }

        this.onBuilt = () => {
            const parent = sirius.getInstance(parentId);

            // Check if the parent element exists
            if (!parent) {
                this.logger.error(`Parent with ID '${parentId}' not found`);
                return;
            }

            // Check if it's a checkbox element
            if (!(parent instanceof SiriusCheckbox)) {
                this.logger.error("Element is not a SiriusCheckbox element");
                return;
            }

            // Check if the parent element to set is the current parent element
            if (this.#parentElement === parent)
                return

            // Remove the current parent element
            if (this.#parentElement)
                this.#removeParentElement()

            // Add the parent element
            this.#addParentElement(parent);
        }
    }

    /** Private method to add the parent element
     * @param {SiriusCheckbox} parent - Parent element
     * */
    #addParentElement(parent) {
        this.#parentElement = parent;
        parent.#children.push(this);
    }

    /** Private method to remove the parent element */
    #removeParentElement() {
        this.#parentElement.#children = this.#children.filter(child => child !== this);
        this.#parentElement = null;
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

    /** Set the label element
     * @param {HTMLElement} label - Label element
     */
    set label(label) {
        if (label)
            this.onBuilt = () => {
                label.slot = SIRIUS_CHECKBOX.SLOTS.LABEL
                this.labelContainerElement.appendChild(label)
            }
    }

    /** Clear the label slot */
    clearLabel() {
        this.onBuilt = () => this.#labelContainerElement.innerHTML = "";
    }

    /** Get the template for the Sirius checkbox
     * @returns {string} - Template
     */
    #getTemplate() {
        // Get the checkbox classes
        const checkboxContainerClasses = [SIRIUS_CHECKBOX.CLASSES.CHECKBOX_CONTAINER];
        const iconContainerClasses = [SIRIUS_CHECKBOX.CLASSES.ICON_CONTAINER];
        const labelContainerClasses = [SIRIUS_CHECKBOX.CLASSES.LABEL_CONTAINER]
        const labelClasses = [SIRIUS_CHECKBOX.CLASSES.LABEL]

        return `<div class="${checkboxContainerClasses.join(' ')}">
                    <div class="${iconContainerClasses.join(' ')}">
                    </div>
                    <div class="${labelContainerClasses.join(' ')}">
                        <slot name="${SIRIUS_CHECKBOX.SLOTS.LABEL}" class="${labelClasses.join(' ')}"></slot>
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

            case SIRIUS_CHECKBOX_ATTRIBUTES.PARENT_ID:
                this.#setParentId(formattedValue);
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
            attributesDefault: SIRIUS_CHECKBOX_ATTRIBUTES_DEFAULT
        });

        // Create the CSS style sheets and add them to the shadow DOM
        await this._loadAndAdoptStyles();

        // Create derived IDs
        const iconId = this._getDerivedId("icon")

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