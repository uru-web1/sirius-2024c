import deepFreeze from "./utils/deep-freeze.js";
import {
    SIRIUS_ELEMENT,
    SIRIUS_ELEMENT_ATTRIBUTES,
    SIRIUS_ELEMENT_PROPERTIES,
    SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES
} from "./SiriusElement.js";
import {SIRIUS_CONTROL_ELEMENT_ATTRIBUTES} from "./SiriusControlElement.js";
import SiriusIcon, {SIRIUS_ICON_ATTRIBUTES} from "./SiriusIcon.js";
import SiriusLinkedControlElement from "./SiriusLinkedControlElement.js";
import {SIRIUS_SVG_ICONS} from "./SiriusSvg.js";

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
        ROOT: 'root',
        HAS_PARENT: 'has-parent',
        ICON_CONTAINER: 'icon-container',
        PARENT: 'parent',
        CHILDREN_CONTAINER: 'children-container',
        CHILDREN: 'children',
    }
});

/** SiriusTreeView attributes */
export const SIRIUS_TREE_VIEW_ATTRIBUTES = deepFreeze({
    MODE: "mode",
    GAP: "gap",
    ICON_WIDTH: "icon-width",
    ICON_HEIGHT: "icon-height",
    ICON_FILL: "icon-fill",
    ICON_TRANSITION_DURATION: "icon-transition-duration",
    ICON_STYLES: "icon-styles",
    ICON_STYLES_ON_HOVER: "icon-styles-on-hover",
    ICON_STYLES_ON_CLICK: "icon-styles-on-click",
    CHILDREN_GAP: "children-gap",
    CHILDREN_MARGIN_LEFT: "children-margin-left",
    SHOW_ANIMATION: "show-animation",
    HIDING_ANIMATION: "hiding-animation",
})

/** SiriusTreeView modes */
export const SIRIUS_TREE_VIEW_MODES = deepFreeze({
    OPEN: "open",
    CLOSE: "close",
})

/** SiriusTreeView attributes default values */
export const SIRIUS_TREE_VIEW_ATTRIBUTES_DEFAULT = deepFreeze({
    [SIRIUS_TREE_VIEW_ATTRIBUTES.MODE]: SIRIUS_TREE_VIEW_MODES.OPEN
})

/** Sirius class that represents a Tree View component */
export default class SiriusTreeView extends SiriusLinkedControlElement {
    // Container elements
    #treeViewContainerElement = null
    #parentContainerElement = null
    #iconContainerElement = null
    #childrenContainerElement = null

    // Main elements
    #iconElement = null

    /**
     * Create a SiriusTreeView element
     * @param {object} properties - SiriusTreeView properties
     */
    constructor(properties) {
        super({...properties, [SIRIUS_ELEMENT_PROPERTIES.NAME]: SIRIUS_TREE_VIEW.NAME});

        // Build the SiriusTreeView
        this.#build(properties).then();
    }

    /** Define observed attributes */
    static get observedAttributes() {
        return [...SiriusLinkedControlElement.observedAttributes, ...Object.values(SIRIUS_TREE_VIEW_ATTRIBUTES)];
    }

    /** Get the template for the SiriusTreeView
     * @returns {string} - Template
     * */
    #getTemplate() {
        // Get the Tree View classes
        const treeViewContainerClasses = [SIRIUS_ELEMENT.CLASSES.MAIN_ELEMENT, SIRIUS_TREE_VIEW.CLASSES.TREE_VIEW_CONTAINER];
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

    /** Build the SiriusTreeView
     * @param {object} properties - SiriusTreeView properties
     * @returns {Promise<void>} - Promise that resolves when the SiriusTreeView is built
     * */
    async #build(properties) {
        // Load SiriusTreeView attributes
        this._loadAttributes({
            instanceProperties: properties,
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
            [iconKey]: SIRIUS_SVG_ICONS.ARROW,
        })

        // Get HTML inner content
        const innerHTML = this.#getTemplate();

        // Add label to the shadow DOM
        const container = await this._createContainerElementTemplate(innerHTML);
        this.#treeViewContainerElement = this._containerElement = container
        this.#parentContainerElement = this.treeViewContainerElement.firstElementChild;
        this.#iconContainerElement = this.parentContainerElement.firstElementChild;
        this._linkedParentSlotElement = this.parentContainerElement.lastElementChild;
        this.#childrenContainerElement = this.treeViewContainerElement.lastElementChild;
        this._linkedChildrenSlotElement = this.childrenContainerElement.firstElementChild;

        // Add icon to the icon container
        this.iconContainerElement.appendChild(this.iconElement);

        // Add event listener to the icon container element
        this.iconContainerElement.addEventListener("click", () => this.toggleMode());

        // Add the container element to the shadow DOM
        this.shadowRoot.appendChild(this.containerElement);

