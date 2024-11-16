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
    ITEMS: "items",
})

/** SiriusListBox attributes default values */
export const SIRIUS_LIST_BOX_ATTRIBUTES_DEFAULT = deepFreeze({
    [SIRIUS_LIST_BOX_ATTRIBUTES.ITEMS]: [],
});

/** Sirius class that represents a ListBox component */
export class SiriusListBox extends SiriusElement {

    // container elements
    #listBoxContainerElement = null;
    #headContainerElement = null;
    #itemsListContainerElement = null;
    #itemContainerElement = null;

    // elements
    #checkboxElement = null;
    #labelElement = null;
    #headElement = null;
    #head = null;
    
    // lists
    #itemsList = [];
    #itemContainerList = [];
    _checkedItems = [];


    /**
     * Create a Sirius ListBox element
     * @param {object} properties - Element properties
     */
    constructor(properties) {
        super(properties, SIRIUS_LIST_BOX.NAME);

        // Build the SiriusListBox
        this.#build().then();
        
    }

    /** Define observed attributes
     * @returns {string[]} - Observed attributes
     * */
    static get observedAttributes() {
        return [...SiriusElement.observedAttributes, ...Object.values(SIRIUS_LIST_BOX_ATTRIBUTES)];
    }

    /** Build the SiriusListBox */
    async #build() {

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
        this.#itemsListContainerElement = this.#listBoxContainerElement.lastElementChild;

        // Add ListBox to the shadow DOM
        this.shadowRoot.appendChild(this.containerElement);

