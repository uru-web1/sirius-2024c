import SiriusElement,{
    SIRIUS_ELEMENT,
    SIRIUS_ELEMENT_ATTRIBUTES,
    SIRIUS_ELEMENT_PROPERTIES,
    SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES
} from "./SiriusElement.js";
import SiriusListBoxV2 , { SIRIUS_LIST_BOX } from './SiriusListBoxV2.js';
import SiriusIcon, {SIRIUS_ICON, SIRIUS_ICON_ATTRIBUTES} from './SiriusIcon.js';
import { SIRIUS_SVG_ICONS } from "./SiriusSvg.js";
import deepFreeze from "./utils/deep-freeze.js";

/** SiriusExchangeList constants */
export const SIRIUS_EXCHANGE_LIST = deepFreeze({
    NAME: "SiriusExchangeList",
    TAG: "sirius-exchange-list",
    CLASSES: {
        TRANSFER_LIST_CONTAINER: 'exchange-list-container',
        BUTTON_CONTAINER: 'button-container',
        BUTTON: 'button',
    },
    SLOTS:{
        LISTBOX_LEFT: 'listbox-left',
        LISTBOX_RIGHT: 'listbox-right',
    }
});

/** SiriusExchangeList attributes */
export const SIRIUS_EXCHANGE_LIST_ATTRIBUTES = deepFreeze({});

/** SiriusExchangeList attributes default values */
export const SIRIUS_EXCHANGE_LIST_ATTRIBUTES_DEFAULT = deepFreeze({});

/** Sirius class that represents a transfer list component */
export default class SiriusExchangeList extends SiriusElement {
    // Container elements
    #exchangeListContainerElement = null;
    #leftListBoxElement = null;
    #rightListBoxElement = null;
    #buttonContainerElement = null;
    #iconElementLeft = null;
    #iconElementRight = null;


    /**
     * Create a SiriusExchangeList element
     * @param {object} properties - Element properties
     */
    constructor(properties) {
        super({...properties, [SIRIUS_ELEMENT_PROPERTIES.NAME]: SIRIUS_EXCHANGE_LIST.NAME},);
        this.#build(properties).then();
    }

    /** Define observed attributes
     * @returns {string[]} - Observed attributes
     * */
    static get observedAttributes() {
        return [...SiriusElement.observedAttributes, ...Object.values(SIRIUS_EXCHANGE_LIST_ATTRIBUTES)];
    }

    /** Get the template for the SiriusExchangeList
     * @returns {string} - Template
     */
    #getTemplate() {

