import deepFreeze from "./utils/deep-freeze.js";
import {SIRIUS_ELEMENT_ATTRIBUTES, SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES, SiriusElement} from "./SiriusElement.js";

/** Sirius SVG constants */
export const SIRIUS_SVG = deepFreeze({
    NAME: "SiriusSvg",
    TAG: "sirius-svg",
    CSS_VARIABLES: {
        WIDTH: '--sirius-svg--width',
        HEIGHT: '--sirius-svg--height',
        FILL: '--sirius-svg--fill',
        ROTATION: '--sirius-svg--rotation',
        TRANSITION_DURATION: '--sirius-svg--transition-duration',
        ANIMATION_DURATION: '--sirius-svg--animation-duration',
    },
    CLASSES: {
        SVG_CONTAINER: 'svg-container',
    }
})

/** Sirius icons */
export const SIRIUS_SVG_ICONS = {
    ARROW: 'arrow',
    DOUBLE_ARROW: 'double-arrow',
    STAR: 'star',
    INDETERMINATE: "indeterminate",
    CHECK_MARK: "check-mark",
    WARNING: 'warning',
    CLOSE: 'close',
    HOME: 'home',
    EDIT: 'edit',
    MENU: 'menu',
    HELP: 'help',
    INFO: 'info',
    LOCATION: 'location',
    SETTINGS: 'settings',
    SEARCH: 'search',
    PERSON: 'person',
    RADIO_CHECKED: 'radio-checked',
    RADIO_UNCHECKED: 'radio-unchecked',
}

/** Sirius icons inner HTML */
export const SIRIUS_SVG_ICONS_INNER_HTML = {
    // Arrow icon
    [SIRIUS_SVG_ICONS.ARROW]:
        `<path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/>`,

    // Double arrow icon
    [SIRIUS_SVG_ICONS.DOUBLE_ARROW]:
        `<path d="m296-224-56-56 240-240 240 240-56 56-184-183-184 183Zm0-240-56-56 240-240 240 240-56 56-184-183-184 183Z"/>`,

    // Indeterminate icon
    [SIRIUS_SVG_ICONS.INDETERMINATE]:
        `<path d="M240-440v-80h480v80H240Z"/>`,

    // Star icon
    [SIRIUS_SVG_ICONS.STAR]:
        `<path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/>`,

    // Check icon
    [SIRIUS_SVG_ICONS.CHECK_MARK]:
        `<path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>`,

    // Warning icon
    [SIRIUS_SVG_ICONS.WARNING]:
        `<path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"/>`,

    // Close icon
    [SIRIUS_SVG_ICONS.CLOSE]:
        `<path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>`,

    // Edit icon
    [SIRIUS_SVG_ICONS.EDIT]:
        `<path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>`,

    // Help icon
    [SIRIUS_SVG_ICONS.HELP]:
        `<path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>`,

    // Home icon
    [SIRIUS_SVG_ICONS.HOME]:
        `<path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>`,

    // Information icon
    [SIRIUS_SVG_ICONS.INFO]:
        `<path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>`,

    // Location icon
    [SIRIUS_SVG_ICONS.LOCATION]:
        `<path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/>`,

    // Menu icon
    [SIRIUS_SVG_ICONS.MENU]:
        `<path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>`,

    // Person icon
    [SIRIUS_SVG_ICONS.PERSON]:
        `<path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>`,

    // Settings icon
    [SIRIUS_SVG_ICONS.SETTINGS]:
        `<path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>`,

    // Search icon
    [SIRIUS_SVG_ICONS.SEARCH]:
        `<path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>`,

    // Radio unchecked icon
    [SIRIUS_SVG_ICONS.RADIO_UNCHECKED]:
        `<path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>`,

    // Radio checked icon
    [SIRIUS_SVG_ICONS.RADIO_CHECKED]:
        `<path d="M480-280q83 0 141.5-58.5T680-480q0-83-58.5-141.5T480-680q-83 0-141.5 58.5T280-480q0 83 58.5 141.5T480-280Zm0 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>`,
}

/** Sirius SVG attributes */
export const SIRIUS_SVG_ATTRIBUTES = deepFreeze({
    ICON: 'icon',
    WIDTH: 'width',
    HEIGHT: 'height',
    FILL: 'fill',
    ROTATION: 'rotation',
    TRANSITION_DURATION: 'transition-duration',
    ANIMATION_DURATION: 'animation-duration',
    SHOW_ANIMATION: 'show-animation',
    HIDING_ANIMATION: 'hiding-animation',
})

