import { SiriusElement } from "./SiriusElement.js"; 
import deepFreeze from "./utils/deep-freeze.js"; 
import { SiriusIcon } from "./SiriusIcon.js"; 

// Configuración global e inmutable para el PopupMenu
export const POPUP_MENU = deepFreeze({
    NAME: "PopupMenu", 
    TAG: "popup-menu",
    CSS_VARS: {
        WIDTH: "--menu-width",
        BACKGROUND: "--menu-background",
        OPTION_COLOR: "--option-color",
        OPTION_HOVER: "--option-hover-color",
        ANIMATION_DURATION: "--animation-duration",
    },
    CLASSES: { 
        MENU_CONTAINER: "menu-container",
        MENU_OPTION: "menu-option",
        FIXED_OPTION: "menu-fixed-option",
        BACK_BUTTON: "menu-back-button",
        SLIDE_IN: "slide-in",
        SLIDE_OUT: "slide-out",
        MENU_ICON: "menu-icon",
        OPTION_CONTAINER: "PopupMenu_Option_Container", 
        FONDO: "menu-fondo",
        TITLE: "menu-title",
        OPTION_ICON: "option-icon",
        BACK_ICON: "back-icon"
    },
});

// Clase que define el componente PopupMenu
export class PopupMenu extends SiriusElement {
    // Propiedades privadas del componente
    #menuContainerElement = null; // Contenedor del menú
    #menuOpen = false; // Indica si el menú está abierto
    #currentLevel = 0; // Nivel actual del menú (jerarquía)
    #optionLevels = []; // Niveles de opciones disponibles
    #fixedOptions = []; // Opciones fijas (siempre visibles)
    #animationDuration = 300; // Duración de las animaciones en milisegundos
    #optionLevelMap = new Map(); // Mapa que relaciona niveles con sus opciones
    #clickOutsideHandler = null; // Manejador para clicks fuera del menú
    #optionTrail = []; // Historial de opciones seleccionadas
    #menuTitle = "Menu"; // Título del menú

    // Constructor para inicializar propiedades y configuraciones
    constructor(properties) {
        super(properties, POPUP_MENU.NAME);
        if (properties?.title) { // Si se proporciona un título al crear el componente
            this.#menuTitle = properties.title;
        }
    }

    // Atributos del componente que se observan para cambios
    static get observedAttributes() {
        return [...SiriusElement.observedAttributes];
    }

    // Método para cambiar el título del menú
    setTitle(title) {
        this.#menuTitle = title;
        if (this.#menuOpen) { // Si el menú está abierto, actualiza el contenido
            this.shadowRoot.innerHTML = this.#getTemplate();
        }
    }

