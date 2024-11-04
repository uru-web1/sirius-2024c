import {SIRIUS_ELEMENT_ATTRIBUTES, SiriusElement} from "./SiriusElement.js";
import {changeSvgElementInnerHTML, getSvgElementWithCSS, SIRIUS_ICONS} from "./SiriusSvg.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Sirius icon constants */
export const SIRIUS_ICON = deepFreeze({
    NAME: "SiriusIcon",
    TAG: "sirius-icon",
    CSS_VARS: {
        SVG_WIDTH: '--svg-width',
        SVG_HEIGHT: '--svg-height',
        SVG_FILL: '--svg-fill',
        ANIMATION_DURATION: '--animation-duration',
        ICON_ROTATION: '--icon-rotation',
    },
    CLASSES: {
        ICON_CONTAINER: 'icon-container',
        SVG_CONTAINER: 'svg-container',
        DISABLED: 'disabled',
    }
})

/** Sirius icon attributes */
export const SIRIUS_ICON_ATTRIBUTES = deepFreeze({
    ICON: "icon",
    ICON_WIDTH: "icon-width",
    ICON_HEIGHT: "icon-height",
    ICON_FILL: "icon-fill",
    ICON_ROTATION: "icon-rotation",
    SHOW_ANIMATION: 'show-animation',
    HIDING_ANIMATION: 'hiding-animation',
    ANIMATION_DURATION: 'animation-duration',
})

/** Sirius icon attributes default values
 * If an attribute is not present in the object, the default value is null
 * */
export const SIRIUS_ICON_ATTRIBUTES_DEFAULT = deepFreeze({
    [SIRIUS_ICON_ATTRIBUTES.ICON]: SIRIUS_ICONS.WARNING,
    [SIRIUS_ICON_ATTRIBUTES.ICON_ROTATION]: null,
    [SIRIUS_ICON_ATTRIBUTES.ICON_WIDTH]: null,
    [SIRIUS_ICON_ATTRIBUTES.ICON_HEIGHT]: null,
    [SIRIUS_ICON_ATTRIBUTES.ICON_FILL]: null,
    [SIRIUS_ICON_ATTRIBUTES.ANIMATION_DURATION]: null,
    [SIRIUS_ICON_ATTRIBUTES.SHOW_ANIMATION]: null,
    [SIRIUS_ICON_ATTRIBUTES.HIDING_ANIMATION]: null,
})

/** Sirius rotation constants */
export const SIRIUS_ICON_ROTATION = deepFreeze({
    RIGHT: 'right',
    DOWN: 'down',
    LEFT: 'left',
    UP: 'up'
})

/** Sirius rotation degrees */
export const SIRIUS_ICON_ROTATION_DEGREES = deepFreeze({
    [SIRIUS_ICON_ROTATION.RIGHT]: 0,
    [SIRIUS_ICON_ROTATION.DOWN]: 90,
    [SIRIUS_ICON_ROTATION.LEFT]: 180,
    [SIRIUS_ICON_ROTATION.UP]: 270,
})

/** Sirius class that represents an icon component */
export class SiriusIcon extends SiriusElement {
    #iconContainerElement = null
    #svgContainerElement = null
    #svgElement = null
    #iconName = ''
    #iconRotation = ''

    /**
     * Create a Sirius icon element
     * @param {object} properties - Element properties
     */
    constructor(properties) {
        super(properties, SIRIUS_ICON.NAME);

        // Load SiriusIcon attributes
        this._loadAttributes({
            instanceProperties: properties,
            attributes: SIRIUS_ICON_ATTRIBUTES,
            attributesDefault: SIRIUS_ICON_ATTRIBUTES_DEFAULT
        });
    }

    /** Define observed attributes
     * @returns {string[]} - Observed attributes
     * */
    static get observedAttributes() {
        return [...SiriusElement.observedAttributes, ...Object.values(SIRIUS_ICON_ATTRIBUTES)]
    }

    /** Get icon container element */
    get iconContainerElement() {
        return this.#iconContainerElement;
    }

    /** Get SVG container element */
    get svgContainerElement() {
        return this.#svgContainerElement;
    }

    /** Get icon SVG element */
    get svgElement() {
        return this.#svgElement;
    }

    /** Get current icon attribute value
     * @returns {string|null} - Icon name
     * */
    get iconName() {
        this.getAttribute(SIRIUS_ICON_ATTRIBUTES.ICON);
    }

