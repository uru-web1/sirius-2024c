import { SIRIUS_TYPES, SiriusElement } from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Sirius switch constants */
export const SIRIUS_SWITCH = deepFreeze({
    NAME: "SiriusSwitch",
    TAG: "sirius-switch",
    ATTRIBUTES: {
        LABEL: { NAME: "label", DEFAULT: "Switch", TYPE: SIRIUS_TYPES.STRING },
        CHECKED: { NAME: "isChecked", DEFAULT: false, TYPE: SIRIUS_TYPES.BOOLEAN }
    },
    CLASSES: {
        CONTAINER: 'sirius-switch-container',
        LABEL: 'sirius-switch-label',
        INPUT: 'sirius-switch-input',
        CHECKED: 'checked'
    }
});

class SiriusSwitch extends SiriusElement {
    /**
     * Create a SiriusSwitch element
     * @param {object} props - Element properties (id, label, isChecked, etc.)
     */
    constructor(props) {
        super(props, SIRIUS_SWITCH.NAME);

        // Load Sirius switch HTML attributes
        this._loadAttributes({
            htmlAttributes: SIRIUS_SWITCH.ATTRIBUTES,
            properties: props
        });

        // Build the switch template
        this._createSwitchTemplate();
    }

    /** Create the switch template */
    async _createSwitchTemplate() {
        // Construct the HTML template using the constants
        const switchHTML = `
            <div id="${this._attributes.id}-container" class="${SIRIUS_SWITCH.CLASSES.CONTAINER}">
                <label for="${this._attributes.id}-input" class="${SIRIUS_SWITCH.CLASSES.LABEL}">
                    ${this._attributes[SIRIUS_SWITCH.ATTRIBUTES.LABEL.NAME]}
                </label>
                <input type="checkbox" id="${this._attributes.id}-input" class="${SIRIUS_SWITCH.CLASSES.INPUT}"
                    ${this._attributes[SIRIUS_SWITCH.ATTRIBUTES.CHECKED.NAME] ? 'checked' : ''}>
            </div>
        `;

        // Create the inner HTML template using the helper function from SiriusElement
        await this._createTemplate(switchHTML);

        // Set the container element as the switch's outer div
        this.containerElement = this._templateContent.querySelector(`#${this._attributes.id}-container`);

        // Append the template content to the shadow DOM
        this.shadowRoot.appendChild(this._templateContent);

        // Load the styles for this component
        await this._loadElementStyles(SIRIUS_SWITCH.NAME);

        // Dispatch the built event once the element is fully built
        this.dispatchBuiltEvent();
    }

    /** Toggle the switch state programmatically */
    toggleSwitch() {
        const input = this.shadowRoot.querySelector(`#${this._attributes.id}-input`);
        if (input) {
            input.checked = !input.checked;
            this._attributes[SIRIUS_SWITCH.ATTRIBUTES.CHECKED.NAME] = input.checked;
        }
    }

    /** Get the current state of the switch */
    get isChecked() {
        return this._attributes[SIRIUS_SWITCH.ATTRIBUTES.CHECKED.NAME];
    }

    /** Add the SiriusSwitch element to the body */
    addToBody() {
        document.body.appendChild(this);
    }

    /** Show the switch */
    show() {
        this.containerElement.classList.remove('hidden');
    }

    /** Hide the switch */
    hide() {
        this.containerElement.classList.add('hidden');
    }

    /** Center the switch on the screen */
    centerScreen() {
        this.containerElement.classList.add('center-screen');
    }

    /** Remove centering from the screen */
    removeCenterScreen() {
        this.containerElement.classList.remove('center-screen');
    }
}

// Register the custom element in the browser
customElements.define(SIRIUS_SWITCH.TAG, SiriusSwitch);

export default SiriusSwitch;
