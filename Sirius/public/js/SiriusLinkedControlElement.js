import deepFreeze from "./utils/deep-freeze.js";
import SiriusControlElement, {SIRIUS_CONTROL_ELEMENT, SIRIUS_CONTROL_ELEMENT_STATUS} from "./SiriusControlElement.js";

/** SiriusLinkedControlElement constants */
export const SIRIUS_LINKED_CONTROL_ELEMENT = deepFreeze({
    NAME: 'SiriusLinkedControlElement',
})

/** SiriusLinkedControlElement attributes */
export const SIRIUS_LINKED_CONTROL_ELEMENT_ATTRIBUTES = deepFreeze({})

/** SiriusLinkedControlElement status values */
export const SIRIUS_LINKED_CONTROL_ELEMENT_STATUS = deepFreeze({})

/** SiriusLinkedControlElement default values */
export const SIRIUS_LINKED_CONTROL_ELEMENT_ATTRIBUTES_DEFAULT = deepFreeze({})

/** Class that represents a linked control element */
export default class SiriusLinkedControlElement extends SiriusControlElement {
    // Linked slot elements
    _linkedParentSlotElement=null;
    _linkedChildrenSlotElement=null;

    // Linked elements
    _linkedParent=null ;
   _linkedChildren=[];

   // Observers
    _linkedParentSlotObserver=null;
    _linkedChildrenSlotObserver=null;

    /**
     * Create a SiriusLinkedControlElement
     * @param {Object} properties - The properties of the SiriusLinkedControlElement
     * @param {string} elementName - Element name
     */
    constructor(properties, elementName) {
        super(properties, elementName);

        // Prepare the SiriusLinkedControlElement
        this.#prepare().then();
    }

    /** Define observed attributes */
    static get observedAttributes() {
        return [...SiriusControlElement.observedAttributes, ...Object.values(SIRIUS_LINKED_CONTROL_ELEMENT_ATTRIBUTES)];
    }

