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
    // Logger
    #logger = null;

    // JavaScript modules
    #jsModules = new Map();

    // Module instances ID
    #instancesId = new Map();

    // CSS files
    #CSSFiles = new Map();
    #CSSFilesPromises = new Map();
    #lockedCSSFiles = new Set();

    // Loaded flag
    #loaded = false;
    #onLoaded = []

    /** Create Sirius object */
    constructor() {
        // Inject logger
        this.#logger = new SiriusLogger({
            name: SIRIUS.NAME,
            logBgColor: SIRIUS.LOG.BG_COLOR,
            logColor: SIRIUS.LOG.COLOR,
            errorBgColor: SIRIUS.ERROR.BG_COLOR,
            errorColor: SIRIUS.ERROR.COLOR
        })

        // On DOM content loaded
        addEventListener("DOMContentLoaded", async () => {
            // Set the loaded flag
            this.#loaded = true;

            // Get the initialization callbacks
            const callbacks = this.#onLoaded

            // Clear the initialization callbacks
            this.#onLoaded = [];

            // Call the initialization callbacks
            for (const callback of callbacks) await callback();
        });
    }

    /** Get Sirius logger
     * @returns {SiriusLogger} - Logger
     * */
    get logger() {
        return this.#logger
    }

    /** Set Sirius on loaded callback
     * @param {function(): Promise<void>} callback - Callback
     * */
    set onLoaded(callback) {
        // Check if the framework is loaded
        if (this.#loaded) {
            callback().then();
            return;
        }

        // Add the callback to the list
        this.#onLoaded.push(callback);
    }

    /** Set instance ID
     * @param id - Instance ID
     * @param instance - Instance
     * */
    setInstance(id, instance) {
        if (!id || !instance) return;

        // Check if the instance already exists
        if (this.#instancesId.has(id))
            throw new Error(`Instance with ID '${id}' already exists`);

        // Set the instance
        this.#instancesId.set(id, instance);
    }

    /** Remove instance by ID
     * @param id - Instance ID
     */
    removeInstance(id) {
        if (!id) return;

        // Check if the instance exists
        if (!this.#instancesId.has(id))
            throw new Error(`Instance with ID '${id}' does not exist`);

        // Remove the instance
        this.#instancesId.delete(id);
    }

    /** Get Sirius element by ID
     * @param id - Element ID
     * @returns {SiriusCheckbox|SiriusIcon | SiriusLabel | SiriusListBox | SiriusSvg | SiriusTreeView | null} - Element
     * */
    getInstance(id) {
        return this.#instancesId.has(id) ? this.#instancesId.get(id) : null;
    }

    /** Load CSS style sheet file
     * @param {string} cssFilename - CSS filename
     * @param {string} cssRoute - CSS route
     * @returns {Promise<any|string>} - CSS file
     */
    async loadCSSStyleSheetFile(cssFilename, cssRoute = SIRIUS.ROUTES.CSS(cssFilename)) {
        // Check if the CSS file is already loaded
        if (this.#CSSFiles.has(cssFilename)) {
            this.logger.log(`CSS file '${cssFilename}' already loaded`);
            return this.#CSSFiles.get(cssFilename);
        }

        // Wait for the CSS file to be loaded
        if (this.#lockedCSSFiles.has(cssFilename)) {
            this.logger.log(`Waiting for CSS file '${cssFilename}' to be loaded`);

            // Wait for the CSS file to be loaded
            if (this.#CSSFilesPromises.has(cssFilename))
                return await this.#CSSFilesPromises.get(cssFilename);

            // Throw an error if the CSS file is locked
            throw new Error(`CSS file '${cssFilename}' is locked and cannot be loaded`);
        }

        // Lock the CSS file
        this.#lockedCSSFiles.add(cssFilename);

        // Create CSS promise and store it
        const cssPromise = (async () => {
            // Load the CSS file
            const response = await fetch(cssRoute)
            const css = await response.text()
            this.logger.log(`CSS file '${cssFilename}' loaded`);

            // Store the CSS file
            this.#CSSFiles.set(cssFilename, css);
            return css
        })()

        // Store the CSS promise
        this.#CSSFilesPromises.set(cssFilename, cssPromise);
        this.logger.log(`Loading CSS file '${cssFilename}'`);

        return cssPromise;
    }

    /** Get Sirius Script file
     * @param {string} jsFilename - JavaScript filename
     * @param {string} jsClass - JavaScript class
     * @param {string} jsRoute - CSS route
     * @returns {Promise<Class | null>} - JavaScript class
     * */
    async getClass(jsFilename, jsClass, jsRoute = SIRIUS.ROUTES.JS(jsFilename)) {
        // Check if script has been loaded
        if (this.#jsModules.has(jsFilename)) {
            const jsModule = this.#jsModules.get(jsFilename);

            // The class is already loaded
            if (jsModule.has(jsClass))
                return jsModule.get(jsClass)

            // Load the class
            const importedClass = this.#jsModules[jsClass]
            if (!importedClass) {
                this.logger.error(`Class '${jsClass}' not found on loaded script '${jsFilename}'`);
                return null;
            }

            // Store the class in the map
            jsModule.set(jsClass, importedClass);
            return importedClass;
        }

        // Store the class in a new Map if jsFilename is not already in the map
        const jsModule = new Map()
        this.#jsModules.set(jsFilename, jsModule);

        // Load the script
        const importedScript = await import(jsRoute);
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
        jsModule.set(jsClass, importedClass);
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
            const importedClass = await this.getClass(jsFilename, jsClass);
            const instance = new importedClass(props);
            this.#instancesId.set(props.id, instance);

            return instance;

        } catch (err) {
            this.logger.error(`An error occurred: ${err}`)
            return null;
        }
    }
}

// Create a global instance of Sirius
const sirius = new Sirius()
export default sirius
// window.sirius = new Sirius();