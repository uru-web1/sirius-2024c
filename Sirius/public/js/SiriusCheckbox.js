import {SIRIUS_TYPES, SiriusElement} from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";


/** Sirius icon constants */

export const SIRIUS_CHECKBOX = deepFreeze({
    NAME: "SiriusCheckbox",
    TAG: "sirius-checkbox",
    PROPERTIES: {STYLE: 'style', EVENTS: 'events'}, 
    BOOLEAN_ATTRIBUTES: {
        CHECKED: {NAME: 'checked', DEFAULT: false},
        DISABLED: {NAME: 'disabled', DEFAULT: false}
    },
    ATTRIBUTES:{
        CHECKED:{
            NAME: 'checked',
            DEFAULT: false,
            TYPE: SIRIUS_TYPES.BOOLEAN
        },
        DISABLED:{
            NAME: 'disabled',
            DEFAULT: false,
            TYPE: SIRIUS_TYPES.BOOLEAN
        },
    },

    CLASSES: {
        CHECKBOX: 'checkbox',
        CHECKED: 'checked',
        UNCHECKED: 'unchecked',
        DISABLED: 'disabled',
        HOVER: 'hover',
        FOCUS: 'focus',
        PRESSED: 'pressed'
    }

});
    

/** Sirius class that represents a checkbox component */
export class SiriusCheckbox extends SiriusElement {
    /**
     * Create a Sirius checkbox element
     * @param {Object} props - The properties of the Sirius checkbox
     */
    constructor(props) {
        super(props, SIRIUS_CHECKBOX.NAME);

        this._attributes = {};

        //Load Sirius checkbox HTML attributes

        this._loadAttributes({
     
            htmlAttributes: SIRIUS_CHECKBOX.ATTRIBUTES,
            properties: props || {}
    });

    this._checked= this._attributes[SIRIUS_CHECKBOX.BOOLEAN_ATTRIBUTES.CHECKED] || false;
    this._disabled= this._attributes[SIRIUS_CHECKBOX.BOOLEAN_ATTRIBUTES.DISABLED] || false;

        //Attach shadow DOM

        this.attachShadow({mode: 'open'});

        //Initial state
        this._checked = this.hasAttribute(SIRIUS_CHECKBOX.BOOLEAN_ATTRIBUTES.CHECKED) || (props.checked === true);
        this._disabled = this.hasAttribute(SIRIUS_CHECKBOX.BOOLEAN_ATTRIBUTES.DISABLED);
        this._style = this.getAttribute(SIRIUS_CHECKBOX.PROPERTIES.STYLE) || '';
        this._events = this.getAttribute(SIRIUS_CHECKBOX.PROPERTIES.EVENTS) || '';
    }


    /**Get the template for the Sirius Checkbox */

    //duda existencial 
    #getTemplate(){
        return `
            <label class="${SIRIUS_CHECKBOX.CLASSES.CHECKBOX}">
                <input type="checkbox" class="${SIRIUS_CHECKBOX.CLASSES.CHECKBOX}" ${this._checked ? 'checked' : ''} ${this._disabled ? 'disabled' : ''}>
                <span class="checkmark"></span>
            </label>
        `;
    }


    /**Lifecycle method called when the component is connected to the DOM */


async connectedCallback(){

    await this.getCss(SIRIUS_CHECKBOX.NAME);
    this.shadowRoot.adoptedStyleSheets = [this._sheet];
    
    const innerHTML = this.#getTemplate();
    if(!innerHTML){
        this.logger.error('Error creating the Sirius Checkbox template');
        return;
    }

    await this.createTemplate(innerHTML);
    
    this.checkboxElement = this.templateContent.firstChild;
    this.shadowRoot.appendChild(this.checkboxElement);

    //Add event listeners for state changes 

    const checkbox= this.shadowRoot.querySelector('input');

    checkbox.addEventListener('mouseenter', () => this._setState(SIRIUS_CHECKBOX.CLASSES.HOVER, true));
    checkbox.addEventListener('mouseleave', () => this._setState(SIRIUS_CHECKBOX.CLASSES.HOVER, false));
    checkbox.addEventListener('focus', () => this._setState(SIRIUS_CHECKBOX.CLASSES.FOCUS, true));
    checkbox.addEventListener('blur', () => this._setState(SIRIUS_CHECKBOX.CLASSES.FOCUS, false));
    checkbox.addEventListener('mousedown', () => this._setState(SIRIUS_CHECKBOX.CLASSES.PRESSED, true));
    checkbox.addEventListener('mouseup', () => this._setState(SIRIUS_CHECKBOX.CLASSES.PRESSED, false));


    //Load attributes and properties

    this._update();
    this.built();
}
    /**Set or unset a state class  */

    _setState(stateClass, isActive){
        const checkbox=this.shadowRoot.querySelector('input');
        checkbox.classList.toggle(stateClass, isActive);
    }

     /**Update the checkbox state */

     _update(){
        const checkbox=this.shadowRoot.querySelector('input');
        checkbox.checked=this._checked;
        checkbox.disabled=this._disabled;

        checkbox.classList.toggle(SIRIUS_CHECKBOX.CLASSES.CHECKED, this._checked);
        checkbox.classList.toggle(SIRIUS_CHECKBOX.CLASSES.UNCHECKED, !this._checked);
        checkbox.classList.t0oggle(SIRIUS_CHECKBOX.CLASSES.DISABLED, this._disabled);
    }

     /**Toggle the checkbox state */

    toggle(){
        if(!this._disabled){
            this._checked = !this._checked;
            this._update();
        }   
    }

    /**Reset the checkbox to its initial state */

    reset(){
        this._checked=false;
        this._update();
    }

    /**Check the validity of the checkbox*/

    checkValidity(){
        return !this._disabled;
    }

    /**Enable or disable the checkbox */

    setDisable(state){
        this._disabled = state;
        this._update();
    }

    /**Focus the checkbox */
    focus(){
        this.shadowRoot.querySelector('input').focus();
    }

    blur(){
        this.shadowRoot.querySelector('input').blur();
    }


    /**Getters and setter for properties*/

    get checked(){
        return this._checked;
    }

    set checked(value){
        this._checked=value;
        this._update();
    }   

    get disabled(){
        return this._disabled;
    }

    set disabled(value){
        this._disabled=value;
        this._update();
    }
}

//Register custom element 
customElements.define(SIRIUS_CHECKBOX.TAG, SiriusCheckbox);


