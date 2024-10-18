class Sirius {
    constructor() {
        // JavaScript modules
        this.jsModules = new Map();
        
        // Module instances ID
        this.instancesId = new Map();


        this.cssFiles = new Map();
        this.pendingCssPromises = new Map();
    }

    async getCssFile(fileName) {

        if (!this.cssFiles.has(fileName)) {
            // Si ya se está descargando, esperamos a la misma promesa
            if (this.pendingCssPromises.has(fileName)) {
                console.log("retornado por promesa");

                return await this.pendingCssPromises.get(fileName);
            }

            // Crear la promesa y almacenarla
            const cssPromise = fetch(sirius.routes.css + fileName + ".css")
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

    getInstance(id) {
        let e = document.getElementById(id);

        if (e) return e;
        return this.instancesId.has(id)? this.instancesId.get(id): null;
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
        if (!this.instancesId.has(obj.id)) {
            this.instancesId.set(obj.id, obj);
        }
        return this;
    }

    async createInstance(className, props) {
        try {
            if (!this.instancesId.has(props.id)) {
                props.notify = false;
                let newClass = await this.getClass(className);
                let i = new newClass(props);
                this.instancesId.set(props.id, i);

                return i;
            } else {
                return this.instancesId.get(props.id)
            }
        } catch (e) {
            console.log('No se pudo crear la instancia');
            return null;
        }
    }
}

// Create a global instance of Sirius
window.sirius = new Sirius();

// Initialize Sirius
addEventListener("DOMContentLoaded", async () => {
    if (siriusInit) await siriusInit()
});