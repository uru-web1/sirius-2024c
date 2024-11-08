import { SiriusElement } from "./SiriusElement.js";
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
        const childNodes = Array.from(treeItem.childNodes);

        const processedNodes = childNodes.map(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName.toLowerCase() === 'tree-item') {
                    const summaryContent = node.getAttribute('summary-content') || node.getAttribute('label') || 'Item';
                    const iconPosition = node.getAttribute('icon-position') || 'left';
                    const iconElement = '<sirius-icon></sirius-icon>';
                    return `<li>
                                <details>
                                    <summary>
                                        ${iconPosition === 'left' ? iconElement : ''} ${summaryContent} ${iconPosition === 'right' ? iconElement : ''}
                                    </summary>
                                    ${this.#wrapNonListElements(node)}
                                </details>
                            </li>`;
                } else if (node.tagName.toLowerCase() !== 'ul' && node.tagName.toLowerCase() !== 'li') {
                    return `<li>${node.outerHTML}</li>`;
                } else {
                    return node.outerHTML;
                }
            } else {
                return node.textContent;
            }
        });

        return `<ul>${processedNodes.join('')}</ul>`;
    }

    #createTreeItems() {
        const childElements = this.getElementsInside();
        const treeItems = childElements.filter(child => child.tagName.toLowerCase() === 'tree-item');

        const childrenHTML = treeItems.map(treeItem => {
            const wrappedContent = this.#wrapNonListElements(treeItem);
            const summaryContent = treeItem.getAttribute('summary-content') || this.properties.summary_content || 'Item';
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
        const childrenHTML = this.#createTreeItems();
        return `<ul class="${SIRIUS_TREEVIEW.CLASSES.TREE_CONTAINER}">
                    ${childrenHTML}
                </ul>`;
    }

    getElementsInside() {
        return Array.from(this.children);
    }

    async connectedCallback() {
        await super.connectedCallback();

        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }

        await this._loadAndAdoptStyles();
        const innerHTML = this.#getTemplate();
        this.shadowRoot.innerHTML = innerHTML;

        const slotContent = document.createDocumentFragment();
        Array.from(this.childNodes).forEach(node => slotContent.appendChild(node.cloneNode(true)));

        //this.innerHTML = null;

        this.dispatchBuiltEvent();
    }
}

customElements.define(SIRIUS_TREEVIEW.TAG, SiriusTreeView);
