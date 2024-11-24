import {
    SIRIUS_ELEMENT_ATTRIBUTES,
    SIRIUS_ELEMENT_PROPERTIES,
    SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES
} from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";
import {SIRIUS_CONTROL_ELEMENT_ATTRIBUTES} from "./SiriusControlElement.js";
import SiriusLinkedControlElement from "./SiriusLinkedControlElement.js";

/** SiriusListBox class */
export const SIRIUS_LIST_BOX = deepFreeze({
    NAME: "SiriusListBoxV2",
    TAG: "sirius-list-box",
    CSS_VARS: {
        GAP: "--sirius-list-box--gap",
        PADDING: "--sirius-list-box--padding",
        MARGIN: "--sirius-list-box--margin",
        MAX_WIDTH: "--sirius-list-box--max-width",
        BACKGROUND_COLOR: "--sirius-list-box--background-color",
        BOX_SHADOW: "--sirius-list-box--box-shadow",
        HEAD_CONTAINER_PADDING: "--sirius-list-box--head-container--padding",
        HEAD_CONTAINER_BORDER_BOTTOM: "--sirius-list-box--head-container--border-bottom",
        ITEMS_CONTAINER_GAP: "--sirius-list-box--items-container--gap",
        ITEMS_CONTAINER_PADDING: "--sirius-list-box--items-container--padding",
    },
    SLOTS: {
        HEAD: 'head',
        ITEMS: 'items',
    },
    CLASSES: {
        LIST_BOX_CONTAINER: 'list-box-container',
        HEAD_CONTAINER: 'head-container',
        HEAD: 'head',
        ITEMS_CONTAINER: 'items-container',
        ITEMS: 'items',
    }
})

/** SiriusListBox attributes */
export const SIRIUS_LIST_BOX_ATTRIBUTES = deepFreeze({
    GAP: "gap",
    PADDING: "padding",
    MARGIN: "margin",
    MAX_WIDTH: "max-width",
    BACKGROUND_COLOR: "background-color",
    BOX_SHADOW: "box-shadow",
    HEAD_CONTAINER_PADDING: "head-container-padding",
    HEAD_CONTAINER_BORDER_BOTTOM: "head-container-border-bottom",
    ITEMS_CONTAINER_GAP: "items-container-gap",
    ITEMS_CONTAINER_PADDING: "items-container-padding",
})

/** SiriusListBox attributes default values */
export const SIRIUS_LIST_BOX_ATTRIBUTES_DEFAULT = deepFreeze({});

/** SiriusListBox properties */
export const SIRIUS_LIST_BOX_PROPERTIES = deepFreeze({
    HEAD: 'head',
    ITEMS: 'items',
})

/** Sirius class that represents a list box component */
export default class SiriusListBoxV2 extends SiriusLinkedControlElement {
    // Container elements
    #listBoxContainerElement = null;
    #headContainerElement = null;
    #itemsContainerElement = null;

    /**
     * Create a SiriusListBox element
     * @param {object} properties - Element properties
     */
    constructor(properties) {
        super({...properties, [SIRIUS_ELEMENT_PROPERTIES.NAME]: SIRIUS_LIST_BOX.NAME},
            SIRIUS_LIST_BOX_PROPERTIES.HEAD, SIRIUS_LIST_BOX_PROPERTIES.ITEMS);

        // Build the SiriusListBox
        this.#build(properties).then();

    }

    /** Define observed attributes
     * @returns {string[]} - Observed attributes
     * */
    static get observedAttributes() {
        return [...SiriusLinkedControlElement.observedAttributes, ...Object.values(SIRIUS_LIST_BOX_ATTRIBUTES)];
    }

    /** Get the template for the SiriusListBox
     * @returns {string} - Template
     */
    #getTemplate() {
        // Get the ListBox classes
        const listBoxContainerClasses = [SIRIUS_LIST_BOX.CLASSES.LIST_BOX_CONTAINER];
        const headContainerClasses = [SIRIUS_LIST_BOX.CLASSES.HEAD_CONTAINER];
        const headClasses = [SIRIUS_LIST_BOX.CLASSES.HEAD];
        const itemsListContainerClasses = [SIRIUS_LIST_BOX.CLASSES.ITEMS_CONTAINER];
        const itemsClasses = [SIRIUS_LIST_BOX.CLASSES.ITEMS];

