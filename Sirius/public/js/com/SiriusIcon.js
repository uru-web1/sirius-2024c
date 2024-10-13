export const SiriusIcon = class extends Sirius {

    constructor(props) {
        super();
        this.props = props; // Pasar propiedades personalizadas
        this.built = () => {}; // Callback para cuando el componente esté construido
        this.attachShadow({ mode: "open" }); // Usar Shadow DOM
    }

    async connectedCallback() {
        // Crear el estilo y cargar el CSS externo
        let sheet = new CSSStyleSheet();
        let css = await this.#getCss(); // Cargar CSS de forma asíncrona
        sheet.replaceSync(css);
        this.shadowRoot.adoptedStyleSheets = [sheet];

        // Crear la plantilla HTML
        this.template = document.createElement("template");
        this.template.innerHTML = this.#getTemplate(); // Crear la estructura HTML del ícono        

        // Clonar la plantilla y obtener el ícono
        let tpc = this.template.content.cloneNode(true);
        this.mainElement = tpc.firstChild;
        this.shadowRoot.appendChild(this.mainElement);

        // Cargar atributos y propiedades
        this.#getAttributes();
        this.#getProperties();

        // Llamar cuando el componente está construido
        this.built();
    }

    addToBody() {
        document.body.appendChild(this);
    }

    // Devuelve el HTML del componente (el ícono)
    #getTemplate() {
        return `<span class="icon">${this.getIcon(this.getAttribute('name'))}</span>`;
    }

    // Obtener el ícono en base al nombre
    getIcon(name) {
        // Puedes agregar más íconos aquí o usar SVG
        const icons = {
            'heart': '❤️',
            'star': '⭐',
            'default': '★' // Icono por defecto
        };
        return icons[name] || icons['default'];
    }

    // Cargar el CSS externo
    async #getCss() {
        return await sirius.getCssFile("SiriusIcon");
    }

    // Obtener atributos definidos en el HTML y asignarlos al componente
    #getAttributes() {
        
        
        const attributesToHandle = ['name', 'color', 'size'];
        sirius.createInstance('SiriusIcon',{'id':'Icono'})
        if (this.getAttributeNames()) {
            for (let attr of this.getAttributeNames()) {
                if (attributesToHandle.includes(attr)) {
                    this[attr] = this.getAttribute(attr);
                    this.mainElement.setAttribute(attr, this[attr]);
                    
                    if (attr === 'id') {
                        console.log("aña");
                        
                        //atom.createInstance('SiriusIcon', {'id': this[attr]});
                    }
                } else {
                    console.log(`Atributo no soportado: ${attr}`);
                }
            }
        } else {
            console.log("No hay atributos");
        }
        
    }

    // Manejo de propiedades dinámicas como estilo o eventos
    #getProperties() {
        if (this.props) {
            for (let attr in this.props) {
                switch (attr) {
                    case 'style':
                        for (let attrcss in this.props.style) {
                            this.mainElement.style[attrcss] = this.props.style[attrcss];
                        }
                        break;
                    case 'events':
                        for (let evt in this.props.events) {
                            this.mainElement.addEventListener(evt, this.props.events[evt]);
                        }
                        break;

                    case 'id':
                            sirius.createInstance('SiriusIcon', {'id': this[attr]});
                        break
                    default:
                        console.log("No hay propiedades adicionales");
                        break;
                }
                this.setAttribute(attr, this[attr]);
                this[attr] = this.props[attr];
                console.log(attr + ":" + this[attr]);
            }
        } else {
            console.log("No hay propiedades");
        }
    }
}

// Registrar el componente personalizado
customElements.define("sirius-icon", SiriusIcon);
