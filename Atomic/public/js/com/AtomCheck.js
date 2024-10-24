export const AtomCheck = class extends Atom {
    static observedAttributes = ["caption"];

    constructor(props) {
        super();
        this.name = "AtomCheck";
        this.props = props;
        this.built = () => {
        };
        this.attachShadow({mode: 'open'});
    }

    get caption() {
        return this.mainElement.innerText
    }

    set caption(val) {
        this.setAttribute('caption', val);
        this.labelElement.innerText = val;
        this.dispatchEvent(new CustomEvent("changeCaption", {bubbles: true}));
    }

    get checked() {
        return this.checkElement.checked
    }

    set checked(val) {
        this.checkElement.checked = val
    }

    get disabled() {
        return this.checkElement.disabled
    }

    set disabled(val) {
        this.setAttribute('disabled', val);
        this.checkElement.disabled = val;
    }

    #getTemplate() {
        return `
        <label class="AtomCheck">
            <input type="checkbox">
            <span class="checkmark"></span>
            <label class="caption"></label>
        </label>
        `
    }

    async #getCss() {
        return await atom.getCssFile("AtomCheck");
    }

    async connectedCallback() {
        let sheet = new CSSStyleSheet();
        sheet.replaceSync(await this.#getCss());
        this.shadowRoot.adoptedStyleSheets = [sheet];
        this.template = document.createElement('template');
        this.template.innerHTML = this.#getTemplate();
        let tpc = this.template.content.cloneNode(true);
        this.mainElement = tpc.firstChild.nextSibling;
        this.checkElement = this.mainElement.firstChild.nextSibling;
        this.labelElement = this.mainElement.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
        this.shadowRoot.appendChild(this.mainElement);
        for (let attr of this.getAttributeNames()) {
            if (attr.substring(0, 2) != "on") {
                this.setAttribute(attr, this.getAttribute(attr));
                this[attr] = this.getAttribute(attr);
            }
            switch (attr) {
                case 'id' :
                    atom.createInstance('AtomCheck', {'id': this[attr]});
                    this.mainElement.id = this[attr];
                    break;
            }
        }
        if (this.props) {
            for (let attr in this.props) {
                switch (attr) {
                    case 'style' :
                        for (let attrcss in this.props.style) this.mainElement.style[attrcss] = this.props.style[attrcss];
                        break;
                    case 'events' :
                        for (let attrevent in this.props.events) {
                            this.mainElement.addEventListener(attrevent, this.props.events[attrevent], false)
                        }
                        break;
                    default :
                        this.setAttribute(attr, this.props[attr]);
                        this[attr] = this.props[attr];
                        if (attr === 'id') {
                            atom.createInstance('AtomCheck', {'id': this[attr]});
                            this.mainElement.id = this[attr];
                        }
                }
            }
        }
        this.builtEvents(),
            this.built();
    }

    builtEvents() {
        this.checkElement.addEventListener('keyup', (ev) => {
            ev.preventDefault();
            if (ev.key === 'Enter') {
                if (this.checked) this.checked = false; else this.checked = true;
                this.dispatchEvent(new CustomEvent("enter", {bubbles: true}));
            }
            ;
        }, false);
    }

    addToBody() {
        document.body.appendChild(this);
    }
}

if (!customElements.get('atom-check')) {
    customElements.define('atom-check', AtomCheck);
}