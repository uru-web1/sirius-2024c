export const AtomToggle = class extends Atom {
    constructor(props) {
        super(props);
        this.name = "AtomToggle";
        this.props = props;
        this.built = () => {};
        this.attachShadow({ mode: 'open' });
        this.active = false; 
    }

    #getTemplate() {
        return `
            <div class='container'>
                <div class='switch'></div>
            </div>
        `;
    }

    #getCss() {
        return `
            :host{
                --container-color-inactive: #D5D5D5;
                --container-color-active: green;
                --circle-color-active: white;
                --circle-color-inactive: white;
            }

            .container {
                height: 40px;
                width: 80px;
                display: flex;
                border-radius: 20px;
                cursor: pointer;
                transition: background-color 0.2s;
                background-color: var(--container-color-inactive);
            }

            .switch {
                height: 30px;
                width: 30px;
                margin: 5px;
                background-color: white;
                border-radius: 15px;
                transition: margin-left 0.2s;
            }

            .active .switch {
                margin-left: 45px;
                background-color: var(--circle-color-active);
            }

            .active {
                background-color: var(--container-color-active);
            }

            .disabled {
                cursor: not-allowed;
                opacity: 0.6;
            }
        `;
    }

    async connectedCallback() {
        let sheet = new CSSStyleSheet();
        sheet.replaceSync(this.#getCss());
        this.shadowRoot.adoptedStyleSheets = [sheet];

        this.template = document.createElement('template');
        this.template.innerHTML = this.#getTemplate();
        let tpc = this.template.content.cloneNode(true);

        this.mainElement = tpc.querySelector('.container');
        this.switchElement = this.mainElement.querySelector('.switch');

        this.shadowRoot.appendChild(this.mainElement);

        if (this.props) {
            for (let attr in this.props) {
                switch (attr) {
                    case 'style':
                        for (let attrcss in this.props.style) this.mainElement.style.setProperty(attrcss, this.props.style[attrcss]);
                        break;
                    case 'events':
                        for (let attrevent in this.props.events) {
                            this.mainElement.addEventListener(attrevent, this.props.events[attrevent]);
                        }
                        break;
                    default:
                        this.setAttribute(attr, this.props[attr]);
                        this[attr] = this.props[attr];
                }
            }
        }

        if (this.hasAttribute('active')) {
            this.active = this.getAttribute('active') === 'true';
            this.updateVisualState();
        }

        if (this.hasAttribute('disabled')) {
            this.setDisabled(this.getAttribute('disabled') === 'true');
        }

        this.mainElement.addEventListener('click', this.toggle.bind(this));

        this.built();
    }

    toggle() {
        if (this.mainElement.classList.contains('disabled')) return;
        this.active = !this.active;
        this.updateVisualState();
        this.dispatchEvent(new CustomEvent('toggle', { detail: { active: this.active } }));
    }

    updateVisualState() {
        if (this.active) {
            this.mainElement.classList.add('active');
        } else {
            this.mainElement.classList.remove('active');
        }
    }

    setDisabled(isDisabled) {
        if (isDisabled) {
            this.mainElement.classList.add('disabled');
            this.mainElement.removeAttribute('tabindex');
        } else {
            this.mainElement.classList.remove('disabled');
            this.mainElement.setAttribute('tabindex', '0');
        }
    }

    addToBody() {
        document.body.appendChild(this);
    }
}

customElements.define('atom-toggle', AtomToggle);
