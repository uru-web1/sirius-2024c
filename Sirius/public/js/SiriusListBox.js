import {SIRIUS_ELEMENT_ATTRIBUTES, SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES, SiriusElement} from "./SiriusElement.js";
import {SIRIUS_CHECKBOX_ATTRIBUTES, SiriusCheckbox} from "./SiriusCheckbox.js";
import {SIRIUS_LABEL_ATTRIBUTES, SiriusLabel} from "./SiriusLabel.js";
import deepFreeze from "./utils/deep-freeze.js";

/** SiriusListBox class */
export const SIRIUS_LIST_BOX = deepFreeze({
    NAME: "SiriusListBox",
    TAG: "sirius-list-box",
    CSS_VARS: {
        GAP: "--gap",
        BACKGROUND_COLOR: "--background-color",
        PADDING: "--padding"
    },
    CLASSES: {
        LIST_BOX_CONTAINER: 'list-box-container',
        ITEMS_CONTAINER: 'items-container',
        ITEM_CONTAINER: 'item-container',
        HEAD_CONTAINER: 'head-container',
    }
})

/** SiriusListBox attributes */
export const SIRIUS_LIST_BOX_ATTRIBUTES = deepFreeze({
    BACKGROUND_COLOR: "background-color",
    PADDING: "padding",
    GAP: "gap",
    HEAD: "head",
    CHECKBOX_COLOR: "checkbox-border-color",
    CHECKBOX_STATUS: "checkbox-status",
    LIST_BOX_ITEMS: "list-box-items",
    ITEMS: "items"
})

/** SiriusListBox attributes default values */
export const SIRIUS_LIST_BOX_ATTRIBUTES_DEFAULT = deepFreeze({
    [SIRIUS_LIST_BOX_ATTRIBUTES.ITEMS]: [],
});

/** Sirius class that represents a ListBox component */
export class SiriusListBox extends SiriusElement {
    #listBoxContainerElement = null;
    #items = [];
    #checkboxList = [];
    #labelList = [];
    #head = false;
    #headContainerElement = null;
    #itemsContainerElement = null;
    #itemContainerElement = null;
    #checkboxElement = null;
    #labelElement = null;

    /**
     * Create a Sirius ListBox element
     * @param {object} properties - Element properties
     */
    constructor(properties) {
        super(properties, SIRIUS_LIST_BOX.NAME);
    }

    /** Define observed attributes
     * @returns {string[]} - Observed attributes
     * */
    static get observedAttributes() {
        return [...SiriusElement.observedAttributes, ...Object.values(SIRIUS_LIST_BOX_ATTRIBUTES)];
    }

    /** Get the head attribute
     * @returns {boolean} - head attribute
     * */
    get head() {
        return this.#head;
    }

    /** Get the items container element
     * @returns {HTMLElement|null} - ListBox container element
     */

    get itemContainerElement() {
        return this.#itemContainerElement
    }

    /** Get the checkbox element
     * @returns {HTMLElement|null} - ListBox container element
     */
    get checkboxElement() {
        return this.#checkboxElement
    }

    /** Get the label element
     * @returns {HTMLElement|null} - ListBox container element
     */
    get labelElement() {
        return this.#labelElement
    }

    /** Get the head container element
     * @returns {HTMLElement|null} - ListBox container element
     */
    get headContainerElement() {
        return this.#headContainerElement
    }

    /** Get the ListBox container element
     * @returns {HTMLElement|null} - ListBox container element
     */
    get listBoxContainerElement() {
        return this.#listBoxContainerElement;
    }

    /** Get the items container element
     * @returns {HTMLElement|null} - ListBox container element
     */
    get itemsContainerElement() {
        return this.#itemsContainerElement;
    }

