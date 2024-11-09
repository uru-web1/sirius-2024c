import {SIRIUS_ELEMENT_ATTRIBUTES, SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES, SiriusElement} from "./SiriusElement.js";
import {SIRIUS_CHECKBOX_ATTRIBUTES, SiriusCheckbox} from "./SiriusCheckbox.js";
import {SIRIUS_LABEL_ATTRIBUTES, SiriusLabel} from "./SiriusLabel.js";
import deepFreeze from "./utils/deep-freeze.js";

/** SiriusListBox class */
export const SIRIUS_LISTBOX = deepFreeze({
    NAME: "SiriusListbox",
    TAG: "sirius-listbox",
    CSS_VARS: {
        GAP: "--gap",
        BACKGROUND_COLOR: "--background-color",
        PADDING: "--padding"
    },
    CLASSES: {
        LISTBOX_CONTAINER: 'listbox-container',
        ITEM_CONTAINER: 'item-container',
        ITEMS_CONTAINER: 'items-container',
        HEAD_CONTAINER: 'head-container',
    }
})

/** SiriusListBox attributes */
export const SIRIUS_LISTBOX_ATTRIBUTES = deepFreeze({
    BACKGROUND_COLOR: "background-color",
    CHECKBOX_COLOR: "checkbox-border-color",
    PADDING: "padding",
    GAP: "gap",
    HEAD: "head",
    LISTBOX_ITEMS: "listbox-items",
    CHECKBOX_STATUS: "checkbox-status",
})

/** Sirius listbox attributes default values */
export const SIRIUS_LISTBOX_ATTRIBUTES_DEFAULT = deepFreeze({
    [SIRIUS_LISTBOX_ATTRIBUTES.ITEMS]: [],
});

/** Sirius class that represents a listbox component */
export class SiriusListbox extends SiriusElement{
    #listboxContainerElement = null;
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
     * Create a Sirius listbox element
     * @param {object} properties - Element properties
     */
    constructor(properties) {
        super(properties, SIRIUS_LISTBOX.NAME);
    }

    /** Define observed attributes
     * @returns {string[]} - Observed attributes
     * */
    static get observedAttributes() {
        return [...SiriusElement.observedAttributes, ...Object.values(SIRIUS_LISTBOX_ATTRIBUTES)];
    }

    /**Get the head attribute
     * @returns {boolean} - head attribute
     * */
    get head(){
        return this.#head;
    }

    /**Get the items container element
     * @returns {HTMLElement|null} - Listbox container element
     */

    get itemContainerElement(){
        return this.#itemContainerElement
    }

    /**Get the checkbox element
     * @returns {HTMLElement|null} - Listbox container element
    */
    get checkboxElement(){
        return this.#checkboxElement
    }

    /**Get the label element
     * @returns {HTMLElement|null} - Listbox container element
     */
    get labelElement(){
        return this.#labelElement
    }

    /**Get the head container element
     * @returns {HTMLElement|null} - Listbox container element
     */
    get headContainerElement(){
        return this.#headContainerElement
    }

    /**Get the listbox container element
    * @returns {HTMLElement|null} - Listbox container element
    */
    get listboxContainerElement() {
        return this.#listboxContainerElement;
    }

    /**Get items attribute
    * @returns {Array} - Items attribute
    */
    get items() {
        return JSON.parse(this.getAttribute(SIRIUS_LISTBOX_ATTRIBUTES.LISTBOX_ITEMS) || "[]");
    }

    /**Set items attribute
    * @param {Array} value - Items attribute
    */
    set items(value) {
        this.setAttribute(SIRIUS_LISTBOX_ATTRIBUTES.ITEMS, JSON.stringify(value));
    }

    /**Get gap attribute
    * @returns {string} - Gap attribute
    */
    get gap() {
        return this.getAttribute(SIRIUS_LISTBOX_ATTRIBUTES.GAP);
    }

    /**Set gap attribute
    * @param {string} value - Gap attribute
    */
    set gap(value) {
        this.setAttribute(SIRIUS_LISTBOX_ATTRIBUTES.GAP, value);
    }

