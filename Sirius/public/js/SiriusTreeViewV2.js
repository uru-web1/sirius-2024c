import deepFreeze from "./utils/deep-freeze.js";
import {SIRIUS_ELEMENT, SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES, SiriusElement} from "./SiriusElement.js";
import {SiriusCheckbox} from "./SiriusCheckbox.js";
import {SIRIUS_ICON_ATTRIBUTES, SIRIUS_ICON_ATTRIBUTES_DEFAULT, SiriusIcon} from "./SiriusIcon.js";

/** Sirius Tree View constants */
export const SIRIUS_TREE_VIEW = deepFreeze({
    NAME: "SiriusTreeViewV2",
    TAG: "sirius-tree-view",
    CSS_VARIABLES: {
        ICON_WIDTH: '--sirius-tree-view--icon-width',
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
        ICON_CONTAINER: 'icon-container',
        PARENT: 'parent',
        CHILDREN_CONTAINER: 'children-container',
        CHILDREN: 'children',
    }
});

/** Sirius Tree View attributes */
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

/** Sirius Tree View status */
export const SIRIUS_TREE_VIEW_STATUS = deepFreeze({
    OPEN: "open",
    CLOSE: "close",
})

/** Sirius Tree View attributes default values
 * If an attribute is not present in the object, the default value is null
 * */
export const SIRIUS_TREE_VIEW_ATTRIBUTES_DEFAULT = deepFreeze({
    [SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_WIDTH]:SIRIUS_ICON_ATTRIBUTES_DEFAULT.WIDTH,
    [SIRIUS_TREE_VIEW_ATTRIBUTES.STATUS]: SIRIUS_TREE_VIEW_STATUS.OPEN,
    [SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_TRANSITION_DURATION]: "300ms"
})

/** Sirius class that represents a Tree View component */
export class SiriusTreeView extends SiriusElement {
    #treeViewContainerElement = null
    #parentContainerElement = null
    #iconContainerElement = null
    #iconElement = null
    #parent = null
    #childrenContainerElement = null
    #children = null

    /**
     * Create a Sirius icon element
     * @param {object} properties - Element properties
     */
    constructor(properties) {
        super(properties, SIRIUS_TREE_VIEW.NAME);
    }

    /** Define observed attributes */
    static get observedAttributes() {
        return [...SiriusElement.observedAttributes, ...Object.values(SIRIUS_TREE_VIEW_ATTRIBUTES)];
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

    /** Get the parent element
     * @returns {SiriusCheckbox} - Parent element
     */
    get parent() {
        return this.#parent;
    }

    /** Get the children container element
     * @returns {HTMLDivElement} - Children container element
     */
    get childrenContainerElement() {
        return this.#childrenContainerElement
    }

    /** Get the children elements
     * @returns {(SiriusCheckbox|SiriusTreeView)[]} - Children element
     */
    get children() {
        return this.#children;
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
            this.onBuilt = () => {
                this._setCSSVariable(SIRIUS_TREE_VIEW.CSS_VARIABLES.ICON_WIDTH, width);
                this.iconElement.width = width;
            }
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

    /** Get the template for the Sirius Tree View
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
    
    /** Toggle status */
    toggleStatus() {
        if (this.status === SIRIUS_TREE_VIEW_STATUS.OPEN)
            this.status = SIRIUS_TREE_VIEW_STATUS.CLOSE;
        else
            this.status = SIRIUS_TREE_VIEW_STATUS.OPEN;
    }

    /** Attribute change callback
     * @param {string} name - Attribute name
     * @param {string} oldValue - Old attribute value
     * @param {string} newValue - New attribute value
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // Call the pre-attribute changed callback
        const {formattedValue, shouldContinue} = this._preAttributeChangedCallback(name, oldValue, newValue);
        if (!shouldContinue) return;

        switch (name) {
            case SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES.ID:
                this._setId(formattedValue)
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.STATUS:
                this.#setStatus(formattedValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.GAP:
                this.#setGap(formattedValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_WIDTH:
                this.#setIconWidth(formattedValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_HEIGHT:
                this.#setIconHeight(formattedValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_FILL:
                this.#setIconFill(formattedValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_TRANSITION_DURATION:
                this.#setIconTransitionDuration(formattedValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.SHOW_ANIMATION:
                this.#setShowAnimation(formattedValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.HIDING_ANIMATION:
                this.#setHidingAnimation(formattedValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.CHILDREN_GAP:
                this.#setChildrenGap(formattedValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.CHILDREN_MARGIN_LEFT:
                this.#setChildrenMarginLeft(formattedValue);
                break;

            default:
                this._onInjectedLogger = () => this.logger.error(`Unregistered attribute: ${name}`);
                break;
        }
    }

    /** Lifecycle method called when the component is connected to the DOM
     */
    async connectedCallback() {
        // Call the parent connected callback
        await super.connectedCallback()

        // Load Sirius Tree View attributes
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
        this.#parent = this.parentContainerElement.lastElementChild;
        this.#childrenContainerElement = this.treeViewContainerElement.lastElementChild;
        this.#children = this.childrenContainerElement.firstElementChild;
        this.shadowRoot.appendChild(this.containerElement);

        // Add icon to the icon container
        this.iconContainerElement.appendChild(this.iconElement);
        
        // Add event listeners
        this.iconElement.events = {
            "click": () => this.toggleStatus()
        }

        // Dispatch the built event
        this.dispatchBuiltEvent();
    }
}

// Register custom element
customElements.define(SIRIUS_TREE_VIEW.TAG, SiriusTreeView);