    /** Set the icon name
     * @param {string} name - Icon name
     */
    set iconName(name) {
        this.setAttribute(SIRIUS_ICON_ATTRIBUTES.ICON, name)
    }

    /** Get the icon rotation
     * @returns {string|null} - Rotation direction
     */
    get iconRotation() {
        return this.getAttribute(SIRIUS_ICON_ATTRIBUTES.ICON_ROTATION);
    }

    /** Set the icon rotation
     * @param {string} rotate - Rotation direction
     */
    set iconRotation(rotate) {
        this.setAttribute(SIRIUS_ICON_ATTRIBUTES.ICON_ROTATION, rotate);
    }

    /** Get the icon width
     * @returns {string} - Icon width
     */
    get iconWidth() {
        return this.getAttribute(SIRIUS_ICON_ATTRIBUTES.ICON_WIDTH);
    }

    /** Set the icon width
     * @param {string} width - Icon width
     */
    set iconWidth(width) {
        this.setAttribute(SIRIUS_ICON_ATTRIBUTES.ICON_WIDTH, width);
    }

    /** Get the icon height
     * @returns {string} - Icon height
     */
    get iconHeight() {
        return this.getAttribute(SIRIUS_ICON_ATTRIBUTES.ICON_HEIGHT);
    }

    /** Set the icon height
     * @param {string} height - Icon height
     */
    set iconHeight(height) {
        this.setAttribute(SIRIUS_ICON_ATTRIBUTES.ICON_HEIGHT, height);
    }

    /** Get the icon fill color
     * @returns {string} - Icon fill color
     */
    get iconFill() {
        return this.getAttribute(SIRIUS_ICON_ATTRIBUTES.ICON_FILL);
    }

    /** Set the icon fill color
     * @param {string} fill - Icon fill color
     */
    set iconFill(fill) {
        this.setAttribute(SIRIUS_ICON_ATTRIBUTES.ICON_FILL, fill);
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

    /** Get show animation keyframe rules
     * @returns {string} - Show animation keyframe rules
     */
    get showAnimation() {
        return this.getAttribute(SIRIUS_ICON_ATTRIBUTES.SHOW_ANIMATION);
    }

    /** Set show animation keyframe rules
     * @param {string} rules - Show animation keyframe rules
     */
    set showAnimation(rules) {
        this.setAttribute(SIRIUS_ICON_ATTRIBUTES.SHOW_ANIMATION, rules);
    }

    /** Get hiding animation keyframe rules
     * @returns {string} - Hiding animation keyframe rules
     */
    get hidingAnimation() {
        return this.getAttribute(SIRIUS_ICON_ATTRIBUTES.HIDING_ANIMATION);
    }

    /** Set hiding animation keyframe rules
     * @param {string} rules - Hiding animation keyframe rules
     */
    set hidingAnimation(rules) {
        this.setAttribute(SIRIUS_ICON_ATTRIBUTES.HIDING_ANIMATION, rules);
    }

    /** Added on built icon container element callback
     * @param {function(HTMLElement): void} callback - On built callback
     */
    set _onBuiltIconContainerElement(callback) {
        this._onBuiltContainerElement = callback
    }

    /** Added on built SVG container element callback
     * @param {function(HTMLElement): void} callback - On built callback
     */
    set _onBuiltSvgContainerElement(callback) {
        this.onBuilt = () => {
            if (this._checkElement(this.svgContainerElement))
                callback(this.svgContainerElement)
        }
    }

    /** Added on built SVG element callback
     * @param {function(HTMLElement): void} callback - On built callback
     */
    set _onBuiltSvgElement(callback) {
        this.onBuilt = () => {
            if (this._checkSVGElement(this.svgElement))
                callback(this.svgElement)
        }
    }

    /** Get the SVG CSS variables
     * @returns {{width: string, height: string, fill: string}} - CSS variables
     * */
    get iconCSSVariables() {
        const cssVars = SIRIUS_ICON.CSS_VARS

        return {
            width: cssVars.SVG_WIDTH,
            height: cssVars.SVG_HEIGHT,
            fill: cssVars.SVG_FILL,
        }
    }

    /** Private method to set the icon name and rotation
     * @param {string} name - Icon name
     */
    #setIconName(name) {
        this._onBuiltSvgElement = (element) => {
            // Get the icon and rotate key
            const iconKey = SIRIUS_ICON_ATTRIBUTES.ICON
            const rotateKey = SIRIUS_ICON_ATTRIBUTES.ICON_ROTATION

            // Get the icon fields
            const iconFields = name?.split('--') || [];

            // Get the icon name
            this.#iconName = iconFields[0] || SIRIUS_ICON_ATTRIBUTES_DEFAULT[iconKey];

            // Get the icon rotation
            this.#iconRotation = iconFields[1] || SIRIUS_ICON_ATTRIBUTES_DEFAULT[rotateKey];

            // Change the SVG element inner HTML
            changeSvgElementInnerHTML(element, this.#iconName);

            // Set the icon rotation
            if (this.#iconRotation !== null)
                this.iconRotation = this.#iconRotation;
        }
    }

    /** Get rotation degrees
     * @param {string} rotate - Rotation direction
     * @returns {number|null} - Rotation degrees or null
     * */
    #getRotationDegrees(rotate) {
        // Get the rotation degrees based on the rotation direction
        for (let rotationKey of Object.values(SIRIUS_ICON_ROTATION))
            if (rotationKey === rotate)
                return SIRIUS_ICON_ROTATION_DEGREES[rotate];

        // Try to parse the rotation as a number
        const degrees = parseInt(rotate)
        if (!isNaN(degrees)) return degrees

        return null
    }

    /** Private method to set the icon rotation
     * @param {string} rotate - Rotation direction
     */
    #setIconRotation(rotate) {
        // Get the icon rotation degrees
        const degrees = this.#getRotationDegrees(rotate)
        if (degrees === null) return

        // Log the rotation
        this.logger.log(`Setting rotation to ${degrees} degrees`)

        // Set the icon rotation
        this._setCSSVariable(SIRIUS_ICON.CSS_VARS.ICON_ROTATION, `${degrees}deg`)
    }

