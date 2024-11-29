import { SiriusElement } from "./SiriusElement.js";
import deepFreeze from "./utils/deep-freeze.js";

export const SIRIUS_DATA_GRID = deepFreeze({
    NAME: "SiriusDataGrid",
    TAG: "sirius-data-grid",
    ATTRIBUTES: {
        COLUMNS: { NAME: "columns", TYPE: "array", DEFAULT: [] },
        DATA: { NAME: "data", TYPE: "array", DEFAULT: [] },
        ROWS_PER_PAGE: { NAME: "rows-per-page", TYPE: "number", DEFAULT: 5 }
    },
    CLASSES: {
        CONTAINER: "data-grid-container",
        TOOLBAR: "toolbar",
        TABLE: "data-grid",
        HEADER: "data-grid-header",
        BODY: "data-grid-body",
        PAGINATION: "pagination",
        BUTTON: "button",
        ROW: "data-row",
        CELL: "data-cell",
        CHECKBOX: "row-checkbox",
        EDITABLE_CELL: "editable-cell",
        SELECT_ALL: "select-all-checkbox"
    }
});

export class SiriusDataGrid extends SiriusElement {
    constructor(props = {}) {
        if (!props.id) {
            props.id = `sirius-data-grid-${Math.random().toString(36).substr(2, 9)}`;
        }
        super(props, SIRIUS_DATA_GRID.NAME);

        this.columns = this.#parseColumns(props.columns || this.getAttribute('columns'));
        this.data = this.#parseData(props.data || this.getAttribute('data'));
        this.rowsPerPage = props["rows-per-page"] || SIRIUS_DATA_GRID.ATTRIBUTES.ROWS_PER_PAGE.DEFAULT;
        this.currentPage = 1;
    }

    async connectedCallback() {
        await this._loadElementStyles();
        this.render();
    }

    render() {
        const template = this.#getTemplate();
        this.shadowRoot.innerHTML = template;
        this.#initializeElements();
        this.#createHeader();
        this.#createBody();
        this.#updatePagination();
    }

