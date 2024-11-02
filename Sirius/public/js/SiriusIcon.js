import {SIRIUS_ELEMENT, SIRIUS_TYPES, SiriusElement} from "./SiriusElement.js";
import {changeSvgElementInnerHTML, getSvgElement, SIRIUS_ICONS} from "./SiriusSvg.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Sirius icon constants */
export const SIRIUS_ICON = deepFreeze({
    NAME: "SiriusIcon",
    TAG: "sirius-icon",
    ICON_ATTRIBUTES: {
        ICON: {NAME: "icon", DEFAULT: SIRIUS_ICONS.WARNING, TYPE: SIRIUS_TYPES.STRING},
        WIDTH: {NAME: "width", DEFAULT: "24px", TYPE: SIRIUS_TYPES.STRING},
        HEIGHT: {NAME: "height", DEFAULT: "24px", TYPE: SIRIUS_TYPES.STRING},
        FILL: {NAME: "fill", DEFAULT: "red", TYPE: SIRIUS_TYPES.STRING},
        ROTATE: {NAME: "rotate", DEFAULT: "right", TYPE: SIRIUS_TYPES.STRING},
    },
    ATTRIBUTES: {
        HIDE: {NAME: 'hide', DEFAULT: false, TYPE: SIRIUS_TYPES.BOOLEAN},
        DISABLED: {NAME: 'disabled', DEFAULT: false, TYPE: SIRIUS_TYPES.BOOLEAN},
    },
    KEYFRAME_ATTRIBUTES: {
        SHOW: {NAME: 'show-animation', DEFAULT: '', TYPE: SIRIUS_TYPES.STRING},
        HIDING: {NAME: 'hiding-animation', DEFAULT: '', TYPE: SIRIUS_TYPES.STRING},
    },
    CLASSES: {
        ELEMENT_CONTAINER: 'element-container',
        ICON_CONTAINER: 'icon-container',
        DISABLED: 'disabled',
    }
})

/** Sirius rotation constants */
export const SIRIUS_ROTATION = deepFreeze({
    RIGHT: {NAME: 'right', DEG: 0},
    DOWN: {NAME: 'down', DEG: 90},
    LEFT: {NAME: 'left', DEG: 180},
    UP: {NAME: 'up', DEG: 270},
})

/** Sirius class that represents an icon component */
export class SiriusIcon extends SiriusElement {
    #hidden = false
    #iconContainerElement
    #svgElement
    #iconName
    #iconRotation

    /**
     * Create a Sirius icon element
     * @param {object} props - Element properties
     */
    constructor(props) {
        super(props, SIRIUS_ICON.NAME);

        // Sirius icon HTML general attributes, icon-specific attributes and keyframe attributes
        const htmlAttributes = {...SIRIUS_ICON.ICON_ATTRIBUTES, ...SIRIUS_ICON.ATTRIBUTES, ...SIRIUS_ICON.KEYFRAME_ATTRIBUTES}

        // Load attributes
        this._loadAttributes({
            htmlAttributes,
            properties: props
        });
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
        this.#svgElement = this.#iconContainerElement.firstElementChild
    }

