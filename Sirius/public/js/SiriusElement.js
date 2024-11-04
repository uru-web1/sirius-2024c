import {SiriusLogger} from "./SiriusLogger.js";
import sirius from "./Sirius.js";
import deepFreeze from "./utils/deep-freeze.js";
import {SIRIUS_ICON_ATTRIBUTES} from "./SiriusIcon.js";

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
    HIDE: 'hide',
    DISABLED: 'disabled'
})

/** Sirius element attributes default values */
export const SIRIUS_ELEMENT_ATTRIBUTES_DEFAULT = deepFreeze({
    [SIRIUS_ELEMENT_ATTRIBUTES.ID]: null,
    [SIRIUS_ELEMENT_ATTRIBUTES.STYLE]: null,
    [SIRIUS_ELEMENT_ATTRIBUTES.HIDE]: null,
    [SIRIUS_ELEMENT_ATTRIBUTES.DISABLED]: null
})

/** Sirius element properties */
export const SIRIUS_ELEMENT_PROPERTIES = deepFreeze({
    EVENTS: 'events',
})

/** Sirius element properties details */
export const SIRIUS_ELEMENT_PROPERTIES_DETAILS = deepFreeze({
    [SIRIUS_ELEMENT_PROPERTIES.EVENTS]: {DEFAULT: null, TYPE: SIRIUS_TYPES.OBJECT},
})

/** Sirius class that represents an element component */
export class SiriusElement extends HTMLElement {
    _properties = {}
    _styleSheets = {}
    _elementStyleSheetRules = new Map()
    _containerElement = null
    _applyingStyle = false;
    _hidden = false;
    _hiding= false;
    #elementName = ''
    #logger = null
    #isBuilt = false
    #onBuilt = []