    // Renderiza el botón de retroceso si no estamos en el nivel principal
    #renderBackButton() {
        if (this.#currentLevel > 0) {
            const lastOption = this.#optionTrail[this.#optionTrail.length - 1]; // Última opción seleccionada
            const backButtonText = lastOption ? lastOption.text : "Back"; // Texto del botón de retroceso
            return `
                <div class="${POPUP_MENU.CLASSES.BACK_BUTTON}">
                    <sirius-icon class="${POPUP_MENU.CLASSES.BACK_ICON_ICON}" icon="arrow" fill="black" height="20px" width="20px" rotation="left" id="back-icon"></sirius-icon>
                    ${backButtonText}
                </div>`;
        }
        return ""; // Si no hay niveles anteriores, no muestra el botón
    }

    // Agrega una opción al mapa de niveles
    addOption(option) {
        if (!this.#optionLevelMap.has(option.level)) {
            let listOpt = new Map(); // Crea un mapa para el nuevo nivel
            listOpt.level = option.level;
            listOpt.priorLevel = option.priorLevel;
            listOpt.panel = document.createElement("div"); // Panel para las opciones
            listOpt.panel.className = POPUP_MENU.CLASSES.OPTION_CONTAINER; // Clase CSS del contenedor
            listOpt.set(option.id, option); // Agrega la opción al mapa
            this.#optionLevelMap.set(option.level, listOpt);
        } else {
            let olm = this.#optionLevelMap.get(option.level); // Obtiene el mapa existente
            olm.set(option.id, option); // Agrega la opción
        }
        return this; // Permite encadenar métodos
    }

    // Agrega una opción fija (siempre visible)
    addFixedOption(option) {
        this.#fixedOptions.push(option);
    }

    // Renderiza el icono del menú (cuando está cerrado)
    #renderMenuIcon() {
        return `
            <sirius-icon class="${POPUP_MENU.CLASSES.MENU_ICON}" icon="menu" fill="black" height="20px" width="24px" id="icon-1"></sirius-icon>
        `;
    }

    // Renderiza las opciones del menú
    #renderOptions() {
        const options = this.#optionLevelMap.get(this.#currentLevel)?.values() || []; // Obtiene las opciones del nivel actual
        const optionsHTML = [...options]
            .map((option) => {
                const hasNextLevel = option.nextLevel !== null && !isNaN(option.nextLevel); // Verifica si hay un nivel siguiente
                return `
                    <div class="${POPUP_MENU.CLASSES.MENU_OPTION}" 
                        data-action="${option.action}" 
                        data-next-level="${option.nextLevel}" 
                        data-prior-level="${option.priorLevel}">
                        ${option.text}
                        ${hasNextLevel ? `<sirius-icon class="${POPUP_MENU.CLASSES.OPTION_ICON}" icon="arrow" fill="black" height="20px" width="20px" rotation="right" id="option-icon"></sirius-icon>` : `<span class="icon-placeholder"></span>`}
                    </div>`;
            })
            .join(""); // Une las opciones en un solo string de HTML
    
        const fixedOptionsHTML = this.#fixedOptions
            .map(
                (option) =>
                    `<div class="${POPUP_MENU.CLASSES.FIXED_OPTION}" data-action="${option.action}">
                        ${option.text}
                    </div>`
            )
            .join(""); // Une las opciones fijas
    
        return `
            <div class="${POPUP_MENU.CLASSES.OPTION_CONTAINER}">
                ${optionsHTML}
            </div>
            <div class="${POPUP_MENU.CLASSES.FIXED_OPTION}-container">
                ${fixedOptionsHTML}
            </div>
        `;
    }
    // Genera la plantilla completa del menú dependiendo de su estado (abierto o cerrado)
    #getTemplate() {
        if (!this.#menuOpen) {
            return this.#renderMenuIcon(); // Si el menú está cerrado, solo muestra el icono
        }
    
        const backButtonHTML = this.#renderBackButton(); // Renderiza el botón de retroceso si es necesario
        const optionsHTML = this.#renderOptions(); // Renderiza las opciones del menú
    
        return `
            <div class="${POPUP_MENU.CLASSES.MENU_CONTAINER}">
                <div class="${POPUP_MENU.CLASSES.TITLE}">${this.#menuTitle}</div>
                ${backButtonHTML}
                ${optionsHTML}
            </div>
            <div class="${POPUP_MENU.CLASSES.FONDO}"></div> <!-- Fondo para cerrar el menú al hacer clic fuera -->
        `;
    }

    // Alterna el estado del menú entre abierto y cerrado
    #toggleMenu() {
        this.#menuOpen = !this.#menuOpen; // Cambia el estado
        this.shadowRoot.innerHTML = this.#getTemplate(); // Actualiza el contenido
    
        if (this.#menuOpen) {
            this.#attachClickOutsideHandler(); // Agrega un manejador para cerrar el menú al hacer clic fuera
        } else {
            this.#detachClickOutsideHandler(); // Elimina el manejador
        }
    }

    // Agrega un manejador para detectar clics fuera del menú y cerrarlo
    #attachClickOutsideHandler() {
        this.#clickOutsideHandler = (event) => {
            if (!this.contains(event.target)) { // Si el clic no ocurrió dentro del menú
                this.#menuOpen = false; // Cierra el menú
                this.shadowRoot.innerHTML = this.#getTemplate(); // Actualiza el contenido
                this.#detachClickOutsideHandler(); // Elimina el manejador
            }
        };
        document.addEventListener("click", this.#clickOutsideHandler); // Escucha eventos de clic en el documento
    }

    // Elimina el manejador de clics fuera del menú
    #detachClickOutsideHandler() {
        if (this.#clickOutsideHandler) {
            document.removeEventListener("click", this.#clickOutsideHandler); // Deja de escuchar los eventos de clic
            this.#clickOutsideHandler = null;
        }
    }

    // Cambia las opciones visibles del menú al nivel especificado
    #showOptions(level) {
        this.#currentLevel = level; // Actualiza el nivel actual
        this.shadowRoot.innerHTML = this.#getTemplate(); // Actualiza el contenido del menú
    }

    // Manejador para retroceder un nivel en el menú
    async #onBackClick() {
        if (this.#optionTrail.length > 0) { // Si hay opciones seleccionadas previamente
            const lastOption = this.#optionTrail.pop(); // Elimina y obtiene la última opción seleccionada
            this.#showOptions(lastOption.level); // Muestra las opciones del nivel anterior
        }
    }

    // Manejador para cuando se selecciona una opción del menú
    #onOptionClick(event) {
        const optionElement = event.target.closest(`.${POPUP_MENU.CLASSES.MENU_OPTION}`); // Busca el elemento de opción más cercano
        if (optionElement) {
            const action = optionElement.dataset.action; // Obtiene la acción asociada a la opción
            const nextLevel = parseInt(optionElement.dataset.nextLevel, 10); // Obtiene el nivel siguiente, si existe
    
            if (!isNaN(nextLevel)) { // Si hay un nivel siguiente
                const selectedText = optionElement.textContent.trim(); // Obtiene el texto de la opción seleccionada
                this.#optionTrail.push({ level: this.#currentLevel, text: selectedText }); // Guarda el historial de navegación
                this.#showOptions(nextLevel); // Muestra las opciones del nivel siguiente
            } else {
                // Dispara un evento personalizado cuando se selecciona una opción sin nivel siguiente
                this.dispatchEvent(new CustomEvent("option-selected", { detail: { action } }));
            }
        }
    }

    // Método llamado cuando el componente se agrega al DOM
    async connectedCallback() {
        if (!this.shadowRoot) {
            this.attachShadow({ mode: "open" }); // Crea un shadow DOM si no existe
        }

        this.shadowRoot.innerHTML = this.#getTemplate(); // Renderiza la plantilla inicial

        // Agrega manejadores para eventos de clic dentro del shadow DOM
        this.shadowRoot.addEventListener("click", async (event) => {
            if (event.target.classList.contains(POPUP_MENU.CLASSES.MENU_ICON)) {
                this.#toggleMenu(); // Abre o cierra el menú
            } else if (event.target.classList.contains(POPUP_MENU.CLASSES.BACK_BUTTON)) {
                await this.#onBackClick(); // Retrocede un nivel
            } else {
                this.#onOptionClick(event); // Maneja la selección de opciones
            }
        });

        await this._loadAndAdoptStyles(); // Carga y aplica estilos personalizados
        this.dispatchBuiltEvent(); // Dispara un evento indicando que el componente está construido
    }
}

// Define el componente personalizado como un elemento de HTML
customElements.define(POPUP_MENU.TAG, PopupMenu);
