import {SIRIUS_ELEMENT, SIRIUS_TYPES, SiriusElement} from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Sirius icon constants */
export const SIRIUS_ICON = deepFreeze({
    NAME: "SiriusIcon",
    TAG: "sirius-icon",
    ICONS: {
        ARROW: 'arrow',
        DOUBLE_ARROW: 'double-arrow',
        STAR: 'star',
        INDETERMINATE: "indeterminate",
        CHECK: "check",
        WARNING: 'warning',
    },
    ICON_ATTRIBUTES: {
        ICON: {NAME: "icon", DEFAULT: "warning", TYPE: SIRIUS_TYPES.STRING},
        WIDTH: {NAME: "width", DEFAULT: 24, TYPE: [SIRIUS_TYPES.NUMBER, SIRIUS_TYPES.STRING]},
        HEIGHT: {NAME: "height", DEFAULT: 24, TYPE: [SIRIUS_TYPES.NUMBER, SIRIUS_TYPES.STRING]},
        FILL: {NAME: "fill", DEFAULT: "red", TYPE: SIRIUS_TYPES.STRING},
        ROTATE: {NAME: "rotate", DEFAULT: "right", TYPE: SIRIUS_TYPES.STRING},
    },
    ATTRIBUTES: {
        CHECKED: {NAME: 'checked', DEFAULT: true, TYPE: SIRIUS_TYPES.BOOLEAN},
        DISABLED: {NAME: 'disabled', DEFAULT: false, TYPE: SIRIUS_TYPES.BOOLEAN},
        HIDE: {NAME: 'hide', DEFAULT: false, TYPE: SIRIUS_TYPES.BOOLEAN},
    },
    CLASSES: {
        ICON: 'icon',
        CHECK: 'check',
        UNCHECK: 'uncheck',
        DISABLED: 'disabled'
    }
})

/** Sirius SVG Icons */
const SIRIUS_SVGS = {
    // Arrow icon
    [SIRIUS_ICON.ICONS.ARROW]: ({height, width, fill}) => `
        <svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 -960 960 960" width="${width}" fill="${fill}"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
        `,

    // Double arrow icon
    [SIRIUS_ICON.ICONS.DOUBLE_ARROW]: ({height, width, fill}) => `
        <svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 -960 960 960" width="${width}" fill="${fill}"><path d="M383-480 200-664l56-56 240 240-240 240-56-56 183-184Zm264 0L464-664l56-56 240 240-240 240-56-56 183-184Z"/></svg>
        `,

    // Indeterminate icon
    [SIRIUS_ICON.ICONS.INDETERMINATE]: ({width, height, fill}) => `
    <svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 -960 960 960" width="${width}" fill="${fill}"><path d="M240-440v-80h480v80H240Z"/></svg>`,

    // Star icon
    [SIRIUS_ICON.ICONS.STAR]: ({width, height, fill}) =>
        `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 -960 960 960" width="${width}" fill="${fill}"><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>`,

    // Check icon
    [SIRIUS_ICON.ICONS.CHECK]: ({width, height, fill}) =>
        `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 -960 960 960" width="${width}" fill="${fill}"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>`,

    // Warning icon
    [SIRIUS_ICON.ICONS.WARNING]: ({width, height, fill}) => `
        <svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 -960 960 960" width="${width}" fill="${fill}"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"/></svg>`
}

/** Sirius rotation constants */
export const SIRIUS_ROTATION = deepFreeze({
    RIGHT: {NAME: 'right', DEG: 0},
    DOWN: {NAME: 'down', DEG: 90},
    LEFT: {NAME: 'left', DEG: 180},
    UP: {NAME: 'up', DEG: 270},
})

/** Sirius class that represents an icon component */
export class SiriusIcon extends SiriusElement {
    #checked = false
    #spanElement
    #iconName
    #iconRotation

    /**
     * Create a Sirius icon element
     * @param {object} props - Element properties
     */
    constructor(props) {
        super(props, SIRIUS_ICON.NAME);

        // Load Sirius Icon HTML general attributes
        this._loadAttributes({
            htmlAttributes: SIRIUS_ICON.ATTRIBUTES,
            properties: props
        });

        // Load Sirius Icon HTML attributes icon-specific attributes
        this._loadAttributes({
            htmlAttributes: SIRIUS_ICON.ICON_ATTRIBUTES,
            properties: props
        });
    }

    /** Get span element */
    get spanElement() {
        return this.#spanElement;
    }

    /** Set the icon name
     * @param {string} name - Icon name
     */
    set iconName(name) {
        this.#iconName = name || SIRIUS_ICON.ICONS.DEFAULT;
    }