    /**
     * Create a Sirius element
     * @param {object} properties - Element properties
     * @param {string} elementName - Element name
     */
    constructor(properties, elementName) {
        super();

        // Add element name
        this.#elementName = elementName;

        // Load Sirius element HTML attributes
        this._loadAttributes({
            instanceProperties: properties,
            attributes: SIRIUS_ELEMENT_ATTRIBUTES,
            attributesDefault: SIRIUS_ELEMENT_ATTRIBUTES_DEFAULT,
        });

        // Load Sirius element JS properties
        const eventsKey = SIRIUS_ELEMENT_PROPERTIES.EVENTS
        this._loadProperties({
            instanceProperties: {[eventsKey]: properties?.[eventsKey]},
            properties: SIRIUS_ELEMENT_PROPERTIES,
            propertiesDetails: SIRIUS_ELEMENT_PROPERTIES_DETAILS,
        });

        // Check if the element has an ID
        const id = this.id
        if (!id)
            throw new Error('Element ID is required');

        // Set instance ID and element ID
        sirius.setInstance(id, this);

        // Inject logger
        this.#logger = new SiriusLogger({
            name: this.#elementName,
            elementId: this.id
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

    /** Define observed attributes
     * @returns {string[]} - Observed attributes
     * */
    static get observedAttributes() {
        return Object.values(SIRIUS_ELEMENT_ATTRIBUTES).filter(
            attribute => attribute !== SIRIUS_ELEMENT_ATTRIBUTES.ID)
    }

    /** Get the element container
     * @returns {HTMLElement} - Element container
     */
    get containerElement() {
        return this._containerElement
    }

    /** Get hidden icon state
     * @returns {string} - Icon hidden state
     */
    get hidden() {
        return this.getAttribute(SIRIUS_ELEMENT_ATTRIBUTES.HIDE);
    }

    /** Set hidden icon state
     * @param {string} hide - Icon hidden state
     */
    set hidden(hide) {
        this.setAttribute(SIRIUS_ELEMENT_ATTRIBUTES.HIDE, hide);
    }

    /** Get the icon disabled state
     * @returns {string} - Icon disabled state
     */
    get disabled() {
        return this.getAttribute(SIRIUS_ICON_ATTRIBUTES.DISABLED);
    }

    /** Set the icon disabled state
     * @param {string} disable - Icon disabled state
     * */
    set disabled(disable) {
        this.setAttribute(SIRIUS_ICON_ATTRIBUTES.DISABLED, disable);
    }

    /** Get element ID attribute
     * @returns {string} - Element ID
     */
    get id() {
        return this.getAttribute(SIRIUS_ELEMENT_ATTRIBUTES.ID)
    }

    /** Set element ID attribute
     * @param {string} id - Element ID
     */
    set id(id) {
        this.setAttribute(SIRIUS_ELEMENT_ATTRIBUTES.ID, id)
    }

    /** Get style attribute
     * @returns {string} - Style attribute value
     */
    get style() {
        return this.getAttribute(SIRIUS_ELEMENT_ATTRIBUTES.STYLE)
    }

    /** Set style attribute
     * @param {string} style - Style attribute value
     */
    set style(style) {
        this.setAttribute(SIRIUS_ELEMENT_ATTRIBUTES.STYLE, style)
    }

    /** Get the element events
     * @returns {object} - Element events
     */
    get events() {
        return this._properties[SIRIUS_ELEMENT_PROPERTIES.EVENTS]
    }

    /** Load events attribute to the container element
     * @param {object} events - Events attribute value
     */
    set events(events) {
        if (!events)
            return

        // Add the events attribute to the element when built
        this._onBuiltContainerElement = (element) => {
            // Get the events key
            const eventsKey = SIRIUS_ELEMENT_ATTRIBUTES.EVENTS

            // Validate the element property
            this._updateProperty({
                name: eventsKey,
                value: events,
                propertiesDetails: SIRIUS_ELEMENT_PROPERTIES_DETAILS[eventsKey]
            })

            // Add event listeners
            for (let event in events)
                element.addEventListener(event, events[event])
        }
    }

    /** Get Sirius logger
     * @returns {SiriusLogger} - Sirius logger
     * */
    get logger() {
        return this.#logger
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

    /** Hide the element
     * @param {string} event - Event to wait for before hiding the element
     * @param {HTMLElement} element - Element to hide
     * */
    _hide(event, element) {
        // Hide the element when built
        this._onBuiltElement = {
            element: element || this.containerElement,
            callback: (element) => {
                // Check if the element is already hidden
                if (this._hidden|| this._hiding) {
                    this.logger.log('Element already hidden or hiding');
                    return;
                }

                // Check if there is an event to wait for
                if (!event) {
                    element.classList.add(SIRIUS_ELEMENT.CLASSES.HIDDEN);
                    this._hidden = true;
                    this.logger.log('Element hidden');
                    return;
                }

                // Get event handler
                const eventHandler = () => {
                    // Check if the event hasn't been stopped
                    if (this._hiding) {
                        // Hide the element
                        element.classList.remove(SIRIUS_ELEMENT.CLASSES.HIDING);
                        element.classList.add(SIRIUS_ELEMENT.CLASSES.HIDDEN);
                        this._hiding = false
                        this._hidden = true;

                        this.logger.log('Element hidden');
                    }

                    // Remove event listener
                    element.removeEventListener(event, eventHandler);
                }

                // Add event listener to hide the element
                element.addEventListener(event, eventHandler);

                // Remove the hidden class and add the hiding class
                element.classList.remove(SIRIUS_ELEMENT.CLASSES.HIDDEN);
                element.classList.add(SIRIUS_ELEMENT.CLASSES.HIDING);
                this._hiding = true;

                this.logger.log('Element hiding');
            }
        }
    }

    /** Show the element
     * @param {HTMLElement} element - Element to hide
     * */
    _show(element) {
        // Show the element when built
        this._onBuiltElement = {
            element: element || this.containerElement,
            callback: (element) => {
                // Check if the element is already shown
                if (!this._hidden&&!this._hiding) {
                    this.logger.log('Element already shown');
                    return;
                }

                // Check if the element is hiding
                if (this._hiding) {
                    this._hiding= false;
                    element.classList.remove(SIRIUS_ELEMENT.CLASSES.HIDING);
                }

                // Show the element
                element.classList.remove(SIRIUS_ELEMENT.CLASSES.HIDDEN);
                this._hidden = false;
                this.logger.log('Element shown');
            }
        }
    }

    /** Private method to set element ID attribute
     * @param {string} id - Element ID
     */
    #setId(id) {
        // Get the current element ID
        const currentId = this.getAttribute(SIRIUS_ELEMENT_ATTRIBUTES.ID);

        // Set the element ID attribute
        try {
            sirius.setInstance(id, this);
        } catch (error) {
            this.logger.error(error);
            return;
        }

        // Remove the old element ID
        sirius.removeInstance(currentId)

        // Set the element ID attribute
        this.setAttribute(SIRIUS_ELEMENT_ATTRIBUTES.ID, id)
    }

    /** Protected method to set style attribute
     * @param {function(): void} callback - Callback to apply the style
     */
    _setStyle(callback) {
        this._applyingStyle = true;
        this.setAttribute(SIRIUS_ELEMENT_ATTRIBUTES.STYLE, '');
        callback();
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

    /** Check SVG element
     * @param {HTMLElement} element - Element to check
     */
    _checkSVGElement(element) {
        if (!element) {
            this.logger.error(`Element is not set: ${element}`);
            return false
        }

        // Check if the element is an instance of SVGElement
        if (element instanceof SVGElement)
            return true;

        this.logger.error(`Invalid SVG element: ${element}`);
        return false;
    }

    /** Get element style sheet CSS rule
     * @param {string} ruleName - Rule name
     * @returns {CSSRule|null} - CSS rule or null if not found
     */
    _getElementStyleSheetCSSRule(ruleName) {
        // Check if the rule name is not set
        if (!ruleName || ruleName === "")
            return null

        // Check if the rule has been found
        if (this._elementStyleSheetRules.has(ruleName))
            return this._elementStyleSheetRules.get(ruleName);

        // Get the element style sheet
        const styleSheet = this._getElementStyleSheet();

        const rules = styleSheet.cssRules;

        // Iterate over the rules
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];

            // Check the rule name or selector text
            if (rule.name === ruleName || rule.selectorText === ruleName) {
                this._elementStyleSheetRules.set(ruleName, rule);
                return rule;
            }
        }
        return null
    }

