import {SiriusElement} from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

export const SIRIUS_TREEVIEW = deepFreeze({
    NAME: "SiriusTreeView",
    TAG: "sirius-treeview",
    CLASSES: {
        TREE_CONTAINER: 'tree',
        PARENT_CONTAINER: 'parent',
    }
});

export class SiriusTreeView extends SiriusElement {
    constructor(properties) {
        super(properties, SIRIUS_TREEVIEW.NAME);
    }

    #wrapNonListElements(treeItem) {
        // Get all child elements of the `tree-item`
        const childNodes = Array.from(treeItem.childNodes);
    
        // Create an array for processed elements
        const processedNodes = childNodes.map(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName.toLowerCase() === 'tree-item') {
                    // Get custom summary content or fallback to label
                    const summaryContent = node.getAttribute('summary-content') || node.getAttribute('label') || 'Item';
                    
                    // Wrap tree-item in <details> and <summary> using summaryContent
                    return `<li>    
                                <details>
                                    <summary>${summaryContent}</summary>
                                    ${this.#wrapNonListElements(node)} <!-- Recursive call to process inner elements -->
                                </details>
                            </li>`;
                } else if (node.tagName.toLowerCase() !== 'ul' && node.tagName.toLowerCase() !== 'li') {
                    // Wrap other elements that are not `ul` or `li` in `<li>`
                    return `<li>${node.outerHTML}</li>`;
                } else {
                    return node.outerHTML;
                }
            } else {
                // Leave text or comment nodes as they are
                return node.textContent;
            }
        });
    
        // Wrap all non-listed elements inside a single `<ul>` if there are elements to process
        return `<ul>${processedNodes.join('')}</ul>`;
    }
    
    #createTreeItems() {
        // Get child elements and look for `tree-item` tags
        const childElements = this.getElementsInside();
        const treeItems = childElements.filter(child => child.tagName.toLowerCase() === 'tree-item');
        
        // Generate HTML for each `tree-item` inside an `<li>` with the class `parent`
        const childrenHTML = treeItems.map(treeItem => {
            const wrappedContent = this.#wrapNonListElements(treeItem);
            const summaryContent = treeItem.getAttribute('summary-content') || treeItem.getAttribute('label') || 'Item';
            return `<li class="${SIRIUS_TREEVIEW.CLASSES.PARENT_CONTAINER}">
                        <details>
                            <summary>${summaryContent}</summary>
                            ${wrappedContent}
                        </details>
                    </li>`;
        }).join('');

        return childrenHTML;
    }

    #getTemplate() {
        // Call #createTreeItems to get the `li` elements with their content
        const childrenHTML = this.#createTreeItems();

        // Wrap the generated `li` elements inside a `<ul>` with the class `TREE_CONTAINER`
        return `<ul class="${SIRIUS_TREEVIEW.CLASSES.TREE_CONTAINER}">
                    ${childrenHTML}
                </ul>`;
    }

    getElementsInside() {
        // Get the elements of the component (e.g., the children that were inserted)
        return Array.from(this.children); // Use children to get direct child elements
    }

    async connectedCallback() {
        await super.connectedCallback();

        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }

        // Load styles and add content to the shadow DOM
        await this._loadAndAdoptStyles();
        const innerHTML = this.#getTemplate();
        this.shadowRoot.innerHTML = innerHTML; // Insert the generated template with children

        // Trigger the build event
        this.dispatchBuiltEvent();
    }
}

// Register the component
customElements.define(SIRIUS_TREEVIEW.TAG, SiriusTreeView);

