import deepFreeze from "./utils/deep-freeze.js";
import SiriusControlElement, {
    SIRIUS_CONTROL_ELEMENT_PROPERTIES,
    SIRIUS_CONTROL_ELEMENT_STATUS
} from "./SiriusControlElement.js";

/** SiriusLinkedControlElement constants */
export const SIRIUS_LINKED_CONTROL_ELEMENT = deepFreeze({
    NAME: 'SiriusLinkedControlElement',
})

/** SiriusLinkedControlElement attributes */
export const SIRIUS_LINKED_CONTROL_ELEMENT_ATTRIBUTES = deepFreeze({})

/** SiriusLinkedControlElement default values */
export const SIRIUS_LINKED_CONTROL_ELEMENT_ATTRIBUTES_DEFAULT = deepFreeze({})

/** SiriusLinkedControlElement properties */
export const SIRIUS_LINKED_CONTROL_ELEMENT_PROPERTIES = deepFreeze({
    PARENT: 'parent',
})

/** Class that represents a linked control element */
export default class SiriusLinkedControlElement extends SiriusControlElement {
    // Linked slot elements
    _linkedParentSlotElement = null;
    _linkedChildrenSlotElement = null;

    // Linked elements
    _linkedParent = null;
    #linkedParentFlag = false;
    _linkedChildren = [];
    #linkedChildrenFlag = false;

    // Observers
    _elementObserver = null;

    /**
     * Create a SiriusLinkedControlElement
     * @param {Object} properties - SiriusLinkedControlElement properties
     * @param {string} parentProperty - Parent property name
     * @param {string} childrenProperty - Children property name
     */
    constructor(properties, parentProperty = SIRIUS_LINKED_CONTROL_ELEMENT_PROPERTIES.PARENT, childrenProperty = SIRIUS_CONTROL_ELEMENT_PROPERTIES.CHILDREN) {
        // Overwrite the children property when calling the parent constructor
        super({...properties, children: []});

        // Check if the properties contains the children
        const children = properties?.[childrenProperty];
        if (children) {
            this._linkedChildren = children;
            this.#linkedChildrenFlag = true;
        }

        // Check if the properties contains the parent
        const parent = properties?.[parentProperty];
        if (parent) {
            this._linkedParent = parent;
            this.#linkedParentFlag = true;
        }

        // Build the SiriusLinkedControlElement
        this.#build(properties).then();
    }

    /** Define observed attributes */
    static get observedAttributes() {
        return [...SiriusControlElement.observedAttributes, ...Object.values(SIRIUS_LINKED_CONTROL_ELEMENT_ATTRIBUTES)];
    }