    #getTemplate() {
        return `
            <div class="${SIRIUS_DATA_GRID.CLASSES.CONTAINER}">
                <div class="${SIRIUS_DATA_GRID.CLASSES.TOOLBAR}">
                    <button class="${SIRIUS_DATA_GRID.CLASSES.BUTTON}" id="add-row">+</button>
                    <button class="${SIRIUS_DATA_GRID.CLASSES.BUTTON}" id="delete-rows">🗑️</button>
                </div>
                <table class="${SIRIUS_DATA_GRID.CLASSES.TABLE}">
                    <thead class="${SIRIUS_DATA_GRID.CLASSES.HEADER}"></thead>
                    <tbody class="${SIRIUS_DATA_GRID.CLASSES.BODY}"></tbody>
                </table>
                <div class="${SIRIUS_DATA_GRID.CLASSES.PAGINATION}">
                    <button id="first-page" class="pagination-button">⏮</button>
                    <button id="prev-page" class="pagination-button">◀</button>
                    <span id="page-info"></span>
                    <button id="next-page" class="pagination-button">▶</button>
                    <button id="last-page" class="pagination-button">⏭</button>
                </div>
            </div>`;
    }

    #initializeElements() {
        this.table = this.shadowRoot.querySelector(`.${SIRIUS_DATA_GRID.CLASSES.TABLE}`);
        this.header = this.table.querySelector(`.${SIRIUS_DATA_GRID.CLASSES.HEADER}`);
        this.body = this.table.querySelector(`.${SIRIUS_DATA_GRID.CLASSES.BODY}`);
        this.pagination = this.shadowRoot.querySelector(`.${SIRIUS_DATA_GRID.CLASSES.PAGINATION}`);

        this.shadowRoot.getElementById("add-row").addEventListener("click", () => this.addRow());
        this.shadowRoot.getElementById("delete-rows").addEventListener("click", () => this.deleteSelectedRows());

        this.shadowRoot.getElementById("first-page").addEventListener("click", () => this.#goToFirstPage());
        this.shadowRoot.getElementById("prev-page").addEventListener("click", () => this.#goToPreviousPage());
        this.shadowRoot.getElementById("next-page").addEventListener("click", () => this.#goToNextPage());
        this.shadowRoot.getElementById("last-page").addEventListener("click", () => this.#goToLastPage());
    }

    #createHeader() {
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `<th><input type="checkbox" class="${SIRIUS_DATA_GRID.CLASSES.SELECT_ALL}" id="select-all"></th>`;
        this.columns.forEach(column => {
            const th = document.createElement('th');
            th.innerText = column.label;
            headerRow.appendChild(th);
        });
        this.header.appendChild(headerRow);

        // Evento para seleccionar/desmarcar todas las filas
        this.shadowRoot.getElementById("select-all").addEventListener("change", (e) => this.#toggleSelectAll(e.target.checked));
    }

    #createBody() {
        this.body.innerHTML = '';
        const startIndex = (this.currentPage - 1) * this.rowsPerPage;
        const endIndex = Math.min(startIndex + this.rowsPerPage, this.data.length);
        const pageData = this.data.slice(startIndex, endIndex);

        pageData.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');
            tr.classList.add(SIRIUS_DATA_GRID.CLASSES.ROW);

            const checkboxCell = document.createElement('td');
            checkboxCell.innerHTML = `<input type="checkbox" class="${SIRIUS_DATA_GRID.CLASSES.CHECKBOX}">`;
            tr.appendChild(checkboxCell);

            this.columns.forEach(column => {
                const td = document.createElement('td');
                td.classList.add(SIRIUS_DATA_GRID.CLASSES.CELL, SIRIUS_DATA_GRID.CLASSES.EDITABLE_CELL);
                td.contentEditable = true;
                td.innerText = row[column.field];
                td.addEventListener('blur', (e) => {
                    this.data[startIndex + rowIndex][column.field] = e.target.innerText;
                });
                tr.appendChild(td);
            });

            this.body.appendChild(tr);
        });
    }

    #toggleSelectAll(isChecked) {
        const checkboxes = this.body.querySelectorAll(`.${SIRIUS_DATA_GRID.CLASSES.CHECKBOX}`);
        checkboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    }

    deleteSelectedRows() {
        const checkboxes = this.body.querySelectorAll(`.${SIRIUS_DATA_GRID.CLASSES.CHECKBOX}`);
        const rowsToDelete = [];
        checkboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                rowsToDelete.push(index);
            }
        });
        rowsToDelete.reverse().forEach(index => {
            this.data.splice(index, 1);
        });
        this.#createBody();
        this.#updatePagination();
    }

    addRow() {
        const newRow = {};
        this.columns.forEach(column => {
            newRow[column.field] = '';
        });
        this.data.push(newRow);
        this.#createBody();
        this.#updatePagination();
    }

    #updatePagination() {
        const totalPages = Math.ceil(this.data.length / this.rowsPerPage);
        const pageInfo = this.shadowRoot.getElementById("page-info");
        pageInfo.innerText = `Page ${this.currentPage} of ${totalPages}`;
    }

    #goToFirstPage() {
        this.currentPage = 1;
        this.#createBody();
        this.#updatePagination();
    }

    #goToPreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.#createBody();
            this.#updatePagination();
        }
    }

    #goToNextPage() {
        const totalPages = Math.ceil(this.data.length / this.rowsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.#createBody();
            this.#updatePagination();
        }
    }

    #goToLastPage() {
        this.currentPage = Math.ceil(this.data.length / this.rowsPerPage);
        this.#createBody();
        this.#updatePagination();
    }

    #parseColumns(columns) {
        return typeof columns === 'string' ? JSON.parse(columns) : columns;
    }

    #parseData(data) {
        return typeof data === 'string' ? JSON.parse(data) : data;
    }
}

customElements.define(SIRIUS_DATA_GRID.TAG, SiriusDataGrid);
