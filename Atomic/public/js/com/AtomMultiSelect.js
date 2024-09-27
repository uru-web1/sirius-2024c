// File: AtomMultiSelect.js

import { Atom } from "../com/Atom.js";

export const AtomMultiSelect = class extends Atom {
  static observedAttributes = ["caption", "options"];

  constructor(props = {}) {
    super(props);
    this.name = "AtomMultiSelect";
    this.props = {
      caption: props.caption || 'Select an option',
      options: props.options || [],
      searcherPlaceHolder: props.searcherPlaceHolder || 'Search...'
    };
    this.built = () => {};
    this.attachShadow({ mode: 'open' });
    this.selectedOptions = [];
    this.panelExpanded = false;
  }

  #getTemplate() {
    return `
      <div class="multi-select">
        <div class="selected-container">
          <span class="caption">${this.props.caption}</span>
          <input type="text" class="multi-select-search" placeholder="${this.props.searcherPlaceHolder}" readonly>
          <button class="toggle-btn">▼</button>
        </div>
        <div class="options-container">
          ${this.props.options.map(option => `
            <div class="option">
              <input type="checkbox" id="${option.value}" value="${option.value}">
              <label for="${option.value}">${option.caption}</label>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  #getCss() {
    return `
      .multi-select {
        position: relative;
        background-color: var(--surfaceColor);
        margin-bottom: 30px;
        border: 1px solid var(--dividerColor);
        border-radius: 4px;
        width: 250px;
        font-family: Arial, sans-serif;
      }
      .selected-container {
        display: flex;
        align-items: center;
        padding: 8px;
        box-sizing: border-box;
        cursor: pointer;
      }
      .caption {
        flex: 1;
        font-size: 14px;
        color: #333;
      }
      .multi-select-search {
        border: none;
        outline: none;
        flex: 1;
        padding: 8px;
        box-sizing: border-box;
        font-size: 14px;
        color: #666;
        background: transparent;
      }
      .toggle-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
        color: #333;
      }
      .options-container {
        position: absolute;
        width: 100%;
        max-height: 300px;
        overflow: auto;
        background-color: inherit;
        z-index: 10;
        box-shadow: var(--z8);
        display: none;
        flex-direction: column;
        border-top: 1px solid var(--dividerColor);
      }
      .option {
        padding: 12px 16px;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #333;
      }
      .option.matched {
        background-color: var(--primaryLightColor);
      }
    `;
  }

  async connectedCallback() {
    let sheet = new CSSStyleSheet();
    sheet.replaceSync(this.#getCss());
    this.shadowRoot.adoptedStyleSheets = [sheet];
    this.template = document.createElement('template');
    this.template.innerHTML = this.#getTemplate();
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));

    this.searchInput = this.shadowRoot.querySelector('.multi-select-search');
    this.optionsContainer = this.shadowRoot.querySelector('.options-container');
    this.toggleBtn = this.shadowRoot.querySelector('.toggle-btn');
    this.selectedContainer = this.shadowRoot.querySelector('.selected-container');

    this.searchInput.addEventListener('keyup', this.handleSearch.bind(this));
    this.optionsContainer.addEventListener('change', this.handleSelection.bind(this));
    this.selectedContainer.addEventListener('click', this.toggleOptions.bind(this));
    this.built();
  }

  toggleOptions() {
    this.panelExpanded = !this.panelExpanded;
    this.optionsContainer.style.display = this.panelExpanded ? 'block' : 'none';
  }

  handleSearch(event) {
    const query = event.target.value.toLowerCase();
    const options = this.shadowRoot.querySelectorAll('.option');
    options.forEach(option => {
      const label = option.querySelector('label').innerText.toLowerCase();
      if (label.includes(query)) {
        option.classList.add('matched');
        option.style.display = 'flex';
      } else {
        option.classList.remove('matched');
        option.style.display = 'none';
      }
    });
  }

  handleSelection(event) {
    const checkbox = event.target;
    const value = checkbox.value;
    if (checkbox.checked) {
      this.selectedOptions.push(value);
    } else {
      this.selectedOptions = this.selectedOptions.filter(opt => opt !== value);
    }
    this.updateCaption();
  }

  updateCaption() {
    const selectedLabels = this.selectedOptions.map(val => {
      return this.shadowRoot.querySelector(`label[for="${val}"]`).innerText;
    });
    this.searchInput.value = selectedLabels.join(', ');
  }

  addToBody() {
    document.body.appendChild(this);
  }

  get caption() {
    return this.shadowRoot.querySelector('.multi-select-search').value;
  }

  set caption(val) {
    this.setAttribute('caption', val);
    this.shadowRoot.querySelector('.multi-select-search').value = val;
  }

  get options() {
    return this.props.options;
  }

  set options(val) {
    this.setAttribute('options', val);
    this.props.options = val;
    this.shadowRoot.querySelector('.options-container').innerHTML = this.#getTemplate().innerHTML;
  }
};

customElements.define('atom-multi-select', AtomMultiSelect);
