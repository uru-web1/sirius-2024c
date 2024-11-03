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
    STYLE_SHEETS: {
        ELEMENT: 'element',
        GENERAL: 'general'
    },
    EVENTS: {
        BUILT: 'built',
        HIDE: 'hide',
    },
    CLASSES: {
        HIDDEN: 'hidden',
        HIDING: 'hiding',
        CENTER_SCREEN: 'center-screen'
    }
})

/** Sirius element attributes */
export const SIRIUS_ELEMENT_ATTRIBUTES = deepFreeze({
    ID: 'id',
    STYLE: 'style',
    EVENTS: 'events',
    HIDE: 'hide',
})

/** Sirius element attributes details */
export const SIRIUS_ELEMENT_ATTRIBUTES_DETAILS = deepFreeze({
    [SIRIUS_ELEMENT_ATTRIBUTES.ID]: {DEFAULT: null, TYPE: SIRIUS_TYPES.STRING},
    [SIRIUS_ELEMENT_ATTRIBUTES.STYLE]: {DEFAULT: null, TYPE: [SIRIUS_TYPES.OBJECT, SIRIUS_TYPES.STRING]},
    [SIRIUS_ELEMENT_ATTRIBUTES.EVENTS]: {DEFAULT: null, TYPE: SIRIUS_TYPES.OBJECT},
    [SIRIUS_ELEMENT_ATTRIBUTES.HIDE]: {DEFAULT: false, TYPE: SIRIUS_TYPES.BOOLEAN},
})

/** Sirius class that represents an element component */
export class SiriusElement extends HTMLElement {
    _hidden = false
    _attributes = {}
    _styleSheets = {}
    _elementStyleSheetRules= new Map()
    #containerElement = null
    #elementName = 'UNDEFINED'
    #elementId = ''
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
        this._loadAttributes({
            attributes: SIRIUS_ELEMENT_ATTRIBUTES,
            attributesDetails: SIRIUS_ELEMENT_ATTRIBUTES_DETAILS,
            properties: props
        });

        // Check if the element has an ID
        if (!this._attributes[SIRIUS_ELEMENT_ATTRIBUTES.ID])
            throw new Error('Element ID is required');

        // Set instance ID and element ID
        sirius.setInstance(this._attributes.id, this);
        this.#elementId = this._attributes.id;

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

    /** Get element ID
     * @returns {string} - Element ID
     */
    get elementId() {
        return this.#elementId
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
        // Check if the element is built
        if (this.#isBuilt) {
            callback();
            return;
        }

        // Add the callback to the list
        this.#onBuilt.push(callback);
    }

    /** Added on built element callback
     * @param {HTMLElement} element - Element to check
     * @param {function(HTMLElement): void} callback - On built callback
     * */
    set _onBuiltElement({element, callback}) {
        this.onBuilt = () => {
            if (this._checkElement(element))
                callback(element)
        }
    }

    /** Added on built container element callback
     * @param {function(HTMLElement): void} callback - On built callback
     */
    set _onBuiltContainerElement(callback) {
        this.onBuilt = () => this._onBuiltElement = {element: this.containerElement, callback}
    }

