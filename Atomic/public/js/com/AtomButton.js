export const AtomButton = class extends Atom {
    static observedAttributes = ["caption"];

    constructor(props) {
        super();
        this.name = "AtomButton";
        this.props = props;
        this.built = () => {
        };
        this.attachShadow({mode: 'open'});
    }

    #getTemplate() {
        return `
            <button class='AtomButton'></button>
        `
    }

    async #getCss() {
        return await atom.getCssFile("AtomButton");
    }

    async connectedCallback() {
        let sheet = new CSSStyleSheet();
        let css = await this.#getCss();
        sheet.replaceSync(css);
        this.shadowRoot.adoptedStyleSheets = [sheet];
        this.template = document.createElement('template');
        this.template.innerHTML = this.#getTemplate();
        let tpc = this.template.content.cloneNode(true);
        this.mainElement = tpc.firstChild.nextSibling;
        this.shadowRoot.appendChild(this.mainElement);
        for (let attr of this.getAttributeNames()) {
            if (attr.substring(0, 2) != "on") {
                this.mainElement.setAttribute(attr, this.getAttribute(attr));
                this[attr] = this.getAttribute(attr);
            }
            switch (attr) {
                case 'id' :
                    atom.createInstance('AtomButton', {'id': this[attr]});
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
                            this.mainElement.addEventListener(attrevent, this.props.events[attrevent])
                        }
                        break;
                    default :
                        this.setAttribute(attr, this.props[attr]);
                        this[attr] = this.props[attr];
                        if (attr === 'id') atom.createInstance('AtomButton', {'id': this[attr]});
                }
            }
        }
        this.built();
    }

    addToBody() {
        document.body.appendChild(this);
    }

    get caption() {
        return this.mainElement.innerText
    }

    set caption(val) {
        this.setAttribute('caption', val);
        this.mainElement.innerText = val;
        this.dispatchEvent(new CustomEvent("changeCaption", {bubbles: true}));
    }

    get disabled() {
        return this.mainElement.disabled
    }

    set disabled(val) {
        this.setAttribute('disabled', val);
        this.mainElement.disabled = val;
    }
}

if (!customElements.get('atom-button')) {
    customElements.define('atom-button', AtomButton);
}