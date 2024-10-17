export const SiriusIcon = class extends Sirius {

    constructor(props) {
        super();
        this.props = props; // Pasar propiedades personalizadas
        this.built = () => {}; // Callback para cuando el componente esté construido
        this.attachShadow({ mode: "open" }); // Usar Shadow DOM
        this.left = 5;
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
        return `<span class="icon">${this.getIcon(this.getAttribute('icon'),
            {   'width':this.getAttribute('width') || 24,
                "stroke":this.getAttribute('stroke') || "white",
                "height":this.getAttribute('height') || 24,
                "left":this.getAttribute('left') || 0,
                "right":this.getAttribute('right') || 0,
                "strokeWidth":this.getAttribute('strokeWidth') || 1.5,
                "fill":this.getAttribute("fill") || "none",
            }) || this.getIcon('default')}</span>`;
    }

    toggleCheck() {

        if(this.getAttribute('icon') == 'check'){
            
            const maskElement = this.shadowRoot.querySelector('.svg-mask');
                
            if (maskElement.classList.contains('check')) {
                maskElement.classList.remove('check');
                maskElement.classList.add('uncheck'); // Desmarcar el check
            } else {
                maskElement.classList.remove('uncheck');
                maskElement.classList.add('check'); // Dibujar el check
            }
        }
        
    }

    // Obtener el ícono en base al nombre (ahora en SVG)
    getIcon(name, options = {}) {

        // Atributos por defecto de los iconos
        const {width,height,stroke,strokeWidth,fill,right,left} = options;
            console.log(options.left);
            
        const icons = {
            'heart': `
                <!-- Aquí puedes agregar el SVG del icono 'heart' -->
            `,
            'star': `
                <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            `,
            'check': `
                <svg class="custom-svg" width="${24}" height="${24}" viewBox="${left} ${right} ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <clipPath id="reveal">
                            <rect class="svg-mask" x="0" y="0" width="32" height="24" fill="white"/>
                        </clipPath>
                    </defs>
                    <path class="svg-check" d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4L9 16.2z" stroke="${stroke}" stroke-width="${strokeWidth}" fill="${fill}" clip-path="url(#reveal)"/>
                </svg>
            `,
            'default': `
                <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                </svg>
            `
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

        if (this.getAttributeNames()) {
            for (let attr of this.getAttributeNames()) {
                
                if (attr === 'class') {
                    console.log(5);
                    
                    const maskElement = this.shadowRoot.querySelector('.svg-mask'); 
                    
                    const classValue = this.getAttribute(attr); // Obtener el valor del atributo 'class'
                    
                    // Usar if para verificar el valor del atributo 'class'
                    if (classValue === 'check') {
                        maskElement.classList.add('check'); 
                        console.log('Clase check agregada');
                    } else if (classValue === 'uncheck') {
                        maskElement.classList.add('uncheck'); 
                        console.log('Clase uncheck agregada');
                    } else {
                        console.log('Clase no reconocida');
                    }
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

                        }
                        break;
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