    /** Change element style sheet keyframe animation rules
     * @param {string} name - Keyframe name
     * @param {string} rules - Keyframe rules
     */
    _setKeyframeRules(name, rules) {
        this.onBuilt = () => {
            // Check if the keyframe name is not set
            if (!name || name === "") {
                this.logger.error('Keyframe name is not set');
                return
            }

            // Check if the keyframe rules are not set
            if (!rules || rules === "") {
                this.logger.error('Keyframe rules are not set');
                return
            }

            // Get the rules
            const rule = this._getElementStyleSheetCSSRule(name);

            // Check if the rule was not found
            if (!rule) {
                this.logger.error(`Rule not found: ${name}`);
                return;
            }

            // Delete the keyframe rule
            while (rule.cssRules.length > 0)
                rule.deleteRule(rule.cssRules[0].keyText);

            // Add the keyframe rules
            for (let keyframeRule of rules.split('}'))
                rule.appendRule(keyframeRule + '}');

            // Log the keyframe rules change
            this.logger.log(`Changed keyframe rules: ${name}`);
        }
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
     * @returns {string} - Formatted attribute value
     */
    _formatAttributeValue(value) {
        return value.replace(/\n|\t|\s/g, '');
    }

    /** Set shadow DOM CSS variable
     * @param {string} name - Variable name
     * @param {string} value - Variable value
     * */
    _setCSSVariable(name, value) {
        this.onBuilt = () => {
            // Check if the variable name is not set
            if (!name || name === "") {
                this.logger.error('Variable name is not set');
                return
            }

            // Check if the variable value is not set
            if (!value || value === "") {
                this.logger.error('Variable value is not set');
                return
            }

            // Get the rules from shadow DOM :host
            const rule = this._getElementStyleSheetCSSRule(":host");

            // Check if the rule was not found
            if (!rule) {
                this.logger.error(`Rule not found: :host`);
                return;
            }

            // Set the CSS variable
            rule.style.setProperty(name, value);
        }
    }

    /** Load HTML attributes
     * @param {object} instanceProperties - Element instance properties
     * @param {object} attributes - Element HTML attributes to load
     * @param {object} attributesDetails - Element HTML attributes default values
     * */
    _loadAttributes({instanceProperties, attributes, attributesDefault}) {
        // Iterate over the attributes
        Object.values(attributes).forEach(name => {
            // Get the attribute value
            let value = this.getAttribute(name)

            // Check if the attribute is set
            if (value !== null && value !== "")
                return;

            // Check if the attribute is set on the instance properties
            if (instanceProperties && instanceProperties[name] !== undefined)
                value = instanceProperties[name];

            else {
                // Get the attribute default value
                value = attributesDefault[name]

                // Check if the default value is not set
                if (value === undefined) {
                    this.logger.error(`Default value is not set for '${name}' attribute`);
                    return;
                }
            }

            // Check if the value is null
            if (value === null) return;

            // Set the attribute default value
            this.setAttribute(name, value)
        })
    }

    /** Parse property types
     * @param {string[]|string} types - Property valid types
     * @returns {string[]} - Parsed types
     */
    _parseTypes(types) {
        return Array.isArray(types) ? types : [types]
    }

    /** Check if the property has the given type
     * @param {string[]|string} types - Property valid types
     * @param {string} type - Property type
     * @returns {{parsedTypes: string[], hasType: boolean}} - Parsed types and if the property has the given type
     */
    _hasPropertyType(types, type) {
        // Check if the valid types are an array
        const parsedTypes = this._parseTypes(types)
        return {parsedTypes, hasType: parsedTypes.includes(type)}
    }

    /** Validate and update the element property
     * @param {string} name - Property name
     * @param {any} value - Property value
     * @param {object} propertiesDetails - Properties details
     */
    _updateProperty({name, value, propertiesDetails}) {
        // Check if the property name is not set
        if (name === undefined) {
            this.logger.error(`Property '${name}' is not set`);
            return;
        }

        // Check if the property value is not set
        if (value === undefined) {
            this.logger.error(`Property value is not set for '${name}' property`);
            return;
        }

        // Check if the property details for the given property are not set
        if (!propertiesDetails[name]) {
            this.logger.error(`Property details are not set for '${name}' property`);
            return
        }

        // Get the property default value and types
        const {DEFAULT: def, TYPE: types} = propertiesDetails[name]

        // Get the property parsed types and check if the property has the given type
        const {parsedTypes, hasType: hasBoolean} = this._hasPropertyType(types, SIRIUS_TYPES.BOOLEAN)

        // Check if the property has any type
        if (parsedTypes.includes(SIRIUS_TYPES.ANY))
            return

        // Check if the property is a boolean and the value is an empty string
        if (value === "" && hasBoolean)
            value = true

        // Check if the default value is null
        if (def === null && value === null)
            return

        // Check if the property value is in the valid types array
        if (!parsedTypes.includes(typeof value))
            throw new Error(`Invalid property value '${value}' for '${name}' property. Valid types: ${parsedTypes.join(', ')}`)

        // Set the property value
        this._properties[name] = value
    }

    /** Load the element properties
     * @param {object} instanceProperties - Element instance properties
     * @param {object} properties - Element properties
     * @param {object} propertiesDetails - Element properties details
     */
    _loadProperties({instanceProperties, properties, propertiesDetails}) {
        // Iterate over the properties
        Object.values(properties).forEach(name => {
            // Get the property value
            let value = instanceProperties?.[name]

            // Check if the property is not set
            if (value === undefined) {
                // Get the property default value
                const {DEFAULT: def} = propertiesDetails[name]

                // Check if the default value is not set
                if (def === undefined) {
                    this.logger.error(`Default value is not set for '${name}' property`);
                    return;
                }
                value = def
            }

            // Validate and update the property
            this._updateProperty({name, value, propertiesDetails})
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
    _getElementStyleSheet() {
        return this._styleSheets[SIRIUS_ELEMENT.STYLE_SHEETS.ELEMENT];
    }

    /** Get the Sirius element general style sheet
     * @returns {CSSStyleSheet} - General style sheet
     */
    _getGeneralStyleSheet() {
        return this._styleSheets[SIRIUS_ELEMENT.STYLE_SHEETS.GENERAL];
    }

    /** Adopt style sheets by the shadow DOM
     */
    #adoptStyles() {
        // Get style sheets
        const element = this._getElementStyleSheet();
        const general = this._getGeneralStyleSheet();

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
}