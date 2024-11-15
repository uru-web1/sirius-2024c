import { SiriusElement } from "./SiriusElement.js";

export const SIRIUS_MENU_BAR = {
    NAME: "SiriusMenuBar",
    TAG: "sirius-menu-bar",
    ATTRIBUTES: {
        ITEMS: { NAME: "items", DEFAULT: [], TYPE: "array" },
        ID: { NAME: "id", DEFAULT: null, TYPE: "string" }
    },
    CLASSES: {
        MENU: "menu-bar",
        MENU_ITEM: "menu-item",
        SUBMENU: "submenu",
        ACTIVE: "active",
        HAS_SUBMENU: "has-submenu"
    }
};

export class SiriusMenuBar extends SiriusElement {
    constructor(props = {}) {
        // Validar y asignar un ID si no se proporciona
        if (!props.id) {
            props.id = `sirius-menu-${Math.random().toString(36).substr(2, 9)}`;
        }

        // Llama al constructor de la clase base SiriusElement
        super(props, SIRIUS_MENU_BAR.NAME);

        // Inicializar los atributos
        this._attributes = {
            ...SIRIUS_MENU_BAR.ATTRIBUTES,
            ...props,
            items: this.#parseItems(props.items || this.getAttribute(SIRIUS_MENU_BAR.ATTRIBUTES.ITEMS.NAME) || [])
        };
    }

    #parseItems(items) {
        if (typeof items === 'string') {
            try {
                return JSON.parse(items);
            } catch (e) {
                console.error("Error parsing items:", e);
                return [];
            }
        }
        return Array.isArray(items) ? items : [];
    }

    async connectedCallback() {
        await this._loadElementStyles();
        this.render();
        this.#attachEventListeners();
        this.dispatchBuiltEvent();
    }

    render() {
        const template = this.#getTemplate();
        this.shadowRoot.innerHTML = template;
    }

    #getTemplate() {
        const items = this._attributes.items;
        return `<div class="${SIRIUS_MENU_BAR.CLASSES.MENU}">
                    ${items.map(item => this.#getMenuItemTemplate(item)).join("")}
                </div>`;
    }

    #getMenuItemTemplate(item) {
        const hasSubmenu = Array.isArray(item.submenu) && item.submenu.length > 0;
        const submenuHTML = hasSubmenu ? this.#getSubMenuTemplate(item.submenu) : "";
        const submenuClass = hasSubmenu ? SIRIUS_MENU_BAR.CLASSES.HAS_SUBMENU : "";

        return `
            <div class="${SIRIUS_MENU_BAR.CLASSES.MENU_ITEM} ${submenuClass}">
                <span>${item.label}</span>
                ${submenuHTML}
            </div>`;
    }

    #getSubMenuTemplate(submenuItems) {
        return `<div class="${SIRIUS_MENU_BAR.CLASSES.SUBMENU}">
                    ${submenuItems.map(subitem => this.#getMenuItemTemplate(subitem)).join("")}
                </div>`;
    }

    #attachEventListeners() {
        const menuItems = this.shadowRoot.querySelectorAll(`.${SIRIUS_MENU_BAR.CLASSES.HAS_SUBMENU}`);
        menuItems.forEach(menuItem => {
            const submenu = menuItem.querySelector(`.${SIRIUS_MENU_BAR.CLASSES.SUBMENU}`);
            menuItem.addEventListener('mouseenter', () => {
                submenu.classList.add(SIRIUS_MENU_BAR.CLASSES.ACTIVE);
            });
            menuItem.addEventListener('mouseleave', () => {
                submenu.classList.remove(SIRIUS_MENU_BAR.CLASSES.ACTIVE);
            });
        });
    }
}

customElements.define(SIRIUS_MENU_BAR.TAG, SiriusMenuBar);
