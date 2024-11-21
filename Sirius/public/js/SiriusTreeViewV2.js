import deepFreeze from "./utils/deep-freeze.js";
import SiriusElement, {SIRIUS_ELEMENT, SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES} from "./SiriusElement.js";
import SiriusControlElement, {SIRIUS_CONTROL_ELEMENT} from "./SiriusControlElement.js";
import SiriusIcon, {SIRIUS_ICON_ATTRIBUTES, SIRIUS_ICON_ATTRIBUTES_DEFAULT} from "./SiriusIcon.js";

/** SiriusTreeView constants */
export const SIRIUS_TREE_VIEW = deepFreeze({
    NAME: "SiriusTreeViewV2",
    TAG: "sirius-tree-view",
    CSS_VARIABLES: {
        ANIMATION_DURATION: '--sirius-tree-view--animation-duration',
        CHILDREN_MARGIN_LEFT: '--sirius-tree-view--children-margin-left',
        CHILDREN_GAP: '--sirius-tree-view--children-gap',
        GAP: '--sirius-tree-view--gap',
    },
    SLOTS: {
        PARENT: 'parent',
        CHILDREN: 'children',
    },
    CLASSES: {
        TREE_VIEW_CONTAINER: 'container-element',
        PARENT_CONTAINER: 'parent-container',
        HAS_PARENT: 'has-parent',
        ICON_CONTAINER: 'icon-container',
        PARENT: 'parent',
        CHILDREN_CONTAINER: 'children-container',
        CHILDREN: 'children',
    }
});

/** SiriusTreeView attributes */
export const SIRIUS_TREE_VIEW_ATTRIBUTES = deepFreeze({
    STATUS: "status",
    GAP: "gap",
    ICON_WIDTH: "icon-width",
    ICON_HEIGHT: "icon-height",
    ICON_FILL: "icon-fill",
    ICON_TRANSITION_DURATION: "icon-transition-duration",
    SHOW_ANIMATION: "show-animation",
    HIDING_ANIMATION: "hiding-animation",
    CHILDREN_GAP: "children-gap",
    CHILDREN_MARGIN_LEFT: "children-margin-left",
})

/** SiriusTreeView status */
export const SIRIUS_TREE_VIEW_STATUS = deepFreeze({
    OPEN: "open",
    CLOSE: "close",
})

/** SiriusTreeView attributes default values
 * If an attribute is not present in the object, the default value is null
 * */
export const SIRIUS_TREE_VIEW_ATTRIBUTES_DEFAULT = deepFreeze({
    [SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_WIDTH]:SIRIUS_ICON_ATTRIBUTES_DEFAULT.WIDTH,
    [SIRIUS_TREE_VIEW_ATTRIBUTES.STATUS]: SIRIUS_TREE_VIEW_STATUS.OPEN,
    [SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_TRANSITION_DURATION]: "300ms"
})

/** Sirius class that represents a Tree View component */
export default class SiriusTreeView extends SiriusElement {
    #treeViewContainerElement = null
    #parentContainerElement = null
    #iconContainerElement = null
    #iconElement = null
    #parentSlotElement = null
    #childrenContainerElement = null
    #childrenSlotElement = null
    #parentId = ""
    #childrenParent = null
    #children = []
    #parentObserver=null
    #childrenObserver=null

    /**
     * Create a Sirius icon element
     * @param {object} properties - Element properties
     */
    constructor(properties) {
        super(properties, SIRIUS_TREE_VIEW.NAME);

        // Build the SiriusTreeView
        this.#build().then();
    }

    /** Define observed attributes */
    static get observedAttributes() {
        return [...SiriusElement.observedAttributes, ...Object.values(SIRIUS_TREE_VIEW_ATTRIBUTES)];
    }

    /** Get the template for the SiriusTreeView
     * @returns {string} - Template
     * */
    #getTemplate() {
        // Get the Tree View classes
        const treeViewContainerClasses = [SIRIUS_TREE_VIEW.CLASSES.TREE_VIEW_CONTAINER];
        const parentContainerClasses = [SIRIUS_TREE_VIEW.CLASSES.PARENT_CONTAINER];
        const iconContainerClasses = [SIRIUS_TREE_VIEW.CLASSES.ICON_CONTAINER];
        const parentClasses = [SIRIUS_TREE_VIEW.CLASSES.PARENT];
        const childrenContainerClasses = [SIRIUS_TREE_VIEW.CLASSES.CHILDREN_CONTAINER];
        const childrenClasses = [SIRIUS_TREE_VIEW.CLASSES.CHILDREN];

