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
        BUILT: 'built'
    },
    ATTRIBUTES: {
        ID: {NAME: "id", DEFAULT: null, TYPE: SIRIUS_TYPES.STRING},
        STYLE: {NAME: 'style', DEFAULT: null, TYPE: [SIRIUS_TYPES.OBJECT, SIRIUS_TYPES.STRING]},
        EVENTS: {NAME: 'events', DEFAULT: null, TYPE: SIRIUS_TYPES.OBJECT},
    },
    CLASSES: {
        HIDDEN: 'hidden',
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

    /** Hide the element */
    hide() {
        this._onBuiltContainerElement = () => {
            this.containerElement.classList.add(SIRIUS_ELEMENT.CLASSES.HIDDEN.NAME);
            this.logger.log('Element hidden');
        }
    }

    /** Show the element */
    show() {
        this._onBuiltContainerElement = () => {
            this.containerElement.classList.remove(SIRIUS_ELEMENT.CLASSES.HIDDEN.NAME);
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

    dispatchBuiltEvent() {
        this.dispatchEvent(new Event(SIRIUS_ELEMENT.EVENTS.BUILT));
    }
}