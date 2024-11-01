import { SIRIUS_TYPES, SiriusElement } from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

export const SIRIUS_MENU_BAR = deepFreeze({
    NAME: "SiriusMenuBar",
    TAG: "sirius-menu-bar",
    ATTRIBUTES: {
        ITEMS: { NAME: "items", DEFAULT: [], TYPE: SIRIUS_TYPES.ARRAY },
        ID: { NAME: "id", DEFAULT: null, TYPE: SIRIUS_TYPES.STRING }
    },
    CLASSES: {
        MENU: "menu-bar",
        MENU_ITEM: "menu-item",
        SUBMENU: "submenu",
        ACTIVE: "active"
    }
});

export class SiriusMenuBar extends SiriusElement {
    constructor(props = {}) {
        super(props, SIRIUS_MENU_BAR.NAME);
        this._attributes = {
            ...SIRIUS_MENU_BAR.ATTRIBUTES,
            ...props,
            items: this.#parseItems(props.items || this.getAttribute(SIRIUS_MENU_BAR.ATTRIBUTES.ITEMS.NAME) || [])
        };
    }

    #parseItems(items) {
        if (typeof items === 'string') {
            try {
                items = JSON.parse(items);
            } catch (e) {
                items = [];
            }
        }
        return Array.isArray(items) ? items : [];
    }

    async connectedCallback() {
        await this._loadElementStyles();
        const innerHTML = this.#getTemplate();
        await this._createTemplate(innerHTML);
        this.containerElement = this._templateContent.firstChild;
        this.shadowRoot.appendChild(this.containerElement);
        this.dispatchBuiltEvent();
    }

    #getTemplate() {
        const items = this._attributes.items;
        const menuItemsHTML = items.map(item => this.#getMenuItemTemplate(item)).join("");
        return `<div class="${SIRIUS_MENU_BAR.CLASSES.MENU}" id="${this._attributes.id}">${menuItemsHTML}</div>`;
    }

    #getMenuItemTemplate(item) {
        if (!item || typeof item.label !== 'string') {
            return '';
        }
        const submenuHTML = item.submenu ? this.#getSubMenuTemplate(item.submenu) : "";
        const iconHTML = item.svg ? `<span class="icon">${item.svg}</span>` : '';
        return `<div class="${SIRIUS_MENU_BAR.CLASSES.MENU_ITEM}">
                    ${iconHTML} <span>${item.label}</span>
                    ${submenuHTML}
                </div>`;
    }

    #getSubMenuTemplate(submenuItems) {
        if (!Array.isArray(submenuItems)) {
            return '';
        }
        const submenuItemsHTML = submenuItems.map(subitem => {
            if (!subitem || typeof subitem.label !== 'string') {
                return '';
            }
            return `<div class="${SIRIUS_MENU_BAR.CLASSES.MENU_ITEM}">${subitem.label}</div>`;
        }).join("");
        return `<div class="${SIRIUS_MENU_BAR.CLASSES.SUBMENU}">${submenuItemsHTML}</div>`;
    }
}

customElements.define(SIRIUS_MENU_BAR.TAG, SiriusMenuBar);