    /** Get current icon attribute value
     * @returns {string} - Icon name
     * */
    get iconName() {
        if (this.#iconName)
            return this.#iconName;

        // Get the icon key
        const iconKey = SIRIUS_ICON.ICON_ATTRIBUTES.ICON.NAME

        // Check if the icon contains the rotation
        const iconFields = this._attributes[iconKey]?.split('--') || [];

        // Get the icon name
        this.iconName = iconFields[0];

        // Get the icon rotation
        if (!this.iconRotation)
            this.iconRotation = iconFields[1];

        return this.#iconName;
    }

    /** Set the icon name
     * @param {string} name - Icon name
     */
    set iconName(name) {
        this.#iconName = name || SIRIUS_ICON.ICON_ATTRIBUTES.ICON.DEFAULT;
    }

    /** Get the icon rotation
     * @returns {string} - Rotation direction
     */
    get iconRotation() {
        return this.#iconRotation;
    }

    /** Set the icon rotation
     * @param {string} rotate - Rotation direction
     */
    set iconRotation(rotate) {
        this.#iconRotation = rotate || SIRIUS_ICON.ICON_ATTRIBUTES.ROTATE.DEFAULT;
        this.#setIconRotation(this.#iconRotation);
    }

    /** Get the icon attributes
     * @returns {object} - Icon attributes
     * */
    get iconAttributes() {
        const iconAttributes = {};

        // Get the icon attributes
        Object.keys(SIRIUS_ICON.ICON_ATTRIBUTES).forEach(attribute => {
            const {NAME: attributeName} = SIRIUS_ICON.ICON_ATTRIBUTES[attribute]
            iconAttributes[attributeName] = this._attributes[attributeName]
        })

        return iconAttributes
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

    /** Set icon name and rotation attributes
     * @param {string} name - Icon name
     */
    _setIconNameAndRotation(name) {
        // Get the icon key
        const iconKey = SIRIUS_ICON.ICON_ATTRIBUTES.ICON.NAME

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

    /** Change icon SVG
     * @param {string} name - Icon name
     * */
    changeIcon(name) {
        // Set the icon attributes
        this._setIconNameAndRotation(name);

        // Update the SVG element
        this.svgElement = this.#getSvgElement();
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
     * @returns {string} - Icon SVG element
     * */
    #getSvgElement() {
        // Get the icon SVG element options and the default icon SVG name
        const options = {...this.iconAttributes}
        const def = SIRIUS_ICON.ICON_ATTRIBUTES.ICON.DEFAULT;

        // Get the icon SVG element
        return getSvgElement(this.iconName, options) || getSvgElement(def, options);
    }

    /** Get dimensions
     * @returns {object} - Icon dimensions
     */
    _getDimensions() {
        // Get the width and height keys
        const widthKey = SIRIUS_ICON.ICON_ATTRIBUTES.WIDTH.NAME;
        const heightKey = SIRIUS_ICON.ICON_ATTRIBUTES.HEIGHT.NAME;

        // Get attributes values
        const width = this._attributes[widthKey];
        const height = this._attributes[heightKey];

        return {width, height};
    }

    /** Get the template for the Sirius icon
     * @returns {string} - Template
     * */
    #getTemplate() {
        // Get the icon classes
        const containerClasses = [SIRIUS_ICON.CLASSES.ELEMENT_CONTAINER];
        const iconClasses = [SIRIUS_ICON.CLASSES.ICON_CONTAINER];

        // Check if the icon is being shown
        if (this.hidden)
            iconClasses.push(SIRIUS_ELEMENT.CLASSES.HIDDEN);

        // Get width and height
        const {width, height} = this._getDimensions();

        return `<div class='${containerClasses.join(' ')}' height="${height}" width="${width}">
                    <div class='${iconClasses.join(' ')}'>
                        ${this.#getSvgElement()}
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

    /** Get rotation degrees
     * @param {string} rotate - Rotation direction
     * @returns {number} - Rotation degrees
     * */
    #getRotationDegrees(rotate) {
        // Check if the rotation is not set
        if (!rotate) return this.#getRotationDegrees(SIRIUS_ICON.ICON_ATTRIBUTES.ROTATE.DEFAULT);

        // Get the rotation degrees based on the rotation direction
        for (let rotationKey of Object.keys(SIRIUS_ROTATION)) {
            const rotation = SIRIUS_ROTATION[rotationKey];
            if (rotation.NAME === rotate) return rotation.DEG;
        }

        // Try to parse the rotation as a number
        const degrees = parseInt(rotate)
        if (!isNaN(degrees)) return degrees

        // Log an error if the rotation is invalid
        this.logger.error(`Invalid rotation: ${rotate}`)

        // Return the default rotation degrees
        return this.#getRotationDegrees(SIRIUS_ICON.ICON_ATTRIBUTES.ROTATE.DEFAULT)
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

    /** Load dynamic properties and HTML attributes */
    #loadAttributes() {
        this.onBuilt = () => {
            if (!this._attributes)
                this.logger.log("No attributes");

            Object.keys(this._attributes).forEach(attributeName => {
                // Get the attribute value
                const attributeValue = this._attributes[attributeName]

                // Check if the attribute value is null
                if (!attributeValue) return

                switch (attributeName) {
                    case SIRIUS_ELEMENT.ATTRIBUTES.STYLE.NAME:
                        this._loadStyleAttribute(attributeValue, this.containerElement);
                        break;

                    case SIRIUS_ELEMENT.ATTRIBUTES.EVENTS.NAME:
                        this._loadStyleAttribute(attributeValue, this.containerElement);
                        break;

                    case SIRIUS_ICON.ATTRIBUTES.HIDE.NAME:
                        this.hidden = attributeValue;
                        break;

                    case SIRIUS_ICON.ATTRIBUTES.DISABLED.NAME:
                        // Add disabled class
                        if (attributeValue)
                            this.setDisabled();
                        break;

                    case SIRIUS_ICON.ICON_ATTRIBUTES.ROTATE.NAME:
                        // Check if the direction is the default value
                        if (attributeValue === SIRIUS_ICON.ICON_ATTRIBUTES.ROTATE.DEFAULT) return;

                        // Set the icon rotation
                        this.iconRotation = attributeValue;
                        break;

                    case SIRIUS_ICON.KEYFRAME_ATTRIBUTES.SHOW.NAME:
                        // Set the show animation keyframe
                        this._changeKeyframeRules(SIRIUS_ELEMENT.STYLE_SHEETS.ELEMENT, SIRIUS_ICON.KEYFRAME_ATTRIBUTES.SHOW.NAME, attributeValue);

                        // Remove the attribute
                        this.removeAttribute(SIRIUS_ICON.KEYFRAME_ATTRIBUTES.SHOW.NAME);
                        break;

                    case SIRIUS_ICON.KEYFRAME_ATTRIBUTES.HIDING.NAME:
                        // Set the hiding animation keyframe
                        this._changeKeyframeRules(SIRIUS_ELEMENT.STYLE_SHEETS.ELEMENT, SIRIUS_ICON.KEYFRAME_ATTRIBUTES.HIDING.NAME, attributeValue);

                        // Remove the attribute
                        this.removeAttribute(SIRIUS_ICON.KEYFRAME_ATTRIBUTES.HIDING.NAME);
                        break;

                    default:
                        //this.logger.log(`Unregistered attribute: ${attributeName}`);
                        break;
                }
            })
        }
    }

    /** Lifecycle method called when the component is connected to the DOM
     */
    async connectedCallback() {
        // Load attributes
        this.#loadAttributes();

        // Create the CSS style sheets and add them to the shadow DOM
        await this._loadElementStyles();

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