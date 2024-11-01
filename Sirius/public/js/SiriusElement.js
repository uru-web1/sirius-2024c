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
    NAME: 'SiriusElement',
    EVENTS: {
        BUILT: 'built',
        HIDE: 'hide',
    },
    ATTRIBUTES: {
        ID: {NAME: "id", DEFAULT: null, TYPE: SIRIUS_TYPES.STRING},
        STYLE: {NAME: 'custom-style', DEFAULT: null, TYPE: [SIRIUS_TYPES.OBJECT, SIRIUS_TYPES.STRING]},
        EVENTS: {NAME: 'custom-events', DEFAULT: null, TYPE: SIRIUS_TYPES.OBJECT},
    },
    CLASSES: {
        HIDDEN: 'hidden',
        HIDING: 'hiding',
        CENTER_SCREEN: 'center-screen'
    }
})

/** Sirius class that represents an element component */
export class SiriusElement extends HTMLElement {
    _attributes = {}
    #containerElement = null
    #elementName = 'UNDEFINED'
    #logger = null
    #isBuilt = false
    #onBuilt = []

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
        if (!this._attributes?.id)
            throw new Error('Element ID is required');

        // Set instance ID
        sirius.setInstance(this._attributes.id, this);

        // Inject logger
        this.#logger = new SiriusLogger({
            name: this.#elementName,
            elementId: this._attributes.id
        });

        // Attach shadow DOM
        this.attachShadow({mode: "open"});

        // Built event listener
        this.addEventListener(SIRIUS_ELEMENT.EVENTS.BUILT, async () => {
            // Set the element as built
            this.#isBuilt = true;

            // Call the initialization callbacks
            for (const callback of this.#onBuilt) await callback();

            // Clear the initialization callbacks
            this.#onBuilt = [];
        });
    }

    /** Get Sirius logger
     * @returns {SiriusLogger} - Sirius logger
     * */
    get logger() {
        return this.#logger
    }

    /** Get the element container
     * @returns {HTMLElement} - Element container
     */
    get containerElement() {
        return this.#containerElement
    }

    /** Set the element container
     * @param {HTMLElement} containerElement - Element container
     */
    set containerElement(containerElement) {
        this.#containerElement = containerElement
    }

    /** Set Sirius Element on built callback
     * @param callback - On built callback
     * */
    set onBuilt(callback) {
        if (this.#isBuilt) {
            callback();
            return;
        }
        this.#onBuilt.push(callback);
    }

    /** Check the container element
     * @returns {boolean} - True if the container element is set
     */
    _checkContainerElement() {
        if (this.#containerElement)
            return true

        this.logger.error('Container element is not set');
        return false
    }

    /** Check if the attribute has the given type
     * @param {object} attribute - Element attribute
     * @param {string} type - Attribute type
     * @returns {string[], boolean} - Valid types and true if the attribute has the given type
     */
    _hasAttributeType(attribute, type) {
        // Get the attribute valid types
        let {TYPE: types} = attribute

        // Check if the valid types are an array
        types = Array.isArray(types) ? types : [types]

        if (types.includes(type))
            return [types, true]

        return [types, false]
    }

    /** Validate the element attribute
     * @param {string} name - Attribute name
     * @param {any} value - Attribute value
     * @param {string[]} types - Attribute valid types
     * @param {object} def - Attribute default value
     */
    _validateAttribute({name, value, types, def}) {
        // Check if the attribute has any type
        if (types.includes(SIRIUS_TYPES.ANY))
            return

        // Check if the default value is null
        if (def === null && value === null)
            return

        // Check if the attribute value is in the valid types array
        if (!types.includes(typeof value))
            throw new Error(`Invalid attribute value '${value}' for '${name}' attribute. Valid types: ${types.join(', ')}`)
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
            const {NAME: name, DEFAULT: def} = htmlAttribute

            // Get the attribute value
            let attributeValue = this.getAttribute(name)
            const [parsedTypes, hasBoolean] = this._hasAttributeType(htmlAttribute, SIRIUS_TYPES.BOOLEAN)

            if (attributeValue===""&&hasBoolean)
                attributeValue = true

            else if (attributeValue===null){
                // Check if the attribute is not set
                if (properties?.[name] === undefined)
                    attributeValue = def

                else {
                    // Get the attribute value from the properties
                    attributeValue = properties[name]

                    // Set the attribute value
                    this.setAttribute(name, attributeValue)
                }
            }

            // Validate the attribute
            this._validateAttribute({
                name,
                def,
                types: parsedTypes,
                value: attributeValue,
            })

            // Set the attribute value
            this._attributes[name] = attributeValue
        })
    }

    /** Get a given stylesheet file content
     * @param {string} cssFilename - CSS filename
     */
    async #getStyles(cssFilename) {
        // Create the CSS stylesheet
        const sheet = new CSSStyleSheet();

        // Load the CSS file content
        const css = await sirius.getStylesFile(cssFilename);

        // Add the CSS content to the stylesheet
        sheet.replaceSync(css);

        return sheet;
    }

    /**
     * Get the Sirius element stylesheets
     * @param {string} cssFilename - CSS filename
     * @returns {Promise<{element: CSSStyleSheet, general: CSSStyleSheet}>} - Stylesheets
     */
    async #getElementStyles(cssFilename) {
        // Get the element and the general stylesheets
        const elementStylesheet = await this.#getStyles(cssFilename);
        const generalStylesheet = await this.#getStyles(SIRIUS_ELEMENT.NAME);

        return {element: elementStylesheet, general: generalStylesheet};
    }

    /**
     * Load style sheets to the shadow DOM
     * @param {CSSStyleSheet[]} styleSheets - Stylesheets
     */
    async #loadStyles(...styleSheets) {
        this.shadowRoot.adoptedStyleSheets = styleSheets;
    }

    /**
     * Load element styles sheets to the shadow DOM
     * @param {string} cssFilename - CSS filename
     */
    async _loadElementStyles(cssFilename = this.#elementName) {
        // Create the CSS style sheets and add them to the shadow DOM
        const {element,general} = await this.#getElementStyles(cssFilename);
        this.#loadStyles(element, general);
    }

    /**
     * Create a template from the inner HTML
     * @param {string} innerHTML - Inner HTML
     */
    async _createTemplate(innerHTML) {
        // Check if the inner HTML is empty
        if (!innerHTML) {
            this.logger.error('Failed to create template');
            return;
        }

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

    /** Added on built container element callback */
    set _onBuiltContainerElement(callback) {
        this.onBuilt = () => {
            if (this._checkContainerElement())
                callback()
        }
    }

    /** Hide the element
     * @param {string} event - Event to wait for before hiding the element
     * @param {HTMLElement} element - Element to hide
     * */
    hide(event, element) {
        element = element || this.containerElement;

        this._onBuiltContainerElement = () => {
            // Check if there is an event to wait for
            if (!event){
                element.classList.add(SIRIUS_ELEMENT.CLASSES.HIDDEN);
                this.logger.log('Element hidden');
                return;
            }

            // Get event handler
            const eventHandler = () => {
                // Hide the element
                element.classList.remove(SIRIUS_ELEMENT.CLASSES.HIDING);
                element.classList.add(SIRIUS_ELEMENT.CLASSES.HIDDEN);
                this.logger.log('Element hidden');

                // Remove event listener
                element.removeEventListener(event, eventHandler);
            }

            // Add event listener to hide the element
            element.addEventListener(event, eventHandler);

            // Set hiding class
            this.logger.log('Element hiding');
            element.classList.remove(SIRIUS_ELEMENT.CLASSES.HIDDEN);
            element.classList.add(SIRIUS_ELEMENT.CLASSES.HIDING);
        }
    }

    /** Show the element
     * @param {HTMLElement} element - Element to hide
     * */
    show(element) {
        element = element || this.containerElement;

        this._onBuiltContainerElement = () => {
            element.classList.remove(SIRIUS_ELEMENT.CLASSES.HIDDEN);
            this.logger.log('Element shown');
        }
    }

    /** Center the element on the screen */
    centerScreen() {
        this._onBuiltContainerElement = () => {
            this.containerElement.classList.add(SIRIUS_ELEMENT.CLASSES.CENTER_SCREEN);
            this.logger.log('Element centered on the screen');
        }
    }

    /** Remove centering of the element */
    removeCenterScreen() {
        this._onBuiltContainerElement = () => {
            this.containerElement.classList.remove(SIRIUS_ELEMENT.CLASSES.CENTER_SCREEN);
            this.logger.log('Element removed from center screen');
        }
    }

    /** Dispatch the built event */
    dispatchBuiltEvent() {
        this.dispatchEvent(new Event(SIRIUS_ELEMENT.EVENTS.BUILT));
    }

    /** Dispatch hide event */
    dispatchHideEvent() {
        this.dispatchEvent(new Event(SIRIUS_ELEMENT.EVENTS.HIDE));
    }
}