    /** Build the SiriusLinkedControlElement
     * @param {Object} properties - SiriusLinkedControlElement properties
     * @returns {Promise<void>}
     * */
    async #build(properties) {
        // Load SiriusLinkedControlElement HTML attributes
        this._loadAttributes({
            instanceProperties: properties,
            attributes: SIRIUS_LINKED_CONTROL_ELEMENT_ATTRIBUTES,
            attributesDefault: SIRIUS_LINKED_CONTROL_ELEMENT_ATTRIBUTES_DEFAULT
        });
    }

    /** Get the linked parent slot element
     * @returns {HTMLSlotElement} - Linked parent slot element
     */
    get linkedParentSlotElement() {
        return this._linkedParentSlotElement
    }

    /** Get the linked children slot element
     * @returns {HTMLSlotElement} - Linked children slot element
     */
    get linkedChildrenSlotElement() {
        return this._linkedChildrenSlotElement
    }

    /** Get the linked parent element
     * @returns {SiriusControlElement|null} - Linked parent element
     */
    get linkedParent() {
        return this._linkedParent;
    }

    /** Set linked parent element
     * @param {SiriusControlElement} element - Linked parent element
     */
    set linkedParent(element) {
        if (!element) return;

        this.onBuilt = () => {
            // Check if the linked parent element is the same
            if (!this.#linkedParentFlag && this.linkedParent === element) return;

            // Remove the current parent element
            if (!this.#linkedParentFlag) {
                if (this.linkedParent)
                    this._removeLinkedParent();
            } else {
                this.#linkedParentFlag = false;
                this._linkedParent = null;
            }

            // Add the parent element
            this._addLinkedParent(element);
        }
    }

    /** Get the linked children elements
     * @returns {SiriusControlElement[]} - Linked children elements
     */
    get linkedChildren() {
        return this._linkedChildren
    }

    /** Set linked children elements
     * @param {SiriusControlElement[]} elements - Linked children elements
     */
    set linkedChildren(elements) {
        if (!elements) return;

        this.onBuilt = () => {
            // Check if the linked children elements are the same
            if (!this.#linkedChildrenFlag && this.linkedChildren === elements) return;

            // Remove the current children elements
            if (!this.#linkedChildrenFlag) {
                if (this.linkedChildren)
                    this._removeAllLinkedChildren();
            } else {
                this.#linkedChildrenFlag = false;
                this._linkedChildren = [];
            }

            // Set the children elements
            this._addLinkedChildren(elements);
        }
    }

    /** Check the linked parent slot element
     * @returns {boolean} - True if the linked parent slot element is set
     */
    _checkLinkedParentSlotElement() {
        if (!this._linkedParentSlotElement) {
            this.logger.error('Linked parent slot element is not defined');
            return false
        }
        return true
    }

    /** Check the linked children slot element
     * @returns {boolean} - True if the linked children slot element is set
     */
    _checkLinkedChildrenSlotElement() {
        if (!this._linkedChildrenSlotElement) {
            this.logger.error('Linked children slot element is not defined');
            return false
        }
        return true
    }

    /** Set the element observer */
    _setElementObserver() {
        // Check if the linked parent slot element is set
        if (!this._checkLinkedParentSlotElement())
            return

        // Check if the linked children slot element is set
        if (!this._checkLinkedChildrenSlotElement())
            return

        // Set up MutationObserver to detect element slot changes
        this._elementObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList)
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.slot) {
                            // Check if the node is a linked parent or child element
                            if (node.slot === this._linkedParentSlotElement.name)
                                this._onAddLinkedParent(node)

                            if (node.slot === this._linkedChildrenSlotElement.name)
                                this._onAddLinkedChild(node)
                        }
                    });
                    mutation.removedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.slot) {
                            // Check if the node is a linked parent or child element
                            if (node.slot === this._linkedParentSlotElement.name)
                                this._onRemoveLinkedParent()

                            if (node.slot === this._linkedChildrenSlotElement.name)
                                this._onRemoveLinkedChild(node)
                        }
                    })
                }
        });

        // Start observing the element
        this._elementObserver.observe(this, {childList: true});

        // Manually call the element observer to add existing parent
        this.linkedParentSlotElement.assignedElements().forEach(node => {
            this.#onAddLinkedParent(node);
        });

        // Manually call the element observer to add existing children
        this.linkedChildrenSlotElement.assignedElements().forEach(node => {
            this.#onAddLinkedChild(node);
        });
    }

    /** Check if an element is a valid linked parent element
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} - True if the element is a valid linked parent element
     */
    _checkLinkedParentElement(element) {
        if (!(element instanceof SiriusControlElement)) {
            this.logger.error("The parent element must be an instance of SiriusControlElement");
            return false
        }
        return true
    }

    /** On add linked parent element
     * @param {SiriusControlElement} parent - Linked parent element
     */
    #onAddLinkedParent(parent) {
        if (!parent) return

        this.onBuilt = () => {
            // Remove the current linked parent element
            this._removeLinkedParent()

            parent.onBuilt = () => {
                // Remove the linked children elements from the parent element
                parent.children = [];

                // Set the linked parent status and parent ID
                this._linkedParent = parent
                parent.status = this.status
                parent.parentId = this.id

                // Set the parent ID for the linked children elements
                this.linkedChildren.forEach(child => child.parentId = parent.id);
            }
        }
    }

    /** On add linked parent element node
     * @param {HTMLElement|SiriusControlElement} element - Linked parent element node/instance
     */
    _onAddLinkedParent(element) {
        // Check if the parent element is a valid SiriusControlElement
        if (!this._checkLinkedParentElement(element))
            return

        this.#onAddLinkedParent(element);
    }

    /** Add linked parent element
     * @param {SiriusControlElement} element - Linked parent element
     */
    _addLinkedParent(element) {
        if (!element) return

        this.onBuilt = () => {
            // Check if the linked parent slot element is set
            if (!this._checkLinkedParentSlotElement())
                return

            // Add the linked parent element to the linked parent slot element
            if (!this._linkedParentSlotElement.contains(element)) {
                element.setAttribute('slot', this._linkedParentSlotElement.name);
                this.appendChild(element);
            }
        }
    }

    /** On remove linked parent element */
    _onRemoveLinkedParent() {
        this.onBuilt = () => {
            // Remove the child-parent relationship and the slot name
            this.linkedParent.parentId = "";
            this.linkedParent.slot = "";
            this._linkedParent = null;

            // Remove the existing linked parent element from the linked children elements
            this.linkedChildren.forEach(child => child.parentId = "");
        }
    }

    /** Remove linked parent element */
    _removeLinkedParent() {
        if (!this.linkedParent) return

        // Check if the linked parent slot element is set
        if (!this._checkLinkedParentSlotElement())
            return;

        // Remove the current linked parent from the linked parent slot element
        if (this._linkedParentSlotElement.contains(this.linkedParent))
            this._linkedParentSlotElement.removeChild(this.linkedParent);
    }

    /** Check if an element is a valid linked child element
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} - True if the element is a valid linked child element
     */
    _checkLinkedChildElement(element) {
        if (!(element instanceof SiriusControlElement)) {
            this.logger.error("The child element must be an instance of SiriusControlElement");
            return false
        }
        return true
    }

    /** On add linked child element
     * @param {SiriusControlElement|HTMLElement} child - Linked child element
     */
    #onAddLinkedChild(child) {
        if (!child) return

        this.onBuilt = () => {
            // Check if the linked child is already in the linked children elements
            if (this.linkedChildren.find(c => c.id === child.id))
                return

            // Add to the linked children elements list
            this.linkedChildren.push(child);

            // Set the parent ID
            if (this.linkedParent)
                this.linkedParent.onBuilt=()=>child.parentId = this.linkedParent.id;
        }
    }

    /** On add linked child element node
     * @param {HTMLElement|SiriusControlElement} element - Linked child element node/instance
     */
    _onAddLinkedChild(element) {
        // Check if the child element is a valid SiriusControlElement
        if (!this._checkLinkedChildElement(element))
            return

        this.#onAddLinkedChild(element);
    }

    /** Add linked child element
     * @param {SiriusControlElement} element - Linked child element
     */
    _addLinkedChild(element) {
        if (!element) return

        this.onBuilt = () => {
            // Check if the linked children slot element is set
            if (!this._checkLinkedChildrenSlotElement())
                return

            // Add the linked child element to the linked children slot element
            if (!this._linkedChildrenSlotElement.contains(element)) {
                element.setAttribute('slot', this._linkedChildrenSlotElement.name);
                this.appendChild(element);
            }
        }
    }

    /** Add linked children elements
     * @param {SiriusControlElement[]} elements - Linked children elements
     */
    _addLinkedChildren(elements) {
        elements.forEach(element => this._addLinkedChild(element));
    }

    /** On remove linked child element
     * @param {SiriusControlElement|HTMLElement} child - Linked child element
     */
    _onRemoveLinkedChild(child) {
        if (!child) return

        this.onBuilt = () => {
            // Remove the linked child element from the linked children elements
            this._linkedChildren = this.linkedChildren.filter(child => child.id !== child.id);

            // Remove the parent ID and the slot name
            child.parentId = "";
            child.slot = ""
        }
    }

    /** Remove linked child element
     * @param {SiriusControlElement} element - Linked child element
     */
    _removeLinkedChild(element) {
        if (!element) return

        // Check if the linked children slot element is set
        if (!this._checkLinkedChildrenSlotElement())
            return

        // Remove the linked child element from the linked children slot element
        if (this._linkedChildrenSlotElement.contains(element))
            this._linkedChildrenSlotElement.removeChild(element);
    }

    /** Remove linked child element by ID
     * @param {string} id - Linked child element ID
     */
    _removeLinkedChildById(id) {
        // Get the child element by ID
        const child = this.linkedChildren.find(child => child.id === id);
        if (!child) return;

        // Remove the linked child element
        this._removeLinkedChild(child);
    }

    /** Remove linked children elements
     * @param {SiriusControlElement[]} elements - Linked children elements
     */
    _removeLinkedChildren(elements) {
        elements.forEach(element => this._removeLinkedChild(element));
    }

    /** Remove linked children elements */
    _removeAllLinkedChildren() {
        this._removeLinkedChildren(this.linkedChildren);
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