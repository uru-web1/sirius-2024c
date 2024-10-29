import { SiriusElement } from "./SiriusElement.js";
import { SiriusIcon } from "./SiriusIcon.js";
import { SiriusCheckbox } from "./SiriusCheckbox.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Sirius Combobox constants */
export const SIRIUS_CHECKCOMBOBOX = deepFreeze({
    NAME: "SiriusCheckCombobox",
    TAG: "sirius-checkcombobox",
    ATTRIBUTES: {
        PLACEHOLDER: { NAME: "placeholder", DEFAULT: "Select an option", TYPE: "string" }, // Define el texto predeterminado en el campo de entrada
        OPTIONS: { NAME: "options", DEFAULT: [], TYPE: "array" }, // Contiene las opciones desplegables del combobox
        TEXT: { NAME: "text", DEFAULT: "Field", TYPE: "string" }
    },
    CLASSES: {
        CONTAINER: 'sirius-checkcombobox-container',
        INPUT_WRAPPER: 'sirius-checkcombobox-input-wrapper', // Clase para contener el input y el icono en el mismo contenedor
        INPUT: 'sirius-checkcombobox-input',
        ICON: 'sirius-checkcombobox-icon', // Clase para el icono de flecha dentro del combobox
        DROPDOWN: 'sirius-checkcombobox-dropdown',
        OPTION: 'sirius-checkcombobox-option',
        CHECKBOX: 'sirius-checkcombobox-checkbox',
        LABEL: 'sirius-checkcombobox-label'
    }
});

export class SiriusCheckCombobox extends SiriusElement {
    constructor(props) {
        super(props, SIRIUS_CHECKCOMBOBOX.NAME);

        // Carga las opciones pasadas como props o desde el atributo HTML, y configura el estado inicial
        let options = props?.options || this.getAttribute(SIRIUS_CHECKCOMBOBOX.ATTRIBUTES.OPTIONS.NAME);
        options = options ? JSON.parse(options) : SIRIUS_CHECKCOMBOBOX.ATTRIBUTES.OPTIONS.DEFAULT;
        this._attributes[SIRIUS_CHECKCOMBOBOX.ATTRIBUTES.OPTIONS.NAME] = options;

        // Cargar el texto
        const text = props?.text || this.getAttribute(SIRIUS_CHECKCOMBOBOX.ATTRIBUTES.TEXT.NAME);
        this._attributes[SIRIUS_CHECKCOMBOBOX.ATTRIBUTES.TEXT.NAME] = text || SIRIUS_CHECKCOMBOBOX.ATTRIBUTES.TEXT.DEFAULT;

        this._selectedOption = ""; // Almacena la opción actualmente seleccionada
        this._createComboboxTemplate(); // Crea y configura la estructura HTML del combobox
    }

    /**
     * Genera el HTML para el combobox y su estructura, y aplica estilos.
     */
    async _createComboboxTemplate() {
        const { PLACEHOLDER, OPTIONS } = SIRIUS_CHECKCOMBOBOX.ATTRIBUTES;

        // Genera el HTML para las opciones desplegables
        const optionsHTML = this._attributes[OPTIONS.NAME].map(
            (option, index) => `
            <div class="${SIRIUS_CHECKCOMBOBOX.CLASSES.OPTION}" data-value="${option}">
                ${option}
                <sirius-checkbox id="${this._attributes.id}-${index}" class="${SIRIUS_CHECKCOMBOBOX.CLASSES.CHECKBOX}"></sirius-checkbox>
            </div>
            `
        ).join("");

        const textHTML = this._attributes[SIRIUS_CHECKCOMBOBOX.ATTRIBUTES.TEXT.NAME];
         this.is
        console.log(textHTML);

        // Estructura HTML del combobox, incluyendo el input, icono, y dropdown
        const comboboxHTML = `
            <div id="${this._attributes.id}-container" class="${SIRIUS_CHECKCOMBOBOX.CLASSES.CONTAINER}">
                <label class="${SIRIUS_CHECKCOMBOBOX.CLASSES.LABEL}">${textHTML}</label>
                <div class="${SIRIUS_CHECKCOMBOBOX.CLASSES.INPUT_WRAPPER}">
                    <input type="text" placeholder="${this._attributes[PLACEHOLDER.NAME] || PLACEHOLDER.DEFAULT}" class="${SIRIUS_CHECKCOMBOBOX.CLASSES.INPUT}" readonly>
                    <sirius-icon id="${this._attributes.id}-arrow" class="${SIRIUS_CHECKCOMBOBOX.CLASSES.ICON}" icon="arrow" width="20" height="20" rotate="down" fill="black"></sirius-icon>
                </div>
                <div class="${SIRIUS_CHECKCOMBOBOX.CLASSES.DROPDOWN}" style="display: none;">
                    ${optionsHTML}
                </div>
            </div>
        `;

        // Inserta la plantilla generada en el shadow DOM
        await this._createTemplate(comboboxHTML);

        // Referencias a los elementos clave para manipulación posterior
        this.containerElement = this._templateContent.querySelector(`#${this._attributes.id}-container`);
        this.inputElement = this.containerElement.querySelector(`.${SIRIUS_CHECKCOMBOBOX.CLASSES.INPUT}`);
        this.dropdownElement = this.containerElement.querySelector(`.${SIRIUS_CHECKCOMBOBOX.CLASSES.DROPDOWN}`);
        this.arrowIcon = this.containerElement.querySelector(`#${this._attributes.id}-arrow`);

        this.shadowRoot.appendChild(this._templateContent);
        await this._loadElementStyles(SIRIUS_CHECKCOMBOBOX.NAME); // Carga estilos de componente
        this.dispatchBuiltEvent(); // Evento de construcción completada del componente

        this._addEventListeners(); // Asigna los eventos necesarios
    }

