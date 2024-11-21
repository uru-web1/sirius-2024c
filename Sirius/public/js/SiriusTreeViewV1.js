import SiriusElement from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

// Define constants for the SiriusTreeViewV1 component
export const SIRIUS_TREEVIEW = deepFreeze({
    NAME: "SiriusTreeViewV1",
    TAG: "sirius-treeview",
    CLASSES: {
        TREE_CONTAINER: 'tree', // Class for the tree container
        PARENT_CONTAINER: 'parent', // Class for the parent container
    }
});

// Define the SiriusTreeView class
export default class SiriusTreeView extends SiriusElement {
    constructor(properties) {
        super(properties, SIRIUS_TREEVIEW.NAME);

        // Build the SiriusTreeView
        this.#build().then();
    }

     // Built the SiriusTreeView
    async #build() {
        await this._loadAndAdoptStyles(); // Load and adopt styles

        // Render using elements instead of innerHTML
        const treeTemplate = this.#getTemplate();  // This is now a <ul> element, not an HTML string
        this.shadowRoot.appendChild(treeTemplate);  // Add the complete <ul> to the Shadow DOM

        this.dispatchBuiltEvent(); // Dispatch a built event
    }

    // Wrap non-list elements inside <li> elements and create a nested <ul> structure for <tree-item> elements
    #wrapNonListElements(treeItem) {
        const childNodes = Array.from(treeItem.childNodes); // Get all child nodes of the tree item
        const ulElement = document.createElement('ul'); // Create a <ul> element

        childNodes.forEach(node => {
            let liElement;

            if (node.nodeType === Node.ELEMENT_NODE) { // Check if the node is an element
                if (node.tagName.toLowerCase() === 'tree-item') { // Check if the element is a <tree-item>
                    liElement = document.createElement('li'); // Create a <li> element

                    const details = document.createElement('details'); // Create a <details> element
                    const summary = document.createElement('summary'); // Create a <summary> element
                    summary.textContent = node.getAttribute('summary-content') || 'Item'; // Set the summary content

                    details.appendChild(summary); // Append the summary to the details
                    details.appendChild(this.#wrapNonListElements(node));  // Recursive call to wrap child elements
                    liElement.appendChild(details); // Append the details to the <li> element
                } else if (node.tagName.toLowerCase() !== 'ul' && node.tagName.toLowerCase() !== 'li') { // Check if the element is not a <ul> or <li>
                    liElement = document.createElement('li'); // Create a <li> element
                    liElement.appendChild(node); // Append the node to the <li> element
                }
            } else {
                liElement = document.createTextNode(node.textContent); // Create a text node for non-element nodes
            }

            if (liElement) {
                ulElement.appendChild(liElement); // Append the <li> element to the <ul> element
            }
        });

        return ulElement;  // Return the <ul> with wrapped elements
    }


    // Create tree items from the child elements
    #createTreeItems() {
        const childElements = this.getElementsInside(); // Get all child elements
        const treeItems = childElements.filter(child => child.tagName.toLowerCase() === 'tree-item'); // Filter for <tree-item> elements

        const fragment = document.createDocumentFragment(); // Create a document fragment

        treeItems.forEach(treeItem => {
            const wrappedContent = this.#wrapNonListElements(treeItem); // Wrap the content of the tree item
            const summaryContent = treeItem.getAttribute('summary-content') || this.properties.summary_content || 'Item'; // Get the summary content

            const li = document.createElement('li'); // Create a <li> element
            li.classList.add(SIRIUS_TREEVIEW.CLASSES.PARENT_CONTAINER); // Add the parent container class

            const details = document.createElement('details'); // Create a <details> element
            const summary = document.createElement('summary'); // Create a <summary> element
            summary.textContent = summaryContent; // Set the summary content

            details.appendChild(summary); // Append the summary to the details
            details.appendChild(wrappedContent); // Append the wrapped content to the details

            li.appendChild(details); // Append the details to the <li> element
            fragment.appendChild(li);  // Add the <li> directly to the fragment
        });

        return fragment;  // Return a document fragment instead of plain HTML
    }


    // Get the template for the tree view
    #getTemplate() {
        const ul = document.createElement('ul'); // Create a <ul> element
        ul.classList.add(SIRIUS_TREEVIEW.CLASSES.TREE_CONTAINER); // Add the tree container class

        ul.appendChild(this.#createTreeItems());  // Add the fragment directly to the <ul>
        return ul;  // Return the <ul> element directly
    }


    // Get all elements inside the tree view
    getElementsInside() {
        return Array.from(this.children);
    }
}

// Define the custom element
customElements.define(SIRIUS_TREEVIEW.TAG, SiriusTreeView);