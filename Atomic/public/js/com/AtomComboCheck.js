/**
 * Crea una instancia del componente flex.ComboCheck de Flexivity.
 *
 * @class AtomComboCheck
 * @extends Atom
 * @param {object} options - Objeto de propiedades.
 */
export const AtomComboCheck = class extends Atom {
    constructor(props) {
        super();
        this.name = "AtomComboCheck";
        this.props = props;
        this.built = () => {
        };
        this.attachShadow({mode: 'open'});
        this.isShow = false;
        this.options = [];
    }

    #getTemplate() {
        return `
        <div class='AtomComboCheck'>
            <div class = 'AtomComboCheckInputContainer'>
                <input class = 'AtomComboCheckInput'>
                <div class = 'AtomComboCheckButtonDown'></div>
            </div>
            <div class = 'AtomComboCheckPanel'></div>
        </div>
        `
    }

    async #getCss() {
        return await atom.getCssFile("AtomComboCheck");
    }

    #checkAttributes() {
        return new Promise((resolve, reject) => {
            try {
                for (let attr of this.getAttributeNames()) {
                    if (attr.substring(0, 2) != "on") {
                        this.mainElement.setAttribute(attr, this.getAttribute(attr));
                        this[attr] = this.getAttribute(attr);
                    }
                    switch (attr) {
                        case 'id' :
                            atom.createInstance('AtomDialog', {'id': this[attr]});
                            break;
                    }
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

    #render(css) {
        return new Promise((resolve, reject) => {
            try {
                this.template = document.createElement('template');
                this.template.innerHTML = this.#getTemplate();
                let sheet = new CSSStyleSheet();
                sheet.replaceSync(css);
                this.shadowRoot.adoptedStyleSheets = [sheet];
                let tpc = this.template.content.cloneNode(true);
                this.mainElement = tpc.firstChild.nextSibling;

                this.buttonComboCheck = this.mainElement.firstChild.nextSibling.firstChild.nextSibling.nextSibling.nextSibling;
                console.log(this.buttonComboCheck);
                this.shadowRoot.appendChild(this.mainElement);
                this.mainElement.id = this.id;
                this.mainElement.pointerEvents = 'none';
                resolve(true);
            } catch (e) {
                reject(false);
            }
        })
    }

    addOption(option) {
        this.options.push(option);
        return this;
    }


    showOptions() {
        console.log(this.options);

    }

    hideOptions() {

    };

    #events() {
        this.buttonComboCheck.addEventListener('click', () => {
            if (!this.isShow) {
                this.buttonComboCheck.style.animationName = "animationUp";
                this.showOptions();
                this.isShow = true;
            } else {
                this.buttonComboCheck.style.animationName = "animationDown";
                this.isShow = false;
            }
        })
    }

    async connectedCallback() {
        await this.#render(await this.#getCss());
        await this.#checkAttributes();
        await this.#checkProps();
        this.#events();
        this.built(this);
    }

    addToBody() {
        document.body.appendChild(this);
    }
}

if (!customElements.get('atom-combocheck')) {
    customElements.define('atom-combocheck', AtomComboCheck);
}