    /** Get items attribute
     * @returns {Array} - Items attribute
     */
    get items() {
        return JSON.parse(this.getAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.LIST_BOX_ITEMS) || "[]");
    }

    /** Set items attribute
     * @param {Array} value - Items attribute
     */
    set items(value) {
        this.setAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.ITEMS, JSON.stringify(value));
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

    /** Get checkbox color attribute
     *
     * @returns {string} - Checkbox color attribute
     * */
    get checkboxBorderColor() {
        return this.getAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.CHECKBOX_COLOR);
    }

    /** Set checkbox color attribute
     *
     * @param {string} value - Checkbox color attribute
     * */
    set checkboxBorderColor(value) {
        this.setAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.CHECKBOX_COLOR, value);
    }

    /**Private method to set the items attribute
     * @param {Array} items - Items attribute value
     */
    #setItems(items) {
        if (!items) return

        this.#items = items;
        this.#renderItems();
    }

    /**Private method to set the head attribute
     * @param {string} head - Head attribute value
     */
    #setHead(head) {
        this.#head = head;
    }

    /** Render the ListBox items
     * @returns {void}
     */
    #renderItems() {
        this.onBuilt = () => {
            if (this.#head) {

                this.#headContainerElement.appendChild(this.#createHead());

                // Render new items
                this.#items.forEach(item => {
                    const itemElement = this.#createItem(item);
                    this.#checkboxList[0].addChildrenElements(itemElement.querySelector("sirius-checkbox"));
                    this.#itemsContainerElement.appendChild(itemElement);
                });

            } else {

                // Render new items
                this.#items.forEach(item => {
                    this.#itemsContainerElement.appendChild(this.#createItem(item));
                });
            }
        }
    }

    /** Create the head of the ListBox
     * @returns {HTMLElement} - ListBox head element
     */
    #createHead() {
        return this.#createItem({id: 'item-0', label: 'Select all', checked: "unchecked"});
    }

    /** Create a ListBox item
     *
     * @param {object} item - Item object
     * @param {string} item.id - Item id
     * @param {string} item.label - Item label
     * @param {string} item.checked - Item checked status
     * @returns {HTMLElement} - ListBox item element
     */
    #createItem({id, label, checked}) {
        // Get the required attributes
        const idKey = SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID

        // Get the derived attributes
        const labelId = this._getDerivedId("label")
        const checkboxId = this._getDerivedId("checkbox")

        // Get the checkbox attributes
        const labelHiddenKey = SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_HIDDEN;
        const statusKey = SIRIUS_CHECKBOX_ATTRIBUTES.STATUS;

        // Get the label attributes
        const captionKey = SIRIUS_LABEL_ATTRIBUTES.CAPTION;

        // Create the item container element
        const itemContainer = document.createElement('div');
        itemContainer.classList.add(SIRIUS_LIST_BOX.CLASSES.ITEM_CONTAINER);
        itemContainer.setAttribute('id', id)

        // Create the checkbox and label elements
        this.#checkboxElement = new SiriusCheckbox({
            [idKey]: checkboxId,
            [statusKey]: checked,
            [labelHiddenKey]: "true"
        });
        itemContainer.appendChild(this.checkboxElement);

        // Create the label element
        this.#labelElement = new SiriusLabel({
            [idKey]: labelId,
            [captionKey]: label
        });
        itemContainer.appendChild(this.labelElement);

        /// Add the checkbox and label elements to the list
        this.#checkboxList.push(this.checkboxElement);
        this.#labelList.push(this.labelElement);

        return itemContainer;
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

    /** Set the events property to this
     * @param {object} events - Events property
     */
    set events(events) {
        if (!events)
            return

        // Add the events property to the element when built
        this.onBuilt = () => this._setEvents(events, this);
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

    /** Private method to set the checkbox color attribute
     * @param {string} checkboxColor - Checkbox color attribute value
     */
    #setCheckboxColor(checkboxColor) {
        if (checkboxColor)
            this.onBuilt = () =>
                this.#checkboxList.forEach(checkbox => checkbox.checkboxBorderColor = checkboxColor);
    }

    /** Get the template for the Sirius ListBox
     * @returns {string} - Template
     */
    #getTemplate() {
        // Get the ListBox classes
        const listBoxContainerClasses = [SIRIUS_LIST_BOX.CLASSES.LIST_BOX_CONTAINER];
        const headContainerClasses = [SIRIUS_LIST_BOX.CLASSES.HEAD_CONTAINER];
        const itemsListContainerClasses = [SIRIUS_LIST_BOX.CLASSES.ITEMS_CONTAINER];

        return `<div class="${listBoxContainerClasses.join(' ')}">
                    <div class="${headContainerClasses.join(' ')}"></div>
                    <div class="${itemsListContainerClasses.join(' ')}"></div>
                </div>`;
    }


    /**Attribute change callback
     * @param {string} name - Attribute name
     * @param {string} oldValue - Old value
     * @param {string} newValue - New value
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // Call the pre-attribute changed callback
        const {formattedValue, shouldContinue} = this._preAttributeChangedCallback(name, oldValue, newValue);
        if (!shouldContinue) return;

        switch (name) {
            case SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID:
                this._setId(formattedValue);
                break;

            case SIRIUS_ELEMENT_ATTRIBUTES.STYLE:
                this.#setStyle(formattedValue);
                break;

            case SIRIUS_LIST_BOX_ATTRIBUTES.LIST_BOX_ITEMS:
                this.#setItems(JSON.parse(formattedValue));
                break;

            case SIRIUS_LIST_BOX_ATTRIBUTES.HEAD:
                this.#setHead(formattedValue);
                break;

            case SIRIUS_LIST_BOX_ATTRIBUTES.GAP:
                this.#setGap(formattedValue);
                break;

            case SIRIUS_LIST_BOX_ATTRIBUTES.PADDING:
                this.#setPadding(formattedValue);
                break;

            case SIRIUS_LIST_BOX_ATTRIBUTES.BACKGROUND_COLOR:
                this.#setBackgroundColor(formattedValue);
                break;

            case SIRIUS_LIST_BOX_ATTRIBUTES.CHECKBOX_COLOR:
                this.#setCheckboxColor(formattedValue);
                break;

            default:
                this._onInjectedLogger = () => this.logger.error(`Unregistered attribute: ${name}`);
                break;
        }
    }

    /** Lifecycle method called when the component is connected to the DOM
     */
    async connectedCallback() {
        // Call the parent connectedCallback
        await super.connectedCallback();

        // Load Sirius ListBox HTML attributes
        this._loadAttributes({
            instanceProperties: this._properties,
            attributes: SIRIUS_LIST_BOX_ATTRIBUTES,
            defaultAttributes: SIRIUS_LIST_BOX_ATTRIBUTES_DEFAULT
        });

        // Create the CSS stylesheet and add it to the shadow DOM
        await this._loadAndAdoptStyles();

        // Get HTML inner content
        const innerHTML = this.#getTemplate();

        // Create the HTML template
        this._createTemplate(innerHTML);

        // Get the container element
        this.#listBoxContainerElement = this._containerElement = this._templateContent.firstChild;
        this.#headContainerElement = this.#listBoxContainerElement.firstElementChild;
        this.#itemsContainerElement = this.#listBoxContainerElement.lastElementChild;

        // Add ListBox to the shadow DOM
        this.shadowRoot.appendChild(this.containerElement);

        // Dispatch the built event
        this.dispatchBuiltEvent();
    }
}

// Register custom element
customElements.define(SIRIUS_LIST_BOX.TAG, SiriusListBox);