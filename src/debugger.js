let singleton = false;

export default class Debugger {
    constructor(flag = false) {
        if (!singleton) {
            singleton = true;

            this.flag = flag;
            this.help = {
                functions: [],
                events: []
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

    }

    addHelpRecord(type, method, desc) {
        if (type && this.help[type] && method && desc) {
            this.help[type].push(`${method} -> ${desc}`);
        }
    }

    print(msgs) {
        if (this.flag) {
            if (msgs.length === 1) {
                console.info(msgs[0]);
            } else {
                this.printGroup(msgs, '@DEBUG MSG');
            }
        }
    }

    printGroup(msgs, label = '@DEBUG GROUP') {
        console.group(`${label}:`);

        for (let msg of msgs) console.info(msg);

        console.groupEnd();
    }

    register() {
        window.debug = this.debug;
    }

    initStatus() {
        this.debug.status = this.flag;

        this.addHelpRecord('functions', 'status()', 'public global flag available everywhere');
    }

    initHelp() {
        this.debug.help = () => {
            const {functions, events} = this.help;
            const eLength = events.length;

            if (this.flag && functions.length > 0) {
                console.group('@DEBUG HELP:');

                this.printGroup(functions, '@AVAILABLE FUNCTIONS');
                events.length > 0 ? this.printGroup(events, '@AVAILABLE EVENTS') : false;

                console.groupEnd();
            }
        }

        this.addHelpRecord('functions', 'help()', 'to get some help with debugger');
    }

    initMsg() {
        this.debug.msg = (...msg) => this.print(msg);

        this.addHelpRecord('functions', `msg('foo')`, 'method for printing messages');
    }

    
    
}