import deepFreeze from "./utils/deep-freeze.js";
import SiriusElement from "./SiriusElement.js";
import sirius from "./Sirius.js";
import {SIRIUS_CHECKBOX_ATTRIBUTES} from "./SiriusCheckbox.js";

/** SiriusControlElement constants */
export const SIRIUS_CONTROL_ELEMENT = deepFreeze({
    NAME: 'SiriusControlElement',
})

/** SiriusControlElement attributes */
export const SIRIUS_CONTROL_ELEMENT_ATTRIBUTES = deepFreeze({
    STATUS: "status",
    PARENT_ID: 'parent-id'
})

/** Sirius checkbox default values */
export const SIRIUS_CONTROL_ELEMENT_ATTRIBUTES_DEFAULT = deepFreeze({
    [SIRIUS_CONTROL_ELEMENT_ATTRIBUTES.STATUS]: "unchecked",
})


/** Sirius class that represents a control element component */
export default class SiriusControlElement extends SiriusElement {
    _parentElement = null;
    _children = []
    _previousStatus = null;
    _changedChildrenStatus = 0
    _changingStatusByParent = false
    _changingStatusByChildren = false

    /**
     * Create a SiriusControlElement
     * @param {Object} properties - The properties of the SiriusControlElement
     * @param {string} elementName - Element name
     */
    constructor(properties, elementName) {
        super(properties, elementName);

        // Prepare the SiriusControlElement
        this.#prepare().then();
    }

    /** Define observed attributes */
    static get observedAttributes() {
        return [...SiriusElement.observedAttributes, ...Object.values(SIRIUS_CONTROL_ELEMENT_ATTRIBUTES)];
    }

