# Debugger
The debugger for a simple and more advanced project. This library gives you a few functionalities to make your development and debugging easiest. 

## How works
It's really simple. Library register themself to the window object and is available always but works only when a controlling flag will be set on true;

## Import

```javascript
import Debugger from 'debugger';
```

## Initialize
The debugger works as a singleton class, it's mean it can be initialized only once. This prevents for register the debugger more than once to the window object.

**It's important to initialize the Debugger at the beginning of the initialization chain. A specially if some function uses of the Debugger methods. Otherwise, you get an error**.

```javascript
class App {
    constructor() {
        new Debugger(flag, settings);
    }
}
```

### Make debugger visible in console
`window.debug` is always registered in the console but any methods don't return or printing anything. For a change it the flag must be changed.

```javascript
// true - visible
// false - hidden

const flag = true // default value is false
```

### Settings
The library has simple default settings

```javascript
const defaultSettings = {
    colorize: true,
    font: '#fff',
    bg: '#03a9fc',
    label: '@DEBUG:'
};
```

`colorize` is property to control colorize messages. If the IE is important for a project then will be better to set this prop on a false for it.

## Available methods
The Debugger has 3 types of methods:

* Variables
* Functions
* Events

### Variables
Variables are always visible for everyone and everywhere. You can use it inside other classes or functions. 

`window.debug.status` - return boolean depend on the debug mode.

### Functions
Functions are only visible if the debug mode is on. 

* `window.debug.help()` - this method print information about the debug methods
* `window.debug.msg('foo')` - this method print message or group of messages. It's useful for print information about initialized some classes, launched complicated functions or other important messages.
* `window.debug.addEvent(name, desc, callback)` - method to register important functions for debugging.
* `window.debug.updateEvent(name, desc, callback)` - method to update registered event.
* `window.debug.launchEvent(name)` - method to launch callback function from the registered event.

### Events
It's a list of events available to launch only when the debug mode is on.

## Adjustment or/and extend
There are two ways to make the adjustment/extend for this library. 

* Change settings - only for a small adjustment
* Extend other class - for a big adjustment and extend