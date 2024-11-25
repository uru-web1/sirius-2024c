import {
    SIRIUS_ELEMENT,
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
    ICON_TRANSITION_DURATION: "icon-transition-duration",
    ICON_ANIMATION_DURATION: 'icon-animation-duration',
    ICON_CHECKED_ANIMATION: "icon-checked-animation",
    ICON_UNCHECKED_ANIMATION: "icon-unchecked-animation",
    ICON_STYLES: "icon-styles",
    ICON_STYLES_ON_HOVER: "icon-styles-on-hover",
    ICON_STYLES_ON_ACTIVE: "icon-styles-on-active",
    CHECKBOX_ORDER: "checkbox-order",
})

/** SiriusCheckbox default values */
export const SIRIUS_CHECKBOX_ATTRIBUTES_DEFAULT = deepFreeze({})

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
     * @param {HTMLElement} parent - Parent element
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
        const iconContainerClasses = [SIRIUS_ELEMENT.CLASSES.MAIN_ELEMENT, SIRIUS_CHECKBOX.CLASSES.ICON_CONTAINER];
        const labelContainerClasses = [SIRIUS_CHECKBOX.CLASSES.LABEL_CONTAINER]
        const labelClasses = [SIRIUS_CHECKBOX.CLASSES.LABEL]

        return `<div class="${checkboxContainerClasses.join(' ')}">
                    <div class="${iconContainerClasses.join(' ')}">
                    </div>
                    <div class="${labelContainerClasses.join(' ')}">
                        <slot name="${SIRIUS_CHECKBOX.SLOTS.LABEL}" class="${labelClasses.join(' ')}">
                        </slot>
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
            [hideKey]: hide
        })

        // Get HTML inner content
        const innerHTML = this.#getTemplate();

        // Create the list box container element
        const container = await this._createContainerElementTemplate(innerHTML);
        this.#checkboxContainerElement = this._containerElement = container
        this.#iconContainerElement = this.checkboxContainerElement.firstElementChild;
        this.#labelContainerElement = this.checkboxContainerElement.lastElementChild;
        this.#labelSlotElement = this.labelContainerElement.firstElementChild

        // Add icon and label to the checkbox container
        this.#iconContainerElement.appendChild(this.iconElement);

        // Add event listener to the icon container element
        this.#iconContainerElement.addEventListener("click", this.toggleStatus.bind(this));

        // Add the container element to the shadow DOM
        this.shadowRoot.appendChild(this.containerElement);

        // Set properties
        this.events = this._events
        this.children = this._children
        this.label = this.#label

        // Dispatch the built event
        this._dispatchBuiltEvent();
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

    /** Get icon transition duration attribute
     * @returns {string} - Icon transition duration attribute
     */
    get iconTransitionDuration() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.ICON_TRANSITION_DURATION);
    }

    /** Set icon transition duration attribute
     * @param {string} value - Icon transition duration attribute
     */
    set iconTransitionDuration(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.ICON_TRANSITION_DURATION, value);
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

    /** Set icon styles attribute
     * @param {string} value - Icon styles attribute
     */
    set iconStyles(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.ICON_STYLES, value);
    }

    /** Get icon styles attribute
     * @returns {string} - Icon styles attribute
     */
    get iconStyles() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.ICON_STYLES);
    }

    /** Get icon styles on hover attribute
     * @returns {string} - Icon styles on hover attribute
     */
    get iconStylesOnHover() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.ICON_STYLES_ON_HOVER);
    }

    /** Set icon styles on hover attribute
     * @param {string} value - Icon styles on hover attribute
     */
    set iconStylesOnHover(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.ICON_STYLES_ON_HOVER, value);
    }

    /** Get icon styles on active attribute
     * @returns {string} - Icon styles on active attribute
     */
    get iconStylesOnActive() {
        return this.getAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.ICON_STYLES_ON_ACTIVE);
    }

    /** Set icon styles on active attribute
     * @param {string} value - Icon styles on active attribute
     */
    set iconStylesOnActive(value) {
        this.setAttribute(SIRIUS_CHECKBOX_ATTRIBUTES.ICON_STYLES_ON_ACTIVE, value);
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
            this._setElementCSSVariable(SIRIUS_CHECKBOX.CSS_VARIABLES.GAP, gap);
    }

    /** Private method to set the padding attribute
     * @param {string} padding - Padding attribute value
     */
    #setPadding(padding) {
        if (padding)
            this._setElementCSSVariable(SIRIUS_CHECKBOX.CSS_VARIABLES.PADDING, padding);
    }

    /** Private method to set the background color attribute
     * @param {string} backgroundColor - Background color attribute value
     */
    #setBackgroundColor(backgroundColor) {
        if (backgroundColor)
            this._setElementCSSVariable(SIRIUS_CHECKBOX.CSS_VARIABLES.BACKGROUND_COLOR, backgroundColor);
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

    /** Private method to set the icon transition duration
     * @param {string} duration - Icon transition duration attribute value
     */
    #setIconTransitionDuration(duration) {
        if (duration)
            this.onBuilt = () => this.iconElement.transitionDuration = duration;
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

    /** Private method to set the icon styles
     * @param {string} styles - Icon styles attribute value
     */
    #setIconStyles(styles) {
        if (styles)
            this.onBuilt = () => this.iconElement.styles = styles;
    }

    /** Private method to set the icon styles on hover
     * @param {string} styles - Icon styles on hover attribute value
     */
    #setIconStylesOnHover(styles) {
        if (styles)
            this.onBuilt = () => this.iconElement.stylesOnHover = styles;
    }

    /** Private method to set the icon styles on active
     * @param {string} styles - Icon styles on active attribute value
     */
    #setIconStylesOnActive(styles) {
        if (styles)
            this.onBuilt = () => this.iconElement.stylesOnActive = styles;
    }

    /** Private method to set the checkbox order
     * @param {string} order - Checkbox order attribute value
     */
    #setCheckboxOrder(order) {
        if (order)
            this._setElementCSSVariable(SIRIUS_CHECKBOX.CSS_VARIABLES.CHECKBOX_ORDER, order);
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

            case SIRIUS_CHECKBOX_ATTRIBUTES.ICON_TRANSITION_DURATION:
                this.#setIconTransitionDuration(newValue);
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

            case SIRIUS_CHECKBOX_ATTRIBUTES.ICON_STYLES:
                this.#setIconStyles(newValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.ICON_STYLES_ON_HOVER:
                this.#setIconStylesOnHover(newValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.ICON_STYLES_ON_ACTIVE:
                this.#setIconStylesOnActive(newValue);
                break;

            case SIRIUS_CHECKBOX_ATTRIBUTES.CHECKBOX_ORDER:
                this.#setCheckboxOrder(newValue);
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

            label.setAttribute("slot", SIRIUS_CHECKBOX.SLOTS.LABEL)
            this.appendChild(label)
        }
    }

    /** Clear the label slot element */
    clearLabelSlotElement() {
        this.labelSlotElement.innerHTML = "";
    }
}

// Register custom element
customElements.define(SIRIUS_CHECKBOX.TAG, SiriusCheckbox);