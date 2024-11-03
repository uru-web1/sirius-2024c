import {SIRIUS_ELEMENT, SIRIUS_ELEMENT_ATTRIBUTES, SIRIUS_TYPES, SiriusElement} from "./SiriusElement.js";
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
    ICON_ROTATE: "icon-rotate",
    SHOW_ANIMATION: 'show-animation',
    HIDING_ANIMATION: 'hiding-animation',
    ANIMATION_DURATION: 'animation-duration',
    DISABLED: 'disabled'
})

/** Sirius icon attributes details */
export const SIRIUS_ICON_ATTRIBUTES_DETAILS = deepFreeze({
    [SIRIUS_ICON_ATTRIBUTES.ICON]: {DEFAULT: SIRIUS_ICONS.WARNING, TYPE: SIRIUS_TYPES.STRING},
    [SIRIUS_ICON_ATTRIBUTES.ICON_WIDTH]: {DEFAULT: "24px", TYPE: SIRIUS_TYPES.STRING},
    [SIRIUS_ICON_ATTRIBUTES.ICON_HEIGHT]: {DEFAULT: "24px", TYPE: SIRIUS_TYPES.STRING},
    [SIRIUS_ICON_ATTRIBUTES.ICON_FILL]: {DEFAULT: "red", TYPE: SIRIUS_TYPES.STRING},
    [SIRIUS_ICON_ATTRIBUTES.ICON_ROTATE]: {DEFAULT: "right", TYPE: SIRIUS_TYPES.STRING},
    [SIRIUS_ICON_ATTRIBUTES.SHOW_ANIMATION]: {DEFAULT: '', TYPE: SIRIUS_TYPES.STRING},
    [SIRIUS_ICON_ATTRIBUTES.HIDING_ANIMATION]: {DEFAULT: '', TYPE: SIRIUS_TYPES.STRING},
    [SIRIUS_ICON_ATTRIBUTES.ANIMATION_DURATION]: {DEFAULT: '500ms', TYPE: SIRIUS_TYPES.STRING},
    [SIRIUS_ICON_ATTRIBUTES.DISABLED]: {DEFAULT: false, TYPE: SIRIUS_TYPES.BOOLEAN},
})

/** Sirius rotation constants */
export const SIRIUS_ICON_ROTATION = deepFreeze({
    RIGHT: 'right',
    DOWN: 'down',
    LEFT: 'left',
    UP: 'up'
})

/** Sirius rotation details */
export const SIRIUS_ICON_ROTATION_DETAILS = deepFreeze({
    [SIRIUS_ICON_ROTATION.RIGHT]: {DEG: 0},
    [SIRIUS_ICON_ROTATION.DOWN]: {DEG: 90},
    [SIRIUS_ICON_ROTATION.LEFT]: {DEG: 180},
    [SIRIUS_ICON_ROTATION.UP]: {DEG: 270},
})

/** Sirius class that represents an icon component */
export class SiriusIcon extends SiriusElement {
    #iconContainerElement = null
    #svgElement = null
    #iconName = null
    #iconRotation = null

    /**
     * Create a Sirius icon element
     * @param {object} props - Element properties
     */
    constructor(props) {
        super(props, SIRIUS_ICON.NAME);

        // Load attributes
        this._loadAttributes({
            attributes: SIRIUS_ICON_ATTRIBUTES,
            attributesDetails: SIRIUS_ICON_ATTRIBUTES_DETAILS,
            properties: props
        });
    }

    /** Define observed attributes
     * @returns {string[]} - Observed attributes
     * */
    static get observedAttributes() {
        return Object.values(SIRIUS_ICON_ATTRIBUTES)
    }

    /** Get icon container element */
    get iconContainerElement() {
        return this.#iconContainerElement;
    }

    /** Get icon SVG element */
    get svgElement() {
        return this.#svgElement;
    }

    /** Set icon SVG element */
    set svgElement(svgElement) {
        this.#iconContainerElement.innerHTML = svgElement
        this.#svgElement = svgElement
    }