        return `<div class="${listBoxContainerClasses.join(' ')}">
                    <div class="${headContainerClasses.join(' ')}">
                        <slot name="${SIRIUS_LIST_BOX.SLOTS.HEAD}" class="${headClasses.join(' ')}"></slot>
                    </div>
                    <div class="${itemsListContainerClasses.join(' ')}">
                        <slot name="${SIRIUS_LIST_BOX.SLOTS.ITEMS}" class="${itemsClasses.join(' ')}"></slot>
                    </div>
                </div>`;
    }

    /** Build the SiriusListBox
     * @param {object} properties - Element properties
     * @returns {Promise<void>} - Build the SiriusListBox
     * */
    async #build(properties) {
        // Load Sirius ListBox HTML attributes
        await this._loadAttributes({
            instanceProperties: properties,
            attributes: SIRIUS_LIST_BOX_ATTRIBUTES,
            defaultAttributes: SIRIUS_LIST_BOX_ATTRIBUTES_DEFAULT
        });

        // Create the CSS stylesheet and add it to the shadow DOM
        await this._loadAndAdoptStyles();

        // Get HTML inner content
        const innerHTML = this.#getTemplate();

        // Create the HTML template
        this._createTemplate(innerHTML);

        // Add ListBox to the shadow DOM
        this.#listBoxContainerElement = this._containerElement = this._templateContent.firstChild;
        this.#headContainerElement = this.#listBoxContainerElement.firstElementChild;
        this._linkedParentSlotElement = this.headContainerElement.firstElementChild;
        this.#itemsContainerElement = this.#listBoxContainerElement.lastElementChild;
        this._linkedChildrenSlotElement = this.itemsContainerElement.firstElementChild;
        this.shadowRoot.appendChild(this.containerElement);

        // Set up the linked parent observer
        this._setLinkedParentObserver();

        // Set up the linked children observer
        this._setLinkedChildrenObserver();

        // Set the properties
        this.linkedParent = this._linkedParent;
        this.linkedChildren = this._linkedChildren

        // Dispatch the built event
        this.dispatchBuiltEvent();
    }

    /** Get the ListBox container element
     * @returns {HTMLDivElement|null} - ListBox container element
     */
    get listBoxContainerElement() {
        return this.#listBoxContainerElement;
    }

    /** Get the head container element
     * @returns {HTMLDivElement|null} - Head container element
     */
    get headContainerElement() {
        return this.#headContainerElement
    }

    /** Get the items container element
     * @returns {HTMLDivElement} - Items container element
     */

    get itemsContainerElement() {
        return this.#itemsContainerElement
    }

    /** Get the head slot element
     * @returns {HTMLSlotElement} - Head slot element
     * */
    get headSlotElement() {
        return this._linkedParentSlotElement;
    }

    /** Get the head element
     * @returns {SiriusControlElement|null} - Head element
     * */
    get headElement() {
        return this._linkedParent;
    }

    /** Get the items slot element
     * @returns {HTMLSlotElement} - Items slot element
     */
    get itemsSlotElement() {
        return this._linkedChildrenSlotElement;
    }

    /** Get the items elements
     * @returns {SiriusControlElement[]} - Items elements
     */
    get itemsElements() {
        return this._linkedChildren
    }

    /** Get the checked items
     * @returns {SiriusControlElement[]} - Checked items
     */
    get checkedItems() {
        return this.checkedChildrenElements;
    }

    /** Get gap attribute
     * @returns {string} - Gap attribute
     */
    get gap() {
        return this.getAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.GAP);
    }

    /** Set gap attribute
     * @param {string} value - Gap attribute
     */
    set gap(value) {
        this.setAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.GAP, value);
    }

    /** Get padding attribute
     * @returns {string} - Padding attribute
     */
    get padding() {
        return this.getAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.PADDING);
    }

    /** Set padding attribute
     * @param {string} value - Padding attribute
     */
    set padding(value) {
        this.setAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.PADDING, value);
    }

    /** Get background color attribute
     * @returns {string} - Background color attribute
     */
    get backgroundColor() {
        return this.getAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.BACKGROUND_COLOR);
    }

    /** Set background color attribute
     * @param {string} value - Background color attribute
     */
    set backgroundColor(value) {
        this.setAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.BACKGROUND_COLOR, value);
    }

    /** Get margin attribute
     * @returns {string} - Margin attribute
     */
    get margin() {
        return this.getAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.MARGIN);
    }


    /** Set margin attribute
     * @param {string} value - Margin attribute
     */
    set margin(value) {
        this.setAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.MARGIN, value);
    }

    /** Get max width attribute
     * @returns {string} - Max width attribute
     */
    get maxWidth() {
        return this.getAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.MAX_WIDTH);
    }

    /** Set max width attribute
     * @param {string} value - Max width attribute
     */
    set maxWidth(value) {
        this.setAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.MAX_WIDTH, value);
    }

    /** Get box shadow attribute
     * @returns {string} - Box shadow attribute
     */
    get boxShadow() {
        return this.getAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.BOX_SHADOW);
    }

    /** Set box shadow attribute
     * @param {string} value - Box shadow attribute
     */
    set boxShadow(value) {
        this.setAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.BOX_SHADOW, value);
    }

    /** Get head container padding attribute
     * @returns {string} - Head container padding attribute
     */
    get headContainerPadding() {
        return this.getAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.HEAD_CONTAINER_PADDING);
    }

    /** Set head container padding attribute
     * @param {string} value - Head container padding attribute
     */
    set headContainerPadding(value) {
        this.setAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.HEAD_CONTAINER_PADDING, value);
    }

    /** Get head container border bottom attribute
     * @returns {string} - Head container border bottom attribute
     */
    get headContainerBorderBottom() {
        return this.getAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.HEAD_CONTAINER_BORDER_BOTTOM);
    }

    /** Set head container border bottom attribute
     * @param {string} value - Head container border bottom attribute
     */
    set headContainerBorderBottom(value) {
        this.setAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.HEAD_CONTAINER_BORDER_BOTTOM, value);
    }

    /** Get items container gap attribute
     * @returns {string} - Items container gap attribute
     */
    get itemsContainerGap() {
        return this.getAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.ITEMS_CONTAINER_GAP);
    }

    /** Set items container gap attribute
     * @param {string} value - Items container gap attribute
     */
    set itemsContainerGap(value) {
        this.setAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.ITEMS_CONTAINER_GAP, value);
    }

    /** Get items container padding attribute
     * @returns {string} - Items container padding attribute
     */
    get itemsContainerPadding() {
        return this.getAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.ITEMS_CONTAINER_PADDING);
    }

    /** Set items container padding attribute
     * @param {string} value - Items container padding attribute
     */
    set itemsContainerPadding(value) {
        this.setAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.ITEMS_CONTAINER_PADDING, value);
    }

    /** Add head element node
     * @param {HTMLElement|SiriusControlElement} element - Head element node/instance
     */
    addHead(element) {
        this.onBuilt = () => this._addLinkedParent(element)
    }

    /** Remove head element node */
    removeHead() {
        this.onBuilt = () => this._removeLinkedParent()
    }

    /** Add items elements node
     * @param {HTMLElement|SiriusControlElement} elements - Items elements node/instance
     */
    addItems(...elements) {
        this.onBuilt = () => this._addLinkedChildren(elements)
    }

    /** Remove items elements node
     * @param {HTMLElement|SiriusControlElement} elements - Items elements node/instance
     * */
    removeItems(...elements) {
        this.onBuilt = () => this._removeLinkedChildren(elements)
    }

    /** Private method to set the ListBox container element style attribute
     * @param {string} style - Style attribute value
     */
    #setStyle(style) {
        if (!style)
            return

        // Add the style attribute to the element when built
        this._setStyle = () => this._setStyleAttributes(style, this.listBoxContainerElement);
    }

    /** Private method to set the gap attribute
     * @param {string} gap - Gap attribute value
     */
    #setGap(gap) {
        if (gap)
            this._setCSSVariable(SIRIUS_LIST_BOX.CSS_VARS.GAP, gap);
    }

    /** Private method to set the padding attribute
     * @param {string} padding - Padding attribute value
     */
    #setPadding(padding) {
        if (padding)
            this._setCSSVariable(SIRIUS_LIST_BOX.CSS_VARS.PADDING, padding);
    }

    /** Private method to set the background color attribute
     * @param {string} backgroundColor - Background color attribute value
     */
    #setBackgroundColor(backgroundColor) {
        if (backgroundColor)
            this._setCSSVariable(SIRIUS_LIST_BOX.CSS_VARS.BACKGROUND_COLOR, backgroundColor);
    }

    /** Private method to set the margin attribute
     * @param {string} margin - Margin attribute value
     */
    #setMargin(margin) {
        if (margin)
            this._setCSSVariable(SIRIUS_LIST_BOX.CSS_VARS.MARGIN, margin);
    }

    /** Private method to set the max width attribute
     * @param {string} maxWidth - Max width attribute value
     */
    #setMaxWidth(maxWidth) {
        if (maxWidth)
            this._setCSSVariable(SIRIUS_LIST_BOX.CSS_VARS.MAX_WIDTH, maxWidth);
    }

    /** Private method to set the box shadow attribute
     * @param {string} boxShadow - Box shadow attribute value
     */

    #setBoxShadow(boxShadow) {
        if (boxShadow)
            this._setCSSVariable(SIRIUS_LIST_BOX.CSS_VARS.BOX_SHADOW, boxShadow);
    }

    /** Private method to set the head container padding attribute
     * @param {string} headContainerPadding - Head container padding attribute value
     */
    #setHeadContainerPadding(headContainerPadding) {
        if (headContainerPadding)
            this._setCSSVariable(SIRIUS_LIST_BOX.CSS_VARS.HEAD_CONTAINER_PADDING, headContainerPadding);
    }

    /** Private method to set the head container border bottom attribute
     * @param {string} headContainerBorderBottom - Head container border bottom attribute value
     */
    #setHeadContainerBorderBottom(headContainerBorderBottom) {
        if (headContainerBorderBottom)
            this._setCSSVariable(SIRIUS_LIST_BOX.CSS_VARS.HEAD_CONTAINER_BORDER_BOTTOM, headContainerBorderBottom);
    }

    /** Private method to set the items container gap attribute
     * @param {string} itemsContainerGap - Items container gap attribute value
     */
    #setItemsContainerGap(itemsContainerGap) {
        if (itemsContainerGap)
            this._setCSSVariable(SIRIUS_LIST_BOX.CSS_VARS.ITEMS_CONTAINER_GAP, itemsContainerGap);
    }

    /** Private method to set the items container padding attribute
     * @param {string} itemsContainerPadding - Items container padding attribute value
     */
    #setItemsContainerPadding(itemsContainerPadding) {
        if (itemsContainerPadding)
            this._setCSSVariable(SIRIUS_LIST_BOX.CSS_VARS.ITEMS_CONTAINER_PADDING, itemsContainerPadding);
    }

    /** Set the events property to this
     * @param {object} events - Events property
     */
    set events(events) {
        if (!events)
            return

        // Add the events property to the element when built
        this.onBuilt = () => this._setEvents(events, this);
    }

    /** Private method to handle attribute changes
     * @param {string} name - Attribute name
     * @param {string} oldValue - Old value
     * @param {string} newValue - New value
     */
    async #attributeChangeHandler(name, oldValue, newValue) {
        switch (name) {
            case SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID:
                this._setId(newValue);
                break;

            case SIRIUS_ELEMENT_ATTRIBUTES.STYLE:
                this.#setStyle(newValue);
                break;

            case SIRIUS_CONTROL_ELEMENT_ATTRIBUTES.STATUS:
                this._setStatus(newValue);
                break;

            case SIRIUS_CONTROL_ELEMENT_ATTRIBUTES.PARENT_ID:
                this._setParentId(newValue);
                break;

            case SIRIUS_LIST_BOX_ATTRIBUTES.GAP:
                this.#setGap(newValue);
                break;

            case SIRIUS_LIST_BOX_ATTRIBUTES.PADDING:
                this.#setPadding(newValue);
                break;

            case SIRIUS_LIST_BOX_ATTRIBUTES.BACKGROUND_COLOR:
                this.#setBackgroundColor(newValue);
                break;

            case SIRIUS_LIST_BOX_ATTRIBUTES.MARGIN:
                this.#setMargin(newValue);
                break;

            case SIRIUS_LIST_BOX_ATTRIBUTES.MAX_WIDTH:
                this.#setMaxWidth(newValue);
                break;

            case SIRIUS_LIST_BOX_ATTRIBUTES.BOX_SHADOW:
                this.#setBoxShadow(newValue);
                break;

            case SIRIUS_LIST_BOX_ATTRIBUTES.HEAD_CONTAINER_PADDING:
                this.#setHeadContainerPadding(newValue);
                break;

            case SIRIUS_LIST_BOX_ATTRIBUTES.HEAD_CONTAINER_BORDER_BOTTOM:
                this.#setHeadContainerBorderBottom(newValue);
                break;

            case SIRIUS_LIST_BOX_ATTRIBUTES.ITEMS_CONTAINER_GAP:
                this.#setItemsContainerGap(newValue);
                break;

            case SIRIUS_LIST_BOX_ATTRIBUTES.ITEMS_CONTAINER_PADDING:
                this.#setItemsContainerPadding(newValue);
                break;

            default:
                this._onInjectedLogger = () => this.logger.error(`Unregistered attribute: ${name}`);
                break;
        }
    }

    /** Attribute change callback
     * @param {string} name - Attribute name
     * @param {string} oldValue - Old value
     * @param {string} newValue - New value
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // Call the attribute change pre-handler
        const {formattedValue, shouldContinue} = this._attributeChangePreHandler(name, oldValue, newValue);
        if (!shouldContinue) return;

        // Call the attribute change handler
        this.onBuilt = () => this.#attributeChangeHandler(name, oldValue, formattedValue);
    }
}

// Register custom element
customElements.define(SIRIUS_LIST_BOX.TAG, SiriusListBoxV2);