    /**Get padding attribute
    * @returns {string} - Padding attribute
    */
    get padding() {
        return this.getAttribute(SIRIUS_LISTBOX_ATTRIBUTES.PADDING);
    }

    /**Set padding attribute
    * @param {string} value - Padding attribute
    */
    set padding(value) {
        this.setAttribute(SIRIUS_LISTBOX_ATTRIBUTES.PADDING, value);
    }

    /**Get background color attribute
    * @returns {string} - Background color attribute
    */
    get backgroundColor() {
        return this.getAttribute(SIRIUS_LISTBOX_ATTRIBUTES.BACKGROUND_COLOR);
    }

    /**Set background color attribute
    * @param {string} value - Background color attribute
    */
    set backgroundColor(value) {
        this.setAttribute(SIRIUS_LISTBOX_ATTRIBUTES.BACKGROUND_COLOR, value);
    }

    /**Get checkbox color attribute
     *  
     * @returns {string} - Checkbox color attribute
     * */
    get checkboxBorderColor() {
        return this.getAttribute(SIRIUS_LISTBOX_ATTRIBUTES.CHECKBOX_COLOR);
    }

    /**Set checkbox color attribute
     *  
     * @param {string} value - Checkbox color attribute
     * */
    set checkboxBorderColor(value) {
        this.setAttribute(SIRIUS_LISTBOX_ATTRIBUTES.CHECKBOX_COLOR, value);
    }

