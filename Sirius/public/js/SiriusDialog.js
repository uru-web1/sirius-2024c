import {SIRIUS_TYPES, SiriusElement} from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Sirius Dialog constants */
export const SIRIUS_DIALOG = deepFreeze({
    NAME: "SiriusDialog",
    TAG: "sirius-dialog",
    ATTRIBUTES: {
		TITLE: {NAME: "title", DEFAULT: "Sirius Window", TYPE: SIRIUS_TYPES.STRING},
		WIDTH: {NAME: "width", DEFAULT: 600, TYPE: SIRIUS_TYPES.NUMBER },
		HEIGHT: {NAME: "height", DEFAULT: 600, TYPE: SIRIUS_TYPES.NUMBER },
		CONTENT: {NAME: "content", DEFAULT: null, TYPE: SIRIUS_TYPES.OBJECT },
    },
    CLASSES: {
        TITLE_BAR: 'dialog-title-bar',
        WINDOW_CLOSE: 'dialog-window-close',
        TITLE_TEXT: 'dialog-title-text',
        WINDOW_CONTENT: 'dialog-window-content',
        CONTAINER: 'dialog-container',
    }
});

/** Sirius class that represents a dialog component */
export class SiriusDialog extends SiriusElement {
    /**
     * Create a Sirius dialog element
     * @param {Object} props - The properties of the Sirius dialog
     */
    constructor(props) {
        super(props, SIRIUS_DIALOG.NAME);

        // Load Sirius dialog HTML attributes
        this._loadAttributes({
            htmlAttributes: SIRIUS_DIALOG.ATTRIBUTES,
            properties: props
        });
    }

    /** Get the template for the Sirius dialog
     * @returns {string} - Template
     */
    #getTemplate() {
        return `<div class="${SIRIUS_DIALOG.CLASSES.CONTAINER}">
                    <div class="${SIRIUS_DIALOG.CLASSES.TITLE_BAR}">
                        <div class="${SIRIUS_DIALOG.CLASSES.TITLE_TEXT}">${this._attributes[SIRIUS_DIALOG.ATTRIBUTES.TITLE.NAME]}</div>
                        <img class="${SIRIUS_DIALOG.CLASSES.WINDOW_CLOSE}" src=../img/x.svg />
                    </div>
                    <div class="${SIRIUS_DIALOG.CLASSES.WINDOW_CONTENT}">
                    	<slot name=content>CONTENT</slot>
                    </div>
                </div>`;
    }

    /** Lifecycle method called when the component is connected to the DOM
     */
    async connectedCallback() {
        // Create the CSS style sheets and add them to the shadow DOM
        await this._loadElementStyles();

        // Get HTML inner content
        const innerHTML = this.#getTemplate();

        // Create the HTML template
        await this._createTemplate(innerHTML);

        // Add dialog to the shadow DOM
        this.containerElement = this._templateContent.firstChild;
        
        // Get the created elements to add and manage events
        let title_bar = this.containerElement.getElementsByClassName(SIRIUS_DIALOG.CLASSES.TITLE_BAR)[0];
        let close = this.containerElement.getElementsByClassName(SIRIUS_DIALOG.CLASSES.WINDOW_CLOSE)[0];
        let content = this.containerElement.getElementsByClassName(SIRIUS_DIALOG.CLASSES.WINDOW_CONTENT)[0];
        
        // insert new elements in the place of the slot element
		    let content_prop = this._attributes[SIRIUS_DIALOG.ATTRIBUTES.CONTENT.NAME];
        if (content_prop) {
	        let slot = content.querySelector('[name="content"]');
	        content.insertBefore(content_prop, slot);
	        slot.remove();
        }
        
        // close window
        close.onclick = () => this.remove();
        
        // prevent the content part of element to be resize or dragged
        content.onmousedown = (e) => {
	        e.preventDefault();
	        e.stopImmediatePropagation();
	    };
      // function that allows the window to be draggable and resizeable
	    let Drag = (dragger, action) => {
	        let x = 0, y = 0;
	        function Move(e) {
	        e.preventDefault();
	          action(x - e.clientX, y - e.clientY);
	          x = e.clientX;
	          y = e.clientY;
	        }
	        function Down(e) {
	          e.preventDefault();  
	          e.stopImmediatePropagation();
	          x = e.clientX;
	          y = e.clientY;
	          document.onmousemove = Move;
	          document.onmouseup = Up;
	        }
	        function Up(e) {
	          document.onmousemove = null;
	          document.onmouseup = null;
	        }
	        dragger.onmousedown = Down;
	     }
       // make the title or header the part of the element that can be dragged
        Drag(title_bar, (x,y) => {
          this.containerElement.style.left = (this.containerElement.offsetLeft - x) + "px";
          this.containerElement.style.top = (this.containerElement.offsetTop - y) + "px";
        });

        // make the window resizeable
         Drag(this.containerElement, (x, y) => {
           this.containerElement.style.width = (this.containerElement.offsetWidth - x) + "px";
           this.containerElement.style.height = (this.containerElement.offsetHeight - y) + "px";
         });

         // give size to element
       this.containerElement.style.width = this._attributes[SIRIUS_DIALOG.ATTRIBUTES.WIDTH.NAME] + "px";
       this.containerElement.style.height = this._attributes[SIRIUS_DIALOG.ATTRIBUTES.HEIGHT.NAME] + "px";


        this.shadowRoot.appendChild(this.containerElement);

        // Dispatch the built event
        this.dispatchBuiltEvent();
    }

}

// Register custom element
customElements.define(SIRIUS_DIALOG.TAG, SiriusDialog);
