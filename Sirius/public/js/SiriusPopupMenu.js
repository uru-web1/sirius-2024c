import { SiriusElement } from "./SiriusElement.js";
import { SiriusIcon } from "./SiriusIcon.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Sirius PopupMenu Constants */
export const SIRIUS_POPUP_MENU = deepFreeze({
    NAME: "SiriusPopupMenu",
    TAG: "sirius-popupmenu",
    ATTRIBUTES: {
        OPTIONS: { NAME: "options", DEFAULT: [], TYPE: "array" },
    },
    CLASSES: {
        CONTAINER: "sirius-popupmenu-container",
        MENU: "sirius-popupmenu",
        OPTION: "sirius-popupmenu-option",
        ICON: "sirius-popupmenu-icon",
        BACK_BUTTON: "sirius-popupmenu-back"
    }
});

export class SiriusPopupMenu extends SiriusElement {
    constructor(props) {
        super(props, SIRIUS_POPUP_MENU.NAME);

        const options = props?.options || this.getAttribute(SIRIUS_POPUP_MENU.ATTRIBUTES.OPTIONS.NAME) || SIRIUS_POPUP_MENU.ATTRIBUTES.OPTIONS.DEFAULT;

        try {
            this._attributes[SIRIUS_POPUP_MENU.ATTRIBUTES.OPTIONS.NAME] = 
                typeof options === "string" ? JSON.parse(options) : options;
        } catch (error) {
            console.error("Error al parsear las opciones: ", error);
            this._attributes[SIRIUS_POPUP_MENU.ATTRIBUTES.OPTIONS.NAME] = SIRIUS_POPUP_MENU.ATTRIBUTES.OPTIONS.DEFAULT;
        }

        this._currentLevelOptions = this._attributes[SIRIUS_POPUP_MENU.ATTRIBUTES.OPTIONS.NAME];
        this._navigationHistory = [];
        
        this._createPopupMenuTemplate();
    }

    _createPopupMenuTemplate() {
        const optionsHTML = this._generateOptionsHTML(this._currentLevelOptions);

        const popupMenuHTML = `
            <div class="${SIRIUS_POPUP_MENU.CLASSES.CONTAINER}">
                <div class="${SIRIUS_POPUP_MENU.CLASSES.MENU}">
                    <div class="${SIRIUS_POPUP_MENU.CLASSES.BACK_BUTTON}" style="display: none;">
                        <sirius-icon icon="arrow_back" class="${SIRIUS_POPUP_MENU.CLASSES.ICON}"></sirius-icon> Volver
                    </div>
                    ${optionsHTML}
                </div>
            </div>
        `;

        this._createTemplate(popupMenuHTML);
        console.log("Template creado: ", this.shadowRoot.innerHTML); // Confirmar contenido en Shadow DOM

        const observer = new MutationObserver(() => {
            this._addEventListeners();
            observer.disconnect();
        });
        observer.observe(this.shadowRoot, { childList: true, subtree: true });
    }

    _generateOptionsHTML(options) {
        return options.map(option => `
            <div class="${SIRIUS_POPUP_MENU.CLASSES.OPTION}" data-value="${option.value}">
                ${option.label}
            </div>
        `).join("");
    }

    _addEventListeners() {
        const optionElements = this.shadowRoot.querySelectorAll(`.${SIRIUS_POPUP_MENU.CLASSES.OPTION}`);
        if (optionElements.length) {
            optionElements.forEach(option => {
                option.addEventListener("click", (event) => this._handleOptionClick(event));
            });
        }

        const backButton = this.shadowRoot.querySelector(`.${SIRIUS_POPUP_MENU.CLASSES.BACK_BUTTON}`);
        if (backButton) {
            backButton.addEventListener("click", () => {
                this._navigateBack();
            });
        }
    }

    _handleOptionClick(event) {
        const selectedOption = event.currentTarget.dataset.value;
        const optionData = this._currentLevelOptions.find(opt => opt.value === selectedOption);
        if (optionData?.subOptions) {
            this._navigationHistory.push(this._currentLevelOptions);
            this._currentLevelOptions = optionData.subOptions;
            this._updateMenu();
        } else {
            this.dispatchEvent(new CustomEvent("option-selected", { detail: { selectedOption } }));
        }
    }

    _navigateBack() {
        if (this._navigationHistory.length > 0) {
            this._currentLevelOptions = this._navigationHistory.pop();
            this._updateMenu();
        }
    }

    _updateMenu() {
        const menuElement = this.shadowRoot.querySelector(`.${SIRIUS_POPUP_MENU.CLASSES.MENU}`);
        menuElement.innerHTML = this._generateOptionsHTML(this._currentLevelOptions);

        const backButton = this.shadowRoot.querySelector(`.${SIRIUS_POPUP_MENU.CLASSES.BACK_BUTTON}`);
        if (backButton) {
            backButton.style.display = this._navigationHistory.length ? "block" : "none";
        }

        this._addEventListeners();
    }

    addToBody() {
        document.body.appendChild(this);
    }
}

customElements.define(SIRIUS_POPUP_MENU.TAG, SiriusPopupMenu);