    /** Get current icon attribute value
     * @returns {string} - Icon name
     * */
    get iconName() {
        if (this.#iconName)
            return this.#iconName;

        // Get the icon name
        const iconKey = SIRIUS_ICON.ICON_ATTRIBUTES.ICON.NAME

        // Check if the icon contains the rotation
        const iconFields = this._attributes[iconKey]?.split('--') || [];

        // Get the icon name
        this.iconName = iconFields[0];

        // Get the icon rotation
        if(!this.iconRotation)
            this.iconRotation = iconFields[1];

        return this.#iconName;
    }

    /** Set the icon rotation
     * @param {string} rotate - Rotation direction
     */
    set iconRotation(rotate) {
        this.#iconRotation = rotate || SIRIUS_ICON.ICON_ATTRIBUTES.ROTATE.DEFAULT;
        this.setIconRotation(this.#iconRotation);
    }

    /** Get the icon rotation
     * @returns {string} - Rotation direction
     */
    get iconRotation() {
        return this.#iconRotation;
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


    /** Get check icon state
     * @returns {boolean} - True if the icon is checked
     */
    get check() {
        return this.#checked;
    }

    /** Set check icon state
     * @param {boolean} checked - True if the icon is checked
     */
    set check(checked) {
        this.#checked = checked;
        this.#setCheckClasses();
    }

    /** Get the icon SVG
     * @returns {string} - Icon SVG
     * */
    #getIcon() {
        // Get the icon SVG function
        const iconFn = SIRIUS_SVGS[this.iconName];

        // Return the icon SVG with the given attributes
        return iconFn({...this.iconAttributes});
    }

    /** Get the template for the Sirius icon
     * @returns {string} - Template
     * */
    #getTemplate() {
        // Get the icon classes
        const classes = [SIRIUS_ICON.CLASSES.ICON];

        // Check if the icon is checked
        if (this.check)
            classes.push(SIRIUS_ICON.CLASSES.CHECK);
        else
            classes.push(SIRIUS_ICON.CLASSES.UNCHECK);

        // Get icon width and height
        const widthKey = SIRIUS_ICON.ICON_ATTRIBUTES.WIDTH.NAME
        const heightKey = SIRIUS_ICON.ICON_ATTRIBUTES.HEIGHT.NAME
        const {[widthKey]: width, [heightKey]: height} = this.iconAttributes;

        return `<div class='${classes.join(' ')}'>
                    <span width="${width}" height="${height}">
                        ${this.#getIcon()}
                    </span>
                </div>`;
    }

    /** Set the check icon as disabled */
    setDisabled() {
        this.containerElement.classList.add(SIRIUS_ICON.CLASSES.DISABLED);
    }
    /** Set the check icon as enabled */
    setEnabled() {
        this.containerElement.classList.remove(SIRIUS_ICON.CLASSES.DISABLED);
    }

    /** Set check and uncheck classes */
    #setCheckClasses() {
        this._onBuiltContainerElement = () => {
            if (this.#checked) {
                this.containerElement.classList.remove(SIRIUS_ICON.CLASSES.UNCHECK);
                this.containerElement.classList.add(SIRIUS_ICON.CLASSES.CHECK);
            } else {
                this.containerElement.classList.remove(SIRIUS_ICON.CLASSES.CHECK);
                this.containerElement.classList.add(SIRIUS_ICON.CLASSES.UNCHECK);
            }
        }
    }

    /** Toggle check and uncheck classes */
    toggleCheck() {
        const nextState = this.#checked ? 'checked' : 'unchecked';
        this.logger.log('Toggling check icon. Set as ' + nextState);

        // Toggle check and uncheck classes
        this.#checked = !this.#checked;
        this.#setCheckClasses();
    }

    /** Get rotation degrees
     * @param {string} rotate - Rotation direction
     * @returns {number} - Rotation degrees
     * */
    #getRotationDegrees(rotate) {
        // Check if the rotation is not set
        if (!rotate) return this.#getRotationDegrees(SIRIUS_ICON.ICON_ATTRIBUTES.ROTATE.DEFAULT);

        // Get the rotation degrees based on the rotation direction
        for(let rotationKey of Object.keys(SIRIUS_ROTATION)) {
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
    setIconRotation(rotate) {
        // Get the icon
        const degrees = this.#getRotationDegrees(rotate)

        // Log the rotation
        this.logger.log(`Setting rotation to ${degrees} degrees`)

        // Set the icon direction
        this._onBuiltContainerElement = () => {
            this.spanElement.style.transform = `rotate(${degrees}deg)`
        }
    }

    /** Load dynamic properties and HTML attributes */
    #loadAttributes() {
        if (!this._attributes)
            this.logger.log("No attributes");

        Object.keys(this._attributes).forEach(attributeName => {
            // Get the attribute value
            const attributeValue = this._attributes[attributeName]

            // Check if the attribute value is null
            if (!attributeValue) return

            switch (attributeName) {
                case SIRIUS_ELEMENT.ATTRIBUTES.STYLE.NAME:
                    // Set the style attributes to the icon element
                    attributeValue.forEach(styleName =>
                        this.containerElement.style[styleName] = attributeValue[styleName]);
                    break;

                case SIRIUS_ELEMENT.ATTRIBUTES.EVENTS.NAME:
                    // TO BE IMPLEMENTED
                    break;

                case SIRIUS_ICON.ATTRIBUTES.DISABLED.NAME:
                    // Add disabled class
                    if (attributeValue)
                        this.setDisabled();
                    break;

                case SIRIUS_ICON.ATTRIBUTES.CHECKED.NAME:
                    // Add check or uncheck class
                    this.check = attributeValue;
                    break;

                case SIRIUS_ICON.ATTRIBUTES.HIDE.NAME:
                    if (attributeValue)
                        this.hide()
                    else
                        this.show()
                    break;

                case SIRIUS_ICON.ICON_ATTRIBUTES.ROTATE.NAME:
                    // Check if the direction is the default value
                    if (attributeValue === SIRIUS_ICON.ICON_ATTRIBUTES.ROTATE.DEFAULT) return;

                    // Set the icon rotation
                    this.iconRotation = attributeValue;
                    break;

                default:
                    // this.logger.log(`Unregistered attribute: ${attributeName}`);
                    break;
            }
        })
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
        this.#spanElement = this.containerElement.firstElementChild;
        this.shadowRoot.appendChild(this.containerElement);

        // Dispatch the built event
        this.dispatchBuiltEvent();
    }
}

// Register custom element
customElements.define(SIRIUS_ICON.TAG, SiriusIcon);