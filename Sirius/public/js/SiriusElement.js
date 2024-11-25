import {SiriusLogger} from "./SiriusLogger.js";
import sirius from "./Sirius.js";
import deepFreeze from "./utils/deep-freeze.js";

/** SiriusElement constants */
export const SIRIUS_ELEMENT = deepFreeze({
    NAME: 'SiriusElement',
    STYLE_SHEETS: {
        ELEMENT: 'element',
        GENERAL: 'general'
    },
    CSS_VARS: {
        TRANSITION_DURATION: '--sirius-element--transition-duration',
    },
    EVENTS: {
        BUILT: 'built',
        HIDE: 'hide',
        INJECTED_LOGGER: 'injected-logger',
        LOADED_STYLES: 'loaded-styles'
    },
    CLASSES: {
        HIDDEN: 'hidden',
        HIDING: 'hiding',
        CENTER_SCREEN: 'center-screen',
        MAIN_ELEMENT: 'main-element'
    }
})

/** SiriusElement required attributes */
export const SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES = deepFreeze({
    ID: 'id'
})

/** SiriusElement attributes */
export const SIRIUS_ELEMENT_ATTRIBUTES = deepFreeze({
    STYLES: 'styles',
    STYLES_ON_HOVER: "styles-on-hover",
    STYLES_ON_ACTIVE: "styles-on-active",
    HIDE: 'hide',
    DISABLED: 'disabled'
})

/** SiriusElement attributes default values
 * If an attribute is not present in the object, the default value is null
 * */
export const SIRIUS_ELEMENT_ATTRIBUTES_DEFAULT = deepFreeze({})

/** SiriusElement properties */
export const SIRIUS_ELEMENT_PROPERTIES = deepFreeze({
    EVENTS: 'events',
    NAME: 'name'
})

/** Sirius class that represents an element component */
export default class SiriusElement extends HTMLElement {
    // Container elements
    _containerElement = null

    // Shadow DOM
    _template = null
    _templateContent = null
    _styleSheets = new Map()
    _styleSheetsCSSRules = new Map()

    // Attributes
    _applyingAttribute = new Map();
    _id = ''

    // Hidden state
    _hidden = false;
    _hiding = false;

    // Element properties
    _events = {}
    _name = ''

    // Built
    #isBuilt = false
    #onBuilt = []

    // Loaded styles
    #areStylesLoaded = false
    #onLoadedStyles = []

    // Logger
    #logger = null
    #isLoggerInjected = false
    #onInjectedLogger = []

    /**
     * Create a SiriusElement
     * @param {object} properties - SiriusElement properties
     */
    constructor(properties) {
        super();

        // Check if the properties contains the events
        const events = properties?.[SIRIUS_ELEMENT_PROPERTIES.EVENTS];
        if (events) this._events = events;

        // Check if the parameters contains the name
        const name = properties?.[SIRIUS_ELEMENT_PROPERTIES.NAME];
        if (name) this._name = name;

        // Build the SiriusElement
        this.#build(properties).then();
    }

    /** Define observed attributes
     * @returns {string[]} - Observed attributes
     * */
    static get observedAttributes() {
        return [...Object.values(SIRIUS_ELEMENT_ATTRIBUTES), ...Object.values(SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES)];
    }

