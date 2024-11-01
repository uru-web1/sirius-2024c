import { SiriusElement } from "./SiriusElement.js";
import { SiriusIcon } from "./SiriusIcon.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Constantes de Sirius PopupMenu */
export const SIRIUS_POPUPMENU = deepFreeze({
    NAME: "SiriusPopupMenu",
    TAG: "sirius-popupmenu",
    ATTRIBUTES: {
        MENU_OPTIONS: { NAME: "menuOptions", DEFAULT: [], TYPE: "array" }
    },
    CLASSES: {
        CONTAINER: 'sirius-popupmenu-container',
        MENU_ICON: 'sirius-popupmenu-icon',
        MENU: 'sirius-popupmenu-menu',
        MENU_ITEM: 'sirius-popupmenu-item',
        BACK_BUTTON: 'sirius-popupmenu-back-button',
        SUBMENU: 'sirius-popupmenu-submenu'
    }
});

export class SiriusPopupMenu extends SiriusElement {
    constructor(props) {
        super(props, SIRIUS_POPUPMENU.NAME);

        // Configura las opciones del menú desde props o atributo HTML
        let menuOptions = props?.menuOptions || this.getAttribute(SIRIUS_POPUPMENU.ATTRIBUTES.MENU_OPTIONS.NAME) || SIRIUS_POPUPMENU.ATTRIBUTES.MENU_OPTIONS.DEFAULT;

        // Si menuOptions es una cadena, intenta convertirla a un array
        if (typeof menuOptions === 'string') {
            try {
                menuOptions = JSON.parse(menuOptions);
            } catch (error) {
                console.error("Error parsing menuOptions:", error);
                menuOptions = SIRIUS_POPUPMENU.ATTRIBUTES.MENU_OPTIONS.DEFAULT;
            }
        }

        this._attributes[SIRIUS_POPUPMENU.ATTRIBUTES.MENU_OPTIONS.NAME] = menuOptions;
        this._currentMenuLevel = []; // Pila para navegación en niveles
        this._createPopupMenuTemplate(); // Construcción de la estructura HTML
    }

    /**
     * Genera la plantilla HTML del PopupMenu.
     */
    async _createPopupMenuTemplate() {
        const { MENU_OPTIONS } = SIRIUS_POPUPMENU.ATTRIBUTES;

        // Generar el HTML para las opciones del menú
        const menuHTML = this._generateMenuHTML(this._attributes[MENU_OPTIONS.NAME]);

        // Plantilla del PopupMenu
        const popupMenuHTML = `
            <div id="${this._attributes.id}-container" class="${SIRIUS_POPUPMENU.CLASSES.CONTAINER}">
                <sirius-icon id="${this._attributes.id}-icon" class="${SIRIUS_POPUPMENU.CLASSES.MENU_ICON}" 
                             icon="menu" width="24" height="24" fill="black"></sirius-icon>
                <div class="${SIRIUS_POPUPMENU.CLASSES.MENU}" style="display: none;">
                    ${menuHTML}
                </div>
            </div>
        `;

        // Inserta la plantilla en el Shadow DOM
        await this._createTemplate(popupMenuHTML);
        this.containerElement = this._templateContent.querySelector(`#${this._attributes.id}-container`);
        this.menuElement = this.containerElement.querySelector(`.${SIRIUS_POPUPMENU.CLASSES.MENU}`);
        this.iconElement = this.containerElement.querySelector(`#${this._attributes.id}-icon`);

        this.shadowRoot.appendChild(this._templateContent);
        await this._loadElementStyles(SIRIUS_POPUPMENU.NAME);
        this.dispatchBuiltEvent();

        this._addEventListeners();
    }

    /**
     * Genera el HTML de un menú según las opciones pasadas.
     */
    _generateMenuHTML(menuOptions) {
        return menuOptions.map(option => {
            if (option.submenu) {
                return `<div class="${SIRIUS_POPUPMENU.CLASSES.MENU_ITEM}" data-submenu>
                            ${option.label}
                            <div class="${SIRIUS_POPUPMENU.CLASSES.SUBMENU}" style="display: none;">
                                ${this._generateMenuHTML(option.submenu)}
                                <button class="${SIRIUS_POPUPMENU.CLASSES.BACK_BUTTON}">Back</button>
                            </div>
                        </div>`;
            }
            return `<div class="${SIRIUS_POPUPMENU.CLASSES.MENU_ITEM}" data-action="${option.action}">
                        ${option.label}
                    </div>`;
        }).join("");
    }

    /**
     * Agrega eventos para el manejo del PopupMenu.
     */
    _addEventListeners() {
        // Evento para mostrar/ocultar el menú
        this.iconElement.addEventListener("click", () => {
            const isHidden = this.menuElement.style.display === 'none' || !this.menuElement.style.display;
            this.menuElement.style.display = isHidden ? 'block' : 'none';
        });

        // Evento para manejar las opciones de menú
        this.menuElement.addEventListener("click", (event) => {
            const menuItem = event.target.closest(`.${SIRIUS_POPUPMENU.CLASSES.MENU_ITEM}`);
            if (menuItem) {
                if (menuItem.hasAttribute("data-submenu")) {
                    const submenu = menuItem.querySelector(`.${SIRIUS_POPUPMENU.CLASSES.SUBMENU}`);
                    this._currentMenuLevel.push(this.menuElement);
                    this.menuElement.style.display = 'none';
                    submenu.style.display = 'block';
                    this.menuElement = submenu;
                } else if (menuItem.dataset.action) {
                    this._handleMenuAction(menuItem.dataset.action);
                }
            }
        });

        // Evento para regresar a un nivel anterior en el menú
        this.menuElement.addEventListener("click", (event) => {
            if (event.target.classList.contains(SIRIUS_POPUPMENU.CLASSES.BACK_BUTTON)) {
                this.menuElement.style.display = 'none';
                this.menuElement = this._currentMenuLevel.pop();
                this.menuElement.style.display = 'block';
            }
        });

        // Evento para cerrar el menú al hacer clic fuera
        document.addEventListener("click", (event) => {
            if (!this.containerElement.contains(event.target)) {
                this.menuElement.style.display = 'none';
            }
        });
    }

    /**
     * Maneja acciones al seleccionar una opción de menú.
     */
    _handleMenuAction(action) {
        this.dispatchEvent(new CustomEvent("menu-action", { detail: { action } }));
        this.menuElement.style.display = 'none';
    }

    /**
     * Añade el PopupMenu al DOM.
     */
    addToBody() {
        document.body.appendChild(this);
    }
}

customElements.define(SIRIUS_POPUPMENU.TAG, SiriusPopupMenu);
