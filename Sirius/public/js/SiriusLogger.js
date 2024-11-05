/** Sirius logger constants */
export const SIRIUS_LOGGER = {
    NAME: 'SiriusLogger',
    INNER_PADDING: {
        CLASS: {
            WIDTH: 20,
            FILL_CHAR: ' ',
        },
        ELEMENT_ID: {
            WIDTH: 20,
            FILL_CHAR: ' ',
        },
    },
    BORDER_PADDING: {
        WIDTH: 2,
        FILL_CHAR: ' ',
    },
    LOG: {
        BG_COLOR: '#96f2d7',
        COLOR: '#212529',
    },
    ERROR: {
        BG_COLOR: '#ffc9c9',
        COLOR: '#212529',
    }
}

/** Sirius logger */
export class SiriusLogger {
    #name
    #elementId
    #logBgColor
    #logColor
    #errorBgColor
    #errorColor

    /** Create a Sirius logger
     * @param {string} name - Logger name
     * @param {string} elementId - Element ID
     * @param {string} logBgColor - Log background color
     * @param {string} logColor - Log text color
     * @param {string} errorBgColor - Error background color
     * @param {string} errorColor - Error text color
     */
    constructor({
                    name,
                    elementId,
                    logBgColor = SIRIUS_LOGGER.LOG.BG_COLOR,
                    logColor = SIRIUS_LOGGER.LOG.COLOR,
                    errorBgColor = SIRIUS_LOGGER.ERROR.BG_COLOR,
                    errorColor = SIRIUS_LOGGER.ERROR.COLOR
                }) {
        this.#name = name
        this.#elementId = elementId
        this.#logBgColor = logBgColor
        this.#logColor = logColor
        this.#errorBgColor = errorBgColor
        this.#errorColor = errorColor
    }

    /** Add padding
     * @param {string} message - Message to log
     * @param {number} width - Padding width
     * @param {string} fillChar - Padding character
     * @returns {string} - Padded message
     */
    addPadding(message, {WIDTH: width, FILL_CHAR: fillChar}) {
        const diff = width - String(message).length - 1;
        let padding = '';
        if (diff > 0) padding = fillChar.repeat(diff);

        return [message, padding].join('')
    }

    /** String formatting
     * @param {string} message - Message to log
     */
    format(message) {
        // Get padded class name
        const paddedClassName = this.addPadding(this.#name, SIRIUS_LOGGER.INNER_PADDING.CLASS);

        // Get padded element ID if exists
        let paddedElementId = ''
        if (this.#elementId)
            paddedElementId = this.addPadding(this.#elementId, SIRIUS_LOGGER.INNER_PADDING.ELEMENT_ID);

        // Get border padding
        const borderPadding = SIRIUS_LOGGER.BORDER_PADDING.FILL_CHAR.repeat(SIRIUS_LOGGER.BORDER_PADDING.WIDTH);

        return ['%c', borderPadding, paddedClassName, paddedElementId, message, borderPadding].join('')
    }

    /** Get color CSS
     * @param {string} bgColor - Background color
     * @param {string} color - Text color
     * @returns {string} - CSS style
     * */
    #getColorCSS({bgColor, color}) {
        return `background-color: ${bgColor}; color: ${color};`
    }

    /** Sirius logger
     * @param {string} message - Message to log
     */
    log(message) {
        // Get the log colors
        const cssStyle = this.#getColorCSS({
            bgColor: this.#logBgColor,
            color: this.#logColor
        });
        console.log(this.format(message), cssStyle);
    }

    /** Sirius logger on error
     * @param {string} message - Message to log
     */
    error(message) {
        // Get the error colors
        const cssStyle = this.#getColorCSS({
            bgColor: this.#errorBgColor,
            color: this.#errorColor
        });
        console.error(this.format(message), cssStyle);
    }
}