    /** Build the SiriusElement
     * @param {object} properties - Element properties
     * */
    async #build(properties) {
        // Inject logger event listener
        this.addEventListener(SIRIUS_ELEMENT.EVENTS.INJECTED_LOGGER, async () => {
            // Set the logger as injected
            this.#isLoggerInjected = true;

            // Call the injected logger callbacks
            for (const callback of this.#onInjectedLogger) await callback(this.logger);

            // Clear the injected logger callbacks
            this.#onInjectedLogger = [];
        });

        // Load SiriusElement required HTML attributes
        this._loadRequiredAttributes({
            instanceProperties: properties,
            attributes: SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES,
        });

        // Inject logger
        this.#logger = new SiriusLogger({
            name: this.name,
            elementId: this.id
        });

        // Dispatch injected logger event
        this._dispatchInjectedLoggerEvent();

        // Load SiriusElement HTML attributes
        this._loadAttributes({
            instanceProperties: properties,
            attributes: SIRIUS_ELEMENT_ATTRIBUTES,
            attributesDefault: SIRIUS_ELEMENT_ATTRIBUTES_DEFAULT,
        });

        // Attach shadow DOM
        this.attachShadow({mode: "open"});

        // Built event listener
        this.addEventListener(SIRIUS_ELEMENT.EVENTS.BUILT, async () => {
            // Set the element as built
            this.#isBuilt = true;

            // Run callbacks on built
            for (const callback of this.#onBuilt) await callback();

            // Clear the on built callbacks
            this.#onBuilt = [];
        });

        // Loaded styles event listener
        this.addEventListener(SIRIUS_ELEMENT.EVENTS.LOADED_STYLES, async () => {
            // Set the element styles as loaded
            this.#areStylesLoaded = true;

            // Run callbacks on loaded styles
            for (const callback of this.#onLoadedStyles) await callback();

            // Clear the on loaded styles callbacks
            this.#onLoadedStyles = [];
        });
    }


    /** Get Sirius logger
     * @returns {SiriusLogger} - Sirius logger
     * */
    get logger() {
        return this.#logger
    }

    /** Set SiriusElement on built callback
     * @param callback - On built callback
     * */
    set onBuilt(callback) {
        // Check if the element has been built
        if (this.#isBuilt) {
            callback();
            return;
        }

        // Add the callback to the list
        this.#onBuilt.push(callback);
    }

    /** Set SiriusElement on loaded styles callback
     * @param callback - On loaded styles callback
     */
    set onLoadedStyles(callback) {
        // Check if the element styles have been loaded
        if (this.#areStylesLoaded) {
            callback();
            return;
        }

        // Add the callback to the list
        this.#onLoadedStyles.push(callback);
    }

    /** Set SiriusElement on injected logger callback
     * @param {function(): void} callback - On injected logger callback
     */
    set _onInjectedLogger(callback) {
        // Check if the logger has been injected
        if (this.#isLoggerInjected) {
            callback();
            return;
        }

        // Add the callback to the list
        this.#onInjectedLogger.push(callback);
    }

    /** Get the element name
     * @returns {string} - Element name
     */
    get name() {
        return this._name
    }

    /** Remove instance from Sirius */
    removeInstance() {
        sirius.onLoaded = async () => sirius.removeInstance(this.id);
    }

    /** Get the style sheet
     * @param {string} styleSheetName - Style sheet name
     * @returns {CSSStyleSheet|null} - Style sheet
     */
    _getStyleSheet(styleSheetName) {
        // Get the style sheet
        if (!this._styleSheets.has(styleSheetName)) {
            this.logger.error(`Style sheet not found: ${styleSheetName}`);
            return null;
        }

        return this._styleSheets.get(styleSheetName);
    }

    /** Get the SiriusElement style sheet
     * @returns {CSSStyleSheet} - Element style sheet
     */
    _getElementStyleSheet() {
        return this._getStyleSheet(SIRIUS_ELEMENT.STYLE_SHEETS.ELEMENT);
    }

    /** Get the SiriusElement general style sheet
     * @returns {CSSStyleSheet} - General style sheet
     */
    _getGeneralStyleSheet() {
        return this._getStyleSheet(SIRIUS_ELEMENT.STYLE_SHEETS.GENERAL);
    }

    /** Get style sheet CSS rules
     * @param {string} styleSheetName - Style sheet name
     * @returns {CSSRuleList|null} - CSS rules
     */
    _getStyleSheetCSSRules(styleSheetName) {
        // Get the style sheet
        const styleSheet = this._getStyleSheet(styleSheetName);

        // Check if the style sheet is not set
        if (!styleSheet)
            return null;

        return styleSheet.cssRules;
    }

    /** Get style sheet rules map
     * @param {string} styleSheetName - Style sheet name
     */
    _getStyleSheetCSSRulesMap(styleSheetName) {
        // Get the style sheet rules map
        if (!this._styleSheetsCSSRules.has(styleSheetName)) {
            this.logger.error(`Style sheet rules not found: ${styleSheetName}`);
            return null;
        }

        return this._styleSheetsCSSRules.get(styleSheetName);
    }

    /** Get style sheet CSS rule index
     * @param {string} styleSheetName - Style sheet name
     * @param {string} ruleName - Rule name
     * @returns {number} - CSS rule index
     */
    _getStyleSheetCSSRuleIndex(styleSheetName, ruleName) {
        // Check if the rule name is not set
        if (!ruleName)
            return -1

        // Get the style sheet CSS rules and the style sheet rules map
        const styleSheetCSSRules = this._getStyleSheetCSSRules(styleSheetName);
        const styleSheetCSSRulesIndex = this._getStyleSheetCSSRulesMap(styleSheetName);

        // Check if the style sheet CSS rules or style sheet CSS rules map is not set
        if (!styleSheetCSSRules || !styleSheetCSSRulesIndex)
            return -1;

        // Check if the rule has been found
        if (styleSheetCSSRulesIndex.has(ruleName))
            return styleSheetCSSRulesIndex.get(ruleName);

        // Check if the rule already exists
        const ruleIndex = Array.from(styleSheetCSSRules).findIndex(rule => {
            if (rule.selectorText === ruleName || rule.name === ruleName)
                return true;
        })

        // Check if the rule was found. If, set the rule index
        if (ruleIndex !== -1)
            styleSheetCSSRulesIndex.set(ruleName, ruleIndex);

        return ruleIndex;
    }

    /** Get the style sheet CSS rule
     * @param {string} styleSheetName - Style sheet name
     * @param {string} ruleName - Rule name
     * @returns {CSSRule|null} - CSS rule
     */
    _getStyleSheetCSSRule(styleSheetName, ruleName) {
        // Get the rule index
        const ruleIndex = this._getStyleSheetCSSRuleIndex(styleSheetName, ruleName);

        // Check if the rule was not found
        if (ruleIndex === -1)
            return null

        // Get the style sheet CSS rules
        const styleSheetCSSRules = this._getStyleSheetCSSRules(styleSheetName)

        // Check if the style sheet CSS rules is not set
        if (!styleSheetCSSRules)
            return null

        return styleSheetCSSRules[ruleIndex]
    }

    /** Move the style sheet CSS rule to the end of the style sheet
     * @param {string} styleSheetName - Style sheet name
     * @param {string} ruleName - Rule name
     */
    _moveStyleSheetCSSRuleToEnd(styleSheetName, ruleName) {
        // Get the style sheet
        const styleSheet = this._getStyleSheet(styleSheetName);
        if (!styleSheet)
            return

        // Get the style sheet CSS rules map and rule index
        const styleSheetCSSRulesMap = this._getStyleSheetCSSRulesMap(styleSheetName);
        const ruleIndex = this._getStyleSheetCSSRuleIndex(styleSheetName, ruleName);

        // Check if the rule was not found
        if (ruleIndex === -1)
            return

        // Get the rule
        const rule = styleSheet.cssRules[ruleIndex];

        // Remove the rule from the style sheet
        styleSheet.deleteRule(ruleIndex);

        // Add the rule to the end of the style sheet
        const index = styleSheet.cssRules.length;
        styleSheet.insertRule(rule.cssText, index);

        // Set the rule index
        styleSheetCSSRulesMap.set(ruleName, index);
    }

    /** Set the style sheet CSS rule
     * @param {string} styleSheetName - Style sheet name
     * @param {string} ruleName - Rule name
     * @param {string} rule - Rule
     */
    _setStyleSheetCSSRule(styleSheetName, ruleName, rule) {
        // Get the style sheet
        const styleSheet = this._getStyleSheet(styleSheetName);
        if (!styleSheet)
            return

        // Get the style sheet CSS rules map and rule index
        const styleSheetCSSRulesMap = this._getStyleSheetCSSRulesMap(styleSheetName);
        let ruleIndex = this._getStyleSheetCSSRuleIndex(styleSheetName, ruleName);

        // Check if the rule was found
        if (ruleIndex !== -1)
            styleSheet.deleteRule(ruleIndex);

        // Add the rule
        const index = styleSheet.cssRules.length;
        styleSheet.insertRule(rule, index);

        // Set the rule index
        styleSheetCSSRulesMap.set(ruleName, index)

        // Check if the rule ends with hover
        if (ruleName.endsWith(":hover")) {
            // Move the active rule to the end of the style sheet
            const activeRuleName = ruleName.replace(":hover", ":active");
            this._moveStyleSheetCSSRuleToEnd(styleSheetName, activeRuleName)
        }
    }

    /** Format CSS rules text
     * @param {string} rules - CSS rules
     */
    _formatCSSRules(rules) {
        return rules.split(';')
            .map(rule =>
                rule.split(':').map(keyValue=>keyValue.trim()).join(':'))
            .join(';');
    }

    /** Set style sheet keyframe rules
     * @param {string} styleSheetName - Style sheet name
     * @param {string} keyframeName - Keyframe name
     * @param {string} rules - Keyframe rules
     */
    _setKeyframeRules(styleSheetName, keyframeName, rules) {
        this.onLoadedStyles = () => {
            // Check if the keyframe name or keyframe rules is not set
            if (!keyframeName || !rules) {
                this.logger.error('Keyframe name or rules are not set');
                return
            }

            // Get the keyframe rule
            const keyframeRule = `@keyframes ${keyframeName} { ${rules} }`;

            // Set the keyframe rules
            this._setStyleSheetCSSRule(styleSheetName, keyframeName, keyframeRule)

            // Log the keyframe rules change
            this.logger.log(`Changed keyframe rules: ${keyframeName}`);
        }
    }

    /** Set element style sheet keyframe rules
     * @param {string} keyframeName - Keyframe name
     * @param {string} rules - Keyframe rules
     */
    _setElementKeyframeRules(keyframeName, rules) {
        this._setKeyframeRules(SIRIUS_ELEMENT.STYLE_SHEETS.ELEMENT, keyframeName, rules)
    }

    /** Set general style sheet keyframe rules
     * @param {string} keyframeName - Keyframe name
     * @param {string} rules - Keyframe rules
     */
    _setGeneralKeyframeRules(keyframeName, rules) {
        this._setKeyframeRules(SIRIUS_ELEMENT.STYLE_SHEETS.GENERAL, keyframeName, rules)
    }

    /** Set element style sheet selector rules
     * @param {string} styleSheetName - Style sheet name
     * @param {string} selector - Selector name
     * @param {string} rules - Selector rules
     */
    _setSelectorRuleStyles(styleSheetName, selector, rules) {
        this.onLoadedStyles = () => {
            // Check if the selector or rules are not set
            if (!selector || !rules) {
                this.logger.error('Selector or rules are not set');
                return
            }

            // Get the selector rule
            const classRule = `${selector} { ${rules} }`;

            // Set the selector rules
            this._setStyleSheetCSSRule(styleSheetName, selector, classRule)

            // Log the selector rules change
            this.logger.log(`Changed selector rules: ${selector}`);
        }
    }

    /** Set element style sheet selector rules
     * @param {string} selector - Selector name
     * @param {string} rules - Selector rules
     */
    _setElementSelectorRuleStyles(selector, rules) {
        this._setSelectorRuleStyles(SIRIUS_ELEMENT.STYLE_SHEETS.ELEMENT, selector, rules)
    }

    /** Set general style sheet selector rules
     * @param {string} selector - Selector name
     * @param {string} rules - Selector rules
     */
    _setGeneralSelectorRuleStyles(selector, rules) {
        this._setSelectorRuleStyles(SIRIUS_ELEMENT.STYLE_SHEETS.GENERAL, selector, rules)
    }

    /** Set main element class rule styles
     * @param {string} styleSheetName - Style sheet name
     * @param {string} rules - Class rules
     * @param {string} pseudoSelector - Pseudo selector
     * @param {string} parentSelectors - Parent selector. Used to increase CSS rule specificity
     */
    _setMainElementClassRuleStyles(styleSheetName, rules, pseudoSelector,...parentSelectors) {
        // Get the formatted parent selectors
        const formattedParentSelectors = parentSelectors.map(selector => selector.trim()).join(' ');

        // Check if the pseudo selector is set
        let mainElement = SIRIUS_ELEMENT.CLASSES.MAIN_ELEMENT;
        if (pseudoSelector)
            mainElement = this._getPseudoSelector(mainElement, pseudoSelector);

        // Get the selector
        let selector = `${formattedParentSelectors} .${mainElement}`;

        // Set the element class rule styles
        this._setSelectorRuleStyles(styleSheetName,selector, rules);
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
        return String(value).trim();
    }

    /** Set shadow DOM CSS variable
     * @param {string} styleSheetName - Style sheet name
     * @param {string} name - Variable name
     * @param {string} value - Variable value
     * */
    _setCSSVariable(styleSheetName, name, value) {
        this.onLoadedStyles = () => {
            // Check if the variable name or value is not set
            if (!name || !value) {
                this.logger.error('Variable name or value is not set');
                return
            }

            // Get the :host rule from shadow DOM
            const rule = this._getStyleSheetCSSRule(styleSheetName, ":host");

            // Check if the rule was not found
            if (!rule) {
                this.logger.error(`Rule not found: :host. Failed to set CSS variable: ${name}`);
                return;
            }

            // Set the CSS variable
            rule.style.setProperty(name, value);
        }
    }

    /** Set element shadow DOM CSS variable
     * @param {string} name - Variable name
     * @param {string} value - Variable value
     */
    _setElementCSSVariable(name, value) {
        this._setCSSVariable(SIRIUS_ELEMENT.STYLE_SHEETS.ELEMENT, name, value)
    }

    /** Set general shadow DOM CSS variable
     * @param {string} name - Variable name
     * @param {string} value - Variable value
     */
    _setGeneralCSSVariable(name, value) {
        this._setCSSVariable(SIRIUS_ELEMENT.STYLE_SHEETS.GENERAL, name, value)
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
    get hide() {
        return this.getAttribute(SIRIUS_ELEMENT_ATTRIBUTES.HIDE);
    }

    /** Set hidden icon state
     * @param {string} hide - Icon hidden state
     */
    set hide(hide) {
        this.setAttribute(SIRIUS_ELEMENT_ATTRIBUTES.HIDE, hide);
    }

    /** Get the icon disabled state
     * @returns {string} - Icon disabled state
     */
    get disabled() {
        return this.getAttribute(SIRIUS_ELEMENT_ATTRIBUTES.DISABLED);
    }

    /** Set the icon disabled state
     * @param {string} disable - Icon disabled state
     * */
    set disabled(disable) {
        this.setAttribute(SIRIUS_ELEMENT_ATTRIBUTES.DISABLED, disable);
    }

    /** Get element ID attribute
     * @returns {string} - Element ID
     */
    get id() {
        return this.getAttribute(SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID)
    }

    /** Set element ID attribute
     * @param {string} id - Element ID
     */
    set id(id) {
        this.setAttribute(SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID, id)
    }

    /** Get styles attribute
     * @returns {string} - Styles attribute value
     */
    get styles() {
        return this.getAttribute(SIRIUS_ELEMENT_ATTRIBUTES.STYLES)
    }

    /** Set styles attribute
     * @param {string} styles - Styles attribute value
     */
    set styles(styles) {
        this.setAttribute(SIRIUS_ELEMENT_ATTRIBUTES.STYLES, styles)
    }

    /** Get the caption styles on hover
     * @returns {string} - Caption styles on hover
     */
    get stylesOnHover() {
        return this.getAttribute(SIRIUS_ELEMENT_ATTRIBUTES.STYLES_ON_HOVER);
    }

    /** Set the caption styles on hover
     * @param {string} styles - Caption styles on hover
     */
    set stylesOnHover(styles) {
        this.setAttribute(SIRIUS_ELEMENT_ATTRIBUTES.STYLES_ON_HOVER, styles);
    }

    /** Get the caption styles on active
     * @returns {string} - Caption styles on active
     */
    get stylesOnActive() {
        return this.getAttribute(SIRIUS_ELEMENT_ATTRIBUTES.STYLES_ON_ACTIVE);
    }

    /** Set the caption styles on active
     * @param {string} styles - Caption styles on active
     */
    set stylesOnActive(styles) {
        this.setAttribute(SIRIUS_ELEMENT_ATTRIBUTES.STYLES_ON_ACTIVE, styles);
    }

    /** Get the transition duration attribute
     * @returns {string} - Transition duration attribute value
     */
    get transitionDuration() {
        return this.getAttribute(SIRIUS_ELEMENT_ATTRIBUTES.TRANSITION_DURATION);
    }

    /** Set the transition duration attribute
     * @param {string} duration - Transition duration attribute value
     */
    set transitionDuration(duration) {
        this.setAttribute(SIRIUS_ELEMENT_ATTRIBUTES.TRANSITION_DURATION, duration);
    }

    /** Load required HTML attributes
     * @param {object} instanceProperties - Element instance properties
     * @param {object} attributes - Element required HTML attributes to load
     * */
    _loadRequiredAttributes({instanceProperties, attributes}) {
        // Iterate over the attributes
        Object.values(attributes).forEach(name => {
            // Get the attribute value
            let value = this.getAttribute(name)

            // Check if the attribute is set
            if (value !== null && value !== "") {
                const trimmedValue = value.trim();

                if (trimmedValue === value)
                    return;

                // Set the attribute value and the applied attribute flag
                this._applyingAttribute.set(name, true);
                this.setAttribute(name, trimmedValue);
                return
            }

            if (instanceProperties && instanceProperties[name] !== undefined)
                value = instanceProperties[name];

            else
                throw new Error(`Value is not set for '${name}' attribute`);

            // Check if the value is null
            if (value === null) return;

            // Set the attribute default value
            this.setAttribute(name, value.trim())
        })
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
            if (value !== null && value !== "") {
                const trimmedValue = value.trim();

                if (trimmedValue === value)
                    return;

                // Set the attribute value and the applied attribute flag
                this._applyingAttribute.set(name, true);
                this.setAttribute(name, trimmedValue)
                return
            }

            // Check if the attribute is set on the instance properties
            if (instanceProperties)
                value = instanceProperties?.[name] || attributesDefault?.[name];

            // Get the attribute default value
            else
                value = attributesDefault?.[name]

            // Check if the value is null
            if (value === null || value === undefined) return;

            // Check the value type
            if (typeof value !== 'string')
                throw new Error(`Invalid value type for '${name}' attribute: ${typeof value}. Valid type: string`);

            // Set the attribute default value
            this.setAttribute(name, value.trim())
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

    /**  Load SiriusElement style sheet
     * @param {string} styleSheetName - Style sheet name
     * @param {string} cssFilename - CSS filename
     * @returns {Promise<void>} - Stylesheets
     */
    async #loadStyle(styleSheetName, cssFilename) {
        // Get the style sheet
        const styleSheet = await this.#loadCSSStyleSheet(cssFilename);

        // Update the style sheet
        this._styleSheets.set(styleSheetName, styleSheet)

        // Update the style sheet rules index map
        this._styleSheetsCSSRules.set(styleSheetName, new Map());
    }

    /**
     * Load SiriusElement style sheets
     * @param {string} cssFilename - CSS filename
     * @returns {Promise<void>} - Stylesheets
     */
    async #loadStyles(cssFilename) {
        // Load the element and the general stylesheets
        await this.#loadStyle(SIRIUS_ELEMENT.STYLE_SHEETS.GENERAL, SIRIUS_ELEMENT.NAME);
        await this.#loadStyle(SIRIUS_ELEMENT.STYLE_SHEETS.ELEMENT, cssFilename);

        // Move the main element class rule to the end of the style sheet
        const ruleName = `.${SIRIUS_ELEMENT.CLASSES.MAIN_ELEMENT}`;
        this._moveStyleSheetCSSRuleToEnd(SIRIUS_ELEMENT.STYLE_SHEETS.ELEMENT, ruleName);
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
        this.shadowRoot.adoptedStyleSheets = [general, element];
    }

    /**
     * Load element styles sheets and adopt them by the shadow DOM
     * @param {string} cssFilename - CSS filename
     */
    async _loadAndAdoptStyles(cssFilename = this.name) {
        // Create the CSS style sheets and add them to the shadow DOM
        await this.#loadStyles(cssFilename);
        this.#adoptStyles();
        
        // Dispatch loaded styles event
        this._dispatchLoadedStylesEvent()
    }

    /**
     * Create a template from the inner HTML
     * @param {string} innerHTML - Inner HTML
     * @returns {{template: HTMLTemplateElement|null, templateContent: Node|null}} - HTML template and template content
     */
    _createTemplate(innerHTML) {
        // Check if the inner HTML is empty
        if (!innerHTML) {
            this.logger.error('Failed to create template');
            return {template: null, templateContent: null};
        }

        // Create HTML template
        const template = document.createElement("template");
        template.innerHTML = innerHTML;

        // Clone the template content
        const templateContent = template.content.cloneNode(true);

        return {template, templateContent};
    }

    /** Create the container element template
     * @param {string} innerHTML - Inner HTML
     * @returns {Node|null} - Template content
     */
    _createContainerElementTemplate(innerHTML) {
        // Create the template
        const {template, templateContent} = this._createTemplate(innerHTML);

        // Check if the template is not set
        if (!template || !templateContent) {
            this.logger.error('Failed to create element template');
            return null;
        }

        // Set the template and the template content
        this._template = template;
        this._templateContent = templateContent;

        return templateContent.firstChild;
    }

    /** Hide the container element on built
     * @param {string|undefined} event - Event to wait for before hiding the element
     * */
    _hide(event) {
        this.onBuilt = () => {
            // Check if the element is already hidden
            if (this._hidden || this._hiding) {
                this.logger.log('Element already hidden or hiding');
                return;
            }

            // Check if there is an event to wait for
            if (!event) {
                this.containerElement.classList.add(SIRIUS_ELEMENT.CLASSES.HIDDEN);
                this._hidden = true;
                this.logger.log('Element hidden');
                return;
            }

            // Get event handler
            const eventHandler = () => {
                // Check if the event hasn't been stopped
                if (this._hiding) {
                    // Hide the element
                    this.containerElement.classList.remove(SIRIUS_ELEMENT.CLASSES.HIDING);
                    this.containerElement.classList.add(SIRIUS_ELEMENT.CLASSES.HIDDEN);
                    this._hiding = false
                    this._hidden = true;

                    this.logger.log('Element hidden');
                }

                // Remove event listener
                this.containerElement.removeEventListener(event, eventHandler);
            }

            // Add event listener to hide the element
            this.containerElement.addEventListener(event, eventHandler);

            // Remove the hidden class and add the hiding class
            this.containerElement.classList.remove(SIRIUS_ELEMENT.CLASSES.HIDDEN);
            this.containerElement.classList.add(SIRIUS_ELEMENT.CLASSES.HIDING);
            this._hiding = true;

            this.logger.log('Element hiding');
        }
    }

    /** Show the container element on built */
    _show() {
        // Show the element when built
        this.onBuilt = () => {
            // Check if the element is already shown
            if (!this._hidden && !this._hiding) {
                this.logger.log('Element already shown');
                return;
            }

            // Check if the element is hiding
            if (this._hiding) {
                this._hiding = false;
                this.containerElement.classList.remove(SIRIUS_ELEMENT.CLASSES.HIDING);
            }

            // Show the element
            this.containerElement.classList.remove(SIRIUS_ELEMENT.CLASSES.HIDDEN);
            this._hidden = false;
            this.logger.log('Element shown');
        }
    }
    /** Private method to set element ID attribute
     * @param {string} id - Element ID
     */
    _setId(id) {
        if (!id) {
            this._onInjectedLogger = () => this.logger.error('Element ID is required');
            return;
        }

        // Remove the old element ID
        if (this._id)
            sirius.removeInstance(this._id)

        // Set the element ID attribute
        try {
            sirius.setInstance(id, this);
            this._id = id;
        } catch (error) {
            this._onInjectedLogger = () => this.logger.error(error.message);
        }
    }

    /** Protected method to set styles attribute
     * @param {string} rules - Styles rules
     * @param {string} parentSelectors - Parent selectors
     */
    _setStyles(rules, ...parentSelectors) {
        this._setMainElementClassRuleStyles(SIRIUS_ELEMENT.STYLE_SHEETS.ELEMENT,rules, "",...parentSelectors);
    }

    /** Get class name with pseudo selector
     * @param {string} className - Class name
     * @param {string} pseudoSelector - Pseudo selector
     */
    _getPseudoSelector(className, pseudoSelector) {
        return `${className}:${pseudoSelector}`
    }

    /** Protected method to set the caption styles on hover attribute
     * @param {string} rules - Styles rules
     * @param {string} parentSelectors - Parent selectors
     */
    _setStylesOnHover(rules, ...parentSelectors) {
        if (rules)
            this._setMainElementClassRuleStyles(SIRIUS_ELEMENT.STYLE_SHEETS.ELEMENT,rules, "hover",...parentSelectors);
    }

    /** Protected method to set the caption styles on active attribute
     * @param {string} rules - Styles rules
     * @param {string} parentSelectors - Parent selectors
     */
    _setStylesOnActive(rules,...parentSelectors) {
        if (rules)
            this._setMainElementClassRuleStyles(SIRIUS_ELEMENT.STYLE_SHEETS.ELEMENT,rules, "active",...parentSelectors);
    }

    /** Protected method to set the transition duration attribute
     * @param {string} duration - Transition duration
     */
    _setTransitionDuration(duration) {
        this._setGeneralCSSVariable(SIRIUS_ELEMENT.CSS_VARS.TRANSITION_DURATION, duration);
    }

    /** Protected method to set events property to the given element
     * @param {object} events - Events attribute value
     * @param {HTMLElement} element - Element to set the events
     */
    _setEvents(events, element) {
        this.onBuilt = () => {
            // Check if the events or element is not set
            if (!events || !element) {
                this.logger.error('Events or element is not set');
                return
            }

            // Check if the events are not an object
            if (typeof events !== 'object') {
                this.logger.error('Events are not an object');
                return
            }

            // Add event listeners
            let fn
            for (const event in events) {
                // Remove current event listener
                this.removeEventListener(event, element)

                // Get the event function
                fn = events[event]

                // Check if the event is not a function
                if (typeof fn !== 'function') {
                    this.logger.error(`Event '${event}' is not a function`);
                    continue
                }

                // Add the event listener
                element.addEventListener(event, fn)

                // Set the event
                this._events[event] = fn
            }
        }
    }

    /** Remove event listener
     * @param {string} event - Event to be removed
     * @param {HTMLElement} element - Element to remove the event listener
     */
    removeEventListener(event, element) {
        // Check if the event or element is not set
        if (!event || !element) {
            this.logger.error('Event or element is not set');
            return
        }

        // Check if the event is set
        if (!this._events[event])
            return

        // Get the event function
        const fn = this._events[event]

        // Remove the event listener
        element.removeEventListener(event, fn)
    }

    /** Get derived element ID attribute
     * @returns {string} aliases - Derived element alias
     * */
    _getDerivedId(...aliases) {
        return [this.id, ...aliases].join("__");
    }

    /** Add the element to the body */
    addToBody() {
        document.body.appendChild(this);
    }

    /** Center the element on the screen */
    centerScreen() {
        this.onBuilt = () => {
            // Center the element when built
            this.containerElement.classList.add(SIRIUS_ELEMENT.CLASSES.CENTER_SCREEN);
            this.logger.log('Element centered on the screen');
        }
    }

    /** Remove centering of the element */
    removeCenterScreen() {
        this.onBuilt = () => {
            this.containerElement.classList.remove(SIRIUS_ELEMENT.CLASSES.CENTER_SCREEN);
            this.logger.log('Element removed from center screen');
        }
    }

    /** Dispatch event
     * @param {string} eventName - Event name
     */
    _dispatchEventName(eventName) {
        this.dispatchEvent(new CustomEvent(eventName, {bubbles: false}));
    }

    /** Dispatch the built event */
    _dispatchBuiltEvent() {
        this._dispatchEventName(SIRIUS_ELEMENT.EVENTS.BUILT)
    }

    /** Dispatch the loaded styles event */
    _dispatchLoadedStylesEvent() {
        this._dispatchEventName(SIRIUS_ELEMENT.EVENTS.LOADED_STYLES)
    }

    /** Dispatch on injected logger event */
    _dispatchInjectedLoggerEvent() {
        this._dispatchEventName(SIRIUS_ELEMENT.EVENTS.INJECTED_LOGGER);
    }

    /** Log attribute change
     * @param {string} name - Attribute name
     * @param {string} oldValue - Old attribute value
     * @param {string} newValue - New attribute value
     */
    _logAttributeChange(name, oldValue, newValue) {
        this._onInjectedLogger = () =>
            this.logger.log(`'${name}' attribute changed: ${oldValue} -> ${newValue}`);
    }

    /** Attribute change pre-handler
     * @param {string} name - Attribute name
     * @param {string} oldValue - Old value
     * @param {string} newValue - New value
     * @returns {{formattedValue: string, shouldContinue: boolean}} - Formatted attribute value and if the attribute change should continue
     */
    _attributeChangePreHandler(name, oldValue, newValue) {
        // Check if the attribute is being applied
        if (this._applyingAttribute.has(name) && this._applyingAttribute.get(name)) {
            this._applyingAttribute.set(name, false);
            return {formattedValue: "", shouldContinue: false}
        }

        // Format the attribute value
        let formattedValue
        if (name.includes(SIRIUS_ELEMENT_ATTRIBUTES.STYLES))
            formattedValue = this._formatCSSRules(newValue);
        else
            formattedValue = this._formatAttributeValue(newValue);

        // Check if the attribute value has changed
        if (oldValue === newValue)
            return {formattedValue, shouldContinue: false}

        // Compare the old value and the new formatted value
        const shouldContinue = oldValue !== formattedValue;

        // Log the attribute change
        if (shouldContinue)
            this._logAttributeChange(name, oldValue, formattedValue);

        // Check if the formatted value and the new value are the same
        if (formattedValue !== newValue) {
            this._applyingAttribute.set(name, true);
            this.setAttribute(name, formattedValue);
        }

        return {formattedValue, shouldContinue: oldValue !== formattedValue}
    }
}