/** Sirius SVG attributes default values
 * If an attribute is not present in the object, the default value is null
 * */
export const SIRIUS_SVG_ATTRIBUTES_DEFAULT = deepFreeze({
    [SIRIUS_SVG_ATTRIBUTES.ICON]: SIRIUS_SVG_ICONS.WARNING,
})

/** Sirius rotation constants */
export const SIRIUS_SVG_ROTATION = deepFreeze({
    RIGHT: 'right',
    DOWN: 'down',
    LEFT: 'left',
    UP: 'up'
})

/** Sirius rotation degrees */
export const SIRIUS_SVG_ROTATION_DEGREES = deepFreeze({
    [SIRIUS_SVG_ROTATION.RIGHT]: 90,
    [SIRIUS_SVG_ROTATION.DOWN]: 180,
    [SIRIUS_SVG_ROTATION.LEFT]: 270,
    [SIRIUS_SVG_ROTATION.UP]: 0,
})

/** Sirius class that represents the SVG icon */
export class SiriusSvg extends SiriusElement {
    #icon = null
    #rotation = null
    #svgContainerElement = null
    #svgElement = null

    /** Create a SiriusSvg element
     * @param {object} properties - Element properties
     * */
    constructor(properties) {
        super(properties, SIRIUS_SVG.NAME);
    }

    /** Define the observed attributes
     * @returns {string[]} - Observed attributes
     * */
    static get observedAttributes() {
        return [...SiriusElement.observedAttributes, ...Object.values(SIRIUS_SVG_ATTRIBUTES)];
    }

    /** Get the SVG container element
     * @returns {HTMLElement|null} - SVG container
     * */
    get svgContainerElement() {
        return this.#svgContainerElement;
    }

    /** Get the SVG element
     * @returns {SVGElement|null} - SVG element
     * */
    get svgElement() {
        return this.#svgElement;
    }

    /** Get the icon
     * @returns {string} - Icon with/without rotation
     * */
    get icon() {
        return this.getAttribute(SIRIUS_SVG_ATTRIBUTES.ICON);
    }

    /** Set the icon
     * @param {string} value - Icon with/without rotation
     */
    set icon(value) {
        this.setAttribute(SIRIUS_SVG_ATTRIBUTES.ICON, value)
    }

    /** Get the width
     * @returns {string} - Width
     * */
    get width() {
        return this.getAttribute(SIRIUS_SVG_ATTRIBUTES.WIDTH);
    }

    /** Set the width
     * @param {string} value - Width
     */
    set width(value) {
        this.setAttribute(SIRIUS_SVG_ATTRIBUTES.WIDTH, value);
    }

    /** Get the height
     * @returns {string} - Height
     */
    get height() {
        return this.getAttribute(SIRIUS_SVG_ATTRIBUTES.HEIGHT);
    }

    /** Set the height
     * @param {string} value - Height
     */
    set height(value) {
        this.setAttribute(SIRIUS_SVG_ATTRIBUTES.HEIGHT, value);
    }

    /** Get the fill
     * @returns {string} - Fill
     */
    get fill() {
        return this.getAttribute(SIRIUS_SVG_ATTRIBUTES.FILL);
    }

    /** Set the fill
     * @param {string} value - Fill
     */
    set fill(value) {
        this.setAttribute(SIRIUS_SVG_ATTRIBUTES.FILL, value);
    }

    /** Get the rotation
     * @returns {string} - Rotation
     */
    get rotation() {
        return this.getAttribute(SIRIUS_SVG_ATTRIBUTES.ROTATION);
    }

    /** Set the rotation
     * @param {string} value - Rotation
     * */
    set rotation(value) {
        this.setAttribute(SIRIUS_SVG_ATTRIBUTES.ROTATION, value);
    }

    /** Get the transition duration
     * @returns {string} - Transition duration
     */
    get transitionDuration() {
        return this.getAttribute(SIRIUS_SVG_ATTRIBUTES.TRANSITION_DURATION);
    }

    /** Set the transition duration
     * @param {string} value - Transition duration
     */
    set transitionDuration(value) {
        this.setAttribute(SIRIUS_SVG_ATTRIBUTES.TRANSITION_DURATION, value);
    }

    /** Get the animation duration
     * @returns {string} - Animation duration
     */
    get animationDuration() {
        return this.getAttribute(SIRIUS_SVG_ATTRIBUTES.ANIMATION_DURATION);
    }

