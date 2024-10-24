export const AtomRadio = class extends Atom {
    constructor(props) {
        super();
        this.name = "AtomRadio";
        this.props = props;
        this.built = () => {
        };
        this.attachShadow({mode: 'open'});
        this._caption = "";
    }

    get caption() {
        return this._caption
    }

    set caption(val) {
        this._caption = val;
        this.captionPanel.innerText = val;
    }

    get checked() {
        return this._checked
    }

    set checked(val) {
        this.#selectRadio(val)
    }

    #getTemplate() {
        return `
        <div class="AtomRadioPanel">
            <div class = "AtomExtRadio">
                <div class = "AtomIntRadio"></div>
            </div>
            <div class="AtomRadioCaption"></div>
        </div>
        `
    }

    async #getCss() {
        return await atom.getCssFile("AtomRadio");
    }

    #render() {
        return new Promise(async (resolve, reject) => {
            try {
                this.template = document.createElement('template');
                this.template.innerHTML = this.#getTemplate();
                let sheet = new CSSStyleSheet();
                sheet.replaceSync(await this.#getCss());
                this.shadowRoot.adoptedStyleSheets = [sheet];
                let tpc = this.template.content.cloneNode(true);
                this.mainElement = tpc.firstChild.nextSibling;
                this.extRadio = this.mainElement.firstChild.nextSibling;
                this.intRadio = this.extRadio.firstChild.nextSibling;
                this.captionPanel = this.mainElement.firstChild.nextSibling.nextSibling.nextSibling;
                this.shadowRoot.appendChild(this.mainElement);
                this.mainElement.id = this.id;
                this.mainElement.pointerEvents = 'none';
                resolve(true);
            } catch (e) {
                reject(false);
            }
        })
    }

    #events() {
        this.mainElement.addEventListener('click', (e) => {
            e.preventDefault();
            this.#selectRadio(true);
        }, false);
    }

    #checkAttributes() {
        return new Promise((resolve, rejct) => {
            try {
                for (let attr of this.getAttributeNames()) {
                    if (attr.substring(0, 2) != "on") {
                        this.mainElement.setAttribute(attr, this.getAttribute(attr));
                        this[attr] = this.getAttribute(attr);
                    }
                    switch (attr) {
                        case 'id' :
                            atom.createInstance('AtomRadio', {'id': this[attr]});
                            break;
                    }
                }
                if (this.props === undefined) {
                    this.mainElement.style.width = parseInt(window.getComputedStyle(this.mainElement).width, 10);
                    this.mainElement.style.height = parseInt(window.getComputedStyle(this.mainElement).height, 10);
                    this.setPosition(px, py);
                }
                resolve(true);
            } catch (e) {
                reject(false);
            }
        })
    }

    #checkProps() {
        return new Promise((resolve, reject) => {
            try {
                if (this.props) {
                    for (let attr in this.props) {
                        switch (attr) {
                            case 'style' :
                                for (let attrcss in this.props.style) {
                                    switch (attrcss) {
                                        case "width" :
                                            this.mainElement.style.width = this.props.style[attrcss];
                                            break;
                                        case "height" :
                                            this.mainElement.style.height = this.props.style[attrcss];
                                            break;
                                    }
                                    this.mainElement.style[attrcss] = this.props.style[attrcss];
                                }
                                break;
                            case 'events' :
                                for (let attrevent in this.props.events) {
                                    this.mainElement.addEventListener(attrevent, this.props.events[attrevent])
                                }
                                break;
                            case 'group' :
                                this.setAttribute(attr, this.props[attr]);
                                this[attr] = this.props[attr];
                                if (atom.radioGroup[this.props.group] === undefined || atom.radioGroup[this.props.group] === null) {
                                    atom.radioGroup[this.props.group] = [];
                                    atom.radioGroup[this.props.group].push(this);
                                } else {
                                    atom.radioGroup[this.props.group].push(this);
                                }
                                break;
                            default :
                                this.setAttribute(attr, this.props[attr]);
                                this[attr] = this.props[attr];
                                if (attr === 'id') atom.createInstance('AtomDialog', {'id': this[attr]});
                        }
                    }
                }
                ;
                resolve(true);
            } catch (e) {
                reject(false);
            }
        })
    }

    #selectRadio(val) {
        if (val) {
            this.captionPanel.className = "AtomRadioCaptionSelected";
            this.intRadio.className = "AtomIntRadioSelected";
        } else {
            this.captionPanel.className = "AtomRadioCaption";
            this.intRadio.className = "AtomIntRadio";
        }
        this._checked = val;
        for (let attr in atom.radioGroup) {
            for (let attr2 in atom.radioGroup[attr]) {
                if (atom.radioGroup[attr][attr2] !== this) {
                    atom.radioGroup[attr][attr2].captionPanel.className = "AtomRadioCaption";
                    atom.radioGroup[attr][attr2].intRadio.className = "AtomIntRadio";
                    atom.radioGroup[attr][attr2]._checked = false;
                }
            }
        }
    }

    async connectedCallback() {
        await this.#render();
        await this.#checkAttributes();
        await this.#checkProps();
        this.#events();
        this.built(this);
    }

    addToBody() {
        document.body.appendChild(this);
    }
}

if (!customElements.get('atom-radio')) {
    customElements.define('atom-radio', AtomRadio);
}