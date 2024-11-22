import deepFreeze from "./utils/deep-freeze.js";
import SiriusElement from "./SiriusElement.js";
import sirius from "./Sirius.js";

/** SiriusControlElement constants */
export const SIRIUS_CONTROL_ELEMENT = deepFreeze({
    NAME: 'SiriusControlElement',
})

/** SiriusControlElement attributes */
export const SIRIUS_CONTROL_ELEMENT_ATTRIBUTES = deepFreeze({
    STATUS: "status",
    PARENT_ID: 'parent-id'
})

/** SiriusControlElement status values */
export const SIRIUS_CONTROL_ELEMENT_STATUS = deepFreeze({
    CHECKED: "checked",
    UNCHECKED: "unchecked",
    INDETERMINATE: "indeterminate"
})

/** SiriusControlElement default values */
export const SIRIUS_CONTROL_ELEMENT_ATTRIBUTES_DEFAULT = deepFreeze({
    [SIRIUS_CONTROL_ELEMENT_ATTRIBUTES.STATUS]: SIRIUS_CONTROL_ELEMENT_STATUS.UNCHECKED,
})

/** Sirius class that represents a control element component */
export default class SiriusControlElement extends SiriusElement {
    // Main elements
    _parent = null;
    _children = []

    // Status
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
            attributes: SIRIUS_CONTROL_ELEMENT_ATTRIBUTES,
            attributesDefault: SIRIUS_CONTROL_ELEMENT_ATTRIBUTES_DEFAULT
        });
    }

    /** Get parent element
     * @returns {SiriusControlElement|null} - Parent element
     */
    get parent() {
        return this._parent;
    }

    /** Get children elements
     * @returns {SiriusControlElement[]} - Children elements
     */
    get children() {
        return Object.freeze([...this._children]);
    }

    /** Get parent ID attribute
     * @returns {string} - Parent ID attribute
     */
    get parentId() {
        return this.getAttribute(SIRIUS_CONTROL_ELEMENT_ATTRIBUTES.PARENT_ID);
    }

    /** Set parent ID attribute
     * @param {string} value - Parent ID attribute
     */
    set parentId(value) {
        this.setAttribute(SIRIUS_CONTROL_ELEMENT_ATTRIBUTES.PARENT_ID, value);
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
        if(this.status === SIRIUS_CONTROL_ELEMENT_STATUS.CHECKED)
            this.status = SIRIUS_CONTROL_ELEMENT_STATUS.UNCHECKED
        else
            this.status=SIRIUS_CONTROL_ELEMENT_STATUS.CHECKED;
    }

    /** Protected method to set the status attribute for the children elements
     * @param {string} status - Status attribute
     */
    _setChildrenStatus(status) {
        if (!this.children || !status) return;

        // Check if it's indeterminate
        if (status === SIRIUS_CONTROL_ELEMENT_STATUS.INDETERMINATE)
            this.logger.error("Cannot set children status to 'indeterminate' from parent element");

        // Set the changing children status flag
        this._changedChildrenStatus = this.children.reduce((acc, child) => {
            if (child.status === status) return acc+1;
            return acc;
        },0);

        // Set the status attribute for the children elements
        this.children.forEach(child => {
            if (child.status === status) return;

            child._changingStatusByParent = true;
            if(status === SIRIUS_CONTROL_ELEMENT_STATUS.CHECKED)
                child.status = SIRIUS_CONTROL_ELEMENT_STATUS.CHECKED;
            else
                child.status = SIRIUS_CONTROL_ELEMENT_STATUS.UNCHECKED
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
            if (status === SIRIUS_CONTROL_ELEMENT_STATUS.CHECKED) numberChildrenChecked++;
            else if (status === SIRIUS_CONTROL_ELEMENT_STATUS.INDETERMINATE) numberChildrenIndeterminate++;
        })

        // Set the checked attribute value
        let status
        if (numberChildrenChecked === 0&&numberChildrenIndeterminate===0)
            status = SIRIUS_CONTROL_ELEMENT_STATUS.UNCHECKED;
        else if (numberChildrenChecked === numberChildren)
            status = SIRIUS_CONTROL_ELEMENT_STATUS.CHECKED;
        else
            status = SIRIUS_CONTROL_ELEMENT_STATUS.INDETERMINATE;

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
     * @param {SiriusControlElement} parent - Parent element
     * */
    _addParent(parent) {
        this.onBuilt = () => {
            this._parent = parent;
            parent._children.push(this);
        }
    }

    /** Protected method to remove the parent element */
    _removeParent() {
        // Check if the parent element is set
        if (!this._parent){
            this.logger.error('Parent element must be set')
            return
        }

        this._parent._children = this._parent._children.filter(child => child !== this);
        this._parent = null;
    }

    /** Add child element
     * @param {SiriusControlElement} child - Child element
     */
    _addChild(child) {
        if (!child) return;

        // Add the child element
        this.onBuilt = () => child.parentId = this.id;
    }

    /** Add children elements
     * @param {SiriusControlElement[]} children - Children elements
     */
    _addChildren(children) {
        if (!children) return;

        // Add the children elements
        this.onBuilt = () => children.forEach(child => child.parentId = this.id)
    }

    /** Remove child element
     * @param {SiriusControlElement} child - Child element
     */
    _removeChild(child) {
        if (!child) return;

        // Remove the child element
        child.parentId = ""
    }

    /** Remove child element by ID
     * @param {string} id - Child ID
     */
    _removeChildById(id) {
        if (!id) return;

        // Get the child element by ID
        const child = this.children.find(child => child.id === id);
        if (!child) return;

        // Remove the child element
        this._removeChild(child);
    }

    /** Remove children elements
     * @param {SiriusControlElement[]} children - Children elements
     */
    _removeChildren(children) {
        if (!children) return;

        children.forEach(child => child.parentId = "")
    }

    /** Remove all children elements */
    _removeAllChildren() {
        this.children.forEach(child => child.parentId = "")
    }

    /** Check if the element is checked
     * @returns {boolean} - Checked status
     */
    get isChecked() {
        return this.status === SIRIUS_CONTROL_ELEMENT_STATUS.CHECKED;
    }

    /** Get the checked children elements
     * @returns {SiriusControlElement[]} - Checked children elements
     */
    get checkedChildrenElements(){
        return this.children.filter(child => child.isChecked);
    }

    /** Protected method to the parent ID
     * @param {string} parentId - Parent ID attribute value
     */
    _setParentId(parentId) {
        if (!parentId) {
            this._removeParent()
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
                this.logger.error("Element is not a SiriusControlElement");
                return;
            }

            // Check if the parent element to set is the current parent element
            if (this._parent === parent)
                return

            // Remove the current parent element
            if (this._parent)
                this._removeParent()

            // Add the parent element
            this._addParent(parent);
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
            if (++this.parent._changedChildrenStatus === this.children.length)
                this.parent._changedChildrenStatus = 0;
        }

        // Check if is the same status
        if (status === this._previousStatus) return;

        // Check if the status is being set manually to indeterminate
        if (status === SIRIUS_CONTROL_ELEMENT_STATUS.INDETERMINATE && !changingStatusByChildren && !changingStatusByParent){
            this.logger.error("Cannot set status to 'indeterminate' manually");
            return
        }

        // Update the children elements
        if (!changingStatusByChildren && this.children)
            this._setChildrenStatus(status);

        // Update the icon element
        if (status === SIRIUS_CONTROL_ELEMENT_STATUS.UNCHECKED)
            this._statusUncheckedHandler()

        else if (status === SIRIUS_CONTROL_ELEMENT_STATUS.CHECKED)
            this._statusCheckedHandler()

        else if (status === SIRIUS_CONTROL_ELEMENT_STATUS.INDETERMINATE)
            this._statusIndeterminateHandler()

        else {
            this.logger.error(`Invalid status attribute value: ${status}`);
            return;
        }

        // Trigger parent element to check children status
        if (this.parent && !changingStatusByParent) {
            this.parent._changingStatusByChildren = true;
            this.parent._checkChildrenStatus();
        }
    }
}