        const buttonClasses = [SIRIUS_EXCHANGE_LIST.CLASSES.BUTTON_CONTAINER]
        return `<div class="${SIRIUS_EXCHANGE_LIST.CLASSES.TRANSFER_LIST_CONTAINER}">
                    <slot name="${SIRIUS_EXCHANGE_LIST.SLOTS.LISTBOX_LEFT}"></slot>
                    <div class="${buttonClasses.join(' ')}"></div>
                    <slot name="${SIRIUS_EXCHANGE_LIST.SLOTS.LISTBOX_RIGHT}"></slot>
            </div>
        `;
    }

    /** Build the SiriusExchangeList
     * @param {object} properties - Element properties
     * @returns {Promise<void>} - Promise
     * */
    async #build(properties) {
        // Load Sirius TransferList attributes
        this._loadAttributes({
            instanceProperties: properties,
            attributes: SIRIUS_EXCHANGE_LIST_ATTRIBUTES,
            attributesDefault: SIRIUS_EXCHANGE_LIST_ATTRIBUTES_DEFAULT
        });

        // Create the CSS stylesheet and add it to the shadow DOM
        await this._loadAndAdoptStyles();

        // Get HTML inner content
        const innerHTML = this.#getTemplate();

        // Create the transfer list container element
        const container = await this._createContainerElementTemplate(innerHTML);
        this.#exchangeListContainerElement = this._containerElement = container;
        this.#leftListBoxElement = this.#exchangeListContainerElement.firstElementChild;
        this.#rightListBoxElement = this.#exchangeListContainerElement.lastElementChild;
        this.#buttonContainerElement = this.#leftListBoxElement.nextElementSibling;

        const idKey = SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID
        const iconKey = SIRIUS_ICON_ATTRIBUTES.ICON
        const rotationKey = SIRIUS_ICON_ATTRIBUTES.ROTATION
        const stylesKey = SIRIUS_ELEMENT_ATTRIBUTES.STYLES
        const styleshoverKey = SIRIUS_ELEMENT_ATTRIBUTES.STYLES_ON_HOVER

        this.#iconElementLeft = new SiriusIcon({
            [idKey]: "icon-left",
            [iconKey]: SIRIUS_SVG_ICONS.ARROW,
            [rotationKey]: "left",
            [stylesKey]: `background-color: whitesmoke; border: 1px solid black; border-radius: 5px;`,
            [styleshoverKey]: `background-color: lightgray;`
        })

        this.#iconElementRight = new SiriusIcon({
            [idKey]: "icon-right",
            [iconKey]: SIRIUS_SVG_ICONS.ARROW,
            [rotationKey]: "right",
            [stylesKey]: `background-color: whitesmoke; border: 1px solid black; border-radius: 5px;`,
            [styleshoverKey]: `background-color: lightgray;`
        })

        this.#buttonContainerElement.appendChild(this.#iconElementLeft)
        this.#buttonContainerElement.appendChild(this.#iconElementRight)

        // Add event listeners to buttons
        this.#iconElementLeft.addEventListener('click', () => this.#transferItems(this.#rightListBoxElement, this.#leftListBoxElement));
        this.#iconElementRight.addEventListener('click', () => this.#transferItems(this.#leftListBoxElement, this.#rightListBoxElement));

        // Add the container element to the shadow DOM
        this.shadowRoot.appendChild(this.containerElement);
        // Dispatch the built event
        this._dispatchBuiltEvent();
    }

    /** Transfer items from one list box to another
     * @param {SiriusListBoxV2} fromListBox - Source list box
     * @param {SiriusListBoxV2} toListBox - Destination list box
     */
    async #transferItems(fromSlot, toSlot) {

        const fromListBox = fromSlot.assignedElements()[0];
        const toListBox = toSlot.assignedElements()[0];

        if (fromListBox && toListBox) {

            const checkedItems = fromListBox.checkedItems;

            // // Remove checked items from the source list box
            // fromListBox.removeItems(...checkedItems);

            // // Add checked items to the destination list box
            // toListBox.addItems(...checkedItems);
            
        }
    }

    /** Get the transfer list container element
     * @returns {HTMLElement|null} - Transfer list container element
     */
    get exchangeListContainerElement() {
        return this.#exchangeListContainerElement;
    }

    /** Get the left list box element
     * @returns {SiriusListBoxV2|null} - Left list box element
     */
    get leftListBoxElement() {
        return this.#leftListBoxElement;
    }

    /** Get the right list box element
     * @returns {SiriusListBoxV2|null} - Right list box element
     */
    get rightListBoxElement() {
        return this.#rightListBoxElement;
    }

    /** Get the button container element
     * @returns {HTMLElement|null} - Button container element
     */
    get buttonContainerElement() {
        return this.#buttonContainerElement;
    }

    /** Get the transfer to right button element
     * @returns {HTMLElement|null} - Transfer to right button element
     */
    get iconElementLeft() {
        return this.#iconElementLeft;
    }

    /** Get the transfer to left button element
     * @returns {HTMLElement|null} - Transfer to left button element
     */
    get iconElementRight() {
        return this.#iconElementRight;
    }
}

// Register custom element
customElements.define(SIRIUS_EXCHANGE_LIST.TAG, SiriusExchangeList);