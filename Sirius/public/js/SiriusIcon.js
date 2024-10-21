import {SIRIUS_ELEMENT, SIRIUS_TYPES, SiriusElement} from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Sirius icon constants */
export const SIRIUS_ICON = deepFreeze({
    NAME: "SiriusIcon",
    TAG: "sirius-icon",
    HIDE:"hide",
    SHOW:"show",
    ICONS: {
        CHEVRON: 'chevron',
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
    },
    ATTRIBUTES: {
        CHECKED: {NAME: 'checked', DEFAULT: null, TYPE: SIRIUS_TYPES.BOOLEAN},
        DISABLED: {NAME: 'disabled', DEFAULT: null, TYPE: SIRIUS_TYPES.BOOLEAN},
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
    // Chevron icon
    [SIRIUS_ICON.ICONS.CHEVRON]: ({height, width, fill}) => `
        <svg xmlns="http://www.w3.org/2000/svg" height=${height} viewBox="0 -960 60 960" width=${width} fill=${fill}><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/></svg>
        `,

    // Indeterminate icon
    [SIRIUS_ICON.ICONS.INDETERMINATE]: ({width, height, fill}) => `
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} fill={fill}><path d="M240-440v-80h480v80H240Z"/></svg>`,

    // Star icon
    [SIRIUS_ICON.ICONS.STAR]: ({width, height, fill}) =>
        `<svg xmlns="http://www.w3.org/2000/svg" height=${height} viewBox="0 -960 960 960" width=${width} fill=${fill}><path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/></svg>`,

    // Check icon
    [SIRIUS_ICON.ICONS.CHECK]: ({width, height, fill}) =>
        `<svg xmlns="http://www.w3.org/2000/svg" height=${height} viewBox="0 -960 960 960" width=${width} fill=${fill}><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>`,

    // Warning icon
    [SIRIUS_ICON.ICONS.WARNING]: ({width, height, fill}) => `
        <svg xmlns="http://www.w3.org/2000/svg" height=${height} viewBox="0 -960 960 960" width=${width} fill=${fill}><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"/></svg>`
}

/** Sirius class that represents an icon component */
export class SiriusIcon extends SiriusElement {
    #icon

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

        // Attach shadow DOM
        this.attachShadow({mode: "open"});
    }

    /** Get current icon attribute value
     * @returns {string} - Icon name
     * */
    get icon() {
        if (this.#icon)
            return this.#icon;

        // Get the icon name
        const iconKey = SIRIUS_ICON.ICON_ATTRIBUTES.ICON.NAME
        this.#icon = this._attributes[iconKey] || SIRIUS_ICON.ICONS.DEFAULT;

        return this.#icon;
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

    /** Get the icon SVG
     * @returns {string} - Icon SVG
     * */
    #getIcon() {
        // Get the icon SVG function
        const iconFn = SIRIUS_SVGS[this.icon];

        // Return the icon SVG with the given attributes
        return iconFn({...this.iconAttributes});
    }

    /** Get the template for the Sirius icon
     * @returns {string} - Template
     * */
    #getTemplate() {
        // Get the icon classes
        let classes = [SIRIUS_ICON.CLASSES.ICON];

        // Check if the icon is a check icon
        if (this.icon === SIRIUS_ICON.ICONS.CHECK)
            classes.push(SIRIUS_ICON.CLASSES.UNCHECK);

        return `<span class='${classes.join(' ')}'>
                ${this.#getIcon()}
            </span>`;
    }

    /** Set the check icon as disabled */
    setDisabled() {
        this.iconElement.classList.add(SIRIUS_ICON.CLASSES.DISABLED);
    }

    /** Toggle check and uncheck classes */
    toggleCheck() {
        // Check if the icon is not a check icon
        if (this.icon !== SIRIUS_ICON.ICONS.CHECK) return;

        this.logger.log('Toggling check icon');

        // Remove disabled classes, if exists
        this.iconElement.classList.remove(SIRIUS_ICON.CLASSES.DISABLED);

        // Toggle check and uncheck classes
        [SIRIUS_ICON.CLASSES.CHECK, SIRIUS_ICON.CLASSES.UNCHECK].forEach(cls => this.iconElement.classList.toggle(cls));
    }

    /** Load dynamic properties and HTML attributes */
    #loadAttributes() {
        if (!this._attributes)
            this.logger.log("No attributes");

        // Get mask element
        const maskElement = this.maskElement;

        Object.keys(this._attributes).forEach(attributeName => {
            // Get the attribute value
            const attributeValue = this._attributes[attributeName]

            // Check if the attribute value is null
            if (!attributeValue) return

            switch (attributeName) {
                case SIRIUS_ELEMENT.ATTRIBUTES.STYLE.NAME:
                    console.log(attributeName);
                    
                    // Set the style attributes to the icon element
                    attributeValue.forEach(styleName =>
                        this.iconElement.style[styleName] = attributeValue[styleName]);
                    break;

                case SIRIUS_ELEMENT.ATTRIBUTES.EVENTS.NAME:
                    // TO BE IMPLEMENTED
                    break;

                case SIRIUS_ICON.ATTRIBUTES.DISABLED.NAME:
                    // Add disabled class
                    if (attributeValue)
                        maskElement.classList.add(SIRIUS_ICON.CLASSES.DISABLED);
                    break;

                case SIRIUS_ICON.ATTRIBUTES.CHECKED.NAME:
                    // Add check or uncheck class
                    if (attributeValue)
                        maskElement.classList.add(SIRIUS_ICON.CLASSES.CHECK);
                    else
                        maskElement.classList.add(SIRIUS_ICON.CLASSES.UNCHECK);
                    break;
                case SIRIUS_ICON.ATTRIBUTES.HIDE:
                    if(attributeValue)
                        console.log('probando123');
                        
                        maskElement.classList.add(this.hide())
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

        // Create the CSS stylesheet and add it to the shadow DOM
        await this.getCss(SIRIUS_ICON.NAME);
        this.shadowRoot.adoptedStyleSheets = [this._sheet];

        // Get HTML inner content
        const innerHTML = this.#getTemplate();
        if (!innerHTML) {
            this.logger.error('Failed to create template')
            return
        }

        // Create the HTML template
        await this.createTemplate(innerHTML);

        // Add icon to the shadow DOM
        this.iconElement = this._templateContent.firstChild;
        this.shadowRoot.appendChild(this.iconElement);
    }
}

// Register custom element
customElements.define(SIRIUS_ICON.TAG, SiriusIcon);