        return `<div class="${treeViewContainerClasses.join(' ')}">
                    <div class="${parentContainerClasses.join(' ')}">
                        <div class="${iconContainerClasses.join(' ')}">
                        </div>
                        <slot name="${SIRIUS_TREE_VIEW.SLOTS.PARENT}" class="${parentClasses.join(' ')}"></slot>
                    </div>
                    <div class="${childrenContainerClasses.join(' ')}">
                        <slot name="${SIRIUS_TREE_VIEW.SLOTS.CHILDREN}" class="${childrenClasses.join(' ')}"></slot>
                        </div>
                </div>`;
    }

    /** Build the SiriusTreeView */
    async #build() {
        // Load SiriusTreeView attributes
        this._loadAttributes({
            instanceProperties: this._properties,
            attributes: SIRIUS_TREE_VIEW_ATTRIBUTES,
            attributesDefault: SIRIUS_TREE_VIEW_ATTRIBUTES_DEFAULT
        });

        // Create the CSS stylesheet and add it to the shadow DOM
        await this._loadAndAdoptStyles()

        // Create derived IDs
        const iconId = this._getDerivedId("icon")

        // Get the required keys
        const idKey = SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID
        const iconKey = SIRIUS_ICON_ATTRIBUTES.ICON

        // Create SiriusIcon element
        this.#iconElement = new SiriusIcon({
            [idKey]: iconId,
            [iconKey]: "arrow",
        })

        // Get HTML inner content
        const innerHTML = this.#getTemplate();

        // Create the HTML template
        await this._createTemplate(innerHTML);

        // Add label to the shadow DOM
        this.#treeViewContainerElement = this._containerElement = this._templateContent.firstChild;
        this.#parentContainerElement = this.treeViewContainerElement.firstElementChild;
        this.#iconContainerElement = this.parentContainerElement.firstElementChild;
        this.#parentSlotElement = this.parentContainerElement.lastElementChild;
        this.#childrenContainerElement = this.treeViewContainerElement.lastElementChild;
        this.#childrenSlotElement = this.childrenContainerElement.firstElementChild;
        this.shadowRoot.appendChild(this.containerElement);

        // Add icon to the icon container
        this.iconContainerElement.appendChild(this.iconElement);

        // Add event listeners
        this.iconElement.events = {
            "click": () => this.toggleStatus()
        }

        // Set up MutationObserver to detect parent slot changes
        this.#parentObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList)
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.slot)
                            this.addChildrenParent(node)
                    });
                    mutation.removedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.slot)
                            this.removeChildrenParent()
                    })
                }
        });

        // Set up MutationObserver to detect parent slot changes
        this.#childrenObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList)
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.slot)
                            this.addChildren(node)
                    });
                    mutation.removedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.slot)
                            this.removeChildElementById(node.id)
                    })
                }
        });

        // Start observing the parent slot element
        this.#parentObserver.observe(this.parentSlotElement, { childList: true });

        // Start observing the children slot element
        this.#childrenObserver.observe(this.childrenSlotElement, { childList: true });

        // Manually call parent slot observer to add existing children
        this.parentSlotElement.assignedElements().forEach(node => {
            this.addChildrenParent(node,false);
        });

        // Manually call children slot observer to add existing children
        this.childrenSlotElement.assignedElements().forEach(node => {
            this.addChildrenNode(node, false);
        })

        // Dispatch the built event
        this.dispatchBuiltEvent();
    }

    /** Get the Tree View container element
     * @returns {HTMLDivElement} - Tree View container element
     */
    get treeViewContainerElement() {
        return this.#treeViewContainerElement;
    }

    /** Get the parent container element
     * @returns {HTMLDivElement} - Parent container element
     */
    get parentContainerElement() {
        return this.#parentContainerElement;
    }

    /** Get the icon container element
     * @returns {HTMLDivElement} - Icon container element
     */
    get iconContainerElement() {
        return this.#iconContainerElement;
    }

    /** Get the icon element
     * @returns {SiriusIcon} - Icon element
     */
    get iconElement() {
        return this.#iconElement;
    }

    /** Get the parent slot element
     * @returns {HTMLSlotElement} - Parent slot element
     */
    get parentSlotElement(){
        return this.#parentSlotElement
    }

    /** Get the children container element
     * @returns {HTMLDivElement} - Children container element
     */
    get childrenContainerElement() {
        return this.#childrenContainerElement
    }

    /** Get the children slot element
     * @returns {HTMLSlotElement} - Children slot element
     */
    get childrenSlotElement(){
        return this.#childrenSlotElement
    }

    /** Get the parent element ID
     * @returns {string} - Parent element ID
     */
    get parentId() {
        return this.#parentId;
    }

    /** Set parent checkbox element ID
     * @param {string} parentId - Parent checkbox element ID
     */
    set parentId(parentId){
        this.onBuilt = () => {
            // Set the parent ID
            this.#parentId = parentId;

            if (this.childrenParent)
                this.childrenParent.parentId = parentId;

            // Set the has parent class
            if (parentId)
                this.classList.add(SIRIUS_TREE_VIEW.CLASSES.HAS_PARENT);
            else
                this.classList.remove(SIRIUS_TREE_VIEW.CLASSES.HAS_PARENT);
        }
    }

    /** Get the children parent element
     * @returns {SiriusControlElement} - Children parent element
     */
    get childrenParent() {
        return this.#childrenParent;
    }

    /** Add children parent element
     * @param {SiriusControlElement} childrenParent - Children parent element
     * @param {boolean} append - Append to the parent element
     */
    #addChildrenParent(childrenParent, append) {
        this.onBuilt = () => {
            // Remove the current parent
            this.removeChildrenParent()

            // Add the new parent
            if (append)
                this.parentSlotElement.appendChild(childrenParent);

            // Set the parent ID
            this.children.forEach(child => child.parentId = childrenParent.id);

            // Set the children parent
            this.#childrenParent = childrenParent
            if (childrenParent && this.parentId)
                this.#childrenParent.parentId = this.parentId
        }
    }

    /** Add children parent element node
     * @param {HTMLElement|SiriusControlElement} element - Children parent element node/instance
     * @param {boolean} append - Append to the parent element
     */
    addChildrenParent(element, append = true) {
        if (element!==null&&element instanceof SIRIUS_CONTROL_ELEMENT.TAG)
            this.logger.error("The parent element must be a SiriusControlElement");

        this.#addChildrenParent(element, append);
    }

    /** Remove children parent element */
    removeChildrenParent() {
        this.onBuilt = () => {
            // Remove the current parent
            if (this.childrenParent) {
                this.parentSlotElement.removeChild(this.childrenParent);

                // Remove the child-parent relationship
                this.childrenParent.parentId = "";
            }

            // Remove the existing parent
            this.children.forEach(child => child.parentId = "");

            // Clear the children parent
            this.#childrenParent = null;
        }
    }

    /** Get the children elements
     * @returns {(SiriusControlElement|SiriusTreeView)[]} - Children elements
     */
    get children() {
        return this.#children
    }

    /** Add child element
     * @param {SiriusControlElement|SiriusTreeView|HTMLElement} child - Child element
     * @param {boolean} append - Append to the children container
     */
    #addChildren(child, append) {
        this.onBuilt=()=> {
            // Add the children to the children container
            if (append)
                this.childrenContainerElement.appendChild(child);

            // Add to the children list
            if (!this.children.find(c => c.id === child.id))
                this.children.push(child);

            // Set the parent ID
            if (this.childrenParent)
                child.parentId = this.childrenParent.id;
        }
    }

    /** Add child element node
     * @param {HTMLElement|SiriusControlElement|SiriusTreeView} element - Child element node/instance
     * @param {boolean} append - Append to the children container
     */
    addChildren(element, append = true) {
        if (!(element instanceof SiriusControlElement) && !(element instanceof SiriusTreeView))
            this.logger.error("The child element must be a SiriusControlElement or SiriusTreeView");

        this.#addChildren(element, append);
    }

    /** Remove children elements */
    removeChildren() {
        this.onBuilt = () => {
            if (!this.children) return

            this.children.forEach(child =>{
                // Remove the children from the children container
                this.childrenContainerElement.removeChild(child);

                // Remove the parent ID
                this.children.forEach(child => child.parentId = "")
            })

            // Clear the children list
            this.#children = [];
        }
    }

    /** Remove child element by ID
     * @param {string} id - Child element ID
     */
    removeChildElementById(id) {
        this.onBuilt = () => {
            // Get the child element by ID
            const child = this.children.find(child => child.id === id);
            if (!child) return;

            // Remove the children from the children container
            this.childrenContainerElement.removeChild(child);

            // Remove the parent ID
            child.parentId = "";

            // Remove the children element from the children list
            this.#children = this.children.filter(child => child.id !== id);
        }
    }

    /** Get the status attribute
     * @returns {string} - Status attribute
     */
    get status() {
        return this.getAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.STATUS);
    }

    /** Set the status attribute
     * @param {string} value - Status attribute
     */
    set status(value) {
        this.setAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.STATUS, value);
    }

    /** Get the gap attribute
     * @returns {string} - Gap attribute
     */
    get gap() {
        return this.getAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.GAP);
    }

    /** Set the gap attribute
     * @param {string} value - Gap attribute
     */
    set gap(value) {
        this.setAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.GAP, value);
    }

    /** Get the icon attribute
     * @returns {string} - Icon attribute
     */
    get icon() {
        return this.getAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.ICON);
    }

    /** Set the icon attribute
     * @param {string} value - Icon attribute
     */
    set icon(value) {
        this.setAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.ICON, value);
    }

    /** Get the icon width attribute
     * @returns {string} - Icon width attribute
     */
    get iconWidth() {
        return this.getAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_WIDTH);
    }

    /** Set the icon width attribute
     * @param {string} value - Icon width attribute
     */
    set iconWidth(value) {
        this.setAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_WIDTH, value);
    }

    /** Get the icon height attribute
     * @returns {string} - Icon height attribute
     */
    get iconHeight() {
        return this.getAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_HEIGHT);
    }

    /** Set the icon height attribute
     * @param {string} value - Icon height attribute
     */
    set iconHeight(value) {
        this.setAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_HEIGHT, value);
    }

    /** Get the icon fill attribute
     * @returns {string} - Icon fill attribute
     */
    get iconFill() {
        return this.getAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_FILL);
    }

    /** Set the icon fill attribute
     * @param {string} value - Icon fill attribute
     */
    set iconFill(value) {
        this.setAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_FILL, value);
    }

    /** Get the icon transition duration attribute
     * @returns {string} - Icon transition duration attribute
     */
    get iconTransitionDuration() {
        return this.getAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_TRANSITION_DURATION);
    }

    /** Set the icon transition duration attribute
     * @param {string} value - Icon transition duration attribute
     */
    set iconTransitionDuration(value) {
        this.setAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_TRANSITION_DURATION, value);
    }

    /** Set the show animation attribute
     * @returns {string} - Show animation attribute
     */
    get showAnimation() {
        return this.getAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.SHOW_ANIMATION);
    }

    /** Set the show animation attribute
     * @param {string} value - Show animation attribute
     */
    set showAnimation(value) {
        this.setAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.SHOW_ANIMATION, value);
    }

    /** Get the hiding animation attribute
     * @returns {string} - Hiding animation attribute
     */
    get hidingAnimation() {
        return this.getAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.HIDING_ANIMATION);
    }

    /** Set the hiding animation attribute
     * @param {string} value - Hiding animation attribute
     */
    set hidingAnimation(value) {
        this.setAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.HIDING_ANIMATION, value);
    }

    /** Get the children gap attribute
     * @returns {string} - Children gap attribute
     */
    get childrenGap() {
        return this.getAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.CHILDREN_GAP);
    }

    /** Set the children gap attribute
     * @param {string} value - Children gap attribute
     */
    set childrenGap(value) {
        this.setAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.CHILDREN_GAP, value);
    }

    /** Get the children margin left attribute
     * @returns {string} - Children margin left attribute
     */
    get childrenMarginLeft() {
        return this.getAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.CHILDREN_MARGIN_LEFT);
    }

    /** Set the children margin left attribute
     * @param {string} value - Children margin left attribute
     */
    set childrenMarginLeft(value) {
        this.setAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.CHILDREN_MARGIN_LEFT, value);
    }

    /** Private method to set the icon status
     * @param {string} status - Icon status
     */
    #setStatus(status) {
        if (!status) return

        this.onBuilt = () => {
            if (status === SIRIUS_TREE_VIEW_STATUS.CLOSE) {
                this.iconElement.rotation = "right";
                this.childrenContainerElement.classList.add(SIRIUS_ELEMENT.CLASSES.HIDING)

            } else if (status === SIRIUS_TREE_VIEW_STATUS.OPEN) {
                this.iconElement.rotation = "down";
                this.childrenContainerElement.classList.remove(SIRIUS_ELEMENT.CLASSES.HIDING)

            } else
                this.logger.error(`Invalid status: ${status}. The status must be either "open" or "close"`);
        }
    }

    /** Private method to set the icon fill
     * @param {string} fill - Icon fill
     */
    #setIconFill(fill) {
        if (fill)
            this.onBuilt = () => this.iconElement.fill = fill;
    }

    /** Private method to set the icon width
     * @param {string} width - Icon width
     */
    #setIconWidth(width) {
        if (width)
            this.onBuilt = () => this.iconElement.width = width;
    }

    /** Private method to set the icon height
     * @param {string} height - Icon height
     */
    #setIconHeight(height) {
        if (height)
            this.onBuilt = () => this.iconElement.height = height;
    }

    /** Private method to set the icon transition duration
     * @param {string} duration - Icon transition duration
     */
    #setIconTransitionDuration(duration) {
        if (duration)
            this.onBuilt = () => this.iconElement.transitionDuration = duration;
    }

    /** Private method to set the children gap
     * @param {string} gap - Children gap
     */
    #setChildrenGap(gap) {
        if (gap)
            this.onBuilt = () => this._setCSSVariable(SIRIUS_TREE_VIEW.CSS_VARIABLES.CHILDREN_GAP, gap);
    }

    /** Private method to set the children margin left
     * @param {string} marginLeft - Children margin left
     */
    #setChildrenMarginLeft(marginLeft) {
        if (marginLeft)
            this.onBuilt = () => this._setCSSVariable(SIRIUS_TREE_VIEW.CSS_VARIABLES.CHILDREN_MARGIN_LEFT, marginLeft);
    }

    /** Private method to set the gap
     * @param {string} gap - Gap
     */
    #setGap(gap) {
        if (gap)
            this.onBuilt = () => this._setCSSVariable(SIRIUS_TREE_VIEW.CSS_VARIABLES.GAP, gap);
    }

    /** Private method to set the show animation
     * @param {string} rules - Show animation rules
     */
    #setShowAnimation(rules) {
        if (rules)
            this.onBuilt = () => this._setKeyframeRules(SIRIUS_TREE_VIEW.CSS_VARIABLES.ANIMATION_DURATION, rules);
    }

    /** Private method to set the hiding animation
     * @param {string} rules - Hiding animation rules
     */
    #setHidingAnimation(rules) {
        if (rules)
            this.onBuilt = () => this._setKeyframeRules(SIRIUS_TREE_VIEW.CSS_VARIABLES.ANIMATION_DURATION, rules);
    }
  
    /** Toggle status */
    toggleStatus() {
        if (this.status === SIRIUS_TREE_VIEW_STATUS.OPEN)
            this.status = SIRIUS_TREE_VIEW_STATUS.CLOSE;
        else
            this.status = SIRIUS_TREE_VIEW_STATUS.OPEN;
    }

    /** Private method to handle attribute changes
     * @param {string} name - Attribute name
     * @param {string} oldValue - Old attribute value
     * @param {string} newValue - New attribute value
     */
    #attributeChangeHandler(name, oldValue, newValue) {
        switch (name) {
            case SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID:
                this._setId(newValue)
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.STATUS:
                this.#setStatus(newValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.GAP:
                this.#setGap(newValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_WIDTH:
                this.#setIconWidth(newValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_HEIGHT:
                this.#setIconHeight(newValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_FILL:
                this.#setIconFill(newValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_TRANSITION_DURATION:
                this.#setIconTransitionDuration(newValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.SHOW_ANIMATION:
                this.#setShowAnimation(newValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.HIDING_ANIMATION:
                this.#setHidingAnimation(newValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.CHILDREN_GAP:
                this.#setChildrenGap(newValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.CHILDREN_MARGIN_LEFT:
                this.#setChildrenMarginLeft(newValue);
                break;

            default:
                this._onInjectedLogger = () => this.logger.error(`Unregistered attribute: ${name}`);
                break;
        }
    }

    /** Attribute change callback
     * @param {string} name - Attribute name
     * @param {string} oldValue - Old attribute value
     * @param {string} newValue - New attribute value
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // Call the attribute change pre-handler
        const {formattedValue, shouldContinue} = this._attributeChangePreHandler(name, oldValue, newValue);
        if (!shouldContinue) return;

        // Call the attribute change handler
        this.onBuilt=()=>this.#attributeChangeHandler(name, oldValue, formattedValue);
    }
}

// Register custom element
customElements.define(SIRIUS_TREE_VIEW.TAG, SiriusTreeView);


