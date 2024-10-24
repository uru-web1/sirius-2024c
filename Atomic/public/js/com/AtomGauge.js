export const AtomGauge = class extends Atom {
    constructor(props) {
        super(props);
        this.name = "AtomGauge";
        this._percentaje = 0;
        this.props = props;
        this.built = () => {
        };
        this.attachShadow({mode: 'open'});
    }

    get percentaje() {
        return this._percentaje;
    }

    set percentaje(val) {
        this._percentaje = parseInt(val);
        if (isNaN(this._percentaje) || this._percentaje < 0) this._percentaje = 0;
        if (this._percentaje > 100) this._percentaje = 100;

        let sheet = new CSSStyleSheet();
        sheet.replaceSync(this.#getCss());
        this.shadowRoot.adoptedStyleSheets = [sheet];

        let start = 0;
        let end = this._percentaje;
        let duration = 100;
        let stepTime = Math.abs(Math.floor(duration / end));

        let current = start;
        let increment = end > start ? 1 : -1;

        // let timer = setInterval(() => {
        //     current += increment;
        //     this.percentajeElement.innerText = `${current}%`;
        //     if (current == end) {
        //         clearInterval(timer);
        //     }
        // }, stepTime);
        this.percentajeElement.innerText = `${this._percentaje}%`;
        this.accumulatorElement.style.width = `${this._percentaje}%`;
    }

    #getTemplate() {
        return `
            <div class='Container'>
                <div class='Accumulator'></div>
                <div class='Percentaje'></div>
            </div>
        `;
    }

    async #getCss() {
        return await atom.getCssFile("../js/css/", "AtomGauge");
    }

    async connectedCallback() {
        let sheet = new CSSStyleSheet();
        sheet.replaceSync(await this.#getCss());
        this.shadowRoot.adoptedStyleSheets = [sheet];

        this.template = document.createElement('template');
        this.template.innerHTML = this.#getTemplate();
        let tpc = this.template.content.cloneNode(true);

        this.mainElement = tpc.querySelector('.Container');
        this.accumulatorElement = this.mainElement.querySelector('.Accumulator');
        this.percentajeElement = this.mainElement.querySelector('.Percentaje');

        this.shadowRoot.appendChild(this.mainElement);

        for (let attr of this.getAttributeNames()) {
            if (!attr.startsWith('on')) {
                this.mainElement.setAttribute(attr, this.getAttribute(attr));
                this[attr] = this.getAttribute(attr);
            }
            if (attr === 'id') {
                atom.createInstance('AtomGauge', {'id': this[attr]});
            }
            if (attr === 'percentaje') {
                this.percentaje = this.getAttribute(attr);
            }
            if (attr === 'container-style') {
                this.applyStyles(this.mainElement, this.parseStyle(this.getAttribute(attr)));
            }
            if (attr === 'accumulator-style') {
                this.applyStyles(this.accumulatorElement, this.parseStyle(this.getAttribute(attr)));
            }
            if (attr === 'percentaje-style') {
                this.applyStyles(this.percentajeElement, this.parseStyle(this.getAttribute(attr)));
            }
        }

        if (this.props) {
            for (let attr in this.props) {
                switch (attr) {
                    case 'style':
                        for (let attrcss in this.props.style) this.accumulatorElement.style[attrcss] = this.props.style[attrcss];
                        break;
                    case 'events':
                        for (let attrevent in this.props.events) {
                            this.mainElement.addEventListener(attrevent, this.props.events[attrevent]);
                        }
                        break;
                    default:
                        this.setAttribute(attr, this.props[attr]);
                        this[attr] = this.props[attr];
                        if (attr === 'id') {
                            atom.createInstance('AtomGauge', {'id': this[attr]});
                        }
                        if (attr === 'container-style') {
                            this.applyStyles(this.mainElement, this.props[attr]);
                        }
                        if (attr === 'accumulator-style') {
                            this.applyStyles(this.accumulatorElement, this.props[attr]);
                        }
                        if (attr === 'percentaje-style') {
                            this.applyStyles(this.percentajeElement, this.props[attr]);
                        }
                }
            }
        }

        this.built();
    }

    applyStyles(element, styles) {
        for (let style in styles) {
            element.style[style] = styles[style];
        }
    }

    parseStyle(styleString) {
        return styleString.split(';').reduce((styles, style) => {
            const [key, value] = style.split(':');
            if (key && value) {
                styles[key.trim()] = value.trim();
            }
            return styles;
        }, {});
    }

    addToBody() {
        document.body.appendChild(this);
    }
}

if (!customElements.get('atom-gauge')) {
    customElements.define('atom-gauge', AtomGauge);
}
