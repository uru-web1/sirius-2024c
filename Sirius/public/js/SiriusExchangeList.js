import SiriusElement, {SIRIUS_ELEMENT_ATTRIBUTES, SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES} from "./SiriusElement.js";
import SiriusListBoxV1 from "./SiriusListBoxV1.js";
import SiriusIcon from "./SiriusIcon.js";
import deepFreeze from "./utils/deep-freeze.js";

/** SiriusListBox class */
export const SIRIUS_EXCHANGE_LIST = deepFreeze({
    NAME: "SiriusExchangeList",
    TAG: "sirius-exchange-list",
    CSS_VARS: {
        GAP: "--gap",
        BACKGROUND_COLOR: "--background-color",
        PADDING: "--padding"
    },
    CLASSES: {
        EXCHANGE_LIST_CONTAINER: 'exchange-list-container',
        LIST_BOX_CONTAINER: 'list-box-container',
        BUTTOM_CONTAINER: 'buttom-container',
    }
})

export default class SiriusExchangeList extends SiriusElement {

    // container elements
    #listBoxElement1 = null;
    #listBoxElement2 = null;
    #iconElement1 = null;
    #iconElement2 = null;
    #exchangeListContainerElement = null;
    #buttomContainerElement = null;
    #listboxContainerElement1 = null;
    #listboxContainerElement2 = null;


    // lists
    #itemsList = [];
    #itemContainerList = [];
    _checkedItems = [];

    constructor(properties) {
        super(properties, SIRIUS_EXCHANGE_LIST.NAME);
    }

    static get observedAttributes() {
        return [...SiriusElement.observedAttributes, ...Object.values(SIRIUS_EXCHANGE_LIST)];
    }

    get listBoxElement1() {
        return this.#listBoxElement1;
    }

    get listBoxElement2() {
        return this.#listBoxElement2;
    }

    get iconElement1() {
        return this.#iconElement1;
    }

    get iconElement2() {
        return this.#iconElement2;
    }

    get exchangeListContainerElement() {
        return this.#exchangeListContainerElement;
    }

    get buttomContainerElement() {
        return this.#buttomContainerElement;
    }

    get listboxContainerElement1() {
        return this.#listboxContainerElement1;
    }

    get listboxContainerElement2() {
        return this.#listboxContainerElement2;
    }


    #setStyle(style) {
        if (!style)
            return
        // Add the style attribute to the element when built
        this._setStyle = () => this._setStyleAttributes(style, this.checkboxContainerElement);
    }

    #getTemplate() {
        // Get the checkbox classes
        const exchangeListContainerClasses = [SIRIUS_EXCHANGE_LIST.CLASSES.EXCHANGE_LIST_CONTAINER];
        const listBoxContainerClasses = [SIRIUS_EXCHANGE_LIST.CLASSES.LIST_BOX_CONTAINER];
        const buttomContainerClasses = [SIRIUS_EXCHANGE_LIST.CLASSES.BUTTOM_CONTAINER];
        return `<div class="${exchangeListContainerClasses.join(' ')}">
                    <div class="${listBoxContainerClasses.join(' ')}">
                    </div>
                    <div class="${buttomContainerClasses.join(' ')}>
                    </div>
                    <div class="${listBoxContainerClasses.join(' ')}">
                    </div>
                </div>`;
    }

    set events(events) {
        if (!events)
            return
        // Add the events property to the element when built
        this.onBuilt = () => this._setEvents(events, this);
    }

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
            default:
                this._onInjectedLogger = () => this.logger.error(`Unregistered attribute: ${name}`);
                break;
        }
    }

    async connectedCallback() {
        // Call the parent connectedCallback
        await super.connectedCallback();
        // Load Sirius checkbox HTML attributes
        this._loadAttributes({
            instanceProperties: this._properties,
            attributes: SIRIUS_EXCHANGE_LIST_ATTRIBUTES,
            defaultAttributes: SIRIUS_EXCHANGE_LIST_ATTRIBUTES_DEFAULT
        });
        // Create the CSS style sheets and add them to the shadow DOM
        await this._loadAndAdoptStyles();

        // Create derived IDs
        // const listbox1key = "listbox1"
        // const listbox2key = "listbox2"

        // Get the required keys
        const idKey = SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID

        // Create SiriusIcon element
        this.#listBoxElement1 = new SiriusListBoxV1({
            [idKey]: 'listbox-1',
            [itemsKey]: `[
                { "id": "item_1", "label": "Item 1"},
                { "id": "item_2", "label": "Item 2"},
                { "id": "item_3", "label": "Item 3"}
            ]
            `,
            [backgroundKey]: 'rgb(205,207,214)',
            [checkboxColorKey]: 'black',

        })

        this.#listBoxElement2 = new SiriusListBoxV1({
            [idKey]: 'listbox-2',
            [itemsKey]: `[
                { "id": "item_4", "label": "Item 4"},
                { "id": "item_5", "label": "Item 5"},
                { "id": "item_6", "label": "Item 6"}
            ]
            `,
            [backgroundKey]: 'rgb(205,207,214)',
            [checkboxColorKey]: 'black',

        })

        this.#iconElement1 = new SiriusIcon({
            [idKey]: 'icon',
            [iconKey]: 'arrow-right',
            [colorKey]: 'blue'
        })

        this.#iconElement2 = new SiriusIcon({
            [idKey]: 'icon',
            [iconKey]: 'arrow-left',
            [colorKey]: 'blue'
        })

        const boton1 = document.createElement('div');
        const boton2 = document.createElement('div');

        boton1.appendChild(this.#iconElement1);
        boton2.appendChild(this.#iconElement2);


        // // Create SiriusLabel element
        // this.#labelElement = new SiriusLabel({
        //     [idKey]: labelId,
        // })
        // Get HTML inner content
        const innerHTML = this.#getTemplate();

        // Create the container element
        const container= this._createContainerElementTemplate(innerHTML)
        this.#exchangeListContainerElement = this._containerElement =container
        this.#listboxContainerElement1 = this.#exchangeListContainerElement.firstElementChild;
        this.#listboxContainerElement2 = this.#exchangeListContainerElement.lastElementChild;
        this.#buttomContainerElement = this.listboxContainerElement1.nextElementSibling;

        this.#listboxContainerElement1.appendChild(this.#listBoxElement1);
        this.#listboxContainerElement2.appendChild(this.#listBoxElement2);
        this.#buttomContainerElement.appendChild(boton1);
        this.#buttomContainerElement.appendChild(boton2);

        // Add ListBox to the shadow DOM
        this.shadowRoot.appendChild(this.containerElement);

        // Dispatch the built event
        this.dispatchBuiltEvent();
    }

    get checkedItems() {
        return this._checkedItems;
    }

    set checkedItems(value) {
        this._checkedItems = value;
    }
}
customElements.define(SIRIUS_EXCHANGE_LIST.TAG, SiriusExchangeList);
    

