import {Atom} from "../com/Atom.js";

export const AtomBadge = class extends Atom {
    static observedAttributes = ["caption"];

    constructor(props) {
        super();
        this.name = "AtomBadge";
        this.props = props;
        this.built = () => {
        };
        this.attachShadow({mode: 'open'});
    }

    set shape(val) {
        switch (val) {
            case "triangle": {
                this.mainElement.className = "triangle";
                break;
            }
                ;
            case "circle": {
                this.mainElement.className = "circle";
                break;
            }
                ;
            default : {
                this.mainElement.className = "square";
                break;
            }
        }
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

    #getTemplate() {
        return `
            <div class="square"></div>
        `
    }

    async #getCss() {
        return await atom.getCssFile("../js/css/", "AtomBadge");
    }

    async connectedCallback() {
        let sheet = new CSSStyleSheet();
        sheet.replaceSync(await this.#getCss());
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
                    atom.createInstance('AtomBadge', {'id': this[attr]});
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
                        if (attr === 'id') atom.createInstance('AtomBadge', {'id': this[attr]});
                }
            }
        }
        this.built();
    }

    addToBody() {
        document.body.appendChild(this);
    }
}

if (!customElements.get('atom-badge')) {
    customElements.define('atom-badge', AtomBadge);
}