import {SIRIUS_TYPES, SiriusElement} from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";
import {SIRIUS_ICON_ATTRIBUTES, SiriusIcon} from "./SiriusIcon.js";

/** Sirius Dialog constants */
export const SIRIUS_DIALOG = deepFreeze({
    NAME: "SiriusDialog",
    TAG: "sirius-dialog",

    CLASSES: {
        TITLE_BAR: 'dialog-title-bar',
        WINDOW_CLOSE: 'dialog-window-close',
        TITLE_TEXT: 'dialog-title-text',
        WINDOW_CONTENT: 'dialog-window-content',
        CONTAINER: 'dialog-container',
    }
});

export const SIRIUS_DIALOG_ATTRIBUTES = deepFreeze({
          TITLE: "title",
          WIDTH: "width",
          HEIGHT: "height",
})

export const SIRIUS_DIALOG_ATTRIBUTES_DEFAULT = deepFreeze({
          [SIRIUS_DIALOG_ATTRIBUTES.TITLE]:"Sirius Window",
          [SIRIUS_DIALOG_ATTRIBUTES.WIDTH]:"600",
          [SIRIUS_DIALOG_ATTRIBUTES.HEIGHT]:"600",
})
/** Sirius class that represents a dialog component */
export class SiriusDialog extends SiriusElement {
    /**
     * Create a Sirius dialog element
     * @param {Object} props - The properties of the Sirius dialog
     */
    #dialogElement = null;
    #content = null
    constructor(props) {
	    super(props, SIRIUS_DIALOG.NAME);
	    props = props || {}
	    this.#content = "content" in props ? props.content : null 
	    if (typeof this.#content == "string") {
		   let tmp = document.createElement("p")
		   tmp.textContent = this.#content
		   this.#content = tmp
	    }
		delete props.content
		let children = [...this.children]
		if (!this.#content && children.length != 0) {
			while(this.firstChild)
				this.firstChild.remove()
			this.#content = document.createElement("div")
      
			for (let c of children)
				this.#content.appendChild(c)
		}
		
        // Load Sirius dialog HTML attributes
        this._loadAttributes({
            instanceProperties: props,
            attributes: SIRIUS_DIALOG_ATTRIBUTES,
            attributesDefault: SIRIUS_DIALOG_ATTRIBUTES_DEFAULT,
        });
    }
    

    /** Get the template for the Sirius dialog
     * @returns {string} - Template
     */
    #getTemplate() {
	    const iconId = this._getDerivedId("icon");
        return `<div class="${SIRIUS_DIALOG.CLASSES.CONTAINER}">
                    <div class="${SIRIUS_DIALOG.CLASSES.TITLE_BAR}">
                        <div class="${SIRIUS_DIALOG.CLASSES.TITLE_TEXT}">${this.getAttribute(SIRIUS_DIALOG_ATTRIBUTES.TITLE)}</div>
                        <sirius-icon icon="close" id="${iconId}" class="${SIRIUS_DIALOG.CLASSES.WINDOW_CLOSE}">
                    </div>
                    <div class="${SIRIUS_DIALOG.CLASSES.WINDOW_CONTENT}">
                    	<slot name=content></slot>
                    </div>
                </div>`;
    }
    // insert new elements in the place of the slot element
    async setContent(content) {
        let content_container = this.#dialogElement.getElementsByClassName(SIRIUS_DIALOG.CLASSES.WINDOW_CONTENT)[0]; 
        if (content) {
	        this.#content = content
	        if (typeof content == "string") {
		        this.#content = document.createElement("p");
		        this.#content.textContent = content;
            // content_container.onclick = (e)=>{
            //   e.stopImmediatePropagation();
            //   e.preventDefault();
            // }
	        }
			while(content_container.firstChild)
				content_container.firstChild.remove()
	        content_container.appendChild(this.#content);
        }
        else {
	        this.#content = null
	        content_container.firstChild.remove()
	        let slot = document.createElement("slot")
	        slot.setAttribute("name", "content")
	        content_container.appendChild(slot)
        }
    }
    getContent() { return this.#content }

    /** Lifecycle method called when the component is connected to the DOM
     */
    async connectedCallback() {
        // Call the parent connectedCallback
        await super.connectedCallback();
        
	    
        // Create the CSS style sheets and add them to the shadow DOM
        await this._loadAndAdoptStyles();

        // Get HTML inner content
        const innerHTML = this.#getTemplate();

        // Create the HTML template
        await this._createTemplate(innerHTML);

        // Add dialog to the shadow DOM
        this.#dialogElement = this._templateContent.firstChild;
        
        // Get the created elements to add and manage events
        let title_bar = this.#dialogElement.getElementsByClassName(SIRIUS_DIALOG.CLASSES.TITLE_BAR)[0];
        let close = this.#dialogElement.getElementsByClassName(SIRIUS_DIALOG.CLASSES.WINDOW_CLOSE)[0];
        let content = this.#dialogElement.getElementsByClassName(SIRIUS_DIALOG.CLASSES.WINDOW_CONTENT)[0];
        this.setContent(this.#content) 
        
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
          this.#dialogElement.style.left = (this.#dialogElement.offsetLeft - x) + "px";
          this.#dialogElement.style.top = (this.#dialogElement.offsetTop - y) + "px";
        });

        // make the window resizeable
        //  Drag(this.#dialogElement, (x, y) => {
        //    this.#dialogElement.style.width = (this.#dialogElement.offsetWidth - x) + "px";
        //    this.#dialogElement.style.height = (this.#dialogElement.offsetHeight - y) + "px";
        //  });

         // give size to element
       this.#dialogElement.style.width = this.getAttribute(SIRIUS_DIALOG_ATTRIBUTES.WIDTH) + "px";
       this.#dialogElement.style.height = this.getAttribute(SIRIUS_DIALOG_ATTRIBUTES.HEIGHT) + "px";


        this.shadowRoot.appendChild(this.#dialogElement);

        // Dispatch the built event
        this.dispatchBuiltEvent();
    }

}

// Register custom element
customElements.define(SIRIUS_DIALOG.TAG, SiriusDialog);
