export const Atom = class extends HTMLElement {
    constructor(props) {
        super();
        this.modules = new Map();
        this.instances = new Map();
        this.mapcallbackids = new Map();
        this._callBack = () => {
        };
        this.allBuilt = () => {
        };
        if (props) this.props = props;
        this.actZIndex = 0;
        this.cssFiles = new Map();
        this.pendingCssPromises = new Map();
    }

    get callback() {
        return this.callback
    }

    set callback(val) {
        this._callBack = val
    }

    get callbackids() {
        return this.mapcallbackids
    }

    set callbackids(arr) {
        for (let id of arr) {
            this.mapcallbackids.set(id, {});
        }
        ;
    }

    async getCssFile(fileName) {

        if (!this.cssFiles.has(fileName)) {
            // Si ya se está descargando, esperamos a la misma promesa
            if (this.pendingCssPromises.has(fileName)) {
                console.log("retornado por promesa");

                return await this.pendingCssPromises.get(fileName);
            }

            // Crear la promesa y almacenarla
            const cssPromise = fetch(atom.routes.css + fileName + ".css")
                .then((response) => response.text())
                .then((css) => {
                    this.cssFiles.set(fileName, css); // Guardar el archivo CSS
                    this.pendingCssPromises.delete(fileName); // Eliminar la promesa pendiente
                    return css;
                });

            this.pendingCssPromises.set(fileName, cssPromise);

            console.log("retornado por primera construccion");
            return await cssPromise;
        } else {
            console.log("retornado por mapa");
            return this.cssFiles.get(fileName); // Retornar el archivo si ya está almacenado
        }
    }

    getMaxZIndex() {
        atom.actZIdx++;
        return atom.actZIdx;
    }

    setCallBackBuilt(extFunct) {
        this.callBack = extFunct;
        return this;
    }

    getInstance(id) {
        let e = document.getElementById(id);
        if (e) return e;
        else if (this.instances.has(id)) {
            return this.instances.get(id)
        } else {
            return null
        }
    }

    async getClass(className) {
        if (!this.modules.has(className)) {
            let clase = await import('./' + className + '.js');
            this.modules.set(className, clase[className]);
        }
        return this.modules.get(className);
    }

    notifyBuilt(id) {
        if (this.mapcallbackids.has(id)) {
            this.mapcallbackids.delete(id)
            if (this.mapcallbackids.size === 0) this._callBack();
        }
        return this;
    }

    addHTMLInstance(obj) {
        if (!this.instances.has(obj.id)) {
            this.instances.set(obj.id, obj);
        }
        return this;
    }

    hide() {
        this.hidden = true;
    }

    show() {
        this.hidden = false;
    }

    async createInstance(className, props) {
        try {
            if (!this.instances.has(props.id)) {

                props.notify = false;
                let newClass = await this.getClass(className);
                let i = new newClass(props);
                this.instances.set(props.id, i);
                return i;
            } else {
                return this.instances.get(props.id)
            }
        } catch (e) {
            console.log('No se pudo crear la instancia');
            return null;
        }
    }
}

if (!customElements.get('x-atom')) {
    customElements.define('x-atom', Atom);
}

window.Atom = Atom;
window.atom = new Atom();
atom.actZIdx = 0;
atom.radioGroup = [];
atom.react = () => {
    for (let attr in atom) {
        if (atom[attr]) {
            if (atom[attr].value || atom[attr].equation) {
                if (atom[attr]._equation) {
                    atom[attr]._value = eval(atom[attr].equation.toString());
                }
                ;
            }
        }
    }
}
atom.routes = {
    css: '../js/css/',
    images: '../images',
    icons: '../images/icons'
}

window.Any = class {
    static observedAttributes = ["equation", "value"];

    constructor(val) {
        if (val) this._value = val; else this.value = null;
        this._equation = null;
    }

    get value() {
        return this._value
    }

    set value(val) {
        this._value = val;
        this.react();
    }

    get equation() {
        return this._equation
    }

    set equation(val) {
        this._equation = val;
        this.react();
    }

    react() {
        atom.react()
    }
}

window.Integer = class extends Any {
    constructor(val) {
        super(val);
    }

    parse(val) {
        this._value = val;
        return parseInt(this._value, 10)
    }
}

window.Float = class extends Any {
    constructor(val) {
        super(val);
        super.add(this);
    }

    parse(val) {
        this._value = val;
        return parseFloat(this._value)
    }
}

addEventListener("DOMContentLoaded", () => {
    if (atomInit) atomInit()
});
