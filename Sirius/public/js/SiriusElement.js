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
        ID: {NAME: "id", DEFAULT: null, TYPE: SIRIUS_TYPES.STRING, PARSE: false},
        STYLE: {NAME: 'style', DEFAULT: null, TYPE: [SIRIUS_TYPES.OBJECT, SIRIUS_TYPES.STRING], PARSE: true},
        EVENTS: {NAME: 'events', DEFAULT: null, TYPE: SIRIUS_TYPES.OBJECT, PARSE: true},
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

    /** Added on built element callback
     * @param {HTMLElement} element - Element to check
     * @param {(HTMLElement)=>{}} callback - On built callback
     * */
    set _onBuiltElement({element, callback}) {
        this.onBuilt = () => {
            if (this._checkElement(element))
                callback(element)
        }
    }

    /** Added on built container element callback
     * @param {(HTMLElement)=>{}} callback - On built callback
     */
    set _onBuiltContainerElement(callback) {
        this.onBuilt = () => {
            if (this._checkElement(this.containerElement))
                callback(this.containerElement)
        }
    }

    /** Check the container element
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} - True if the container element is set
     */
    _checkElement(element) {
        if (!element) {
            this.logger.error(`Element is not set: ${element}`);
            return false
        }

        // Check if the element is an instance of HTMLElement
        if (element instanceof HTMLElement)
            return true

        this.logger.error(`Invalid element: ${element}`);
        return false
    }

    /** Check if the attribute has the given type
     * @param {string[]|string} types - Element types attribute
     * @param {string} type - Attribute type
     * @returns {{parsedTypes: string[], hasType: boolean}} - Parsed types and if the attribute has the given type
     */
    _hasAttributeType(types, type) {
        // Check if the valid types are an array
        const parsedTypes = Array.isArray(types) ? types : [types]
        return {parsedTypes, hasType: parsedTypes.includes(type)}
    }

    /** Validate the element attribute
     * @param {string} name - Attribute name
     * @param {any} value - Attribute value
     * @param {string[]} parsedTypes - Attribute valid types
     * @param {object} def - Attribute default value
     */
    _validateAttribute({name, value, parsedTypes, def}) {
        // Check if the attribute has any type
        if (parsedTypes.includes(SIRIUS_TYPES.ANY))
            return

        // Check if the default value is null
        if (def === null && value === null)
            return

        // Check if the attribute value is in the valid types array
        if (!parsedTypes.includes(typeof value))
            throw new Error(`Invalid attribute value '${value}' for '${name}' attribute. Valid types: ${parsedTypes.join(', ')}`)
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
            const {NAME: name, DEFAULT: def, TYPE: types} = htmlAttribute

            // Get the attribute value
            let attributeValue = this.getAttribute(name)
            const {parsedTypes, hasType: hasBoolean} = this._hasAttributeType(types, SIRIUS_TYPES.BOOLEAN)

            // Check if the attribute is a boolean and the value is an empty string
            if (attributeValue === "" && hasBoolean)
                attributeValue = true

            // Check if the attribute is not set
            else if (attributeValue === null)
                if (properties?.[name] === undefined)
                    attributeValue = def

                else {
                    // Get the attribute value from the properties
                    attributeValue = properties[name]

                    // Set the attribute value
                    this.setAttribute(name, attributeValue)
                }

            // Validate the attribute
            this._validateAttribute({
                name,
                def,
                parsedTypes,
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
        const {element, general} = await this.#getElementStyles(cssFilename);
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

    /** Load style attribute
     * @param {string|object|null} style - Style attribute value
     * @param {HTMLElement} element - Element to add the style
     */
    _loadStyleAttribute(style, element) {
        if (!style)
            return

        this._onBuiltElement = {
            element: element || this.containerElement,
            callback: (element) => {
                // Check if the attribute value is a string
                if (typeof style === SIRIUS_TYPES.STRING)
                    element.style.cssText = style

                // Check if the attribute value is an object
                else if (typeof style === SIRIUS_TYPES.OBJECT)
                    for (let styleName in style)
                        element.style[styleName] = style[styleName];

                else {
                    this.logger.error('Invalid style attribute value');
                    return;
                }

                // Remove the style attribute of the component
                this.removeAttribute(SIRIUS_ELEMENT.ATTRIBUTES.STYLE.NAME);
            }
        }
    }

    /** Load events attribute
     * @param {object|null} events - Events attribute value
     * @param {HTMLElement} element - Element to add the event listeners
     */
    _loadEventsAttribute(events, element) {
        if (!events)
            return

        this._onBuiltElement = {
            element: element || this.containerElement,
            callback: (element) => {
                // Check if the attribute value is an object
                if (typeof events !== SIRIUS_TYPES.OBJECT) {
                    this.logger.error('Invalid events attribute value');
                    return;
                }

                // Get the target element
                const targetElement = element || this.containerElement;

                // Add event listeners
                for (let event in events)
                    targetElement.addEventListener(event, events[event])

                // Remove the events attribute of the component
                this.removeAttribute(SIRIUS_ELEMENT.ATTRIBUTES.EVENTS.NAME);
            }
        }
    }

    /** Add the element to the body */
    addToBody() {
        document.body.appendChild(this);
    }

    /** Hide the element
     * @param {string} event - Event to wait for before hiding the element
     * @param {HTMLElement} element - Element to hide
     * */
    hide(event, element) {
        this._onBuiltElement = {
            element: element || this.containerElement,
            callback: (element) => {
                // Check if there is an event to wait for
                if (!event) {
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
    }

    /** Show the element
     * @param {HTMLElement} element - Element to hide
     * */
    show(element) {
        this._onBuiltElement = {
            element: element || this.containerElement,
            callback: (element) => {
                element.classList.remove(SIRIUS_ELEMENT.CLASSES.HIDDEN);
                this.logger.log('Element shown');
            }
        }
    }

    /** Center the element on the screen */
    centerScreen() {
        this._onBuiltContainerElement = (element) => {
            element.classList.add(SIRIUS_ELEMENT.CLASSES.CENTER_SCREEN);
            this.logger.log('Element centered on the screen');
        }
    }

    /** Remove centering of the element */
    removeCenterScreen() {
        this._onBuiltContainerElement = (element) => {
            element.classList.remove(SIRIUS_ELEMENT.CLASSES.CENTER_SCREEN);
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