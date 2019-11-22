let singleton = false;

const registeredEvents = {};
const defaultSettings = {
    colorize: true,
    font: '#fff',
    bg: '#03a9fc',
    label: '@DEBUG:'
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
        this.initEvents();
    }

    register() {
        window.debug = this.debug;
    }

    // HELPERS METHODS
    addHelpRecord(type, method, desc) {
        if (type && this.help[type] && method && desc) {
            this.help[type].push(`${method} -> ${desc}`);
        }
    }

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

                for (let reg in registeredEvents) {
                    events.push(`${reg} -> ${registeredEvents[reg].desc}`);
                }

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

    initEvents() {
        this.debug.addEvent = this.addEvent.bind(this);
        this.debug.updateEvent = this.updateEvent.bind(this);
        this.debug.launchEvent = this.launchEvent.bind(this);

        this.addHelpRecord('functions', 'addEvent(name, desc, callback)', 'save an important event for the debug purpose only');
        this.addHelpRecord('functions', 'updateEvents(name, desc, callback)', 'update an event');
        this.addHelpRecord('functions', 'launchEvent(name)', 'method to launch specific event');
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