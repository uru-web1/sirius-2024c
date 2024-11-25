import {
    SIRIUS_ELEMENT,
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
        HEAD_CONTAINER_PADDING: "--sirius-list-box--head-container--padding",
        SEPARATOR_BORDER: "--sirius-list-box--separator--border",
        SEPARATOR_BORDER_RADIUS: "--sirius-list-box--separator--border-radius",
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
        SEPARATOR: 'separator',
        ITEMS_CONTAINER: 'items-container',
        ITEMS: 'items',
    }
})

/** SiriusListBox attributes */
export const SIRIUS_LIST_BOX_ATTRIBUTES = deepFreeze({
    HEAD_CONTAINER_PADDING: "head-container-padding",
    SEPARATOR_BORDER: "separator-border",
    SEPARATOR_BORDER_RADIUS: "separator-border-radius",
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
        const listBoxContainerClasses = [SIRIUS_ELEMENT.CLASSES.MAIN_ELEMENT,SIRIUS_LIST_BOX.CLASSES.LIST_BOX_CONTAINER];
        const headContainerClasses = [SIRIUS_LIST_BOX.CLASSES.HEAD_CONTAINER];
        const headClasses = [SIRIUS_LIST_BOX.CLASSES.HEAD];
        const separatorClasses = [SIRIUS_LIST_BOX.CLASSES.SEPARATOR];
        const itemsListContainerClasses = [SIRIUS_LIST_BOX.CLASSES.ITEMS_CONTAINER];
        const itemsClasses = [SIRIUS_LIST_BOX.CLASSES.ITEMS];

        return `<div class="${listBoxContainerClasses.join(' ')}">
                    <div class="${headContainerClasses.join(' ')}">
                        <slot name="${SIRIUS_LIST_BOX.SLOTS.HEAD}" class="${headClasses.join(' ')}"></slot>
                    </div>
                    <div class="${separatorClasses.join(' ')}">
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

        // Create the list box container element
        const container = this._createContainerElementTemplate(innerHTML);
        this.#listBoxContainerElement = this._containerElement = container
        this.#headContainerElement = this.listBoxContainerElement.firstElementChild;
        this._linkedParentSlotElement = this.headContainerElement.firstElementChild;
        this.#itemsContainerElement = this.listBoxContainerElement.lastElementChild;
        this._linkedChildrenSlotElement = this.itemsContainerElement.firstElementChild;

        // Add the container element to the shadow DOM
        this.shadowRoot.appendChild(this.containerElement);

        // Set up the element observer
        this._setElementObserver();

        // Set the properties
        this.linkedParent = this._linkedParent;
        this.linkedChildren = this._linkedChildren

        // Dispatch the built event
        this._dispatchBuiltEvent();
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

    /** Get separator border attribute
     * @returns {string} - Separator border attribute
     */
    get separatorBorder() {
        return this.getAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.SEPARATOR_BORDER);
    }

    /** Set separator border attribute
     * @param {string} value - Separator border attribute
     */
    set separatorBorder(value) {
        this.setAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.SEPARATOR_BORDER, value);
    }

    /** Get separator border radius attribute
     * @returns {string} - Separator border radius attribute
     */
    get separatorBorderRadius() {
        return this.getAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.SEPARATOR_BORDER_RADIUS);
    }

    /** Set separator border radius attribute
     * @param {string} value - Separator border radius attribute
     */
    set separatorBorderRadius(value) {
        this.setAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.SEPARATOR_BORDER_RADIUS, value);
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

    /** Private method to set the head container padding attribute
     * @param {string} headContainerPadding - Head container padding attribute value
     */
    #setHeadContainerPadding(headContainerPadding) {
        if (headContainerPadding)
            this._setElementCSSVariable(SIRIUS_LIST_BOX.CSS_VARS.HEAD_CONTAINER_PADDING, headContainerPadding);
    }

    /** Private method to set the separator border attribute
     * @param {string} separatorBorder - Separator border attribute value
     */
    #setSeparatorBorder(separatorBorder) {
        if (separatorBorder)
            this._setElementCSSVariable(SIRIUS_LIST_BOX.CSS_VARS.SEPARATOR_BORDER, separatorBorder);
    }

    /** Private method to set the separator border radius attribute
     * @param {string} separatorBorderRadius - Separator border radius attribute value
     */
    #setSeparatorBorderRadius(separatorBorderRadius) {
        if (separatorBorderRadius)
            this._setElementCSSVariable(SIRIUS_LIST_BOX.CSS_VARS.SEPARATOR_BORDER_RADIUS, separatorBorderRadius);
    }

    /** Private method to set the items container gap attribute
     * @param {string} itemsContainerGap - Items container gap attribute value
     */
    #setItemsContainerGap(itemsContainerGap) {
        if (itemsContainerGap)
            this._setElementCSSVariable(SIRIUS_LIST_BOX.CSS_VARS.ITEMS_CONTAINER_GAP, itemsContainerGap);
    }

    /** Private method to set the items container padding attribute
     * @param {string} itemsContainerPadding - Items container padding attribute value
     */
    #setItemsContainerPadding(itemsContainerPadding) {
        if (itemsContainerPadding)
            this._setElementCSSVariable(SIRIUS_LIST_BOX.CSS_VARS.ITEMS_CONTAINER_PADDING, itemsContainerPadding);
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

            case SIRIUS_ELEMENT_ATTRIBUTES.TRANSITION_DURATION:
                this._setTransitionDuration(newValue);
                break;

            case SIRIUS_ELEMENT_ATTRIBUTES.STYLES:
                this._setStyles(newValue);
                break;

            case SIRIUS_ELEMENT_ATTRIBUTES.STYLES_ON_HOVER:
                this._setStylesOnHover(newValue);
                break;

            case SIRIUS_ELEMENT_ATTRIBUTES.STYLES_ON_ACTIVE:
                this._setStylesOnActive(newValue);
                break;

            case SIRIUS_CONTROL_ELEMENT_ATTRIBUTES.STATUS:
                this._setStatus(newValue);
                break;

            case SIRIUS_CONTROL_ELEMENT_ATTRIBUTES.PARENT_ID:
                this._setParentId(newValue);
                break;

            case SIRIUS_LIST_BOX_ATTRIBUTES.HEAD_CONTAINER_PADDING:
                this.#setHeadContainerPadding(newValue);
                break;

            case SIRIUS_LIST_BOX_ATTRIBUTES.SEPARATOR_BORDER:
                this.#setSeparatorBorder(newValue);
                break;

            case SIRIUS_LIST_BOX_ATTRIBUTES.SEPARATOR_BORDER_RADIUS:
                this.#setSeparatorBorderRadius(newValue);
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