        // Set up the element observer
        this._setElementObserver();

        // Dispatch the built event
        this._dispatchBuiltEvent();
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

    /** Get the children container element
     * @returns {HTMLDivElement} - Children container element
     */
    get childrenContainerElement() {
        return this.#childrenContainerElement
    }

    /** Get the parent slot element
     * @returns {HTMLSlotElement} - Parent slot element
     */
    get parentSlotElement() {
        return this._linkedParentSlotElement
    }

    /** Get the children slot element
     * @returns {HTMLSlotElement} - Children slot element
     */
    get childrenSlotElement() {
        return this._linkedChildrenSlotElement
    }

    /** Get the parent element
     * @returns {SiriusControlElement|null} - Parent element
     */
    get parentElement() {
        return this._linkedParent;
    }

    /** Get the children elements
     * @returns {SiriusControlElement[]} - Children elements
     */
    get childrenElements() {
        return this._linkedChildren;
    }

    /** Get the mode attribute
     * @returns {string} - Mode attribute
     */
    get mode() {
        return this.getAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.MODE);
    }

    /** Set the mode attribute
     * @param {string} value - Mode attribute
     */
    set mode(value) {
        this.setAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.MODE, value);
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

    /** Get the icon styles attribute
     * @returns {string} - Icon styles attribute
     */
    get iconStyles() {
        return this.getAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_STYLES);
    }

    /** Set the icon styles attribute
     * @param {string} value - Icon styles attribute
     */
    set iconStyles(value) {
        this.setAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_STYLES, value);
    }

    /** Get the icon styles on hover attribute
     * @returns {string} - Icon styles on hover attribute
     */
    get iconStylesOnHover() {
        return this.getAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_STYLES_ON_HOVER);
    }

    /** Set the icon styles on hover attribute
     * @param {string} value - Icon styles on hover attribute
     */
    set iconStylesOnHover(value) {
        this.setAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_STYLES_ON_HOVER, value);
    }

    /** Get the icon styles on active attribute
     * @returns {string} - Icon styles on active attribute
     */
    get iconStylesOnClick() {
        return this.getAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_STYLES_ON_CLICK);
    }

    /** Set the icon styles on active attribute
     * @param {string} value - Icon styles on active attribute
     */
    set iconStylesOnClick(value) {
        this.setAttribute(SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_STYLES_ON_CLICK, value);
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

    /** Add parent element node
     * @param {HTMLElement|SiriusControlElement} element - Parent element node/instance
     */
    addParent(element) {
        this.onBuilt = () => this._addLinkedParent(element);
    }

    /** Remove parent element node */
    removeParent() {
        this.onBuilt = () => this._removeLinkedParent();
    }

    /** Add children elements node
     * @param {HTMLElement|SiriusControlElement} elements - Children elements node/instance
     */
    addChildren(...elements) {
        this.onBuilt = () => this._addLinkedChildren(elements);
    }

    /** Remove children elements node
     * @param {HTMLElement|SiriusControlElement} elements - Children elements node/instance
     * */
    removeChildren(...elements) {
        this.onBuilt = () => this._removeLinkedChildren(elements);
    }

    /** Set parent control element ID
     * @param {string} parentId - Parent control element ID
     */
    #setParentId(parentId) {
        this.onBuilt = () => {
            // Set the parent ID
            super._setParentId(parentId)

            // Set the has parent class
            if (parentId) {
                this.classList.add(SIRIUS_TREE_VIEW.CLASSES.HAS_PARENT);
                this.classList.remove(SIRIUS_TREE_VIEW.CLASSES.ROOT);
            } else {
                this.classList.remove(SIRIUS_TREE_VIEW.CLASSES.HAS_PARENT);
                this.classList.add(SIRIUS_TREE_VIEW.CLASSES.ROOT);
            }
        }
    }

    /** Private method to set the icon mode
     * @param {string} mode - Icon mode
     */
    #setMode(mode) {
        if (!mode) return

        this.onBuilt = () => {
            if (mode === SIRIUS_TREE_VIEW_MODES.CLOSE) {
                this.iconElement.rotation = "right";
                this.childrenContainerElement.classList.add(SIRIUS_ELEMENT.CLASSES.HIDING)

            } else if (mode === SIRIUS_TREE_VIEW_MODES.OPEN) {
                this.iconElement.rotation = "down";
                this.childrenContainerElement.classList.remove(SIRIUS_ELEMENT.CLASSES.HIDING)

            } else
                this.logger.error(`Invalid mode: ${mode}. The status must be either "open" or "close"`);
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

    /** Private method to set the icon styles
     * @param {string} styles - Icon styles
     */
    #setIconStyles(styles) {
        if (styles)
            this.onBuilt = () => this.iconElement.styles = styles;
    }

    /** Private method to set the icon styles on hover
     * @param {string} styles - Icon styles on hover
     */
    #setIconStylesOnHover(styles) {
        if (styles)
            this.onBuilt = () => this.iconElement.stylesOnHover = styles;
    }

    /** Private method to set the icon styles on active
     * @param {string} styles - Icon styles on active
     */
    #setIconStylesOnActive(styles) {
        if (styles)
            this.onBuilt = () => this.iconElement.stylesOnActive = styles;
    }

    /** Private method to set the children gap
     * @param {string} gap - Children gap
     */
    #setChildrenGap(gap) {
        if (gap)
            this.onBuilt = () => this._setElementCSSVariable(SIRIUS_TREE_VIEW.CSS_VARIABLES.CHILDREN_GAP, gap);
    }

    /** Private method to set the children margin left
     * @param {string} marginLeft - Children margin left
     */
    #setChildrenMarginLeft(marginLeft) {
        if (marginLeft)
            this.onBuilt = () => this._setElementCSSVariable(SIRIUS_TREE_VIEW.CSS_VARIABLES.CHILDREN_MARGIN_LEFT, marginLeft);
    }

    /** Private method to set the gap
     * @param {string} gap - Gap
     */
    #setGap(gap) {
        if (gap)
            this.onBuilt = () => this._setElementCSSVariable(SIRIUS_TREE_VIEW.CSS_VARIABLES.GAP, gap);
    }

    /** Private method to set the show animation
     * @param {string} rules - Show animation rules
     */
    #setShowAnimation(rules) {
        if (rules)
            this.onBuilt = () => this._setElementKeyframeRules(
                SIRIUS_TREE_VIEW.CSS_VARIABLES.ANIMATION_DURATION, rules);
    }

    /** Private method to set the hiding animation
     * @param {string} rules - Hiding animation rules
     */
    #setHidingAnimation(rules) {
        if (rules)
            this.onBuilt = () => this._setElementKeyframeRules(SIRIUS_TREE_VIEW.CSS_VARIABLES.ANIMATION_DURATION, rules);
    }

    /** Toggle mode */
    toggleMode() {
        if (this.mode === SIRIUS_TREE_VIEW_MODES.OPEN)
            this.mode = SIRIUS_TREE_VIEW_MODES.CLOSE;
        else
            this.mode = SIRIUS_TREE_VIEW_MODES.OPEN;
    }

    /** Add linked child element
     * @param {SiriusControlElement} element - Linked child element
     */
    _addLinkedChild(element) {
        super._addLinkedChild(element);

        // Add the has parent class
        if (element instanceof SiriusTreeView)
            element.classList.add(SIRIUS_TREE_VIEW.CLASSES.HAS_PARENT);
    }

    /** Remove linked child element
     * @param {SiriusControlElement} element - Linked child element
     */
    _removeLinkedChild(element) {
        super._removeLinkedChild(element);

        // Remove the has parent class
        element.classList.remove(SIRIUS_TREE_VIEW.CLASSES.HAS_PARENT);
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

            case SIRIUS_ELEMENT_ATTRIBUTES.TRANSITION_DURATION:
                this._setTransitionDuration(newValue);
                break;

            case SIRIUS_ELEMENT_ATTRIBUTES.STYLES:
                this._setStyles(newValue);
                break;

            case SIRIUS_ELEMENT_ATTRIBUTES.STYLES_ON_HOVER:
                this._setStylesOnHover(newValue);
                break;

            case SIRIUS_ELEMENT_ATTRIBUTES.STYLES_ON_ACTIVE:
                this._setStylesOnActive(newValue);
                break;

            case SIRIUS_CONTROL_ELEMENT_ATTRIBUTES.STATUS:
                this._setStatus(newValue);
                break;

            case SIRIUS_CONTROL_ELEMENT_ATTRIBUTES.PARENT_ID:
                this.#setParentId(newValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.MODE:
                this.#setMode(newValue);
                break

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

            case SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_STYLES:
                this.#setIconStyles(newValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_STYLES_ON_HOVER:
                this.#setIconStylesOnHover(newValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.ICON_STYLES_ON_CLICK:
                this.#setIconStylesOnActive(newValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.CHILDREN_GAP:
                this.#setChildrenGap(newValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.CHILDREN_MARGIN_LEFT:
                this.#setChildrenMarginLeft(newValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.SHOW_ANIMATION:
                this.#setShowAnimation(newValue);
                break;

            case SIRIUS_TREE_VIEW_ATTRIBUTES.HIDING_ANIMATION:
                this.#setHidingAnimation(newValue);
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
        this.onBuilt = () => this.#attributeChangeHandler(name, oldValue, formattedValue);
    }
}

// Register custom element
customElements.define(SIRIUS_TREE_VIEW.TAG, SiriusTreeView);