    /** Prepare the SiriusControlElement */
    async #prepare() {
        // Load SiriusControlElement HTML attributes
        this._loadAttributes({
            instanceProperties: this._properties,
            attributes: SIRIUS_CONTROL_ELEMENT,
            attributesDefault: SIRIUS_CONTROL_ELEMENT_ATTRIBUTES_DEFAULT
        });
    }

    /** Get parent element
     * @returns {SiriusControlElement|null} - Parent element
     */
    get parentElement() {
        return this._parentElement;
    }

    /** Get children elements
     * @returns {SiriusControlElement[]} - Children elements
     */
    get children() {
        return Object.freeze([...this._children]);
    }

    /** Set parent ID attribute
     * @param {string} value - Parent ID attribute
     */
    set parentId(value) {
        this.setAttribute(SIRIUS_CONTROL_ELEMENT_ATTRIBUTES.PARENT_ID, value);
    }

    /** Get parent ID attribute
     * @returns {string} - Parent ID attribute
     */
    get parentId() {
        return this.getAttribute(SIRIUS_CONTROL_ELEMENT_ATTRIBUTES.PARENT_ID);
    }

    /** Get status attribute
     * @returns {string} - Status attribute
     */
    get status() {
        return this.getAttribute(SIRIUS_CONTROL_ELEMENT_ATTRIBUTES.STATUS);
    }

    /** Set status attribute
     * @param {string} value - Status attribute
     */
    set status(value) {
        // Store the previous status
        this._previousStatus = this.status;

        this.setAttribute(SIRIUS_CONTROL_ELEMENT_ATTRIBUTES.STATUS, value);
    }

    /** Toggle the status attribute */
    toggleStatus() {
        this.status = this.status === "checked" ? "unchecked" : "checked";
    }

    /** Protected method to set the status attribute for the children elements
     * @param {string} status - Status attribute
     */
    _setChildrenStatus(status) {
        if (!this.children || !status) return;

        // Set the changing children status flag
        this._changedChildrenStatus = this.children.reduce((acc, child) => {
            if (child.status === status) return acc+1;
            return acc;
        },0);

        // Set the status attribute for the children elements
        this.children.forEach(child => {
            if (child.status === status) return;

            child._changingStatusByParent = true;
            child.status = status === "checked" ? "checked" : "unchecked"
        });
    }

    /** Protected method to check the children elements status attribute value */
    _checkChildrenStatus() {
        if (!this.children) return;

        // Check the children elements status attribute
        const numberChildren = this.children.length;
        let numberChildrenChecked=0
        let numberChildrenIndeterminate=0

        this.children.map(child => child.status).forEach(status => {
            if (status === "checked") numberChildrenChecked++;
            else if (status === "indeterminate") numberChildrenIndeterminate++;
        })

        // Set the checked attribute value
        let status
        if (numberChildrenChecked === 0&&numberChildrenIndeterminate===0) status = "unchecked";
        else if (numberChildrenChecked === numberChildren) status = "checked";
        else status = "indeterminate";

        // Check if the status has changed
        if (status === this.status) {
            if (this._changingStatusByChildren)
                this._changingStatusByChildren = false;
            return;
        }

        // Set the status attribute
        this.status = status;
    }

    /** Protected method to add the parent element
     * @param {SiriusCheckbox} parent - Parent element
     * */
    _addParentElement(parent) {
        this.onBuilt = () => {
            this._parentElement = parent;
            parent._children.push(this);
        }
    }

    /** Protected method to remove the parent element */
    _removeParentElement() {
        this.onBuilt = () => {
            this._parentElement._children = this._parentElement._children.filter(child => child !== this);
            this._parentElement = null;
        }
    }

    /** Add children elements
     * @param {SiriusControlElement[]} children - Children elements
     */
    addChildrenElement(children) {
        if (!children) return;

        // Add the children elements
        this.onBuilt = () => children.forEach(child => child.parentId = this.id)
    }

    /** Remove children elements
     * @param {SiriusControlElement[]} children - Children elements
     */
    removeChildrenElement(children) {
        if (!children) return;

        // Remove the children elements
        this.onBuilt = () => children.forEach(child => child.parentId = "")
    }

    /** Remove child element by ID
     * @param {string} id - Child ID
     */
    removeChildElementById(id) {
        if (!id) return;

        // Remove the child element
        this.onBuilt = () => {
            // Get the child element by ID
            const child = this.children.find(child => child.id === id);
            if (!child) return;

            // Remove the child element
            child.parentId = "";
        }
    }

    /** Protected method to the parent ID
     * @param {string} parentId - Parent ID attribute value
     */
    _setParentId(parentId) {
        if (!parentId) {
            this._removeParentElement()
            return
        }

        this.onBuilt = () => {
            // Check if the parent element is the same as the current element
            if (this.id === parentId)
                this.logger.error("Parent element cannot be the same as the current element")

            const parent = sirius.getInstance(parentId);

            // Check if the parent element exists
            if (!parent) {
                this.logger.error(`Parent with ID '${parentId}' not found`);
                return;
            }

            // Check if it's a control element
            if (!(parent instanceof SiriusControlElement)) {
                this.logger.error("Element is not a SiriusCheckbox element");
                return;
            }

            // Check if the parent element to set is the current parent element
            if (this._parentElement === parent)
                return

            // Remove the current parent element
            if (this._parentElement)
                this._removeParentElement()

            // Add the parent element
            this._addParentElement(parent);
        }
    }

    /** Protected method to handle the status attribute change to checked
     * NOTE: This method should be implemented by the child class
     * */
    _statusCheckedHandler() {
        this.logger.error("Method not implemented");
    }

     /** Protected method to handle the status attribute change to unchecked
     * NOTE: This method should be implemented by the child class
     * */
    _statusUncheckedHandler() {
        this.logger.error("Method not implemented");
     }

     /** Protected method to handle the status attribute change to indeterminate
     * NOTE: This method should be implemented by the child class
     * */
    _statusIndeterminateHandler() {
        this.logger.error("Method not implemented");
     }

    /** Protected method to set the status attribute
     * @param {string} status - Status attribute value
     */
    _setStatus(status) {
        if (!status) return

        // Store current changing status by parent and children flags
        const changingStatusByParent = this._changingStatusByParent;
        const changingStatusByChildren = this._changingStatusByChildren;

        // Check if the status is being changed by the children elements
        if (changingStatusByChildren)
            this._changingStatusByChildren = false;

        // Check if the status is being changed by the parent element
        if (changingStatusByParent) {
            this._changingStatusByParent = false;

            // Check if all children status have been changed
            if (++this.parentElement._changedChildrenStatus === this.children.length)
                this.parentElement._changedChildrenStatus = 0;
        }

        // Check if is the same status
        if (status === this._previousStatus) return;

        // Update the children elements
        if (!changingStatusByChildren&&status !== "indeterminate" && this.children)
            this._setChildrenStatus(status);

        // Update the icon element
        if (status === "unchecked")
            this._statusUncheckedHandler()

        else if (status === "checked")
            this._statusCheckedHandler()

        else if (status === "indeterminate")
            this._statusIndeterminateHandler()

        else {
            this.logger.error(`Invalid status attribute value: ${status}`);
            return;
        }

        // Trigger parent element to check children status
        if (this.parentElement && !changingStatusByParent) {
            this.parentElement._changingStatusByChildren = true;
            this.parentElement._checkChildrenStatus();
        }
    }
}