    /**
     * Agrega listeners de eventos para manejar el despliegue de la lista y la selección de opciones.
     */
    _addEventListeners() {
        // Evento para mostrar/ocultar el menú desplegable al hacer clic en el input
        this.inputElement.addEventListener("click", () => {
            const isHidden = this.dropdownElement.style.display === 'none' || !this.dropdownElement.style.display;
            this.dropdownElement.style.display = isHidden ? 'block' : 'none';
            
            // Rota la flecha dependiendo de la visibilidad del dropdown
            this.arrowIcon.iconRotation = isHidden ? 'up' : 'down';
        });

        // Evento para seleccionar una opción del dropdown
        // this.dropdownElement.addEventListener("click", (event) => {
        //     const optionElement = event.target.closest(`.${SIRIUS_CHECKCOMBOBOX.CLASSES.OPTION}`);
        //     if (optionElement) {
        //         // Actualiza la opción seleccionada
        //         this._selectedOption = optionElement.dataset.value;

        //         if (this.inputElement.value !== "") {
        //             this.inputElement.value = this.inputElement.value + ", " + this._selectedOption;
        //         } else {
        //             this.inputElement.value = this._selectedOption;
        //         }
                
        //         this.dropdownElement.style.display = 'none';

        //         // Restablece la rotación de la flecha y dispara un evento personalizado
        //         this.arrowIcon.iconRotation = 'down';
        //         this.dispatchEvent(new CustomEvent("option-selected", { detail: { selectedOption: this._selectedOption } }));
        //     }
        // });

        // Evento para seleccionar una opción del dropdown
        this.dropdownElement.addEventListener("click", (event) => {
            const checkboxElement = event.target.closest(`.${SIRIUS_CHECKCOMBOBOX.CLASSES.CHECKBOX}`);
            
            // Verifica si se hizo clic en un checkbox
            if (checkboxElement) {
                const optionElement = checkboxElement.closest(`.${SIRIUS_CHECKCOMBOBOX.CLASSES.OPTION}`);
                
                // Asegúrate de que la opción correspondiente se encuentre
                if (optionElement) {
                    // Actualiza la opción seleccionada
                    this._selectedOption = optionElement.dataset.value;
                    
                    if (this.inputElement.value){

                        if (this.inputElement.value.includes(`, ${this._selectedOption},`)) {

                            this.inputElement.value = this.inputElement.value.replace(`, ${this._selectedOption}`, "");

                        } else if (this.inputElement.value.includes(`, ${this._selectedOption}`)) {

                            this.inputElement.value = this.inputElement.value.replace(`, ${this._selectedOption}`, "");
                        
                        } else if (this.inputElement.value.includes(`${this._selectedOption},`)) {

                            this.inputElement.value = this.inputElement.value.replace(`${this._selectedOption},`, "");

                        } else if (this.inputElement.value.includes(`${this._selectedOption}`)) {

                            this.inputElement.value = this.inputElement.value.replace(`${this._selectedOption}`, "");

                        } else {

                            this.inputElement.value = this.inputElement.value + `, ${this._selectedOption}`;
                        }

                    } else {

                        this.inputElement.value = this._selectedOption;
                    }

                    // Restaura la rotación de la flecha
                    this.arrowIcon.iconRotation = 'down';
                    // Dispara un evento personalizado
                    this.dispatchEvent(new CustomEvent("option-selected", { detail: { selectedOption: this._selectedOption } }));
                }
            }
        });

    }

    /**
     * Retorna la opción seleccionada actualmente.
     */
    get selectedOption() {
        return this._selectedOption;
    }

    /**
     * Configura las opciones del combobox y actualiza el dropdown.
     */
    set options(newOptions) {
        this._attributes[SIRIUS_CHECKCOMBOBOX.ATTRIBUTES.OPTIONS.NAME] = Array.isArray(newOptions) ? newOptions : [];
        this._updateDropdownOptions(); // Actualiza el dropdown con nuevas opciones
    }

    /**
     * Actualiza las opciones del dropdown con el contenido de `options`.
     */
    _updateDropdownOptions() {
        this.dropdownElement.innerHTML = this._attributes[SIRIUS_CHECKCOMBOBOX.ATTRIBUTES.OPTIONS.NAME].map(
            (option) => `<div class="${SIRIUS_CHECKCOMBOBOX.CLASSES.OPTION}" data-value="${option}">${option}</div>`
        ).join("");
    }

    /**
     * Añade el combobox al DOM del documento.
     */
    addToBody() {
        document.body.appendChild(this);
    }
}

// Define el componente personalizado en el navegador
customElements.define(SIRIUS_CHECKCOMBOBOX.TAG, SiriusCheckCombobox);
