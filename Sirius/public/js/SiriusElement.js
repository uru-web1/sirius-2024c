/** Sirius class that represents an element component */
export class SiriusElement extends HTMLElement {
    /**
     * Create a Sirius element
     * @param props - Element properties
     * @param elementName - Element name
     */
    constructor(props, elementName) {
        super();

        // Add custom properties and element name
        this.props = props;
        this.elementName = elementName;

        // Callback for when the component is built
        this.built = () => {
        };
    }

    /**
     * Create a Sirius element stylesheet
     * @param cssFilename - CSS filename
     */
    async getCss(cssFilename = this.elementName) {
        this.sheet = new CSSStyleSheet();

        // Load the CSS file
        const css = await sirius.getCssFile(cssFilename);

        // Add the CSS to the stylesheet
        this.sheet.replaceSync(css);
    }

    /**
     * Create a template from the inner HTML
     * @param innerHTML
     */
    async createTemplate(innerHTML) {
        // Create HTML template
        this.template = document.createElement("template");
        this.template.innerHTML = innerHTML;

        // Clone the template
        this.templateContent = this.template.content.cloneNode(true);
    }

    /** Add the element to the body */
    addToBody() {
        document.body.appendChild(this);
    }

    /** Sirius element logger
     * @param message - Message to log
     */
    _log(message) {
        console.log(`[${this.elementName}] ${message}`);
    }
}