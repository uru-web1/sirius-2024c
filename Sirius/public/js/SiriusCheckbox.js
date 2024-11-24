import {
    SIRIUS_ELEMENT_ATTRIBUTES,
    SIRIUS_ELEMENT_PROPERTIES,
    SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES
} from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";
import SiriusIcon, {SIRIUS_ICON_ATTRIBUTES} from "./SiriusIcon.js";
import SiriusControlElement, {
    SIRIUS_CONTROL_ELEMENT_ATTRIBUTES,
    SIRIUS_CONTROL_ELEMENT_ATTRIBUTES_DEFAULT,
    SIRIUS_CONTROL_ELEMENT_STATUS
} from "./SiriusControlElement.js";
import {SIRIUS_SVG_ICONS} from "./SiriusSvg.js";

/** SiriusCheckbox constants */
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

/** SiriusCheckbox attributes */
export const SIRIUS_CHECKBOX_ATTRIBUTES = deepFreeze({
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
})

/** SiriusCheckbox default values */
export const SIRIUS_CHECKBOX_ATTRIBUTES_DEFAULT = deepFreeze({
    [SIRIUS_CHECKBOX_ATTRIBUTES.ICON_PADDING]: "2px",
})

/** SiriusCheckbox properties */
export const SIRIUS_CHECKBOX_PROPERTIES = deepFreeze({
    LABEL: 'label',
})

/** Sirius class that represents a checkbox component */
export default class SiriusCheckbox extends SiriusControlElement {
    // Container elements
    #checkboxContainerElement = null;
    #labelContainerElement = null;
    #iconContainerElement = null;

    // Slot elements
    #labelSlotElement = null

    // Main elements
    #iconElement = null;

    // Element properties
    #label = null

    /**
     * Create a SiriusCheckbox element
     * @param {Object} properties - SiriusCheckbox properties
     */
    constructor(properties) {
        super({...properties, [SIRIUS_ELEMENT_PROPERTIES.NAME]: SIRIUS_CHECKBOX.NAME});

        // Check if the properties contains the label
        const label = properties?.[SIRIUS_CHECKBOX_PROPERTIES.LABEL];
        if (label) this.#label = label;

        // Build the SiriusCheckbox
        this.#build(properties).then();
    }

    /** Define observed attributes */
    static get observedAttributes() {
        return [...SiriusControlElement.observedAttributes, ...Object.values(SIRIUS_CHECKBOX_ATTRIBUTES)];
    }

    /** Get the template for the SiriusCheckbox
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

    /** Build the SiriusCheckbox
     * @param {Object} properties - SiriusCheckbox properties
     * @returns {Promise<void>} - Promise that resolves when the SiriusCheckbox is built
     * */
    async #build(properties) {
        // Load SiriusCheckbox HTML attributes
        this._loadAttributes({
            instanceProperties: properties,
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
        const statusKey = SIRIUS_CONTROL_ELEMENT_ATTRIBUTES.STATUS
        const eventsKey = SIRIUS_ELEMENT_PROPERTIES.EVENTS

        // Check if the checkbox is hidden
        let hide
        if (SIRIUS_CONTROL_ELEMENT_ATTRIBUTES_DEFAULT[statusKey] === SIRIUS_CONTROL_ELEMENT_STATUS.UNCHECKED)
            hide = "true"
        else
            hide = "false"

        // Create SiriusIcon element
        this.#iconElement = new SiriusIcon({
            [idKey]: iconId,
            [iconKey]: SIRIUS_SVG_ICONS.CHECK_MARK,
            [hideKey]: hide,
            [eventsKey]: {
                "click": () => this.toggleStatus()
            }
        })

        // Get HTML inner content
        const innerHTML = this.#getTemplate();

        // Create the HTML template
        await this._createTemplate(innerHTML);

        // Add checkbox to the shadow DOM
        this.#checkboxContainerElement = this._containerElement = this._templateContent.firstChild;
        this.#iconContainerElement = this.#checkboxContainerElement.firstElementChild;
        this.#labelContainerElement = this.#checkboxContainerElement.lastElementChild;
        this.#labelSlotElement = this.#labelContainerElement.firstElementChild
        this.shadowRoot.appendChild(this.containerElement);

