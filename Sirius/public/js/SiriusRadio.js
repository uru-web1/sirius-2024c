<<<<<<< Updated upstream
import { SIRIUS_TYPES, SiriusElement } from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";
// Definición de constantes para el radio 
export const SIRIUS_RADIO = deepFreeze({
    NAME: "SiriusRadio",
    TAG: "sirius-radio",
    ATTRIBUTES: {
        LABEL: { NAME: "label", DEFAULT: "", TYPE: SIRIUS_TYPES.STRING },
        CHECKED: { NAME: "checked", DEFAULT: false, TYPE: SIRIUS_TYPES.BOOLEAN },
        DISABLED: { NAME: "disabled", DEFAULT: false, TYPE: SIRIUS_TYPES.BOOLEAN },
        GROUP: { NAME: "group", DEFAULT: "", TYPE: SIRIUS_TYPES.STRING },
    },
    CLASSES: {
        CONTAINER: 'radio-container',
        LABEL: 'radio-label',
        INPUT: 'radio-input',
        SVG: 'radio-svg',
    }
});

// Clase para el elemento SiriusRadio
export class SiriusRadio extends SiriusElement {
    constructor(props) {
        super(props, SIRIUS_RADIO.NAME);
        this._attributes = {
            id: props.id || `sirius-radio-${Math.random().toString(36).substr(2, 9)}`,
            label: props.label || SIRIUS_RADIO.ATTRIBUTES.LABEL.DEFAULT,
            checked: props.checked !== undefined ? props.checked : SIRIUS_RADIO.ATTRIBUTES.CHECKED.DEFAULT,
            disabled: props.disabled !== undefined ? props.disabled : SIRIUS_RADIO.ATTRIBUTES.DISABLED.DEFAULT,
            group: props.group || SIRIUS_RADIO.ATTRIBUTES.GROUP.DEFAULT,
        };

        this._loadAttributes({
            htmlAttributes: SIRIUS_RADIO.ATTRIBUTES,
            properties: props
        });
    }

    // Método para deseleccionar los demas radios
    static deselectOtherRadios(groupName, selectedRadio) {
        const radiosInGroup = SiriusRadio.radioGroups[groupName];
        radiosInGroup.forEach((radio) => {
            if (radio !== selectedRadio && radio.isSelected) {
                radio.deselectRadio();
            }
        });
    }

    //Deselecciona el radio
    deselectRadio() {
        this._attributes.checked = false;
        const input = this.shadowRoot.querySelector('input[type="radio"]');
        if (input) {
            input.checked = false;
        }
    }

    async connectedCallback() {
        // Cargar estilos y crear plantilla
        await this._loadElementStyles('./SiriusRadio');
        const innerHTML = this.#getTemplate();
        await this._createTemplate(innerHTML);
        this.shadowRoot.appendChild(this._templateContent);

        // Manejo de eventos
        const input = this.shadowRoot.querySelector('input[type="radio"]');
        input?.addEventListener('click', () => this.toggleRadio());
        this.shadowRoot.querySelector('.radio-svg')?.addEventListener('click', () => this.toggleRadio());

        this.dispatchBuiltEvent();
    }

    // Metodo para obtener la plantilla HTML
    #getTemplate() {
        return `
            <div class="${SIRIUS_RADIO.CLASSES.CONTAINER}">
                <input 
                    type="radio" 
                    id="${this._attributes.id}-input" 
                    class="${SIRIUS_RADIO.CLASSES.INPUT}" 
                    ${this._attributes.disabled ? 'disabled' : ''} 
                    ${this._attributes.checked ? 'checked' : ''}>
                <div class="${SIRIUS_RADIO.CLASSES.SVG}">
                    ${this.#getSVG()}
                </div>
                <label class="${SIRIUS_RADIO.CLASSES.LABEL}" for="${this._attributes.id}-input">
                    ${this._attributes.label}
                </label>
            </div>`;
    }

    // Metodo para obtener el SVG según el estado
    #getSVG() {
        return `
            <svg width="50" height="50" class="radio-svg">
                ${this._attributes.checked 
                    ? `<circle cx="25" cy="25" r="9" fill="none" stroke="black" stroke-width="3"></circle>
                       <circle cx="25" cy="25" r="6" fill="black"></circle>`
                    : `<circle cx="25" cy="25" r="9" fill="none" stroke="black" stroke-width="3"></circle>`}
            </svg>`;
    }

    // Metodo para alternar el estado del radio
    toggleRadio() {
        const input = this.shadowRoot.querySelector(`#${this._attributes.id}-input`);
        if (input) {
            input.checked = !input.checked;
            this._attributes.checked = input.checked;
            this.dispatchEvent(new Event('change'));
            this.updateSVG();
        }
    }

    // Metodo para actualizar el SVG
    updateSVG() {
        const svgContainer = this.shadowRoot.querySelector('.radio-svg');
        svgContainer.innerHTML = this.#getSVG();
    }

    // Recibe el estado actual del radio
    get isSelected() {
        return this._attributes[SIRIUS_RADIO.ATTRIBUTES.CHECKED.NAME]; // Cambié 'SELECTED' a 'CHECKED'
    }

    // Añade el radio al body
    addToBody() {
        document.body.appendChild(this);
    }

    // Muestra el radio
    show() {
        this.containerElement.classList.remove('hidden');
    }

    // Esconde el radio
    hide() {
        this.containerElement.classList.add('hidden');
    }

    // Centra la pantalla
    centerScreen() {
        this.containerElement.classList.add('center-screen');
    }

    // Quita el centrado de la pantalla
    removeCenterScreen() {
        this.containerElement.classList.remove('center-screen');
    }
}