    /** Set the animation duration
     * @param {string} value - Animation duration
     */
    set animationDuration(value) {
        this.setAttribute(SIRIUS_SVG_ATTRIBUTES.ANIMATION_DURATION, value);
    }

    /** Get the show animation
     * @returns {string} - Show animation
     */
    get showAnimation() {
        return this.getAttribute(SIRIUS_SVG_ATTRIBUTES.SHOW_ANIMATION);
    }

    /** Set the show animation
     * @param {string} value - Show animation
     */
    set showAnimation(value) {
        this.setAttribute(SIRIUS_SVG_ATTRIBUTES.SHOW_ANIMATION, value);
    }

    /** Get the hiding animation
     * @returns {string} - Hiding animation
     */
    get hidingAnimation() {
        return this.getAttribute(SIRIUS_SVG_ATTRIBUTES.HIDING_ANIMATION);
    }

    /** Set the hiding animation
     * @param {string} value - Hiding animation
     */
    set hidingAnimation(value) {
        this.setAttribute(SIRIUS_SVG_ATTRIBUTES.HIDING_ANIMATION, value);
    }

    /** Private method to set the icon name and rotation
     * @param {string} name - Icon name with/without rotation
     */
    #setIcon(name) {
        if (!name) return

        this.onBuilt = () => {
            // Get the icon and rotate key
            const iconKey = SIRIUS_SVG_ATTRIBUTES.ICON

            // Get the icon fields
            const iconFields = name?.split('--') || [];

            // Get the icon name
            this.#icon = iconFields[0] || SIRIUS_SVG_ATTRIBUTES_DEFAULT[iconKey];

            // Get the rotation
            this.#rotation = iconFields[1];

            // Update the SVG element inner HTML
            this.onBuilt = () => this.svgElement.innerHTML = this.#getSvgInnerHtml(this.#icon);

            // Set the rotation
            if (this.#rotation !== null && this.#rotation !== undefined)
                this.rotation = this.#rotation;
        }
    }

