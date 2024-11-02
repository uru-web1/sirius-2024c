import {
    SIRIUS_ELEMENT,
    SIRIUS_ELEMENT_ATTRIBUTES,
    SIRIUS_ELEMENT_ATTRIBUTES_DETAILS,
    SIRIUS_TYPES,
    SiriusElement
} from "./SiriusElement.js";
import {changeSvgElementInnerHTML, getSvgElement, SIRIUS_ICONS} from "./SiriusSvg.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Sirius icon constants */
export const SIRIUS_ICON = deepFreeze({
    NAME: "SiriusIcon",
    TAG: "sirius-icon",
    CSS_VARS: {
        SVG_WIDTH: '--svg-width',
        SVG_HEIGHT: '--svg-height',
        SVG_FILL: '--svg-fill',
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
    HIDE: 'hide',
    DISABLED: 'disabled'
})

/** Sirius icon attributes details */
export const SIRIUS_ICON_ATTRIBUTES_DETAILS = deepFreeze({
    [SIRIUS_ICON_ATTRIBUTES.ICON]: {DEFAULT: SIRIUS_ICONS.WARNING, TYPE: SIRIUS_TYPES.STRING},
    [SIRIUS_ICON_ATTRIBUTES.ICON_WIDTH]: {DEFAULT: "24px", TYPE: SIRIUS_TYPES.STRING},
    [SIRIUS_ICON_ATTRIBUTES.ICON_HEIGHT]: {DEFAULT: "24px", TYPE: SIRIUS_TYPES.STRING},
    [SIRIUS_ICON_ATTRIBUTES.ICON_FILL]: {DEFAULT: "red", TYPE: SIRIUS_TYPES.STRING},
    [SIRIUS_ICON_ATTRIBUTES.ICON_ROTATE]:  {DEFAULT: "right", TYPE: SIRIUS_TYPES.STRING},
    [SIRIUS_ICON_ATTRIBUTES.SHOW_ANIMATION]: {DEFAULT: '', TYPE: SIRIUS_TYPES.STRING},
    [SIRIUS_ICON_ATTRIBUTES.HIDING_ANIMATION]: {DEFAULT: '', TYPE: SIRIUS_TYPES.STRING},
    [SIRIUS_ICON_ATTRIBUTES.HIDE]: {DEFAULT: false, TYPE: SIRIUS_TYPES.BOOLEAN},
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
    #hidden = false
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
            attributesDetails: SIRIUS_ELEMENT_ATTRIBUTES_DETAILS,
            properties: props
        });
    }

    /** Define observed attributes
     * @returns {string[]} - Observed attributes
     * */
    static get observedAttributes() {
        return SIRIUS_ICON_ATTRIBUTES
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

    /** Load icon name and rotation attributes */
    _loadIconNameAndRotation() {
         // Get the icon and rotate key
        const iconKey = SIRIUS_ICON_ATTRIBUTES.ICON
        const rotateKey = SIRIUS_ICON_ATTRIBUTES.ICON_ROTATE

        // Check if the icon contains the rotation
        const iconFields = this._attributes[iconKey]?.split('--') || [];

        // Get the icon name
        this.#iconName = iconFields[0] || SIRIUS_ICON_ATTRIBUTES_DETAILS[iconKey].DEFAULT;

        // Get the icon rotation
        this.#iconRotation = iconFields[1] || SIRIUS_ICON_ATTRIBUTES_DETAILS[rotateKey].DEFAULT;
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
        return this.#hidden;
    }

    /** Set hidden icon state
     * @param {boolean} hidden - True if the icon is hidden
     */
    set hidden(hidden) {
        this.#hidden = hidden;
        this.#setHiddenClass();
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

    /** Get rotation degrees
     * @param {string} rotate - Rotation direction
     * @returns {number} - Rotation degrees
     * */
    #getRotationDegrees(rotate) {
        // Get the rotation key and default value
        const rotateKey = SIRIUS_ELEMENT_ATTRIBUTES.ICON_ROTATE
        const def = SIRIUS_ICON_ATTRIBUTES_DETAILS[rotateKey].DEFAULT

        // Check if the rotation is not set
        if (!rotate)
            return this.#getRotationDegrees(def);

        // Get the rotation degrees based on the rotation direction
        for (let rotationDetailsKey of Object.values(SIRIUS_ICON_ROTATION))
            if (rotationDetailsKey === rotate)
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

        // Check if the icon contains the rotation
        const iconFields = name.split('--') || [];

        // Get the icon name
        this.iconName = iconFields[0];

        // Get the icon rotation
        if (!this.iconRotation)
            this.iconRotation = iconFields[1];
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

    /** Get the SVG CSS variables
     * @returns {object} - Icon attributes
     * */
    get iconCSSVariables() {
        const cssVars=SIRIUS_ICON.CSS_VARS

        return {
            width:this._formatCSSVariable(cssVars.SVG_WIDTH),
            height: this._formatCSSVariable(cssVars.SVG_HEIGHT),
            fill: this._formatCSSVariable(cssVars.SVG_FILL),
        }
    }

    /** Get the icon SVG element
     * @param {object} options - Icon options
     * @param {string} options.width - Icon width
     * @param {string} options.height - Icon height
     * @param {string} options.fill - Icon fill
     * @returns {string} - Icon SVG element
     * */
    #getSvgElement({width, height, fill} = this.iconCSSVariables) {
        // Get the icon key, the default icon SVG name and the icon options
        const iconKey = SIRIUS_ICON_ATTRIBUTES.ICON;
        const def = SIRIUS_ICON_ATTRIBUTES_DETAILS[iconKey].DEFAULT;
        const options = {width, height, fill};

        // Get the icon SVG element
        return getSvgElement(this.iconName, options) || getSvgElement(def, options);
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

        // Check if the icon is being shown
        if (this.hidden)
            svgContainerClasses.push(SIRIUS_ELEMENT.CLASSES.HIDDEN);


        return `<div class='${iconContainerClasses.join(' ')}' height="${height}" width="${width}">
                    <div class='${svgContainerClasses.join(' ')}'>
                        ${this.#getSvgElement({width, height, fill})}
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

    /** Add/remove hidden class */
    #setHiddenClass() {
        this._onBuiltIconContainerElement = (element) => {
            if (!this.#hidden)
                this.show(element)

            // Wait for the element animation to finish
            else
                this.hide('animationend', element)
        }
    }

    /** Toggle hidden class */
    toggleHidden() {
        const nextState = this.#hidden ? 'shown' : 'hidden';
        this.logger.log('Toggling icon. Set as ' + nextState);

        // Toggle hidden class
        this.#hidden = !this.#hidden;
        this.#setHiddenClass();
    }

    /** Attribute change callback
     * @param {string} name - Attribute name
     * @param {string} oldValue - Old attribute value
     * @param {string} newValue - New attribute
     * */
    attributeChangeCallback(name, oldValue, newValue) {
        if (oldValue === newValue)
            return

        // Get attribute details
        const details =SIRIUS_ICON_ATTRIBUTES_DETAILS[name]

        // Validate and set attribute
        this._validateAndSetAttribute({
            name,
            value: newValue,
            parsedTypes: this._parseTypes(details.TYPE),
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
                // Update icon name
                this._loadIconNameAndRotation()
                break;

            case SIRIUS_ICON_ATTRIBUTES.ICON_ROTATE:
                // Update icon rotation
                this.#setIconRotation(newValue);
                break;

            case SIRIUS_ELEMENT_ATTRIBUTES.ICON_WIDTH:
                this._updateCSSVariable(SIRIUS_ICON.CSS_VARS.SVG_WIDTH, newValue);
                break;

            case SIRIUS_ELEMENT_ATTRIBUTES.ICON_HEIGHT:
                this._updateCSSVariable(SIRIUS_ICON.CSS_VARS.SVG_HEIGHT, newValue);
                break;

            case SIRIUS_ELEMENT_ATTRIBUTES.ICON_FILL:
                this._updateCSSVariable(SIRIUS_ICON.CSS_VARS.SVG_WIDTH, newValue);
                break;

            case SIRIUS_ICON_ATTRIBUTES.HIDE:
                this.hidden = newValue;
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

            default:
                this.logger.log(`Unregistered attribute: ${newValue}`);
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