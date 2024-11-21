export const AtomSwitch = class extends Atom {
    constructor(props) {
        super();
        this.name = "AtomSwitch";
        this.props = props;
        this._sts = false;
        this.built = () => {
        };
        this.attachShadow({mode: 'open'});
    }

    get disabled() {
        return this.mainElement.disabled
    }

    set disabled(val) {
        this.setAttribute('disabled', val);
        this.mainElement.disabled = val;
        if (val) this.mainElement.animate([{opacity: 0.2}], {duration: 500, fill: 'both'});
        else this.mainElement.animate([{opacity: 1}], {duration: 500, fill: 'both'});
    }

    get sts() {
        return this._sts
    }

    set sts(val) {
        this._sts = val;
        this.#fullAnimation();
    }

    #getTemplate() {
        return `
            <div class='AtomSwitch'>
                <div class= 'AtomSwitchButton'><div>
            </div>
        `
    }

    async #getCss() {
        return await atom.getCssFile("AtomSwitch");
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
        this.buttonSwitch = this.mainElement.firstChild.nextSibling;

        this.shadowRoot.appendChild(this.mainElement);
        for (let attr of this.getAttributeNames()) {
            if (attr.substring(0, 2) != "on") {
                this.mainElement.setAttribute(attr, this.getAttribute(attr));
                this[attr] = this.getAttribute(attr);
            } else {
                let f = this[attr];
                this[attr] = () => {
                    if (!this.disabled) f();
                };
            }
            switch (attr) {
                case 'id' :
                    atom.createInstance('AtomSwitch', {'id': this[attr]});
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
                            this.mainElement.addEventListener(attrevent, () => {
                                if (!this.disabled) {
                                    this.props.events[attrevent]
                                }
                            })
                        }
                        break;
                    default :
                        this.setAttribute(attr, this.props[attr]);
                        this[attr] = this.props[attr];
                        if (attr === 'id') atom.createInstance('AtomSwitch', {'id': this[attr]});
                }
            }
        }
        this.#events();
        this.built();
    }

    #events() {
        this.mainElement.addEventListener('pointerup', () => {
            if (!this.disabled) {
                if (this._sts)
                    this.sts = false;
                else
                    this.sts = true;
            }
        }, false)
    }

    #fullAnimation() {
        if (this._sts) {
            this.buttonSwitch.style.animationName = "sw_move_on";
            if (!this.disabled) this.mainElement.animate([{opacity: 1}], {duration: 500, fill: 'both'});
        } else {
            this.buttonSwitch.style.animationName = "sw_move_off";
            if (!this.disabled) this.mainElement.animate([{opacity: 0.6}], {duration: 500, fill: 'both'});
        }
    }

    addToBody() {
        document.body.appendChild(this);
    }
}

if (!customElements.get('atom-switch')) {
    customElements.define('atom-switch', AtomSwitch);
}