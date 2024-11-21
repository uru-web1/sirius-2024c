export const AtomSelect = class extends Atom {
    constructor(props) {
        super();
        this._reactive = false;
        this.name = "AtomSelect";
        this.props = props;
        this.built = () => {
        };
        this.attachShadow({mode: 'open'});
        this._reactive = false;
    }

    get options() {
        return this.selectElement.options;
    }

    get caption() {
        return this.labelElement.innerText
    }

    set caption(val) {
        this.setAttribute('caption', val);
        this.labelElement.innerText = val;
    }

    get reactive() {
        return this._reactive
    }

    set reactive(val) {
        this.setAttribute('reactive', val);
        this._reactive = val;
    }

    get disabled() {
        return this.selectElement.disabled
    }

    set disabled(val) {
        this.setAttribute('disabled', val);
        this.selectElement.disabled = val;
    }

    get selectedIndex() {
        return this.selectElement.selectedIndex;
    }

    set selectedIndex(val) {
        this.selectElement.selectedIndex = val;
        if (val >= 0) this.#animationUp(); else this.#animationDown();
    }

    get value() {
        return this.getOption(this.selectElement.selectedIndex).text;
    }

    #getTemplate() {
        return `
            <div class="AtomSelectContainer">
                <select class="AtomSelect"></select>
                <label class="AtomSelectLabel"></label>
            </div>
        `
    }

    async #getCss() {
        return await atom.getCssFile("AtomSelect");
    }

    async connectedCallback() {
        let sheet = new CSSStyleSheet();
        sheet.replaceSync(await this.#getCss());
        this.shadowRoot.adoptedStyleSheets = [sheet];
        this.template = document.createElement('template');
        this.template.innerHTML = this.#getTemplate();
        let tpc = this.template.content.cloneNode(true);
        this.mainElement = tpc.firstChild.nextSibling;
        this.selectElement = this.mainElement.firstChild.nextSibling;
        this.labelElement = this.mainElement.firstChild.nextSibling.nextSibling.nextSibling;
        this.shadowRoot.appendChild(this.mainElement);
        for (let attr of this.getAttributeNames()) {
            if (attr.substring(0, 2) != "on") {
                this[attr] = this.getAttribute(attr);
            } else {
                switch (attr) {
                    case 'onescape' :
                        this.selectElement.addEventListener('escape', () => {
                            eval(this.getAttribute(attr))
                        });
                        break;
                    case 'onenter' :
                        this.selectElement.addEventListener('enter', () => {
                            eval(this.getAttribute(attr))
                        });
                        break;
                }
            }
        }
        if (this.getAttribute('id')) {
            await atom.createInstance('AtomSelect', {'id': this.getAttribute('id')});
            this['id'] = this.getAttribute('id');
        }
        if (this.props) {
            for (let attr in this.props) {
                switch (attr) {
                    case 'style' :
                        for (let attrcss in this.props.style) this.mainElement.style[attrcss] = this.props.style[attrcss];
                        break;
                    case 'events' :
                        for (let attrevent in this.props.events) {
                            this.selectElement.addEventListener(attrevent, this.props.events[attrevent])
                        }
                        break;
                    default :
                        this.setAttribute(attr, this.props[attr]);
                        this[attr] = this.props[attr];
                        if (attr === 'id') await atom.createInstance('AtomSelect', {'id': this[attr]});
                }
            }
        }

        this.builtEvents();
        atom.notifyBuilt(this.id);
        this.built();
    }

    focus() {
        this.selectElement.focus();
        return this;
    }

    addToBody() {
        document.body.appendChild(this);
        return this;
    }

    getSelect() {
        return this.selectElement
    }

    #animationUp() {
        this.labelElement.style.animation = "animationLabelUp .5s both";
        return this;
    }

    #animationDown() {
        this.labelElement.style.animation = "animationLabelDown .5s both";
        return this;
    }

    clean() {
        this.selectedIndex = -1;
        return this;
    }

    getOption(index) {
        return this.selectElement.options[index];
    }

    builtEvents() {
        this.labelElement.addEventListener('click', (ev) => {
            ev.preventDefault();
            this.selectElement.focus();
        }, false);
        this.selectElement.addEventListener('focus', (ev) => {
            ev.preventDefault();
            this.#animationUp();
        }, false);
        this.selectElement.addEventListener('change', (ev) => {
            ev.preventDefault();
            this.#animationUp();
            if (this._reactive) atom.react();
        }, false);
        this.selectElement.addEventListener('keyup', (ev) => {
            ev.preventDefault();
            if (ev.key === 'Enter') {
                this.selectElement.dispatchEvent(new CustomEvent("enter", {bubbles: true}));
            } else if (ev.key === 'Escape') {
                this.selectElement.dispatchEvent(new CustomEvent("escape", {bubbles: true}));
            } else this.#animationUp();
        }, false);
        this.selectElement.addEventListener('blur', (ev) => {
            ev.preventDefault();
            if (this.selectElement.value.trim() === "") this.#animationDown();
        }, false);
    }

    addOption(opt) {
        var option = document.createElement("option");
        option.className = 'AtomOption';
        if (typeof opt === 'string' || typeof opt === 'number') option.text = opt;
        else {
            if (typeof opt === 'object') {
                for (let attr in opt) {
                    option[attr] = opt[attr];
                }
            }
        }
        this.selectElement.appendChild(option);
        this.selectedIndex = -1;
        return this;
    }

    setOption(opt) {
        let option = this.getOption(opt.index);
        if (typeof opt === 'string' || typeof opt === 'number') option.text = opt.text;
        else {
            if (typeof opt === 'object') {
                for (let attr in opt) {
                    if (attr !== 'index') option[attr] = opt[attr];
                }
            }
        }
        return this;
    }
}

if (!customElements.get('atom-select')) {
    customElements.define('atom-select', AtomSelect);
}