        // Dispatch the built event
        this.dispatchBuiltEvent();
    }

    /** Get the head attribute
     * @returns {string} - head attribute
     * */
    get head() {
        return this.#head;
    }

    /** Get the head element
     * @returns {HTMLElement|null} - ListBox head element
     * */
    get headElement() {
        return this.#headElement;
    }

    /** Set the head element
     * @param {HTMLElement} head - ListBox head element
     * */
    set headElement(head) {
        this.#headElement = head;
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
    get itemsListContainerElement() {
        return this.#itemsListContainerElement;
    }

    /** Get items attribute
     * @returns {Array} - Items attribute
     */
    get items() {
        return JSON.parse(this.getAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.ITEMS) || "[]");
    }

    /** Set items attribute
     * @param {Array} value - Items attribute
     */
    set items(value) {
        this.setAttribute(SIRIUS_LIST_BOX_ATTRIBUTES.ITEMS, (value));
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

    /** Public method to get the checked items
     * @returns {Array} - Checked items
     */
    getCheckedItems(){

        this.#itemContainerList.forEach((item) => {
            if(item.querySelector("sirius-checkbox").status === "checked" && item.id !== "item-0"){
                this._checkedItems.push(item);
            }
        });
        return this._checkedItems;
    }

    /**Public method to set the items attribute
         * 
         * @param {Array} items - Items attribute value
         * @returns {void}
         * */
    addItem(item){
        this.onBuilt = () => {
            
            const itemElement = this.#createItem(item);
            this.#itemsListContainerElement.appendChild(itemElement);
            this.#itemsList.push(item);
            
        }
    }

    /**Public method to remove an item
     * @param {string} id - Item id
     * @returns {void}
     * */
    removeItem(id) {
        this.onBuilt = () => {

            const item = this.#itemsListContainerElement.querySelector(`#${id}`);
            
            if(!item) return;
            
            this.#headElement.querySelector("sirius-checkbox").removeChildren(item.querySelector("sirius-checkbox"));

            
            this.#itemsListContainerElement.removeChild(item);
            this.#updateList(item);
        } 
    }

    /**Private method to update the list
     * @param {HTMLElement} item - Item to be removed
     * @returns {void}
     * */
    #updateList(item){   

        this.onBuilt = () => {

            const itemId= item.id;
            
            const checkbox = item.querySelector('sirius-checkbox');
            const label = item.querySelector('sirius-label');
            
            sirius.removeInstance(label.id)
            sirius.removeInstance(checkbox.id)

            // Remove the item from the itemsList
            this.#itemsList.forEach((item)=>{
                if(item.id === itemId){
                    this.#itemsList.splice(this.#itemsList.indexOf(item), 1);
                }
            })
            
    
            // Remove the item from the itemContainerList lists
            this.#itemContainerList.forEach((item)=>{
                if(item.id === itemId){
                    this.#itemContainerList.splice(this.#itemContainerList.indexOf(item), 1);
            }})
            
        }
    }

    /**Private method to set the items attribute
     * @param {Array} items - Items attribute value
     */
    async #setItems(items) {
        if (!items) return
        this.#itemsList = items;

        // Render the ListBox items
        this.#renderItems();
    
    }

    /** Private method to set the head attribute
     * @param {string} head - Head attribute value
     */
    #setHead(head) {
        this.#head = head;
    }

    /** Render the ListBox items
     * @returns {void}
     */
    #renderItems() {
        
            if (!this.#head) {
                this.#createHead();
            }else{
                // Hide the head container
                this.#headContainerElement.hidden = true;
            }

            console.log(this.#itemsList);
            

            // Render new items
            this.#itemsList.forEach(item => {
                const itemElement = this.#createItem(item);
                this.#itemsListContainerElement.appendChild(itemElement);
            });
    
        
    }

    /** Create the head of the ListBox
     * @returns {HTMLElement} - ListBox head element
     */
    #createHead() {

        this.#headElement = this.#createItem({id: 'item_head', label: 'Select all', checked: "unchecked"});
        this.#headContainerElement.appendChild(this.headElement);
        
    }

    /** Create a ListBox item
     *
     * @param {object} item - Item object
     * @param {string} item.id - Item id
     * @param {string} item.label - Item label
     * @param {string} item.checked - Item checked status
     * @returns {HTMLElement} - ListBox item element
     */
    #createItem({id, label, checked = "unchecked"}) {
        // Get the required attributes
        const idKey = SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID

        // Get the derived attributes
        const labelId = `${this.id}_label_${id}`;
        const checkboxId = `${this.id}_checkbox_${id}`;

        // Get the checkbox attributes
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
        });
        itemContainer.appendChild(this.checkboxElement);

        // Create the label element
        this.#labelElement = new SiriusLabel({
            [idKey]: labelId,
            [captionKey]: label
        });
        itemContainer.appendChild(this.labelElement);

        // Add the click event to the checkbox element
        this.checkboxElement.addEventListener('click', () => {
            console.log(this.getCheckedItems());
            console.log(this.#headElement.querySelector("sirius-checkbox").children);
            this._checkedItems=[];
        });
        
        // Set the checkbox element parent id
        if (!this.#head && this.#itemContainerList.length >= 1 ){
            this.checkboxElement.parentId = this.#headElement.querySelector("sirius-checkbox").id;
        }

        this.#itemContainerList.push(itemContainer);

        
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
    #setCheckboxColor(Color) {
        if (Color)
            this.onBuilt = () => {
                this.#itemContainerList.forEach(item => {
                    const checkbox = item.querySelector("sirius-checkbox")
                    checkbox.checkboxBorderColor = Color;
                    checkbox.iconFill = Color;
                });
            }
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

    /** Private method to handle attribute changes
     * @param {string} name - Attribute name
     * @param {string} oldValue - Old value
     * @param {string} newValue - New value
     */
    #attributeChangeHandler(name, oldValue, newValue) {
        switch (name) {
            case SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID:
                this._setId(newValue);
                break;

            case SIRIUS_ELEMENT_ATTRIBUTES.STYLE:
                this.#setStyle(newValue);
                break;

            case SIRIUS_LIST_BOX_ATTRIBUTES.HEAD:
                this.#setHead(newValue);
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

            case SIRIUS_LIST_BOX_ATTRIBUTES.CHECKBOX_COLOR:
                this.#setCheckboxColor(newValue);
                break;
            case SIRIUS_LIST_BOX_ATTRIBUTES.ITEMS:
                this.#setItems(JSON.parse(newValue));
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
        this.onBuilt=()=>this.#attributeChangeHandler(name, oldValue, formattedValue);
    }
}

// Register custom element
customElements.define(SIRIUS_LIST_BOX.TAG, SiriusListBox);