    /**Private method to set the items attribute
    * @param {Array} items - Items attribute value
    */
    #setItems(items) {
        if (items) {
            this.#items = items;
            this.#renderItems();
        }
    }

    /**Private method to set the head attribute
     * @param {boolean} head - Head attribute value
    */
    #setHead(head){
        this.#head = head;  
    }

    /** Render the listbox items
     * @returns {void}
     */
    #renderItems() {

        if (!this.#listboxContainerElement) return;
        
        if (this.#head){
            
            this.#headContainerElement.appendChild(this.#createHead());

            // Render new items
            this.#items.forEach(item => {
                const itemElement = this.#createItem(item);
                this.#checkboxList[0].addChildrenElements(itemElement.querySelector("sirius-checkbox"));
                this.#itemsContainerElement.appendChild(itemElement);
            });

        }else{

             // Render new items
            this.#items.forEach(item => {
                this.#itemsContainerElement.appendChild(this.#createItem(item));
            });
        }

    }

    /** Create the head of the listbox
     * @returns {HTMLElement} - Listbox head element
     */
    #createHead(){
        const headElement = this.#createItem({ id: 'item-0', label: 'Seleccionar todo', checked: "unchecked" });
        return headElement;
    }

    /** Create a listbox item
     * 
     * @param {object} item - Item object
     * @param {string} item.id - Item id
     * @param {string} item.label - Item label
     * @param {string} item.checked - Item checked status
     * @returns {HTMLElement} - Listbox item element
     */
    #createItem({id,label,checked}) {


        const idKey = SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID
        const labelId = this._getDerivedId("label")
        const checkboxId = this._getDerivedId("checkbox")
        const labelHiddenkey = SIRIUS_CHECKBOX_ATTRIBUTES.LABEL_HIDDEN;
        const statusKey = SIRIUS_CHECKBOX_ATTRIBUTES.STATUS;
        const captionKey = SIRIUS_LABEL_ATTRIBUTES.CAPTION;

        const itemContainer = document.createElement('div');
        itemContainer.classList.add(SIRIUS_LISTBOX.CLASSES.ITEM_CONTAINER);
        itemContainer.setAttribute(idKey, id)

        
        this.#checkboxElement = new SiriusCheckbox({ 
            [idKey]: checkboxId, 
            [statusKey]: checked,
            [labelHiddenkey]: "true" });

        this.#labelElement = new SiriusLabel({ 
            [idKey]: labelId, 
            [captionKey]: label });

        itemContainer.appendChild(this.checkboxElement);
        itemContainer.appendChild(this.labelElement);

        this.#checkboxList.push(this.checkboxElement);
        this.#labelList.push(this.labelElement);

        return itemContainer;
    }

    /** Private method to set the listbox container element style attribute
     * @param {string} style - Style attribute value
     */
    #setStyle(style) {
        if (!style)
            return
        // Add the style attribute to the element when built
        this._setStyle = () => this._setStyleAttributes(style,this.listBoxContainerElement);
    }

    /** Set the events property to this
     * @param {object} events - Events property
     */
    set events(events){
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
            this._setCSSVariable(SIRIUS_LISTBOX.CSS_VARS.GAP, gap);
    }

    /** Private method to set the padding attribute
     * @param {string} padding - Padding attribute value
     */
    #setPadding(padding) {
        if (padding)
            this._setCSSVariable(SIRIUS_LISTBOX.CSS_VARS.PADDING, padding);
    }

    /** Private method to set the background color attribute
     * @param {string} backgroundColor - Background color attribute value
     */
    #setBackgroundColor(backgroundColor) {
        if (backgroundColor)
            this._setCSSVariable(SIRIUS_LISTBOX.CSS_VARS.BACKGROUND_COLOR, backgroundColor);
    }

    /** Private method to set the checkbox color attribute
     * @param {string} checkboxColor - Checkbox color attribute value
     */
    #setCheckboxColor(Color) {
        if (Color)
            this.onBuilt = () => {
                this.#checkboxList.forEach(checkbox => {

                    checkbox.checkboxBorderColor = Color;
                }
                );
            }
    }

    /** Get the template for the Sirius listbox
     * @returns {string} - Template
     */
    #getTemplate() {
        // Get the listbox classes
        const listboxContainerClasses = [SIRIUS_LISTBOX.CLASSES.LISTBOX_CONTAINER];
        const headContainerClasses = [SIRIUS_LISTBOX.CLASSES.HEAD_CONTAINER];
        const itemsListContainerClasses = [SIRIUS_LISTBOX.CLASSES.ITEMS_CONTAINER];

        return `<div class="${listboxContainerClasses.join(' ')}">
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
        const { formattedValue, shouldContinue } = this._preAttributeChangedCallback(name, oldValue, newValue);
        if (!shouldContinue) return;

        switch (name) {
            case SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID:
                this._setId(formattedValue);
                break;

            case SIRIUS_ELEMENT_ATTRIBUTES.STYLE:
                this.#setStyle(formattedValue);
                break;

            case SIRIUS_LISTBOX_ATTRIBUTES.LISTBOX_ITEMS:
                this.#setItems(JSON.parse(formattedValue));
                break;
            
            case SIRIUS_LISTBOX_ATTRIBUTES.HEAD:
                this.#setHead(formattedValue);
                break;

            case SIRIUS_LISTBOX_ATTRIBUTES.GAP:
                this.#setGap(formattedValue);
                break;

            case SIRIUS_LISTBOX_ATTRIBUTES.PADDING:
                this.#setPadding(formattedValue);
                break;

            case SIRIUS_LISTBOX_ATTRIBUTES.BACKGROUND_COLOR:
                this.#setBackgroundColor(formattedValue);
                break;
            
            case SIRIUS_LISTBOX_ATTRIBUTES.CHECKBOX_COLOR:
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

        // Load Sirius listbox HTML attributes
        this._loadAttributes({
            instanceProperties: this._properties,
            attributes: SIRIUS_LISTBOX_ATTRIBUTES,
            defaultAttributes: SIRIUS_LISTBOX_ATTRIBUTES_DEFAULT
        });

        // Create the CSS stylesheet and add it to the shadow DOM
        await this._loadAndAdoptStyles();

        // Get HTML inner content
        const innerHTML = this.#getTemplate();
        
        // Create the HTML template
        this._createTemplate(innerHTML);
        
        // Get the container element
        this.#listboxContainerElement = this._containerElement = this._templateContent.firstChild;
        this.#headContainerElement = this.#listboxContainerElement.firstElementChild;
        this.#itemsContainerElement = this.#listboxContainerElement.lastElementChild;
        
        // Add listbox to the shadow DOM
        this.shadowRoot.appendChild(this.containerElement);

        // // Render the items
        this.#renderItems();

        // Dispatch the built event
        this.dispatchBuiltEvent();

    }

}

// Register custom element
customElements.define(SIRIUS_LISTBOX.TAG, SiriusListbox);