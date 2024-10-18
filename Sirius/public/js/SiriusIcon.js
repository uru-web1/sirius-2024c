import {SiriusElement} from "./SiriusElement";
import deepFreeze from "./utils/deep-freeze";

/** Sirius icon constants */
export const SIRIUS_ICON = deepFreeze({
    NAME: "SiriusIcon",
    ICONS: {STAR: 'start', CHECK: "check", DEFAULT: "default"},
    PROPERTIES: {STYLE: 'style', EVENTS: 'events'},
    BOOLEAN_ATTRIBUTES: {
        CHECKED: 'checked',
        UNCHECKED: 'unchecked',
        DISABLED: 'disabled',
    },
    ATTRIBUTES: {
        ICON: {NAME: "icon", DEFAULT: "default"},
        WIDTH: {NAME: "width", DEFAULT: 24},
        HEIGHT: {NAME: "height", DEFAULT: 24},
        STROKE: {NAME: "stroke", DEFAULT: "white"},
        STROKE_WIDTH: {NAME: "strokeWidth", DEFAULT: 1.5},
        FILL: {NAME: "fill", DEFAULT: "none"},
        LEFT: {NAME: "left", DEFAULT: 0},
        RIGHT: {NAME: "right", DEFAULT: 0}
    },
    CLASSES: {
        ICON: 'icon',
        CHECK: 'check',
        UNCHECK: 'uncheck',
        DISABLED: 'disabled'
    },
    IDS: {
        SVG_MASK: '.svg_mask'
    }
})

/** Sirius SVG Icons */
const SIRIUS_SVGS = {
    // 'heart'
    [SIRIUS_ICON.ICONS.STAR]: ({width, height, fill, stroke, strokeWidth}) => `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>`,
    [SIRIUS_ICON.ICONS.CHECK]: ({width, height, fill, stroke, strokeWidth, left, right}) => `
        <svg class="custom-svg" width="${width}" height="${height}" viewBox="${left} ${right} ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
             <defs>
                  <clipPath id="reveal">
                       <rect class="svg-mask" x="0" y="0" width="32" height="24" fill="white"/>
                  </clipPath>
             </defs>
             <path class="svg-check" d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4L9 16.2z" stroke="${stroke}" stroke-width="${strokeWidth}" fill="${fill}" clip-path="url(#reveal)"/>
        </svg>`,
    [SIRIUS_ICON.ICONS.DEFAULT]: ({width, height, fill, stroke, strokeWidth}) => `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
             <circle cx="12" cy="12" r="10"></circle>
        </svg>`
}

/** Sirius class that represents an icon component */
export class SiriusIcon extends SiriusElement {
    /**
     * Create a Sirius icon element
     * @param props - Element properties
     */
    constructor(props) {
        super(props, SIRIUS_ICON.NAME);

        // Attach shadow DOM
        this.attachShadow({mode: "open"});
    }

    /** Get attributes */
    get attributes() {
        const attributes = {}

        // Iterate over the attributes
        Object.keys(SIRIUS_ICON.ATTRIBUTES).forEach(key => {
            // Get the attribute name and default value
            const {NAME, DEFAULT} = SIRIUS_ICON.ATTRIBUTES[key]

            // Set the attribute value
            attributes[NAME] = this.getAttribute(NAME) || DEFAULT
        })
        return attributes
    }

    /** Get the mask element */
    get maskElement() {
        return this.shadowRoot.querySelector(SIRIUS_ICON.IDS.SVG_MASK);
    }

    /** Get current icon attribute value */
    get icon() {
        return this.getAttribute(SIRIUS_ICON.ATTRIBUTES.ICON)
    }

    /** Lifecycle method called when the component is connected to the DOM
     */
    async connectedCallback() {
        // Create the CSS stylesheet and add it to the shadow DOM
        await this.getCss(SIRIUS_ICON.NAME);
        this.shadowRoot.adoptedStyleSheets = [this.sheet];

        // Get HTML inner content
        const innerHTML = this.#getTemplate();

        // Create the HTML template
        await this.createTemplate(innerHTML);

        // Add icon to the shadow DOM
        this.iconElement = this.templateContent.firstChild;
        this.shadowRoot.appendChild(this.iconElement);

        // Load attributes and properties
        this.#getAttributes();
        this.#getProperties();

        this.built();
    }

    /** Get the template for the Sirius icon */
    #getTemplate() {
        return `<span class=${SIRIUS_ICON.CLASSES.ICON}>
                ${this.#getIcon(this.attributes)}
            </span>`;
    }

    /** Toggle check and uncheck classes */
    toggleCheck() {
        // Check the current icon
        if (this.icon === SIRIUS_ICON.ICON.CHECK) {
            const maskElement = this.maskElement;

            // Toggle check and uncheck classes
            ([SIRIUS_ICON.CLASSES.CHECK, SIRIUS_ICON.CLASSES.UNCHECK].forEach(cls => maskElement.classList.toggle(cls)));
        }
    }

    /** Get the icon SVG
     * @param attributes - Icon attributes (icon, width, height, stroke, strokeWidth, fill, right, left)
     * @returns {string} - Icon SVG
     * */
    #getIcon(attributes) {
        // Get the icon name
        const icon = attributes[SIRIUS_ICON.ATTRIBUTES.ICON.NAME] || SIRIUS_ICON.ICONS.DEFAULT;

        // Get the icon SVG function
        const iconFn = SIRIUS_SVGS[icon];

        // Return the icon SVG with the given attributes
        return iconFn({...attributes});
    }

    /** Get the HTML attributes and assign it to the component */
    #getAttributes() {
        if (!this.getAttributeNames())
            this._log("No attributes");

        // NOT USED
        // const attributesToHandle = ['name', 'color', 'size'];

        for (const attributeName of this.getAttributeNames())
            switch (attributeName) {
                case SIRIUS_ICON.BOOLEAN_ATTRIBUTES.CHECKED:
                    this.maskElement.classList.add(SIRIUS_ICON.CLASSES.CHECK);
                    break;

                case SIRIUS_ICON.BOOLEAN_ATTRIBUTES.UNCHECKED:
                    this.maskElement.classList.add(SIRIUS_ICON.CLASSES.UNCHECK);
                    break;

                case SIRIUS_ICON.BOOLEAN_ATTRIBUTES.DISABLED:
                    this.maskElement.classList.add(SIRIUS_ICON.CLASSES.DISABLED);
                    break;

                default:
                    this._log(`Unregistered attribute: ${attributeName}`);
                    break;
            }
    }

    /** Dynamic properties management (like style or events) */
    #getProperties() {
        if (!this.props)
            this._log("No additional properties");

        for (const attributeName in this.props) {
            switch (attributeName) {
                case SIRIUS_ICON.PROPERTIES.STYLE:
                    // Set the style properties to the main element
                    for (const cssAttribute in this.props.style)
                        this.mainElement.style[cssAttribute] = this.props.style[cssAttribute];
                    break;
                case SIRIUS_ICON.PROPERTIES.EVENTS:
                    // TO BE IMPLEMENTED
                    // for (const evt in this.props.events) {}
                    break;
                default:
                    this._log(`Unregistered property: ${attributeName}`);
                    break;
            }
            this.setAttribute(attributeName, this.props[attributeName]);

            // I think this can potentially overwrite class members
            // this[attributeName] = this.props[attributeName];

            this._log(`${attributeName}: ${this[attributeName]}`);
        }
    }
}

// Register custom element
customElements.define("sirius-icon", SiriusIcon);