    /** Private method to set the SVG width
     * @param {string} width - SVG width
     */
    #setWidth(width) {
        if (width)
            this._setCSSVariable(SIRIUS_SVG.CSS_VARIABLES.WIDTH, width);
    }

    /** Private method to set the SVG height
     * @param {string} height - SVG height
     */
    #setHeight(height) {
        if (height)
            this._setCSSVariable(SIRIUS_SVG.CSS_VARIABLES.HEIGHT, height);
    }

    /** Private method to set the SVG fill color
     * @param {string} fill - SVG fill color
     */
    #setFill(fill) {
        if (fill)
            this._setCSSVariable(SIRIUS_SVG.CSS_VARIABLES.FILL, fill);
    }

    /** Get rotation degrees
     * @param {string} rotate - Rotation direction or degrees
     * @returns {number|null} - Rotation degrees or null
     * */
    #getRotationDegrees(rotate) {
        // Get the rotation degrees based on the rotation direction
        for (let rotationKey of Object.values(SIRIUS_SVG_ROTATION))
            if (rotationKey === rotate)
                return SIRIUS_SVG_ROTATION_DEGREES[rotate];

        // Try to parse the rotation as a number
        const degrees = parseInt(rotate)
        if (!isNaN(degrees)) return degrees

        return null
    }

    /** Private method to set the SVG rotation
     * @param {string} rotate - Rotation direction or degrees
     */
    #setRotation(rotate) {
        if (!rotate) return

        // Get the icon rotation degrees
        const degrees = this.#getRotationDegrees(rotate)
        if (degrees === null) return

        // Log the rotation
        this.logger.log(`Setting rotation to ${degrees} degrees`)

        // Set the icon rotation
        this._setCSSVariable(SIRIUS_SVG.CSS_VARIABLES.ROTATION, `${degrees}deg`)
    }

    /** Private method to set the transition duration
     * @param {string} duration - Transition duration
     */
    #setTransitionDuration(duration) {
        if (duration)
            this._setCSSVariable(SIRIUS_SVG.CSS_VARIABLES.TRANSITION_DURATION, duration);
    }

    /** Private method to set the animation duration
     * @param {string} duration - Animation duration
     */
    #setAnimationDuration(duration) {
        if (duration)
            this._setCSSVariable(SIRIUS_SVG.CSS_VARIABLES.ANIMATION_DURATION, duration);
    }

    /** Private method to set the show animation rules
     * @param {string} rules - Show animation keyframe rules
     */
    #setShowAnimation(rules) {
        if (rules)
            this._setKeyframeRules(SIRIUS_SVG_ATTRIBUTES.SHOW_ANIMATION, rules);
    }

    /** Private method to set the hiding animation rules
     * @param {string} rules - Hiding animation keyframe rules
     */
    #setHidingAnimation(rules) {
        if (rules)
            this._setKeyframeRules(SIRIUS_SVG_ATTRIBUTES.HIDING_ANIMATION, rules);
    }

    /** Private method to set the element hidden state
     * @param {string} hide - True if the element will be hidden
     * */
    #setHide(hide) {
        if (hide === 'true' || hide === '')
            this._hide('animationend')
        else
            this._show()
    }

    /** Get SVG element inner HTML
     * @param {string} icon - Icon name
     */
    #getSvgInnerHtml(icon) {
        return SIRIUS_SVG_ICONS_INNER_HTML[icon] || SIRIUS_SVG_ICONS_INNER_HTML[SIRIUS_SVG_ATTRIBUTES_DEFAULT[SIRIUS_SVG_ATTRIBUTES.ICON]]
    }

    /** Get the template for the Sirius SVG
     * @returns {string} - Template
     */
    #getTemplate() {
        // Get the SVG container element classes
        const svgContainerClasses = [SIRIUS_SVG.CLASSES.SVG_CONTAINER];

        // Get the icon
        const icon = this.icon || SIRIUS_SVG_ATTRIBUTES_DEFAULT[SIRIUS_SVG_ATTRIBUTES.ICON];

        return `<div class="${svgContainerClasses.join(' ')}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                        ${this.#getSvgInnerHtml(icon)}
                    </svg>
                </div>`;
    }

    /** Attribute changed callback
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

            case SIRIUS_ELEMENT_ATTRIBUTES.HIDE:
                this.#setHide(formattedValue);
                break;

            case SIRIUS_SVG_ATTRIBUTES.ICON:
                this.#setIcon(formattedValue);
                break;

            case SIRIUS_SVG_ATTRIBUTES.WIDTH:
                this.#setWidth(formattedValue);
                break;

            case SIRIUS_SVG_ATTRIBUTES.HEIGHT:
                this.#setHeight(formattedValue);
                break;

            case SIRIUS_SVG_ATTRIBUTES.FILL:
                this.#setFill(formattedValue);
                break;

            case SIRIUS_SVG_ATTRIBUTES.ROTATION:
                this.#setRotation(formattedValue);
                break;

            case SIRIUS_SVG_ATTRIBUTES.TRANSITION_DURATION:
                this.#setTransitionDuration(formattedValue);
                break;

            case SIRIUS_SVG_ATTRIBUTES.ANIMATION_DURATION:
                this.#setAnimationDuration(formattedValue);
                break;

            case SIRIUS_SVG_ATTRIBUTES.SHOW_ANIMATION:
                this.#setShowAnimation(formattedValue);
                break;

            case SIRIUS_SVG_ATTRIBUTES.HIDING_ANIMATION:
                this.#setHidingAnimation(formattedValue);
                break;

            default:
                this._onInjectedLogger = () => this.logger.error(`Unregistered attribute: ${name}`);
                break;
        }
    }

    /** Lifecycle method called when the component is connected to the DOM */
    async connectedCallback() {
        // Call the parent connected callback
        await super.connectedCallback()

        // Load Sirius Label attributes
        this._loadAttributes({
            instanceProperties: this._properties,
            attributes: SIRIUS_SVG_ATTRIBUTES,
            attributesDefault: SIRIUS_SVG_ATTRIBUTES_DEFAULT
        });

        // Create the CSS stylesheet and add it to the shadow DOM
        await this._loadAndAdoptStyles()

        // Get HTML inner content
        const innerHTML = this.#getTemplate();

        // Create the HTML template
        await this._createTemplate(innerHTML);

        // Add SVG to the shadow DOM
        this.#svgContainerElement = this._containerElement = this._templateContent.firstChild;
        this.#svgElement = this.svgContainerElement.firstElementChild;
        this.shadowRoot.appendChild(this.containerElement);

        // Dispatch the built event
        this.dispatchBuiltEvent();
    }
}

// Define the custom element
customElements.define(SIRIUS_SVG.TAG, SiriusSvg);
