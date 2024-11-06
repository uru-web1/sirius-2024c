import {SIRIUS_ELEMENT_ATTRIBUTES, SIRIUS_ELEMENT_REQUIRED_ATTRIBUTES, SiriusElement} from "./SiriusElement.js";
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
        // Obtener todos los elementos hijos del `tree-item`
        const childNodes = Array.from(treeItem.childNodes);
    
        // Crear un array para los elementos procesados
        const processedNodes = childNodes.map(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName.toLowerCase() === 'tree-item') {
                    // Si el nodo es un `tree-item`, creamos un `<details>` y `<summary>`
                    const label = node.getAttribute('label') || 'Item';
                    return `<li>    
                                <details>
                                    <summary>${label}</summary>
                                    ${this.#wrapNonListElements(node)} <!-- Llamada recursiva para procesar elementos internos -->
                                </details>
                            </li>`;
                } else if (node.tagName.toLowerCase() !== 'ul' && node.tagName.toLowerCase() !== 'li') {
                    // Envolver otros elementos que no sean `ul` o `li` en `<li>`
                    return `<li>${node.outerHTML}</li>`;
                } else {
                    // Dejar `ul` y `li` tal como están
                    return node.outerHTML;
                }
            } else {
                // Dejar nodos de texto o comentarios tal como están
                return node.textContent;
            }
        });
    
        // Envolver todos los elementos no listados en un solo `<ul>` si hay elementos que procesar
        return `<ul>${processedNodes.join('')}</ul>`;
    }
    
    

    #createTreeItems() {
        // Obtiene los elementos hijos y busca etiquetas `tree-item`
        const childElements = this.getElementsInside();
        const treeItems = childElements.filter(child => child.tagName.toLowerCase() === 'tree-item');
        
        // Generar el HTML de cada `tree-item` dentro de un `<li>` con clase `parent`
        const childrenHTML = treeItems.map(treeItem => {
            const wrappedContent = this.#wrapNonListElements(treeItem);
            return `<li class="${SIRIUS_TREEVIEW.CLASSES.PARENT_CONTAINER}">
                        <details>
                            <summary>${treeItem.getAttribute('label') || 'Item'}</summary>
                            ${wrappedContent}
                        </details>
                    </li>`;
        }).join('');

        return childrenHTML;
    }

    #getTemplate() {
        // Llama a #createTreeItems para obtener los elementos `li` con sus contenidos
        const childrenHTML = this.#createTreeItems();

        // Envolver los elementos `li` generados dentro de un `<ul>` con clase `TREE_CONTAINER`
        return `<ul class="${SIRIUS_TREEVIEW.CLASSES.TREE_CONTAINER}">
                    ${childrenHTML}
                </ul>`;
    }

    getElementsInside() {
        // Obtener los elementos del componente (p. ej., los hijos que fueron insertados)
        return Array.from(this.children); // Usamos children para obtener los elementos directos del nodo
    }

    async connectedCallback() {
        await super.connectedCallback();

        // Crear el shadow DOM solo si no existe
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }

        // Cargar los estilos y agregar contenido al shadow DOM
        await this._loadAndAdoptStyles();
        const innerHTML = this.#getTemplate();
        this.shadowRoot.innerHTML = innerHTML; // Insertamos el template generado con los hijos

        // Disparar el evento de construcción
        this.dispatchBuiltEvent();
    }
}

// Registrar el componente
customElements.define(SIRIUS_TREEVIEW.TAG, SiriusTreeView);
