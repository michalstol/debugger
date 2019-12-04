import Debugger from './debugger';

class ExtendedClass extends Debugger {
    constructor(flag) {
        super(flag);

        console.log('class is extended');
    }
}

// new Debugger(true);

new ExtendedClass(true);