    /** Private method to set the icon width
     * @param {string} width - Icon width
     */
    #setIconWidth(width) {
        if (width)
            this._setCSSVariable(SIRIUS_ICON.CSS_VARS.SVG_WIDTH, width);
    }

    /** Private method to set the icon height
     * @param {string} height - Icon height
     */
    #setIconHeight(height) {
        if (height)
            this._setCSSVariable(SIRIUS_ICON.CSS_VARS.SVG_HEIGHT, height);
    }

    /** Private method to set the icon fill color
     * @param {string} fill - Icon fill color
     */
    #setIconFill(fill) {
        if (fill)
            this._setCSSVariable(SIRIUS_ICON.CSS_VARS.SVG_FILL, fill);
    }

    /** Private method to set the icon animation duration
     * @param {string} duration - Icon animation duration
     */
    #setAnimationDuration(duration) {
        if (duration)
            this._setCSSVariable(SIRIUS_ICON.CSS_VARS.ANIMATION_DURATION, duration);
    }

    /** Private method to set the show animation rules
     * @param {string} rules - Show animation keyframe rules
     */
    #setShowAnimation(rules) {
        if (rules)
            this._setKeyframeRules(SIRIUS_ICON_ATTRIBUTES.SHOW_ANIMATION, rules);
    }

    /** Private method to set the hiding animation rules
     * @param {string} rules - Hiding animation keyframe rules
     */
    #setHidingAnimation(rules) {
        if (rules)
            this._setKeyframeRules(SIRIUS_ICON_ATTRIBUTES.HIDING_ANIMATION, rules);
    }

    /** Protected method to set style attribute
     * @param {string} style - Style attribute value
     */
    #setStyle(style) {
        if (!style)
            return

        // Add the style attribute to the element when built
        this._setStyle(() => {
            this._onBuiltSvgContainerElement = (element) => element.style.cssText = String(style)
        })
    }

    /** Set hidden/shown class
     * @param {string} hide - True if the element will be hidden
     * */
    #setHidden(hide) {
        this._onBuiltSvgContainerElement = (element) => {
            if (hide === 'true' || hide === '')
                this._hide('animationend', element)
            else
                this._show(element)
        }
    }

    /** Private method to set the icon disabled state
     * @param {string} disable - Icon disabled state
     */
    #setDisabled(disable) {
        this._onBuiltIconContainerElement = (element) => {
            if (disable === 'true' || disable === '')
                element.classList.add(SIRIUS_ICON.CLASSES.DISABLED);
            else
                element.classList.remove(SIRIUS_ICON.CLASSES.DISABLED);
        }
    }

    /** Get the icon SVG element
     * @param {string} fill - Icon fill color CSS variable
     * @returns {string} - Icon SVG element
     * */
    #getSvgElement(fill) {
        // Get the icon key, the default icon SVG name and the icon options
        const iconKey = SIRIUS_ICON_ATTRIBUTES.ICON;
        const def = SIRIUS_ICON_ATTRIBUTES_DEFAULT[iconKey];
        const options = {
            width: "100%",
            height: "100%",
            fill: this._formatCSSVariable(fill)
        };

        // Get the icon SVG element
        return getSvgElementWithCSS(this.iconName, options) || getSvgElementWithCSS(def, options);
    }

    /** Get the template for the Sirius icon
     * @returns {string} - Template
     * */
    #getTemplate() {
        // Get CSS variables
        const {width, height, fill} = this.iconCSSVariables;

        // Get the icon classes
        const iconContainerClasses = [SIRIUS_ICON.CLASSES.ICON_CONTAINER];
        const svgContainerClasses = [SIRIUS_ICON.CLASSES.SVG_CONTAINER];

        // Generate the icon container style
        const style = `height: var(${height}); width: var(${width});`;

        return `<div class='${iconContainerClasses.join(' ')}' style="${style}"">
                    <div class='${svgContainerClasses.join(' ')}'>
                        ${this.#getSvgElement(fill)}
                    </div>
                </div>`;
    }

    /** Add/remove hidden class */
    toggleHidden() {
        this.hidden = (this.hidden === 'true' || this.hidden === '') ? 'false' : 'true';
    }

    /** Attribute change callback
     * @param {string} name - Attribute name
     * @param {string} oldValue - Old attribute value
     * @param {string} newValue - New attribute
     * */
    attributeChangedCallback(name, oldValue, newValue) {
        // Check if the attribute value has changed
        if (oldValue === newValue)
            return

        // Check if is the style attribute and the style is being applied
        if (name === SIRIUS_ELEMENT_ATTRIBUTES.STYLE && this._applyingStyle) {
            this._applyingStyle = false;
            return;
        }

        // Log the attribute change
        this.logger.log(`'${name}' attribute changed: ${oldValue} -> ${newValue}`);

        switch (name) {
            case SIRIUS_ELEMENT_ATTRIBUTES.STYLE:
                this.#setStyle(newValue);
                break;

            case SIRIUS_ELEMENT_ATTRIBUTES.HIDE:
                this.#setHidden(newValue);
                break;

            case SIRIUS_ELEMENT_ATTRIBUTES.DISABLED:
                this.#setDisabled(newValue);
                break;

            case SIRIUS_ICON_ATTRIBUTES.ICON:
                this.#setIconName(newValue);
                break;

            case SIRIUS_ICON_ATTRIBUTES.ICON_ROTATION:
                this.#setIconRotation(newValue);
                break;

            case SIRIUS_ICON_ATTRIBUTES.ICON_WIDTH:
                this.#setIconWidth(newValue);
                break;

            case SIRIUS_ICON_ATTRIBUTES.ICON_HEIGHT:
                this.#setIconHeight(newValue);
                break;

            case SIRIUS_ICON_ATTRIBUTES.ICON_FILL:
                this.#setIconFill(newValue);
                break;

            case SIRIUS_ICON_ATTRIBUTES.HIDE:
                this.#setHidden(newValue);
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

            case SIRIUS_ICON_ATTRIBUTES.ANIMATION_DURATION:
                this.#setAnimationDuration(newValue);
                break;

            default:
                this.logger.error(`Unregistered attribute: ${name}`);
                break;
        }
    }

    /** Lifecycle method called when the component is connected to the DOM
     */
    async connectedCallback() {
        // Load the CSS style sheets and add them to the shadow DOM
        await this._loadAndAdoptStyles();

        // Get HTML inner content
        const innerHTML = this.#getTemplate();

        // Create the HTML template
        await this._createTemplate(innerHTML);

        // Add icon to the shadow DOM
        this.#iconContainerElement = this._containerElement = this._templateContent.firstChild;
        this.#svgContainerElement = this.#iconContainerElement.firstElementChild;
        this.#svgElement = this.#svgContainerElement.firstElementChild;
        this.shadowRoot.appendChild(this._containerElement);

        // Dispatch the built event
        this.dispatchBuiltEvent();
    }
}

// Register custom element
customElements.define(SIRIUS_ICON.TAG, SiriusIcon);