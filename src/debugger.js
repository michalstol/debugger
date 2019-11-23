let singleton = false;

const registeredEvents = {};
const defaultSettings = {
    colorize: true, // colorize logs
    font: '#fff',
    bg: '#03a9fc',
    label: '@DEBUG:',
    columns: 12,
    gridID: 'debug-grid'
};

export default class Debugger {
    constructor(flag = false, userSettings = {}) {
        if (!singleton) {
            singleton = true;

            this.settings = {...defaultSettings, ...userSettings};
            this.flag = flag;
            this.help = {
                vars: [],
                functions: []
            };

            this.init();
            this.register();
        }
    }

    init() {
        this.debug = {};

        this.initStatus();
        this.initHelp();
        this.initMsg();
        this.initGrid();
        this.initEvents();
    }

    // REGISTER DEBUG METHOD
    register() {
        window.debug = this.debug;
    } 

    // INIT METHODS
    initStatus() {
        this.debug.status = this.flag;

        this.addHelpRecord('vars', 'status', 'public global flag available everywhere');
    }

    initHelp() {
        this.debug.help = this.printHelp.bind(this);

        this.addHelpRecord('functions', 'help()', 'to get some help with debugger');
    }

    initMsg() {
        this.debug.msg = this.print.bind(this);

        this.initPrintColors();
        this.addHelpRecord('functions', `msg('foo')`, 'method for printing messages');
    }

    initGrid() {
        this.debug.grid = this.grid.bind(this);

        this.addHelpRecord('functions', 'grid(noColumns)', 'show the grid with 12 columns - 12 is default');
    }

    initEvents() {
        this.debug.addEvent = this.addEvent.bind(this);
        this.debug.updateEvent = this.updateEvent.bind(this);
        this.debug.launchEvent = this.launchEvent.bind(this);

        this.addHelpRecord('functions', 'addEvent(name, desc, callback)', 'save an important event for the debug purpose only');
        this.addHelpRecord('functions', 'updateEvents(name, desc, callback)', 'update an event');
        this.addHelpRecord('functions', 'launchEvent(name)', 'method to launch specific event');
    }

    // HELP METHODS
    addHelpRecord(type, method, desc) {
        if (type && this.help[type] && method && desc) {
            this.help[type].push(`${method} -> ${desc}`);
        }
    }

    // PRINT METHODS
    initPrintColors() {
        const {colorize, font, bg} = this.settings;

        this.colors = {
            before: colorize ? '%c' : '',
            after: colorize ? `${bg && bg !== '' ? `background: ${bg};` : '' } ${font && font !== '' ? `color: ${font};` : '' }` : ''
        }
    }

    print(...msgs) {
        if (this.flag) {
            if (msgs.length === 1) {
                console.info(`${this.colors.before} ${this.settings.label} `, this.colors.after, msgs[0]);
            } else {
                console.group(`${this.colors.before} ${this.settings.label} `, this.colors.after);
                for (let msg of msgs) console.info(`${this.colors.before} `, this.colors.after, msg);
                console.groupEnd();
            }
        }
    }

    printHelp() {
        const {vars, functions} = this.help;

        if (this.flag && functions.length > 0) {
            console.group(`${this.colors.before} ${this.settings.label} `, this.colors.after);

            this.printHelpGroup('@AVAILABLE VARIABLES:', vars);
            this.printHelpGroup('@AVAILABLE FUNCTIONS:', functions);

            if (Object.keys(registeredEvents).length > 0) {
                const events = [];

                for (let reg in registeredEvents) events.push(`${reg} -> ${registeredEvents[reg].desc}`);

                this.printHelpGroup('@AVAILABLE EVENTS:', events);
            }

            console.groupEnd();
        }
    }

    printHelpGroup(label = this.settings.label, msgs) {
        if (msgs) {
            console.group(`${this.colors.before} ${label} `, this.colors.after);

            for (let msg of msgs) console.info(`${this.colors.before} `, this.colors.after, msg);

            console.groupEnd();
        }
    }

    // GRID METHODS
    grid(columns = this.settings.columns) {
        const {gridID} = this.settings;

        if (this.flag && columns && typeof columns === 'number' && gridID && typeof gridID === 'string' && gridID !== '') {
            const htmlString = `
                <div id="${gridID}">
                    <div class="container">
                        <div class="row">
                            ${this.gridColumns(columns)}
                        </div>
                    </div>

                    ${this.gridStyle(gridID)}
                </div>
            `;

            this.removeGrid(gridID);
            document.body.appendChild((new DOMParser().parseFromString(htmlString, 'text/html')).getElementById(gridID));
        }
    }

    removeGrid(id) {
        const $html = document.getElementById(id);

        $html ? document.body.removeChild($html) : false;
    }

    gridColumns(columns) {
        const htmlArray = [];

        for (let i = 1; i <= columns; i++) htmlArray.push('<div class="col-xs"></div>');

        return htmlArray.join('');
    }

    gridStyle(id = '') {
        return `
        <style>
            #${id} {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                z-index: 9999;
            }

            #${id}, #${id} * {
                pointer-events: none;
            }

            #${id} .container, #${id} .row {
                height: 100%;
            }

            #${id} *[class*=col] {
                height: 100%;
            }

            #${id} *[class*=col]::after {
                content: '';
                position: relative;
                display: block;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.1);
            }
        </style>
        `;
    }

    // EVENT METHODS
    addEvent(name, desc, callback) {
        if (this.flag && name && typeof name === 'string' && desc && typeof desc === 'string' && callback && typeof callback === 'function' && !registeredEvents[name]) {
            registeredEvents[name] = {
                desc,
                callback
            }
        }
    }

    updateEvent(name, desc, callback) {
        if (this.flag && name && typeof name === 'string' && desc && typeof desc === 'string' && callback && typeof callback === 'function' && registeredEvents[name]) {
            registeredEvents[name] = {
                desc,
                callback
            }
        }
    }

    launchEvent(name) {
        if (this.flag && name && typeof name === 'string' && registeredEvents[name]) {
            this.print(`${name} -> launched!`);

            registeredEvents[name].callback();
        }
    }
}