    /** Prepare the SiriusLinkedControlElement */
    async #prepare() {
        // Load SiriusLinkedControlElement HTML attributes
        this._loadAttributes({
            instanceProperties: this._properties,
            attributes: SIRIUS_LINKED_CONTROL_ELEMENT_ATTRIBUTES,
            attributesDefault: SIRIUS_LINKED_CONTROL_ELEMENT_ATTRIBUTES_DEFAULT
        });
    }

    /** Get the linked parent slot element
     * @returns {HTMLSlotElement} - Linked parent slot element
     */
    get linkedParentSlotElement(){
        return this._linkedParentSlotElement
    }

    /** Get the linked children slot element
     * @returns {HTMLSlotElement} - Linked children slot element
     */
    get linkedChildrenSlotElement(){
        return this._linkedChildrenSlotElement
    }

    /** Get the linked parent element
     * @returns {SiriusControlElement|null} - Linked parent element
     */
    get linkedParent() {
        return this._linkedParent;
    }

    /** Get the linked children elements
     * @returns {SiriusControlElement[]} - Linked children elements
     */
    get linkedChildren() {
        return this._linkedChildren
    }

    /** Set the linked parent observer */
    _setLinkedParentObserver() {
        if(!this._linkedParentSlotElement) {
            this.logger.error('Linked parent slot element is not defined');
            return
        }

        // Set up MutationObserver to detect linked parent slot changes
        this._linkedParentSlotObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList)
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Add the parent slot
                            node.slot = this._linkedParentSlotElement.name;

                            this._addLinkedParent(node)
                        }
                    });
                    mutation.removedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE)
                            this._removeLinkedParent()
                    })
                }
        });

        // Start observing the linked parent slot element
        this._linkedParentSlotObserver.observe(this.linkedParentSlotElement, { childList: true });

        // Manually call linked parent slot observer to add existing parent
        this.linkedParentSlotElement.assignedElements().forEach(node => {
            this.#addLinkedParent(node);
        });
    }

    /** Set the linked children observer */
    _setLinkedChildrenObserver() {
        if (!this._linkedChildrenSlotElement) {
            this.logger.error('Linked children slot element is not defined');
            return
        }

        // Set up MutationObserver to detect linked children slot changes
        this._linkedChildrenSlotObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList)
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Add the children slot
                            node.slot=this._linkedChildrenSlotElement.name;

                            this._addLinkedChild(node)
                        }
                    });
                    mutation.removedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE)
                            this._removeLinkedChild(node)
                    })
                }
        });

        // Start observing the linked children slot element
        this._linkedChildrenSlotObserver.observe(this.linkedChildrenSlotElement, {childList: true});

        // Manually call linked children slot observer to add existing children
        this.linkedChildrenSlotElement.assignedElements().forEach(node => {
            this.#addLinkedChild(node);
        })
    }

    /** Add linked parent element
     * @param {SiriusControlElement} parent - Linked parent element
     */
    #addLinkedParent(parent) {
        if (!parent) return

        this.onBuilt = () => {
            // Removed current linked parent
            this._removeLinkedParent()

            // Set the linked parent status, slot name and parent ID
            this._linkedParent = parent
            parent.status = this.status
            parent.parentId = this.id

            // Set the parent ID for the linked children elements
            this.linkedChildren.forEach(child => child.parentId = parent.id);
        }
    }

    /** Add linked parent element node
     * @param {HTMLElement|SiriusControlElement} element - Linked parent element node/instance
     */
    _addLinkedParent(element) {
        // Check if the linked parent element is a valid SiriusControlElement
        if (!(element instanceof SiriusControlElement))
            this.logger.error("The parent element must be an instance of SiriusControlElement");

        this.#addLinkedParent(element);
    }

    /** Remove linked parent element */
    _removeLinkedParent() {
        if (!this.linkedParent) return

        // Remove slot from linked parent and the child-parent relationship
        this.linkedParent.slot=""
        this.linkedParent.parentId = "";

        // Remove the current linked parent from the linked parent slot element
        this.linkedParent.remove();

        // Remove the linked parent
        this._linkedParent = null;

        // Remove the existing linked parent element from the linked children elements
        this.linkedChildren.forEach(child => child.parentId = "");
    }

    /** Add linked child element
     * @param {SiriusControlElement|SiriusTreeView|HTMLElement} child - Linked child element
     */
    #addLinkedChild(child) {
        if(!child) return

        this.onBuilt=()=> {
            // Check if the linked child is already in the linked children elements
            if (this.linkedChildren.find(c => c.id === child.id))
                return

            // Add to the linked children elements list
            this.linkedChildren.push(child);

            // Set the parent ID
            if (this.linkedParent)
                child.parentId = this.linkedParent.id;
        }
    }

    /** Add linked child element node
     * @param {HTMLElement|SiriusControlElement} element - Linked child element node/instance
     */
    _addLinkedChild(element) {
        // Check if the child element is a valid SiriusControlElement
        if (!(element instanceof SiriusControlElement))
            this.logger.error("The child element must be an instance of SiriusControlElement");

        this.#addLinkedChild(element);
    }

    /** Remove linked child element
     * @param {SiriusControlElement|HTMLElement} child - Linked child element
     */
    _removeLinkedChild(child) {
        if (!child) return

        // Remove the linked child element from the linked children elements
        this._linkedChildren = this.linkedChildren.filter(child => child.id !== child.id);

        // Remove the parent ID and the slot name
        child.parentId = "";
    }

    /** Protected method to handle the status attribute change to checked */
    _statusCheckedHandler() {
        this.onBuilt = () => {
            if (this.linkedParent)
                this.linkedParent.status = SIRIUS_CONTROL_ELEMENT_STATUS.CHECKED;
        }
    }

     /** Protected method to handle the status attribute change to unchecked */
    _statusUncheckedHandler() {
        this.onBuilt = () => {
            if (this.linkedParent)
                this.linkedParent.status = SIRIUS_CONTROL_ELEMENT_STATUS.UNCHECKED;
        }
     }

     /** Protected method to handle the status attribute change to indeterminate */
    _statusIndeterminateHandler() {
        this.onBuilt = () => {
            if (this.linkedParent)
                this.linkedParent.status = SIRIUS_CONTROL_ELEMENT_STATUS.INDETERMINATE;
        }
    }
}