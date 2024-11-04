/** Get the SVG icon
 * @param {string} icon - Icon name
 * @param {object} options - Icon options
 * @param {number} options.width - Icon width
 * @param {number} options.height - Icon height
 * @param {string} options.fill - Icon fill color
 * @returns {string | null} - SVG icon element or null
 * */
export const getSvgElement = (icon, {width, height, fill}) => {
    // Get the inner HTML of the SVG icon
    const innerHtml = SIRIUS_SVG_INNER_HTML[icon];
    if (!innerHtml) return null;

    return `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="0 -960 960 960" width="${width}" fill="${fill}">
        ${innerHtml}
    </svg>`
}

/** Get the SVG icon
 * @param {string} icon - Icon name
 * @param {object} options - Icon options
 * @param {string} options.width - Icon CSS width
 * @param {string} options.height - Icon CSS height
 * @param {string} options.fill - Icon CSS fill color
 * @returns {string | null} - SVG icon element or null
 * */
export const getSvgElementWithCSS = (icon, {width, height, fill}) => {
    // Get the inner HTML of the SVG icon
    const innerHtml = SIRIUS_SVG_INNER_HTML[icon];
    if (!innerHtml) return null;

    // Generate the SVG icon style
    const style = `height: ${height}; width: ${width}; fill: ${fill};`;

    return `<svg xmlns="http://www.w3.org/2000/svg" style="${style}" viewBox="0 -960 960 960">
        ${innerHtml}
    </svg>`
}

/** Change SVG element inner HTML
 * @param {HTMLElement} element - SVG element
 * @param {string} icon - Icon name
 */
export const changeSvgElementInnerHTML = (element, icon) => {
    // Get the inner HTML of the SVG icon
    const innerHtml = SIRIUS_SVG_INNER_HTML[icon];
    if (!innerHtml) return;

    element.innerHTML = innerHtml;
}

/** Sirius SVG Icons */
export const SIRIUS_ICONS = {
    ARROW: 'arrow',
    DOUBLE_ARROW: 'double-arrow',
    STAR: 'star',
    INDETERMINATE: "indeterminate",
    CHECK_MARK: "check-mark",
    WARNING: 'warning',
    CLOSE: 'close',
    HOME: 'home',
    EDIT: 'edit',
    MENU: 'menu',
    HELP: 'help',
    INFO: 'info',
    LOCATION: 'location',
    SETTINGS: 'settings',
    SEARCH: 'search',
    PERSON: 'person',
    RADIO_CHECKED: 'radio-checked',
    RADIO_UNCHECKED: 'radio-unchecked',
}

/** Sirius SVG Icons */
export const SIRIUS_SVG_INNER_HTML = {
    // Arrow icon
    [SIRIUS_ICONS.ARROW]:
        `<path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>`,

    // Double arrow icon
    [SIRIUS_ICONS.DOUBLE_ARROW]:
        `<path d="M383-480 200-664l56-56 240 240-240 240-56-56 183-184Zm264 0L464-664l56-56 240 240-240 240-56-56 183-184Z"/>`,

    // Indeterminate icon
    [SIRIUS_ICONS.INDETERMINATE]:
        `<path d="M240-440v-80h480v80H240Z"/>`,

    // Star icon
    [SIRIUS_ICONS.STAR]:
        `<path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/>`,

    // Check icon
    [SIRIUS_ICONS.CHECK_MARK]:
        `<path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>`,

    // Warning icon
    [SIRIUS_ICONS.WARNING]:
        `<path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"/>`,

    // Close icon
    [SIRIUS_ICONS.CLOSE]:
        `<path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>`,

    // Edit icon
    [SIRIUS_ICONS.EDIT]:
        `<path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>`,

    // Help icon
    [SIRIUS_ICONS.HELP]:
        `<path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>`,

    // Home icon
    [SIRIUS_ICONS.HOME]:
        `<path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>`,

    // Information icon
    [SIRIUS_ICONS.INFO]:
        `<path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>`,

    // Location icon
    [SIRIUS_ICONS.LOCATION]:
        `<path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/>`,

    // Menu icon
    [SIRIUS_ICONS.MENU]:
        `<path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>`,

    // Person icon
    [SIRIUS_ICONS.PERSON]:
        `<path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>`,

    // Settings icon
    [SIRIUS_ICONS.SETTINGS]:
        `<path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>`,

    // Search icon
    [SIRIUS_ICONS.SEARCH]:
        `<path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>`,

    // Radio unchecked icon
    [SIRIUS_ICONS.RADIO_UNCHECKED]:
        `<path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>`,

    // Radio checked icon
    [SIRIUS_ICONS.RADIO_CHECKED]:
        `<path d="M480-280q83 0 141.5-58.5T680-480q0-83-58.5-141.5T480-680q-83 0-141.5 58.5T280-480q0 83 58.5 141.5T480-280Zm0 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>`,
}