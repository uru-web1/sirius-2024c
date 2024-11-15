import {SIRIUS_ELEMENT_ATTRIBUTES, SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES, SiriusElement} from "./SiriusElement.js";
import {SiriusSvg} from "./SiriusSvg.js";
import deepFreeze from "./utils/deep-freeze.js";
import {SIRIUS_CHECKBOX_ATTRIBUTES} from "./SiriusCheckbox.js";

/** Sirius icon constants */
export const SIRIUS_ICON = deepFreeze({
    NAME: "SiriusIcon",
    TAG: "sirius-icon",
    CSS_VARIABLES: {
        PADDING: "--sirius-icon--padding",
        WIDTH: '--sirius-icon--width',
        HEIGHT: '--sirius-icon--height',
        ANIMATION_DURATION: '--sirius-icon--animation-duration',
    },
    CLASSES: {
        ICON_CONTAINER: 'icon-container',
        SVG_ELEMENT: 'svg-element',
        DISABLED: 'disabled',
    }
})

/** Sirius icon attributes */
export const SIRIUS_ICON_ATTRIBUTES = deepFreeze({
    ICON: "icon",
    WIDTH: "width",
    HEIGHT: "height",
    FILL: "fill",
    SHOW_ANIMATION: 'show-animation',
    HIDING_ANIMATION: 'hiding-animation',
    ROTATION: "rotation",
    TRANSITION_DURATION: "transition-duration",
    ANIMATION_DURATION: 'animation-duration',
    PADDING: 'padding',
})

/** Sirius icon attributes default values
 * If an attribute is not present in the object, the default value is null
 * */
export const SIRIUS_ICON_ATTRIBUTES_DEFAULT = deepFreeze({
    [SIRIUS_ICON_ATTRIBUTES.WIDTH]: "24px",
    [SIRIUS_ICON_ATTRIBUTES.HEIGHT]: "24px",
})

/** Sirius class that represents an icon component */
export class SiriusIcon extends SiriusElement {
    #iconContainerElement = null
    #svgElement = null

    /**
     * Create a Sirius icon element
     * @param {object} properties - Element properties
     */
    constructor(properties) {
        super(properties, SIRIUS_ICON.NAME);

        // Build the SiriusIcon
        this.#build().then();
    }

    /** Define observed attributes
     * @returns {string[]} - Observed attributes
     * */
    static get observedAttributes() {
        return [...SiriusElement.observedAttributes, ...Object.values(SIRIUS_ICON_ATTRIBUTES)]
    }

    /** Build the SiriusIcon */
    async #build() {
        // Load SiriusIcon attributes
        this._loadAttributes({
            instanceProperties: this._properties,
            attributes: SIRIUS_ICON_ATTRIBUTES,
            attributesDefault: SIRIUS_ICON_ATTRIBUTES_DEFAULT
        });

        // Load the CSS style sheets and add them to the shadow DOM
        await this._loadAndAdoptStyles();

        // Create derived ID
        const svgId = this._getDerivedId("svg")

        // Get the required keys
        const idKey = SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID

