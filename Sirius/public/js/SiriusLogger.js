/** Sirius logger constants */
export const SIRIUS_LOGGER = {
    NAME: 'SiriusLogger',
    DEBUG: true,
    PADDING: {
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
     * @param {number} maxLength - Maximum length
     * @param {string} padding - Padding
     * @returns {string} - Padded message
     */
    addPadding(message, maxLength = message.length, padding = '') {
        if (typeof message !== 'string') {
            message = String(message); // Convertir a cadena
        }
    
        const filledMessage = message.concat(SIRIUS_LOGGER.PADDING.FILL_CHAR.repeat(maxLength - message.length));
        return [padding, filledMessage, padding].join('');
    }
    

    /** String formatting
     * @param {string} message - Message to log
     */
    format(message) {
        if (typeof message !== 'string') {
            message = String(message); // Convertir a cadena si no lo es
        }
    
        const maxLength = Math.max(this.#name.length, this.#elementId?.length || 0, message.length);
        const padding = SIRIUS_LOGGER.PADDING.FILL_CHAR.repeat(SIRIUS_LOGGER.PADDING.WIDTH);
    
        const paddedClassName = this.addPadding(this.#name, maxLength, padding);
        const paddedMessage = this.addPadding(message, maxLength, padding);
    
        if (!this.#elementId) {
            return ['%c', paddedClassName, paddedMessage].join('\n');
        }
    
        const paddedElementId = this.addPadding(this.#elementId, maxLength, padding);
        return ['%c', paddedClassName, paddedElementId, paddedMessage].join('\n');
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
        if (!SIRIUS_LOGGER.DEBUG) return;
    
        if (typeof message !== 'string') {
            message = String(message); // Convertir a cadena
        }
    
        const cssStyle = this.#getColorCSS({
            bgColor: this.#logBgColor,
            color: this.#logColor
        });
        console.log(this.format(message), cssStyle);
    }
    
    error(message) {
        if (!SIRIUS_LOGGER.DEBUG) return;
    
        if (typeof message !== 'string') {
            message = String(message); // Convertir a cadena
        }
    
        const cssStyle = this.#getColorCSS({
            bgColor: this.#errorBgColor,
            color: this.#errorColor
        });
        console.error(this.format(message), cssStyle);
    }
    
}