        // Add icon and label to the checkbox container
        this.#iconContainerElement.appendChild(this.iconElement);

        // Set properties
        this.events = this._events
        this.children = this._children
        this.label = this.#label

        // Dispatch the built event
        this.dispatchBuiltEvent();
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

    /** Get the label slot element
     * @returns {HTMLSlotElement|null} - Label container element
     */
    get labelSlotElement() {
        return this.#labelSlotElement;
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

    /** Protected method to handle the status attribute change to checked */
    _statusCheckedHandler() {
        this.onBuilt = () => {
            this.iconElement.hide = "false";
            this.iconElement.icon = SIRIUS_SVG_ICONS.CHECK_MARK;
        }
    }

    /** Protected method to handle the status attribute change to unchecked */
    _statusUncheckedHandler() {
        this.onBuilt = () => this.iconElement.hide = "true";
    }

    /** Protected method to handle the status attribute change to indeterminate */
    _statusIndeterminateHandler() {
        this.onBuilt = () => {
            this.iconElement.hide = "false";
            this.iconElement.icon = SIRIUS_SVG_ICONS.INDETERMINATE;
        }
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

            case SIRIUS_CONTROL_ELEMENT_ATTRIBUTES.PARENT_ID:
                this._setParentId(newValue);
                break

            case SIRIUS_CONTROL_ELEMENT_ATTRIBUTES.STATUS:
                this._setStatus(newValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.GAP:
                this.#setGap(newValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.PADDING:
                this.#setPadding(newValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.BACKGROUND_COLOR:
                this.#setBackgroundColor(newValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.ICON_WIDTH:
                this.#setIconWidth(newValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.ICON_HEIGHT:
                this.#setIconHeight(newValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.ICON_FILL:
                this.#setIconFill(newValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.ICON_ANIMATION_DURATION:
                this.#setIconAnimationDuration(newValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.ICON_CHECKED_ANIMATION:
                this.#setIconCheckedAnimation(newValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.ICON_UNCHECKED_ANIMATION:
                this.#setIconUncheckedAnimation(newValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.ICON_PADDING:
                this.#setIconPadding(newValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_ORDER:
                this.#setCheckboxOrder(newValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BACKGROUND_COLOR:
                this.#setCheckboxBackgroundColor(newValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BORDER_COLOR:
                this.#setCheckboxBorderColor(newValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BORDER_LINE_STYLE:
                this.#setCheckboxBorderLineStyle(newValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BORDER_RADIUS:
                this.#setCheckboxBorderRadius(newValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_BORDER_WIDTH:
                this.#setCheckboxBorderWidth(newValue);
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

    /** Set the events property to the icon element
     * @param {object} events - Events property
     */
    set events(events) {
        if (events)
            this.onBuilt = () => this.iconElement.events = events;
    }

    /** Get the label element
     * @returns {HTMLElement} - Label element
     */
    get label() {
        return this.#label;
    }

    /** Set the label element
     * @param {HTMLElement} label - Label element
     */
    set label(label) {
        if (!label) return

        // Check if the label is an instance of HTMLElement
        if (!(label instanceof HTMLElement)) {
            this.logger.error("Label must be an instance of HTMLElement")
            return
        }

        // Set the label element when built
        this.onBuilt = () => {
            // Clear the current label
            if (this.label)
                this.clearLabelSlotElement();

            // Set the label
            this.#label = label

            label.slot = SIRIUS_CHECKBOX.SLOTS.LABEL
            this.labelSlotElement.appendChild(label)
        }
    }

    /** Clear the label slot element */
    clearLabelSlotElement() {
        this.labelSlotElement.innerHTML = "";
    }
}

// Register custom element
customElements.define(SIRIUS_CHECKBOX.TAG, SiriusCheckbox);