        // Create SiriusSvg element
        this.#svgElement = new SiriusSvg({
            [idKey]: svgId
        })

        // Add the SVG element classes
        this.svgElement.classList.add(SIRIUS_ICON.CLASSES.SVG_ELEMENT);

        // Get HTML inner content
        const innerHTML = this.#getTemplate();

        // Create the HTML template
        await this._createTemplate(innerHTML);

        // Add icon to the shadow DOM
        this.#iconContainerElement = this._containerElement = this._templateContent.firstChild;
        this.shadowRoot.appendChild(this.containerElement);

        // Add the SVG element to the icon container
        this.iconContainerElement.appendChild(this.svgElement);

        // Dispatch the built event
        this.dispatchBuiltEvent();
    }

    /** Get icon container element
     * @returns {HTMLElement|null} - Icon container element
     * */
    get iconContainerElement() {
        return this.#iconContainerElement;
    }

    /** Get icon SVG element
     * @returns {SiriusSvg|null} - Icon SVG element
     * */
    get svgElement() {
        return this.#svgElement;
    }

    /** Get current icon name
     * @returns {string|null} - Icon name with/without rotation
     * */
    get icon() {
        this.getAttribute(SIRIUS_ICON_ATTRIBUTES.ICON);
    }

    /** Set the icon name
     * @param {string} name - Icon name with/without rotation
     */
    set icon(name) {
        this.setAttribute(SIRIUS_ICON_ATTRIBUTES.ICON, name)
    }

    /** Get the icon rotation
     * @returns {string|null} - Icon rotation direction
     */
    get rotation() {
        return this.getAttribute(SIRIUS_ICON_ATTRIBUTES.ROTATION);
    }

    /** Set the icon rotation
     * @param {string} rotate - Icon rotation direction
     */
    set rotation(rotate) {
        this.setAttribute(SIRIUS_ICON_ATTRIBUTES.ROTATION, rotate);
    }

    /** Get the icon width
     * @returns {string} - Icon width
     */
    get width() {
        return this.getAttribute(SIRIUS_ICON_ATTRIBUTES.WIDTH);
    }

    /** Set the icon width
     * @param {string} width - Icon width
     */
    set width(width) {
        this.setAttribute(SIRIUS_ICON_ATTRIBUTES.WIDTH, width);
    }

    /** Get the icon height
     * @returns {string} - Icon height
     */
    get height() {
        return this.getAttribute(SIRIUS_ICON_ATTRIBUTES.HEIGHT);
    }

    /** Set the icon height
     * @param {string} height - Icon height
     */
    set height(height) {
        this.setAttribute(SIRIUS_ICON_ATTRIBUTES.HEIGHT, height);
    }

    /** Get the icon fill color
     * @returns {string} - Icon fill color
     */
    get fill() {
        return this.getAttribute(SIRIUS_ICON_ATTRIBUTES.FILL);
    }

    /** Set the icon fill color
     * @param {string} fill - Icon fill color
     */
    set fill(fill) {
        this.setAttribute(SIRIUS_ICON_ATTRIBUTES.FILL, fill);
    }

    /** Get the transition duration
     * @returns {string} - Transition duration
     */
    get transitionDuration() {
        return this.getAttribute(SIRIUS_ICON_ATTRIBUTES.TRANSITION_DURATION);
    }

    /** Set the transition duration
     * @param {string} duration - Transition duration
     */
    set transitionDuration(duration) {
        this.setAttribute(SIRIUS_ICON_ATTRIBUTES.TRANSITION_DURATION, duration);
    }

    /** Get the icon animation duration
     * @returns {string} - Icon animation duration
     */
    get animationDuration() {
        return this.getAttribute(SIRIUS_ICON_ATTRIBUTES.ANIMATION_DURATION);
    }

    /** Set the icon animation duration
     * @param {string} duration - Icon animation duration
     */
    set animationDuration(duration) {
        this.setAttribute(SIRIUS_ICON_ATTRIBUTES.ANIMATION_DURATION, duration);
    }

    /** Get icon show animation keyframe rules
     * @returns {string} - Icon show animation keyframe rules
     */
    get showAnimation() {
        return this.getAttribute(SIRIUS_ICON_ATTRIBUTES.SHOW_ANIMATION);
    }

    /** Set icon show animation keyframe rules
     * @param {string} rules - Icon show animation keyframe rules
     */
    set showAnimation(rules) {
        this.setAttribute(SIRIUS_ICON_ATTRIBUTES.SHOW_ANIMATION, rules);
    }

    /** Get icon hiding animation keyframe rules
     * @returns {string} - Icon hiding animation keyframe rules
     */
    get hidingAnimation() {
        return this.getAttribute(SIRIUS_ICON_ATTRIBUTES.HIDING_ANIMATION);
    }

    /** Set icon hiding animation keyframe rules
     * @param {string} rules - Icon hiding animation keyframe rules
     */
    set hidingAnimation(rules) {
        this.setAttribute(SIRIUS_ICON_ATTRIBUTES.HIDING_ANIMATION, rules);
    }

    /** Get the icon padding
     * @returns {string} - Icon padding
     */
    get padding() {
        return this.getAttribute(SIRIUS_ICON_ATTRIBUTES.PADDING);
    }

    /** Set the icon padding
     * @param {string} padding - Icon padding
     */
    set padding(padding) {
        this.setAttribute(SIRIUS_ICON_ATTRIBUTES.PADDING, padding);
    }

    /** Private method to set the icon name
     * @param {string} name - Icon name with/without rotation
     */
    #setIcon(name) {
        if (name)
            this.onBuilt = () => this.svgElement.icon = name;
    }

    /** Private method to set the icon rotation
     * @param {string} rotate - Rotation direction
     */
    #setRotation(rotate) {
        if (rotate)
            this.onBuilt = () => this.svgElement.rotation = rotate;
    }

    /** Private method to set the icon width
     * @param {string} width - Icon width
     */
    #setWidth(width) {
        if (width) {
            this._setCSSVariable(SIRIUS_ICON.CSS_VARIABLES.WIDTH, width);
            this.onBuilt = () => this.svgElement.width = width;
        }
    }

    /** Private method to set the icon height
     * @param {string} height - Icon height
     */
    #setHeight(height) {
        if (height) {
            this._setCSSVariable(SIRIUS_ICON.CSS_VARIABLES.HEIGHT, height);
            this.onBuilt = () => this.svgElement.height = height;
        }
    }

    /** Private method to set the icon fill color
     * @param {string} fill - Icon fill color
     */
    #setFill(fill) {
        if (fill) this.onBuilt = () => this.svgElement.fill = fill;
    }

    /** Private method to set the icon transition duration
     * @param {string} duration - Transition duration
     */
    #setTransitionDuration(duration) {
        if (duration)
            this.onBuilt = () => this.svgElement.transitionDuration = duration;
    }

    /** Private method to set the icon animation duration
     * @param {string} duration - Icon animation duration
     */
    #setAnimationDuration(duration) {
        if (duration)
            this.onBuilt = () => this.svgElement.animationDuration = duration;
    }

    /** Private method to set the show animation rules
     * @param {string} rules - Show animation keyframe rules
     */
    #setShowAnimation(rules) {
        if (rules)
            this.onBuilt = () => this.svgElement.showAnimation = rules;
    }

    /** Private method to set the hiding animation rules
     * @param {string} rules - Hiding animation keyframe rules
     */
    #setHidingAnimation(rules) {
        if (rules)
            this.onBuilt = () => this.svgElement.hidingAnimation = rules;
    }

    /** Private method to set the icon padding
     * @param {string} padding - Icon padding
     */
    #setPadding(padding) {
        if (padding)
            this._setCSSVariable(SIRIUS_ICON.CSS_VARIABLES.PADDING, padding);
    }

    /** Private method to set the SVG container element style attribute
     * @param {string} style - Style attribute value
     */
    #setStyle(style) {
        if (style)
            this._setStyle = () => this._setStyleAttributes(style, this.iconContainerElement);
    }

    /** Private method to set the element hidden state
     * @param {string} hide - True if the element will be hidden
     * */
    #setHide(hide) {
        if (hide)
            this.onBuilt = () => this.svgElement.hide = hide;
    }

    /** Toggle the hide attribute */
    toggleHide() {
        this.hide = (this.hide === 'true' || this.hide === '') ? 'false' : 'true';
    }

    /** Private method to set the icon disabled state
     * @param {string} disable - Icon disabled state
     */
    #setDisabled(disable) {
        this.onBuilt = () => {
            if (disable === 'true' || disable === '')
                this.svgElement.classList.add(SIRIUS_ICON.CLASSES.DISABLED);
            else
                this.svgElement.classList.remove(SIRIUS_ICON.CLASSES.DISABLED);
        }
    }

    /** Set the events property to this
     * @param {object} events - Events property
     */
    set events(events) {
        if (events)
            this._setEvents(events, this);
    }

    /** Get the template for the Sirius icon
     * @returns {string} - Template
     * */
    #getTemplate() {
        // Get the icon classes
        const iconContainerClasses = [SIRIUS_ICON.CLASSES.ICON_CONTAINER];

        return `<div class="${iconContainerClasses.join(' ')}">
                </div>`;
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

            case SIRIUS_ELEMENT_ATTRIBUTES.HIDE:
                this.#setHide(newValue);
                break;

            case SIRIUS_ELEMENT_ATTRIBUTES.DISABLED:
                this.#setDisabled(newValue);
                break;

            case SIRIUS_ICON_ATTRIBUTES.ICON:
                this.#setIcon(newValue);
                break;

            case SIRIUS_ICON_ATTRIBUTES.ROTATION:
                this.#setRotation(newValue);
                break;

            case SIRIUS_ICON_ATTRIBUTES.WIDTH:
                this.#setWidth(newValue);
                break;

            case SIRIUS_ICON_ATTRIBUTES.HEIGHT:
                this.#setHeight(newValue);
                break;

            case SIRIUS_ICON_ATTRIBUTES.FILL:
                this.#setFill(newValue);
                break;

            case SIRIUS_ICON_ATTRIBUTES.DISABLED:
                this.#setDisabled(newValue);
                break;

            case SIRIUS_ICON_ATTRIBUTES.SHOW_ANIMATION:
                this.#setShowAnimation(newValue);
                break;

            case SIRIUS_ICON_ATTRIBUTES.HIDING_ANIMATION:
                this.#setHidingAnimation(newValue);
                break;

            case SIRIUS_ICON_ATTRIBUTES.TRANSITION_DURATION:
                this.#setTransitionDuration(newValue);
                break;

            case SIRIUS_ICON_ATTRIBUTES.ANIMATION_DURATION:
                this.#setAnimationDuration(newValue);
                break;

            case SIRIUS_ICON_ATTRIBUTES.PADDING:
                this.#setPadding(newValue);
                break;

            default:
                this._onInjectedLogger = () => this.logger.error(`Unregistered attribute: ${name}`);
                break;
        }
    }

    /** Attribute change callback
     * @param {string} name - Attribute name
     * @param {string} oldValue - Old attribute value
     * @param {string} newValue - New attribute
     * */
    attributeChangedCallback(name, oldValue, newValue) {
        // Call the attribute change pre-handler
        const {formattedValue, shouldContinue} = this._attributeChangePreHandler(name, oldValue, newValue);
        if (!shouldContinue) return;

        // Call the attribute changed handler
        this.onBuilt=()=>this.#attributeChangeHandler(name, oldValue, formattedValue);
    }
}

// Register custom element
customElements.define(SIRIUS_ICON.TAG, SiriusIcon);