    /** Load style attribute
     * @param {string|object|null} style - Style attribute value
     * @param {HTMLElement} element - Element to add the style
     */
    set style({style, element}) {
        if (!style)
            return

        // Add the style attribute to the element when built
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

                else
                    this.logger.error('Invalid style attribute value');
            }
        }
    }

    /** Load events attribute
     * @param {object|null} events - Events attribute value
     * @param {HTMLElement} element - Element to add the event listeners
     */
    set events({events, element}) {
        if (!events)
            return

        // Add the events attribute to the element when built
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
            }
        }
    }

    /** Get element style sheet CSS rule
     * @param {string} ruleName - Rule name
     * @returns {CSSRule} - CSS rule
     */
    _getElementStyleSheetCSSRule(ruleName) {
         // Check if the rule has been found
        if (this._elementStyleSheetRules.has(ruleName))
            return this._elementStyleSheetRules.get(ruleName);

        // Get the element style sheet
        const styleSheet = this.#getElementStyleSheet();

        const rules = styleSheet.cssRules;

        // Iterate over the rules
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];

            // Check the rule name
            if (rule.name === ruleName)
            {
                this._elementStyleSheetRules.set(ruleName, rule);
                return rule;
            }
        }
        return null
    }

    /** Change element style sheet keyframe animation content
     * @param {string} styleSheetName - Stylesheet name
     * @param {string} keyframeName - Keyframe name
     * @param {string} keyframeRules - Keyframe content
     */
    set keyframeRules({keyframeName, keyframeRules}) {
        this.onBuilt = ()=> {
            // Check if the keyframe rules are not set
            if (!keyframeRules || keyframeRules === "")
                return

            // Get the rules
            const rule = this._getElementStyleSheetCSSRule(keyframeName);

            // Check if the rule is not found
            if (!rule) {
                this.logger.error(`Rule not found: ${keyframeName}`);
                return;
            }

            // Delete the keyframe rule
            while (rule.cssRules.length > 0)
                rule.deleteRule(rule.cssRules[0].keyText);

            // Add the keyframe rules
            for (let keyframeRule of keyframeRules.split('}'))
                rule.appendRule(keyframeRule + '}');

            // Log the keyframe content change
            this.logger.log(`Changed keyframe content: ${keyframeName}`);
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

    /** typedef {Object.<string, string>} Attributes
     * @property {string} [key] - Attribute snake case capitalized name
     * @property {string} [value] - Attribute camel case name
     */

    /** typedef {Object} AttributeDetails
     * @property {string} NAME - Attribute camel case name
     * @property {any} DEFAULT - Attribute default value
     */

    /**
     * @typedef {Object.<string, AttributeDetails>} AttributesDetails
     * @property {string} [key] - Attribute camel case name
     * @property {AttributeDetails} [value] - Attribute details
     */

    /** Parse attribute types
     * @param {string[]|string} types - Element types attribute
     * @returns {string[]} - Parsed types
     */
    _parseTypes(types) {
        return Array.isArray(types) ? types : [types]
    }

    /** Check if the attribute has the given type
     * @param {string[]|string} types - Element types attribute
     * @param {string} type - Attribute type
     * @returns {{parsedTypes: string[], hasType: boolean}} - Parsed types and if the attribute has the given type
     */
    _hasAttributeType(types, type) {
        // Check if the valid types are an array
        const parsedTypes = this._parseTypes(types)
        return {parsedTypes, hasType: parsedTypes.includes(type)}
    }

    /** Validate the element attribute
     * @param {string} name - Attribute name
     * @param {any} value - Attribute value
     * @param {string[]|string} types - Attribute valid types
     * @param {any} def - Attribute default value
     */
    _validateAttribute({name, value, types, def}) {
        // Parse types
        const {parsedTypes, hasType: hasBoolean} = this._hasAttributeType(types, SIRIUS_TYPES.BOOLEAN)

        // Check if the attribute is a boolean and the value is an empty string
        if (value === "" && hasBoolean)
            value = true

        // Check if the attribute has any type
        if (parsedTypes.includes(SIRIUS_TYPES.ANY))
            return

        // Check if the default value is null
        if (def === null && value === null)
            return

        // Check if the attribute value is in the valid types array
        if (!parsedTypes.includes(typeof value))
            throw new Error(`Invalid attribute value '${value}' for '${name}' attribute. Valid types: ${parsedTypes.join(', ')}`)

        // Set the attribute value
        this._attributes[name] = value
    }

    /** Load HTML attributes and properties
     * @param {Attributes} attributes - Element HTML attributes to load
     * @param {AttributeDetails} attributesDetails - Element HTML attributes details to load
     * @param {object} properties - Element properties
     * */
    _loadAttributes({attributes, attributesDetails, properties}) {
        // Iterate over the attributes
        Object.values(attributes).forEach(name => {
            // Get the attribute name and default value
            const {DEFAULT: def, TYPE: types} = attributesDetails[name]

            // Get the attribute value
            let value = this.getAttribute(name)

            // Check if the attribute is not set
            if (value === null) {
                if (properties?.[name] === undefined)
                    value = def

                // Get the attribute value from the properties
                else
                    value = properties[name]

                // Set the attribute value
                if (value !== null && value !== undefined && value !== "")
                    this.setAttribute(name, value)
            }

            // Validate the attribute
            this._validateAttribute({
                name,
                def,
                types,
                value,
            })
        })
    }

    /** Load a given CSS style sheet file content
     * @param {string} cssFilename - CSS filename
     */
    async #loadCSSStyleSheet(cssFilename) {
        // Create the CSS stylesheet
        const sheet = new CSSStyleSheet();

        // Load the CSS file content
        const css = await sirius.loadCSSStyleSheetFile(cssFilename);

        // Add the CSS content to the stylesheet
        sheet.replaceSync(css);

        return sheet;
    }

    /**
     * Get the Sirius element style sheets
     * @param {string} cssFilename - CSS filename
     * @returns {Promise<void>} - Stylesheets
     */
    async #loadStyles(cssFilename) {
        // Get the element and the general stylesheets
        const elementStylesheet = await this.#loadCSSStyleSheet(cssFilename);
        const generalStylesheet = await this.#loadCSSStyleSheet(SIRIUS_ELEMENT.NAME);

        // Update the stylesheets
        this._styleSheets = {
            [SIRIUS_ELEMENT.STYLE_SHEETS.ELEMENT]: elementStylesheet,
            [SIRIUS_ELEMENT.STYLE_SHEETS.GENERAL]: generalStylesheet
        };
    }

    /** Get the Sirius element style sheet
     * @returns {CSSStyleSheet} - Element style sheet
     */
    #getElementStyleSheet() {
        return this._styleSheets[SIRIUS_ELEMENT.STYLE_SHEETS.ELEMENT];
    }

    /** Get the Sirius element general style sheet
     * @returns {CSSStyleSheet} - General style sheet
     */
    #getGeneralStyleSheet() {
        return this._styleSheets[SIRIUS_ELEMENT.STYLE_SHEETS.GENERAL];
    }

    /** Adopt style sheets by the shadow DOM
     */
    #adoptStyles() {
        // Get style sheets
        const element = this.#getElementStyleSheet();
        const general = this.#getGeneralStyleSheet();

        // Check if the style sheets are not set
        if (!element || !general) {
            this.logger.error('Style sheets are not set');
            return;
        }

        // Add the style sheets to the shadow DOM
        this.shadowRoot.adoptedStyleSheets = [element, general];
    }

    /**
     * Load element styles sheets and adopt them by the shadow DOM
     * @param {string} cssFilename - CSS filename
     */
    async _loadAndAdoptStyles(cssFilename = this.#elementName) {
        // Create the CSS style sheets and add them to the shadow DOM
        await this.#loadStyles(cssFilename);
        this.#adoptStyles();
    }

    /** Format CSS variables
     * @param {string} name - Variable name
     * @returns {string} - Formatted CSS variable
     */
    _formatCSSVariable(name) {
        return `var(${name})`
    }

    /** Format attribute value
     * @param {string} value - Attribute value to format
     */
    _formatAttributeValue(value) {
        return value.replace(/\n|\t|\s/g, '');
    }

    /** Update shadow DOM variable
     * @param {string} name - Variable name
     * @param {string} value - Variable value
     * */
    _updateCSSVariable(name, value) {
        this.onBuilt = () => {
            console.log(this.#getElementStyleSheet());
            //.sheet.rules[0].style.setProperty(name, value)
        }
    }

    /**
     * Create a template from the inner HTML
     * @param {string} innerHTML - Inner HTML
     */
    _createTemplate(innerHTML) {
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

    /** Hide the element
     * @param {string} event - Event to wait for before hiding the element
     * @param {HTMLElement} element - Element to hide
     * */
    hide(event, element) {
        // Hide the element when built
        this._onBuiltElement = {
            element: element || this.containerElement,
            callback: (element) => {
                // Check if the element is already hidden
                if (this._hidden) {
                    this.logger.log('Element already hidden');
                    return;
                }

                // Set the element as hidden
                this._hidden = true

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
        // Show the element when built
        this._onBuiltElement = {
            element: element || this.containerElement,
            callback: (element) => {
                // Check if the element is already shown
                if (!this._hidden) {
                    this.logger.log('Element already shown');
                    return;
                }

                // Set the element as shown
                this._hidden = false;

                element.classList.remove(SIRIUS_ELEMENT.CLASSES.HIDDEN);
                this.logger.log('Element shown');
            }
        }
    }

    /** Center the element on the screen */
    centerScreen() {
        // Center the element when built
        this._onBuiltContainerElement = (element) => {
            element.classList.add(SIRIUS_ELEMENT.CLASSES.CENTER_SCREEN);
            this.logger.log('Element centered on the screen');
        }
    }

    /** Remove centering of the element */
    removeCenterScreen() {
        // Remove centering of the element when built
        this._onBuiltContainerElement = (element) => {
            element.classList.remove(SIRIUS_ELEMENT.CLASSES.CENTER_SCREEN);
            this.logger.log('Element removed from center screen');
        }
    }

    /** Dispatch event
     * @param {string} eventName - Event name
     */
    dispatchEventName(eventName) {
        this.dispatchEvent(new Event(eventName));
    }

    /** Dispatch the built event */
    dispatchBuiltEvent() {
        this.dispatchEventName(SIRIUS_ELEMENT.EVENTS.BUILT);
    }

    /** Dispatch hide event */
    dispatchHideEvent() {
        this.dispatchEventName(SIRIUS_ELEMENT.EVENTS.HIDE);
    }
}