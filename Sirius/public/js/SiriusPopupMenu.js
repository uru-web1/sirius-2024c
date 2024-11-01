import { SIRIUS_TYPES, SiriusElement } from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Sirius PopupMenu constants */
export const SIRIUS_POPUP_MENU = deepFreeze({
    NAME: "SiriusPopupMenu",
    TAG: "sirius-popup-menu",
    ATTRIBUTES: {
        ICON: { NAME: "icon", DEFAULT: "☰", TYPE: SIRIUS_TYPES.STRING },
        OPEN: { NAME: "open", DEFAULT: false, TYPE: SIRIUS_TYPES.BOOLEAN },
        MENU_OPTIONS: { NAME: "menuOptions", DEFAULT: [], TYPE: SIRIUS_TYPES.ARRAY }
    },
    CLASSES: {
        CONTAINER: "popup-menu-container",
        MENU: "popup-menu",
        MENU_ITEM: "popup-menu-item",
        ICON: "popup-menu-icon",
        BACK_BUTTON: "popup-menu-back",
        OPENED: "popup-menu-opened"
    }
});

/** Sirius class that represents a popup menu component */
export class SiriusPopupMenu extends SiriusElement {
    /**
     * Create a Sirius PopupMenu element
     * @param {Object} props - The properties of the Sirius PopupMenu
     */
    constructor(props = {}) {  // Se asegura de que props tenga un valor por defecto
        super(props, SIRIUS_POPUP_MENU.NAME);

        // Ensure menuOptions is set to an array if not provided
        if (!Array.isArray(props[SIRIUS_POPUP_MENU.ATTRIBUTES.MENU_OPTIONS.NAME]) || 
            props[SIRIUS_POPUP_MENU.ATTRIBUTES.MENU_OPTIONS.NAME].length === 0) {
            throw new Error(`Invalid attribute value for '${SIRIUS_POPUP_MENU.ATTRIBUTES.MENU_OPTIONS.NAME}': Must be a non-empty array.`);
        }

        // Load Sirius PopupMenu HTML attributes
        this._loadAttributes({
            htmlAttributes: SIRIUS_POPUP_MENU.ATTRIBUTES,
            properties: props
        });

        // Bind event handlers
        this._handleIconClick = this._handleIconClick.bind(this);
    }

    /** Toggle menu visibility */
    _handleIconClick() {
        this._attributes[SIRIUS_POPUP_MENU.ATTRIBUTES.OPEN.NAME] = !this._attributes[SIRIUS_POPUP_MENU.ATTRIBUTES.OPEN.NAME];
        this._updateMenuDisplay();
    }

    /** Get the template for the Sirius PopupMenu
     * @returns {string} - Template
     */
    #getTemplate() {
        return `<div class="${SIRIUS_POPUP_MENU.CLASSES.CONTAINER}">
                    <span class="${SIRIUS_POPUP_MENU.CLASSES.ICON}" id="popupIcon">${this._attributes[SIRIUS_POPUP_MENU.ATTRIBUTES.ICON.NAME]}</span>
                    <div class="${SIRIUS_POPUP_MENU.CLASSES.MENU}">
                        ${this._generateMenuOptions()}
                    </div>
                </div>`;
    }

    /** Generate menu options from attributes
     * @returns {string} - HTML string of menu items
     */
    _generateMenuOptions() {
        const options = this._attributes[SIRIUS_POPUP_MENU.ATTRIBUTES.MENU_OPTIONS.NAME];
        return options.map(option => `<div class="${SIRIUS_POPUP_MENU.CLASSES.MENU_ITEM}">${option}</div>`).join('');
    }

    /** Toggle menu display based on the "open" attribute */
    _updateMenuDisplay() {
        const menu = this.shadowRoot.querySelector(`.${SIRIUS_POPUP_MENU.CLASSES.MENU}`);
        if (this._attributes[SIRIUS_POPUP_MENU.ATTRIBUTES.OPEN.NAME]) {
            menu.classList.add(SIRIUS_POPUP_MENU.CLASSES.OPENED);
        } else {
            menu.classList.remove(SIRIUS_POPUP_MENU.CLASSES.OPENED);
        }
    }

    /** Lifecycle method called when the component is connected to the DOM */
    async connectedCallback() {
        await this._loadElementStyles();
        const innerHTML = this.#getTemplate();
        await this._createTemplate(innerHTML);

        this.containerElement = this._templateContent.firstChild;
        this.shadowRoot.appendChild(this.containerElement);

        // Add event listeners
        this.shadowRoot.getElementById("popupIcon").addEventListener("click", this._handleIconClick);

        this.dispatchBuiltEvent();
    }
}

// Register custom element
customElements.define(SIRIUS_POPUP_MENU.TAG, SiriusPopupMenu);
