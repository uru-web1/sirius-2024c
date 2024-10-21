import {SiriusLogger} from "./SiriusLogger.js";
import deepFreeze from "./utils/deep-freeze.js";

/** Sirius framework constants */
export const SIRIUS = deepFreeze({
    NAME: 'Sirius',
    ROUTES: {
        CSS: cssFilename => `../css/${cssFilename}.css`,
        JS: scriptFilename => `./${scriptFilename}.js`,
    },
    LOG: {
        BG_COLOR: '#212529',
        COLOR: '#d0bfff',
    },
    ERROR: {
        BG_COLOR: '#212529',
        COLOR: '#fcc2d7',
    }
})

/** Sirius framework singleton class */
class Sirius {
    #logger
    #jsModules
    #instancesId
    #cssFiles
    #pendingCSSPromises
    #init = []

    /** Create Sirius object */
    constructor() {
        // JavaScript modules
        this.#jsModules = new Map();

        // Module instances ID
        this.#instancesId = new Map();

        // Inject logger
        this.#logger = new SiriusLogger({
            name: SIRIUS.NAME,
            logBgColor: SIRIUS.LOG.BG_COLOR,
            logColor: SIRIUS.LOG.COLOR,
            errorBgColor: SIRIUS.ERROR.BG_COLOR,
            errorColor: SIRIUS.ERROR.COLOR
        })

        this.#cssFiles = new Map();
        this.#pendingCSSPromises = new Map();
    }

    /** Get Sirius logger
     * @returns {SiriusLogger} - Logger
     * */
    get logger() {
        return this.#logger
    }

    /** Sirius initialization */
    get init() {
        this.logger.log('Initializing Sirius');
    }

    /** Set Sirius initialization
     * @param callback - Initialization callback
     * */
    set init(callback) {
        this.#init.push(callback);

        // On DOM content loaded
        addEventListener("DOMContentLoaded", async () => {
            // Call the initialization callbacks
            for (const callback of this.#init) await callback();

            // Clear the initialization callbacks
            this.#init = [];
        });
    }

    /** Set instance ID */
    setInstance(id, instance) {
        if (!id || !instance) return;

        // Check if the instance already exists
        if (this.#instancesId.has(id))
            throw new Error(`Instance with ID '${id}' already exists`);

        this.#instancesId.set(id, instance);
    }

    /** Get CSS file
     * @param fileName - File name
     * @returns {Promise<any|string>} - CSS file
     */
    async getCssFile(fileName) {
        // Check if the CSS file is already loaded
        if (this.#cssFiles.has(fileName)) {
            this.logger.log(`CSS file '${fileName}' already loaded`);
            return this.#cssFiles.get(fileName);
        }
    
        // Wait for the CSS file to be loaded
        if (this.#pendingCSSPromises.has(fileName)) {
            this.logger.log(`Waiting for CSS file '${fileName}' to be loaded`);
            return await this.#pendingCSSPromises.get(fileName);
        }
    
        // Create CSS promise and store it
        const cssRoute = SIRIUS.ROUTES.CSS(fileName);
        const cssPromise = fetch(cssRoute)
            .then(response => response.text())
            .then(css => {
                this.logger.log(`CSS file '${fileName}' loaded`);
                this.#cssFiles.set(fileName, css);
                return css;
            })
            .finally(() => {
                // Remove the promise from the pending list
                this.#pendingCSSPromises.delete(fileName); 
            });
    
        // Store the CSS promise
        this.#pendingCSSPromises.set(fileName, cssPromise);
        this.logger.log(`Loading CSS file '${fileName}'`);

        return cssPromise;
    }
                    // async getCssFile(fileName) {
                    //     // Check if the CSS file is already loaded
                    //     if (this.#cssFiles.has(fileName)) {
                    //         this.logger.log(`CSS file '${fileName}' already loaded`);
                    //         return this.#cssFiles.get(fileName);
                    //     }

                    //     // Wait for the CSS file to be loaded
                    //     if (this.#pendingCSSPromises.has(fileName)) {
                    //         this.logger.log(`Waiting for CSS file '${fileName}' to be loaded`);
                    //         return await this.#pendingCSSPromises.get(fileName);
                    //     }

                    //     // Create CSS promise and store it
                    //     const cssRoute = SIRIUS.ROUTES.CSS(fileName);
                    //     const cssPromise = fetch(cssRoute)

                    //     // Store the CSS promise
                    //     this.#pendingCSSPromises.set(fileName, cssPromise);
                    //     this.logger.log(`Loading CSS file '${fileName}'`);

                    //     // Load the CSS file
                    //     const response = await cssPromise
                    //     const css = await response.text()
                    //     this.logger.log(`CSS file '${fileName}' loaded`);

                    //     // Store the CSS file
                    //     this.#cssFiles.set(fileName, css);

                    //     // Remove the promise from the pending list
                    //     this.#pendingCSSPromises.delete(fileName);
                    //     return css;
                    // }

    /** Get Sirius element by ID
     * @param id - Element ID
     * @returns {HTMLElement | null} - Element
     * */
    getInstance(id) {
        let e = document.getElementById(id);

        if (e) return e;
        return this.#instancesId.has(id) ? this.#instancesId.get(id) : null;
    }

    /** Get Sirius Script file
     * @param {string} jsFilename - JavaScript filename
     * @param {string} jsClass - JavaScript class
     * @returns {Promise<Class | null>} - JavaScript class
     * */
    async getClass(jsFilename, jsClass) {
        // Check if script has been loaded
        if (this.#jsModules.has(jsFilename)) {
            const currentClasses = this.#jsModules.get(jsFilename);

            // Loaded class
            if (currentClasses.has(jsClass))
                return currentClasses.get(jsClass)

            const importedClass = this.#jsModules[jsClass]
            if (!importedClass) {
                this.logger.error(`Class '${jsClass}' not found on loaded script '${jsFilename}'`);
                return null;
            }
        }

        // Load the script
        const importedScript = await import(SIRIUS.ROUTES.JS(jsFilename));
        if (!importedScript) {
            this.logger.error(`Error loading script '${jsFilename}'`);
            return null;
        }

        // Get the class
        const importedClass = importedScript[jsClass];
        if (!importedClass) {
            this.logger.error(`Error loading class '${jsClass}'`);
            return null;
        }

        // Store the class
        this.#jsModules.set(jsClass, importedClass);

        return importedClass;
    }

    /**  Create a new instance of a class
     * @param jsFilename - JavaScript filename
     * @param jsClass - JavaScript class
     * @param props - Properties
     * @returns {Promise<HTMLElement | null>} - Instance
     * */
    async createInstance(jsFilename, jsClass, props) {
        try {
            // Check if the instance already exists
            if (this.#instancesId.has(props.id)) {
                this.logger.error(`Instance with ID '${props.id}' already exists`);
                return this.#instancesId.get(props.id);
            }

            // Load the class and create an instance
            let importedClass = await this.getClass(jsFilename, jsClass);
            let instance = new importedClass(props);
            this.#instancesId.set(props.id, instance);

            return instance;

        } catch (err) {
            this.logger.error(`An error occurred: ${err}`)
            return null;
        }
    }

    /** Add the element to the body
     * @param {HTMLElement} element - Element to add
     * */
    addToBody(element) {
        document.body.appendChild(element);
    }
}

// Create a global instance of Sirius
const sirius = new Sirius()
export default sirius
// window.sirius = new Sirius();