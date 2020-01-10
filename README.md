# Debugger
The debugger for a simple and more advanced project. This library gives you a few functionalities to make your development and debugging process easier. 

## How works
It's really simple. Library register themself to the window object and is available always but works only when a controlling flag will be set on true;

## Import

```javascript
import Debugger from 'debugger-for-dev';
```

## Initialize
The debugger works as a singleton class, it's mean it can be initialized only once. This prevents for register the debugger more than once to the window object.

**It's important to initialize the Debugger at the beginning of the initialization chain. A specially if some function uses Debugger methods. Otherwise, you get an error**.

```javascript
class App {
    constructor() {
        new Debugger(flag, settings);
    }
}
```

### Make debugger visible in console
`window.debug` is an object and is always registered to the window. Methods inside this object can be triggered in any moment but if the flag is set on false there will be no reaction.

```javascript
// true - results are visible
// false - results are hidden

const flag = true // default value is false
```

### Settings
The library has a simple default settings

```javascript
const defaultSettings = {
    label: '@DEBUG:',
    colorize: true,
    font: '#fff',
    bg: '#03a9fc',
    gridID: 'debug-grid',
    maxColumns: 12,
    defaultColumns: 12
};
```

`label` is a label for all messages from the debugger method.

`colorize` is property to control colorize the label. IE doesn't support colorize any logs.

`font` is a color of the label text.

`bg` is a color of the label background.

`maxColumns` is a maximum amount of columns inside the grid.

`defaultColumns` is a default amount of columns inside the grid.

## Available methods
The Debugger has 3 types of methods:

* Variables
* Functions
* Events

### Variables
Variables are always visible for everyone and everywhere. They are visible also if the flag is set on false.

`window.debug.status` - return boolean value of the flag.

### Functions
Functions are only visible if the flag is set on true. 

* `window.debug.help()` - this method print information about the debug methods
* `window.debug.msg('foo')` - this method print message or group of messages. It's useful for print information about initialized some classes, launched complicated functions or other important messages.
* `window.debug.grid(noColumns)` - method to create a grid layout with default 12 columns. It helps with adjust blocks to layout.
* `window.debug.addEvent(name, desc, callback)` - method to register important functions for debugging.
* `window.debug.updateEvent(name, desc, callback)` - method to update registered event.
* `window.debug.launchEvent(name)` - method to launch callback function from the registered event.

### Events
It's a list of events available to launch only when the debug mode is on.

## Adjustment or/and extend
There are two ways to make the adjustment/extend for this library. 

* Change settings - only for a small adjustment
* Extend other class - for a big adjustment and extend

### Extend
[How to extend by MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends)

Extend your class like that:

```javascript
class FooClass extends Debugger {
    constructor(flag = false, userSettings = {}) {
        super(flag, userSettings);

        // your code
    }
}
```

#### Best methods to overwrite
`createGridHTML(id, numb)` it create the grid HTML but not is responsible for columns and the style. **id** and **numb** is important and should stay like that.

The method looks that:

```javascript
createGridHTML(id, numb) {
    return `
        <div id="${id}">
            <div class="container">
                <div class="row">
                    ${this.gridColumns(numb)} // create the columns HTML
                </div>
            </div>

            ${this.gridStyle(id)} // create the style
        </div>
    `;
}
```

`gridColumns(numb)` is responsible for creating columns. The **numb** variable tells us how many columns we get.

The method looks that:

```javascript
const size = this.settings.maxColumns / numb;
    let html = '';

    while (numb > 0) {
        html += `<div class="col-xs-${size}"></div>`;
        numb--;
    }

    return html;
```

`gridStyle(id)` is resposible for creating style for the grid. Is depend on the gridID (id);

```javascript
gridStyle(id) {
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
```