import { SiriusElement } from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";
import { SiriusIcon } from "./SiriusIcon.js";

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
        OPTION_CONTAINER: "PopupMenu_Option_Container", // Asegurarse de incluir la clase de contenedor
        FONDO: "menu-fondo",
        TITLE: "menu-title",
        OPTION_ICON: "option-icon"
    },
});

export class PopupMenu extends SiriusElement {
    #menuContainerElement = null;
    #menuOpen = false;
    #currentLevel = 0;
    #optionLevels = [];
    #fixedOptions = [];
    #animationDuration = 300;
    #optionLevelMap = new Map();
    #clickOutsideHandler = null;
    #optionTrail = [];
    #menuTitle = "Menu";

    constructor(properties) {
        super(properties, POPUP_MENU.NAME);
        if (properties?.title) {
            this.#menuTitle = properties.title;
        }
    }

    static get observedAttributes() {
        return [...SiriusElement.observedAttributes];
    }

    setTitle(title) {
        this.#menuTitle = title;
        if (this.#menuOpen) {
            this.shadowRoot.innerHTML = this.#getTemplate();
        }
    }

    addOption(option) {
        if (!this.#optionLevelMap.has(option.level)) {
            let listOpt = new Map();
            listOpt.level = option.level;
            listOpt.priorLevel = option.priorLevel;
            listOpt.panel = document.createElement("div");
            listOpt.panel.className = POPUP_MENU.CLASSES.OPTION_CONTAINER; // Usar la clase de contenedor
            listOpt.set(option.id, option);
            this.#optionLevelMap.set(option.level, listOpt);
        } else {
            let olm = this.#optionLevelMap.get(option.level);
            olm.set(option.id, option);
        }
        return this;
    }

    addFixedOption(option) {
        this.#fixedOptions.push(option);
    }

    #renderMenuIcon() {
        return `
            <sirius-icon class="${POPUP_MENU.CLASSES.MENU_ICON}" icon="menu" fill="black" height="20px" width="24px" id="icon-1"></sirius-icon>
        `;
    }

    #renderOptions() {
        const options = this.#optionLevelMap.get(this.#currentLevel)?.values() || [];
        const optionsHTML = [...options]
            .map((option) => {
                const hasNextLevel = option.nextLevel !== null && !isNaN(option.nextLevel);
                return `
                    <div class="${POPUP_MENU.CLASSES.MENU_OPTION}" 
                        data-action="${option.action}" 
                        data-next-level="${option.nextLevel}" 
                        data-prior-level="${option.priorLevel}">
                        ${option.text}
                        ${hasNextLevel ? `<sirius-icon class="${POPUP_MENU.CLASSES.OPTION_ICON}" icon="arrow" fill="black" height="20px" width="20px" rotation="right" id="option-icon"></sirius-icon>` : `<span class="icon-placeholder"></span>`}
                    </div>`;
            })
            .join("");
    
        const fixedOptionsHTML = this.#fixedOptions
            .map(
                (option) =>
                    `<div class="${POPUP_MENU.CLASSES.FIXED_OPTION}" data-action="${option.action}">
                        ${option.text}
                    </div>`
            )
            .join("");
    
        return `
            <div class="${POPUP_MENU.CLASSES.OPTION_CONTAINER}">
                ${optionsHTML}
            </div>
            <div class="${POPUP_MENU.CLASSES.FIXED_OPTION}-container">
                ${fixedOptionsHTML}
            </div>
        `;
    }
    

    #getTemplate() {
        if (!this.#menuOpen) {
            return this.#renderMenuIcon();
        }
    
        const lastOption = this.#optionTrail[this.#optionTrail.length - 1];
        const backButtonText = lastOption ? lastOption.text : "Back";
    
        const backButton = this.#currentLevel > 0
            ? `<div class="${POPUP_MENU.CLASSES.BACK_BUTTON}">${backButtonText}</div>`
            : "";
    
        const optionsHTML = this.#renderOptions();
    
        return `
            <div class="${POPUP_MENU.CLASSES.MENU_CONTAINER}">
                <div class="${POPUP_MENU.CLASSES.TITLE}">${this.#menuTitle}</div>
                ${backButton}
                ${optionsHTML}
            </div>
            <div class="${POPUP_MENU.CLASSES.FONDO}"></div>
        `;
    }
    

    #toggleMenu() {
        this.#menuOpen = !this.#menuOpen;
        this.shadowRoot.innerHTML = this.#getTemplate();

        if (this.#menuOpen) {
            this.#attachClickOutsideHandler();
        } else {
            this.#detachClickOutsideHandler();
        }
    }

    #attachClickOutsideHandler() {
        this.#clickOutsideHandler = (event) => {
            if (!this.contains(event.target)) {
                this.#menuOpen = false;
                this.shadowRoot.innerHTML = this.#getTemplate();
                this.#detachClickOutsideHandler();
            }
        };
        document.addEventListener("click", this.#clickOutsideHandler);
    }

    #detachClickOutsideHandler() {
        if (this.#clickOutsideHandler) {
            document.removeEventListener("click", this.#clickOutsideHandler);
            this.#clickOutsideHandler = null;
        }
    }

    #showOptions(level) {
        this.#currentLevel = level;
        this.shadowRoot.innerHTML = this.#getTemplate();
    }

    async #onBackClick() {
        if (this.#optionTrail.length > 0) {
            const lastOption = this.#optionTrail.pop(); // Obtener la última opción seleccionada
            this.#showOptions(lastOption.level);
        }
    }

    #onOptionClick(event) {
        const optionElement = event.target.closest(`.${POPUP_MENU.CLASSES.MENU_OPTION}`);
        if (optionElement) {
            const action = optionElement.dataset.action;
            const nextLevel = parseInt(optionElement.dataset.nextLevel, 10);
    
            if (!isNaN(nextLevel)) {
                const selectedText = optionElement.textContent.trim();
                this.#optionTrail.push({ level: this.#currentLevel, text: selectedText });
                this.#showOptions(nextLevel);
            } else {
                this.dispatchEvent(new CustomEvent("option-selected", { detail: { action } }));
            }
        }
    }

    async connectedCallback() {
        if (!this.shadowRoot) {
            this.attachShadow({ mode: "open" });
        }

        this.shadowRoot.innerHTML = this.#getTemplate();

        this.shadowRoot.addEventListener("click", async (event) => {
            if (event.target.classList.contains(POPUP_MENU.CLASSES.MENU_ICON)) {
                this.#toggleMenu();
            } else if (event.target.classList.contains(POPUP_MENU.CLASSES.BACK_BUTTON)) {
                await this.#onBackClick();
            } else {
                this.#onOptionClick(event);
            }
        });

        await this._loadAndAdoptStyles();
        this.dispatchBuiltEvent();
    }
}

customElements.define(POPUP_MENU.TAG, PopupMenu);