=======
import { SIRIUS_ELEMENT_ATTRIBUTES, SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES, SiriusElement } from "./SiriusElement.js";
import { SIRIUS_LABEL_ATTRIBUTES, SiriusLabel } from "./SiriusLabel.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Clase SiriusRadio */
export const SIRIUS_RADIO = deepFreeze({
    NAME: "SiriusRadio",
    TAG: "sirius-radio",
    CSS_VARS: {
        GAP: "--gap",
        BACKGROUND_COLOR: "--background-color",
        RADIO_COLOR: "--radio-color",
    },
    CLASSES: {
        RADIO_CONTAINER: 'radio-container',
        ITEMS_CONTAINER: 'items-container',
        ITEM_CONTAINER: 'item-container',
        HEAD_CONTAINER: 'head-container',
    }
});

/** Atributos de SiriusRadio */
export const SIRIUS_RADIO_ATTRIBUTES = deepFreeze({
    BACKGROUND_COLOR: "background-color",
    GAP: "gap",
    RADIO_COLOR: "radio-color",
    ITEMS: "items",
});

/** Valores predeterminados de SiriusRadio */
export const SIRIUS_RADIO_ATTRIBUTES_DEFAULT = deepFreeze({
    [SIRIUS_RADIO_ATTRIBUTES.ITEMS]: [],
});

/** Clase SiriusRadio que representa un grupo de botones de opción */
export class SiriusRadio extends SiriusElement {

    // Elementos contenedores
    #radioContainerElement = null;
    #headContainerElement = null;
    #itemsListContainerElement = null;
    #itemContainerElement = null;

    // Elementos
    #radioElement = null;
    #labelElement = null;
    #head = null;
    
    // Listas
    #itemsList = [];
    #radioList = [];
    #labelList = [];
    #itemContainerList = [];
    _selectedItem = null;

    /**
     * Crea un elemento de grupo de botones de opción Sirius
     * @param {object} properties - Propiedades del elemento
     */
    constructor(properties) {
        super(properties, SIRIUS_RADIO.NAME);
    }

    /** Define los atributos observados
     * @returns {string[]} - Atributos observados
     * */
    static get observedAttributes() {
        return [...SiriusElement.observedAttributes, ...Object.values(SIRIUS_RADIO_ATTRIBUTES)];
    }

    /** Obtiene el atributo de los ítems
     * @returns {Array} - Atributo de los ítems
     */
    get items() {
        return JSON.parse(this.getAttribute(SIRIUS_RADIO_ATTRIBUTES.ITEMS) || "[]");
    }

    /** Establece el atributo de los ítems
     * @param {Array} value - Atributo de los ítems
     */
    set items(value) {
        this.setAttribute(SIRIUS_RADIO_ATTRIBUTES.ITEMS, (value));
    }

    /** Obtiene el atributo de separación (gap)
     * @returns {string} - Atributo de separación
     */
    get gap() {
        return this.getAttribute(SIRIUS_RADIO_ATTRIBUTES.GAP);
    }

    /** Establece el atributo de separación (gap)
     * @param {string} value - Atributo de separación
     */
    set gap(value) {
        this.setAttribute(SIRIUS_RADIO_ATTRIBUTES.GAP, value);
    }

    /** Obtiene el atributo de color de fondo
     * @returns {string} - Atributo de color de fondo
     */
    get backgroundColor() {
        return this.getAttribute(SIRIUS_RADIO_ATTRIBUTES.BACKGROUND_COLOR);
    }

    /** Establece el atributo de color de fondo
     * @param {string} value - Atributo de color de fondo
     */
    set backgroundColor(value) {
        this.setAttribute(SIRIUS_RADIO_ATTRIBUTES.BACKGROUND_COLOR, value);
    }

    /** Obtiene el atributo de color del radio
     * @returns {string} - Atributo de color del radio
     */
    get radioColor() {
        return this.getAttribute(SIRIUS_RADIO_ATTRIBUTES.RADIO_COLOR);
    }

    /** Establece el atributo de color del radio
     * @param {string} value - Atributo de color del radio
     */
    set radioColor(value) {
        this.setAttribute(SIRIUS_RADIO_ATTRIBUTES.RADIO_COLOR, value);
    }