    /** Get current icon attribute value
     * @returns {string|null} - Icon name
     * */
    get iconName() {
        // Check if the icon name and rotation are set
        if (!this.#iconName)
            this._loadIconNameAndRotation();

        return this.#iconName;
    }

    /** Get the icon rotation
     * @returns {string|null} - Rotation direction
     */
    get iconRotation() {
        if (!this.#iconRotation)
            this._loadIconNameAndRotation()

        return this.#iconRotation;
    }

    /** Get hidden icon state
     * @returns {boolean} - True if the icon is hidden
     */
    get hidden() {
        return this._hidden;
    }

    /** Set hidden icon state
     * @param {boolean} hide - True if the icon will be hidden
     */
    set hidden(hide) {
        this.setHidden(hide);
    }

    /** Added on built icon container element callback
     * @param {(HTMLElement)=>{}} callback - On built callback
     */
    set _onBuiltIconContainerElement(callback) {
        this.onBuilt = () => {
            if (this._checkElement(this.iconContainerElement))
                callback(this.iconContainerElement)
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

    /** Load icon name and rotation attributes */
    _loadIconNameAndRotation() {
        // Get the icon and rotate key
        const iconKey = SIRIUS_ICON_ATTRIBUTES.ICON
        const rotateKey = SIRIUS_ICON_ATTRIBUTES.ICON_ROTATE

        // Get the icon fields
        const iconFields = this._attributes[iconKey]?.split('--') || [];

        // Get the icon name
        this.#iconName = iconFields[0] || SIRIUS_ICON_ATTRIBUTES_DETAILS[iconKey].DEFAULT;

        // Get the icon rotation
        this.#iconRotation = iconFields[1] || SIRIUS_ICON_ATTRIBUTES_DETAILS[rotateKey].DEFAULT;
    }

    /** Get rotation degrees
     * @param {string} rotate - Rotation direction
     * @returns {number} - Rotation degrees
     * */
    #getRotationDegrees(rotate) {
        // Get the rotation key and default value
        const rotateKey = SIRIUS_ELEMENT_ATTRIBUTES.ICON_ROTATE
        const def = SIRIUS_ICON_ATTRIBUTES_DETAILS[rotateKey]?.DEFAULT

        // Check the rotation direction
        if (!rotate)
            return this.#getRotationDegrees(def);

        // Get the rotation degrees based on the rotation direction
        for (let rotationKey of Object.values(SIRIUS_ICON_ROTATION))
            if (rotationKey === rotate)
                return SIRIUS_ICON_ROTATION_DETAILS[rotate].DEG;

        // Try to parse the rotation as a number
        const degrees = parseInt(rotate)
        if (!isNaN(degrees)) return degrees

        // Log an error if the rotation is invalid
        this.logger.error(`Invalid rotation: ${rotate}`)

        // Return the default rotation degrees
        return this.#getRotationDegrees(def)
    }

    /** Set icon rotation
     * @param {string} rotate - Rotation direction
     * */
    #setIconRotation(rotate) {
        // Get the icon
        const degrees = this.#getRotationDegrees(rotate)

        // Log the rotation
        this.logger.log(`Setting rotation to ${degrees} degrees`)

        // Set the icon direction
        this._onBuiltContainerElement = (element) => {
            element.style.transform = `rotate(${degrees}deg)`
        }
    }

    /** Set icon name and rotation attributes
     * @param {string} name - Icon name
     */
    _setIconNameAndRotation(name) {
        // Get the icon key
        const iconKey = SIRIUS_ICON_ATTRIBUTES.ICON

        // Set icon attribute
        this.setAttribute(iconKey, name)

        // Load the icon name and rotation
        this._loadIconNameAndRotation()
    }

    /** Change icon SVG content
     * @param {string} name - Icon name
     */
    changeIconContent(name) {
        // Set the icon attributes
        this._setIconNameAndRotation(name);

        // Change the SVG element inner HTML
        changeSvgElementInnerHTML(this.svgElement, name);

        // Set the icon rotation
        this.#setIconRotation(this.iconRotation);
    }

    /** Get the icon SVG element
     * @param {string} fill - Icon fill color CSS variable
     * @returns {string} - Icon SVG element
     * */
    #getSvgElement(fill) {
        // Get the icon key, the default icon SVG name and the icon options
        const iconKey = SIRIUS_ICON_ATTRIBUTES.ICON;
        const def = SIRIUS_ICON_ATTRIBUTES_DETAILS[iconKey].DEFAULT;
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

    /** Set the show icon as disabled */
    setDisabled() {
        this.containerElement.classList.add(SIRIUS_ICON.CLASSES.DISABLED);
    }

    /** Set the show icon as enabled */
    setEnabled() {
        this.containerElement.classList.remove(SIRIUS_ICON.CLASSES.DISABLED);
    }

    /** Set hidden/shown class
     * @param {boolean} hide - True if the element will be hidden
     * */
    setHidden(hide) {
        this._onBuiltIconContainerElement = (element) => {
            if (hide)
                this.hide('animationend', element)
            else
                this.show(element)
        }
    }

    /** Add/remove hidden class */
    toggleHidden() {
        this.setHidden(!this._hidden);
    }

    /** Attribute change callback
     * @param {string} name - Attribute name
     * @param {string} oldValue - Old attribute value
     * @param {string} newValue - New attribute
     * */
    attributeChangedCallback(name, oldValue, newValue) {
        // Format the attribute value and update the attribute
        // newValue = this._formatAttributeValue(newValue);

        // Check if the attribute value has changed
        if (oldValue === newValue)
            return

        // Log the attribute change
        this.logger.log(`'${name}' attribute changed: ${oldValue} -> ${newValue}`);

        // Get attribute details
        const details = SIRIUS_ICON_ATTRIBUTES_DETAILS[name]

        // Validate attribute
        this._validateAttribute({
            name,
            value: newValue,
            types: details.TYPE,
            def: details.DEFAULT,
        })

        switch (name) {
            case SIRIUS_ELEMENT_ATTRIBUTES.STYLE:
                this.style = {style: newValue, element: this.containerElement};
                break;

            case SIRIUS_ELEMENT_ATTRIBUTES.EVENTS:
                this.events = {events: newValue, element: this.containerElement};
                break;

            case SIRIUS_ICON_ATTRIBUTES.ICON:
                this._loadIconNameAndRotation()
                break;

            case SIRIUS_ICON_ATTRIBUTES.ICON_ROTATE:
                this.#setIconRotation(newValue);
                break;

            case SIRIUS_ICON_ATTRIBUTES.ICON_WIDTH:
                this._updateCSSVariable(SIRIUS_ICON.CSS_VARS.SVG_WIDTH, newValue);
                break;

            case SIRIUS_ICON_ATTRIBUTES.ICON_HEIGHT:
                this._updateCSSVariable(SIRIUS_ICON.CSS_VARS.SVG_HEIGHT, newValue);
                break;

            case SIRIUS_ICON_ATTRIBUTES.ICON_FILL:
                this._updateCSSVariable(SIRIUS_ICON.CSS_VARS.SVG_WIDTH, newValue);
                break;

            case SIRIUS_ICON_ATTRIBUTES.HIDE:
                this.hidden = newValue === 'true';
                break;

            case SIRIUS_ICON_ATTRIBUTES.DISABLED:
                if (newValue)
                    this.setDisabled();
                else
                    this.setEnabled();
                break;

            case SIRIUS_ICON_ATTRIBUTES.SHOW_ANIMATION:
            case SIRIUS_ICON_ATTRIBUTES.HIDING_ANIMATION:
                // Set the show/hiding animation keyframe
                this.keyframeRules = {
                    styleSheetName: SIRIUS_ELEMENT.STYLE_SHEETS.ELEMENT,
                    keyframeName: name,
                    keyframeRules: newValue
                }
                break;

            case SIRIUS_ICON_ATTRIBUTES.ANIMATION_DURATION:
                this._updateCSSVariable(SIRIUS_ICON.CSS_VARS.ANIMATION_DURATION, newValue);
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
        this.containerElement = this._templateContent.firstChild;
        this.#iconContainerElement = this.containerElement.firstElementChild;
        this.#svgElement = this.#iconContainerElement.firstElementChild;
        this.shadowRoot.appendChild(this.containerElement);

        // Dispatch the built event
        this.dispatchBuiltEvent();
    }
}

// Register custom element
customElements.define(SIRIUS_ICON.TAG, SiriusIcon);