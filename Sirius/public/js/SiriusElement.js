import {SiriusLogger} from "./SiriusLogger.js";
import sirius from "./Sirius.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Sirius types */
export const SIRIUS_TYPES = deepFreeze({
    STRING: 'string',
    NUMBER: 'number',
    BOOLEAN: 'boolean',
    OBJECT: 'object',
    FUNCTION: 'function',
    UNDEFINED: 'undefined',
    BIGINT: 'bigint',
    ANY: 'any'
})

/** Sirius element constants */
export const SIRIUS_ELEMENT = deepFreeze({
    ATTRIBUTES: {
        ID: {NAME: "id", DEFAULT: null, TYPE: SIRIUS_TYPES.STRING},
        STYLE: {NAME: 'style', DEFAULT: null, TYPE: SIRIUS_TYPES.OBJECT},
        EVENTS: {NAME: 'events', DEFAULT: null, TYPE: SIRIUS_TYPES.OBJECT},
    }
})

/** Sirius class that represents an element component */
export class SiriusElement extends HTMLElement {
    _sheet = null
    _attributes = {}
    #elementName = 'UNDEFINED'
    #logger

    /**
     * Create a Sirius element
     * @param {object} props - Element properties
     * @param {string} elementName - Element name
     */
    constructor(props, elementName) {
        super();

        // Add element name
        this.#elementName = elementName;

        // Load Sirius element HTML attributes
        this._loadAttributes({htmlAttributes: SIRIUS_ELEMENT.ATTRIBUTES, properties: props});

        // Check if the element has an ID
        if (this._attributes?.id === null)
            throw new Error('Element ID is required');

        // Set instance ID
        sirius.setInstance(this._attributes.id, this);

        // Inject logger
        this.#logger = new SiriusLogger({
            name: this.#elementName,
            elementId: this._attributes.id
        });

        // Callback for when the component is built
        // this.built = () => {};
    }

    /** Get Sirius logger
     * @returns {SiriusLogger} - Sirius logger
     * */
    get logger() {
        return this.#logger
    }

    /** Validate the element attribute
     * @param {string} attributeName - Attribute name
     * @param {any} attributeValue - Attribute value
     * @param {object} attribute - Element attribute used to validate
     */
    _validateAttribute({attributeName, attributeValue, attribute}) {
        // Get the attribute valid types
        let {TYPE: types, DEFAULT: def} = attribute

        // Check if the valid types are an array
        types = Array.isArray(types) ? types : [types]

        // Check if any type is invalid
        if (types.includes(SIRIUS_TYPES.ANY))
            return

        // Check if the default value is null
        if (def === null && attributeValue === null)
            return

        // Check if the attribute value is in the valid types array
        if (!types.includes(typeof attributeValue))
            throw new Error(`Invalid attribute value '${attributeValue}' for '${attributeName}' attribute. Valid types: ${types.join(', ')}`)
    }

    /** Load HTML attributes and properties
     * @param {object} htmlAttributes - Element HTML attributes to load
     * @param {object} properties - Element properties
     * */
    _loadAttributes({htmlAttributes, properties}) {
        // Iterate over the attributes
        Object.keys(htmlAttributes).forEach(attributeName => {
            // Get the attribute name and default value
            const htmlAttribute = htmlAttributes[attributeName]
            const {NAME, DEFAULT} = htmlAttribute

            // Get the attribute value
            const attributeValue = this.getAttribute(NAME) || properties?.[NAME] || DEFAULT

            // Validate the attribute
            this._validateAttribute({
                attributeName: NAME,
                attributeValue,
                attribute: htmlAttribute
            })

            // Set the attribute value
            this._attributes[NAME] = attributeValue
        })
    }

    /**
     * Create a Sirius element stylesheet and store it
     * @param {string} cssFilename - CSS filename
     */
    async getCss(cssFilename = this.#elementName) {
        this._sheet = new CSSStyleSheet();

        // Load the CSS file
        const css = await sirius.getCssFile(cssFilename);

        // Add the CSS to the stylesheet
        this._sheet.replaceSync(css);
    }

    /**
     * Create a template from the inner HTML
     * @param {string} innerHTML - Inner HTML
     */
    async createTemplate(innerHTML) {
        // Create HTML template
        this._template = document.createElement("template");
        this._template.innerHTML = innerHTML;

        // Clone the template
        this._templateContent = this._template.content.cloneNode(true);
    }

    /** Add the element to the body */
    addToBody() {
        document.body.appendChild(this);
    }

    // Hide the element
    hide() {
        this.style.display = 'none';
    }

    // Show the element
    show() {
        this.style.display = '';
    }

    // Center the element on the screen
    centerScreen(object = {}) {
        const element = object.id || this;
        element.style.position = 'fixed';
        element.style.top = '50%';
        element.style.left = '50%';
        element.style.transform = 'translate(-50%, -50%)';
        
        return this.style.transform;
    }

    // TO IMPLEMENT
    // hide
    // show
    // centerScreen
}