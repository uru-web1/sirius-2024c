import { SiriusElement } from "./SiriusElement.js";

export const SIRIUS_MENU_BAR = {
    NAME: "SiriusMenuBar",
    TAG: "sirius-menu-bar",
    ATTRIBUTES: {
        ITEMS: { NAME: "items", DEFAULT: [], TYPE: "array" }, // Aseguramos que ITEMS esté definido
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
    #menuContainer = null;

    constructor(properties = {}) {
        // Verificar que los atributos están correctamente definidos
        if (!SIRIUS_MENU_BAR.ATTRIBUTES || !SIRIUS_MENU_BAR.ATTRIBUTES.ITEMS) {
            throw new Error("SIRIUS_MENU_BAR.ATTRIBUTES.ITEMS is not defined");
        }

        // Asignar un ID único si no se proporciona
        if (!properties.id) {
            properties.id = `sirius-menu-bar-${Math.random().toString(36).substr(2, 9)}`;
        }

        super(properties, SIRIUS_MENU_BAR.NAME);

        // Inicializar los atributos con validación de ITEMS
        this._attributes = {
            ...SIRIUS_MENU_BAR.ATTRIBUTES,
            ...properties,
            items: this.#parseItems(
                properties.items || this.getAttribute(SIRIUS_MENU_BAR.ATTRIBUTES.ITEMS.NAME) || []
            )
        };

        // Construcción del componente
        this.#build().then();
    }

    async #build() {
        // Carga y adopta estilos
        await this._loadAndAdoptStyles();

        // Genera la plantilla del menú
        const menuTemplate = this.#getTemplate();

        // Renderiza el menú
        this.shadowRoot.innerHTML = "";
        this.shadowRoot.appendChild(menuTemplate);

        // Asocia los eventos
        this.#attachEventListeners();

        // Evento de inicialización
        this.dispatchBuiltEvent();
    }

    #getTemplate() {
        const menuContainer = document.createElement("div");
        menuContainer.classList.add(SIRIUS_MENU_BAR.CLASSES.MENU);

        const items = this.#parseItems(this._attributes.items || []);
        items.forEach((item) => {
            const menuItem = this.#createMenuItem(item);
            menuContainer.appendChild(menuItem);
        });

        this.#menuContainer = menuContainer;
        return menuContainer;
    }

    #createMenuItem(item) {
        const menuItem = document.createElement("div");
        menuItem.classList.add(SIRIUS_MENU_BAR.CLASSES.MENU_ITEM);

        const label = document.createElement("span");
        label.textContent = item.label;
        menuItem.appendChild(label);

        if (Array.isArray(item.submenu) && item.submenu.length > 0) {
            menuItem.classList.add(SIRIUS_MENU_BAR.CLASSES.HAS_SUBMENU);

            const submenu = document.createElement("div");
            submenu.classList.add(SIRIUS_MENU_BAR.CLASSES.SUBMENU);

            item.submenu.forEach((subItem) => {
                const submenuItem = this.#createMenuItem(subItem);
                submenu.appendChild(submenuItem);
            });

            menuItem.appendChild(submenu);
        }

        return menuItem;
    }

    #parseItems(items) {
        try {
            return typeof items === "string" ? JSON.parse(items) : items || [];
        } catch (e) {
            console.error("Error parsing items:", e);
            return [];
        }
    }

    #attachEventListeners() {
        const menuItems = this.#menuContainer.querySelectorAll(
            `.${SIRIUS_MENU_BAR.CLASSES.HAS_SUBMENU}`
        );

        menuItems.forEach((menuItem) => {
            const submenu = menuItem.querySelector(
                `.${SIRIUS_MENU_BAR.CLASSES.SUBMENU}`
            );

            menuItem.addEventListener("mouseenter", () => {
                submenu.classList.add(SIRIUS_MENU_BAR.CLASSES.ACTIVE);
            });

            menuItem.addEventListener("mouseleave", () => {
                submenu.classList.remove(SIRIUS_MENU_BAR.CLASSES.ACTIVE);
            });
        });
    }
}

// Registro del elemento personalizado
customElements.define(SIRIUS_MENU_BAR.TAG, SiriusMenuBar);