    /** Renderiza los ítems de los botones de opción
     * @returns {void}
     */
    #renderItems() {
        this.onBuilt = () => {
            // Renderizar nuevos ítems
            this.#itemsList.forEach(item => {
                const itemElement = this.#createItem(item);
                this.#itemsListContainerElement.appendChild(itemElement);
            });
        };
    }

    /** Crea un ítem de botón de opción
     * @param {object} item - Objeto ítem
     * @param {string} item.id - ID del ítem
     * @param {string} item.label - Etiqueta del ítem
     * @returns {HTMLElement} - Elemento del ítem radio
     */
    #createItem({ id, label, checked = "unchecked" }) {
        const idKey = SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID;
        const labelId = this._getDerivedId("label");
        const radioId = this._getDerivedId("radio");
        const captionKey = SIRIUS_LABEL_ATTRIBUTES.CAPTION;

        // Crear el contenedor del ítem
        const itemContainer = document.createElement('div');
        itemContainer.classList.add(SIRIUS_RADIO.CLASSES.ITEM_CONTAINER);
        itemContainer.setAttribute('id', id);

        // Crear el botón de radio
        this.#radioElement = document.createElement('input');
        this.#radioElement.type = 'radio';
        this.#radioElement.id = radioId;
        this.#radioElement.checked = checked === "checked";
        this.#radioElement.addEventListener('change', () => this._onRadioChange(itemContainer));

        itemContainer.appendChild(this.#radioElement);

        // Crear la etiqueta del radio
        this.#labelElement = new SiriusLabel({
            [idKey]: labelId,
            [captionKey]: label
        });
        itemContainer.appendChild(this.#labelElement);

        this.#radioList.push(this.#radioElement);
        this.#labelList.push(this.#labelElement);
        this.#itemContainerList.push(itemContainer);

        return itemContainer;
    }

    /** Maneja el evento de cambio del botón de radio */
    _onRadioChange(itemContainer) {
        // Deseleccionar el ítem previamente seleccionado
        if (this._selectedItem && this._selectedItem !== itemContainer) {
            this._selectedItem.querySelector("input").checked = false;
        }

        // Seleccionar el ítem clickeado
        this._selectedItem = itemContainer;

        console.log("Ítem seleccionado: ", itemContainer.id);
    }

    /** Obtiene la plantilla para el grupo de Sirius Radio
     * @returns {string} - Plantilla
     */
    #getTemplate() {
        const radioContainerClasses = [SIRIUS_RADIO.CLASSES.RADIO_CONTAINER];
        const itemsListContainerClasses = [SIRIUS_RADIO.CLASSES.ITEMS_CONTAINER];

        return `<div class="${radioContainerClasses.join(' ')}">
                    <div class="${itemsListContainerClasses.join(' ')}"></div>
                </div>`;
    }

    /** Método de ciclo de vida llamado cuando el componente se conecta al DOM */
    async connectedCallback() {
        await super.connectedCallback();

        // Cargar atributos de Sirius Radio
        this._loadAttributes({
            instanceProperties: this._properties,
            attributes: SIRIUS_RADIO_ATTRIBUTES,
            defaultAttributes: SIRIUS_RADIO_ATTRIBUTES_DEFAULT
        });

        // Crear la hoja de estilos CSS y agregarla al shadow DOM
        await this._loadAndAdoptStyles();

        // Obtener el contenido interno HTML
        const innerHTML = this.#getTemplate();

        // Crear la plantilla HTML
        this._createTemplate(innerHTML);

        // Obtener el contenedor del elemento
        this.#radioContainerElement = this._containerElement = this._templateContent.firstChild;
        this.#itemsListContainerElement = this.#radioContainerElement.lastElementChild;

        // Agregar el grupo de RadioButton al shadow DOM
        this.shadowRoot.appendChild(this.containerElement);

        // Despachar el evento de construcción
        this.dispatchBuiltEvent();
    }

    /** Callback de cambio de atributo
     * @param {string} name - Nombre del atributo
     * @param {string} oldValue - Valor anterior
     * @param {string} newValue - Nuevo valor
     */
    attributeChangedCallback(name, oldValue, newValue) {
        const { formattedValue, shouldContinue } = this._preAttributeChangedCallback(name, oldValue, newValue);
        if (!shouldContinue) return;

        switch (name) {
            case SIRIUS_RADIO_ATTRIBUTES.ITEMS:
                this.#itemsList = JSON.parse(formattedValue);
                this.#renderItems();
                break;
            case SIRIUS_RADIO_ATTRIBUTES.GAP:
                this._setCSSVariable(SIRIUS_RADIO.CSS_VARS.GAP, formattedValue);
                break;
            case SIRIUS_RADIO_ATTRIBUTES.BACKGROUND_COLOR:
                this._setCSSVariable(SIRIUS_RADIO.CSS_VARS.BACKGROUND_COLOR, formattedValue);
                break;
            case SIRIUS_RADIO_ATTRIBUTES.RADIO_COLOR:
                this._setCSSVariable(SIRIUS_RADIO.CSS_VARS.RADIO_COLOR, formattedValue);
                break;
            default:
                break;
        }
    }
}

// Registrar el elemento personalizado
>>>>>>> Stashed changes
customElements.define(SIRIUS_RADIO.TAG, SiriusRadio);
