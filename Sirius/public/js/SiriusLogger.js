/** SiriusLogger constants */
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

/** SiriusLogger */
export class SiriusLogger {
    #name
    #elementId
    #logBgColor
    #logColor
    #errorBgColor
    #errorColor

    /** Create a SiriusLogger
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
    addPadding(message, maxLength= message.length, padding='') {
        // Get the filled message
        const filledMessage = message.concat(SIRIUS_LOGGER.PADDING.FILL_CHAR.repeat(maxLength - message.length));

        return [padding, filledMessage,padding].join('')
    }

    /** String formatting
     * @param {string} message - Message to log
     */
    format(message) {
        // Get maximum length
        const maxLength = Math.max(this.#name.length, this.#elementId?.length || 0, message.length);

        // Get padding
        const padding = SIRIUS_LOGGER.PADDING.FILL_CHAR.repeat(SIRIUS_LOGGER.PADDING.WIDTH);

        // Get padded class name
        const paddedClassName = this.addPadding(this.#name,maxLength, padding);

        // Get padded message
        const paddedMessage = this.addPadding(message,maxLength, padding);

        // Check if element ID is available
        if (!this.#elementId)
            return ['%c', paddedClassName, paddedMessage].join('\n')

        // Get padded element ID
        const paddedElementId = this.addPadding(this.#elementId,maxLength, padding);

        return ['%c', paddedClassName, paddedElementId, paddedMessage].join('\n')
    }

    /** Get color CSS
     * @param {string} bgColor - Background color
     * @param {string} color - Text color
     * @returns {string} - CSS style
     * */
    #getColorCSS({bgColor, color}) {
        return `background-color: ${bgColor}; color: ${color};`
    }

    /** SiriusLogger
     * @param {string} message - Message to log
     */
    log(message) {
        if (!SIRIUS_LOGGER.DEBUG) return;

        // Get the log colors
        const cssStyle = this.#getColorCSS({
            bgColor: this.#logBgColor,
            color: this.#logColor
        });
        console.log(this.format(message), cssStyle);
    }

    /** SiriusLogger on error
     * @param {string} message - Message to log
     */
    error(message) {
        if (!SIRIUS_LOGGER.DEBUG) return;

        // Get the error colors
        const cssStyle = this.#getColorCSS({
            bgColor: this.#errorBgColor,
            color: this.#errorColor
        });
        console.error(this.format(message), cssStyle);
    }
}