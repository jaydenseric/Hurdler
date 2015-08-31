# ![Hurdler](http://jaydenseric.com/shared/hurdler-logo.svg)

Hurdler enables hash links to web page content that is hidden beneath layers of interaction. Ultra-lightweight plain JS.

Setup simple tests identifying components along with callbacks for what you want to happen when they are encountered. When a URL hash is set all tests are run against the target element and ancestors.

Native scroll-jump behaviour is prevented for same-page hash links that pass a test.

## Browser support

Evergreen browsers.

Be sure to include [a polyfill](https://plainjs.com/javascript/traversing/get-closest-element-by-selector-39) for [`Element.closest()`](https://developer.mozilla.org/docs/Web/API/Element/closest).

## Usage

### `new Hurdler()`

Constructs a new Hurdler instance.

### `hurdler.addTest(test, callback)`

Adds a new test.

Parameter | Type | Description
--- | --- | ---
test | function | Test returning a Boolean if the callback should fire.
callback | function | Callback to fire if the test passes. Passed a per-run session object argument, handy for creating custom flags to ensure certain things only happen once per run.

### `hurdler.run(event)`

Runs tests and callbacks for the current URL hash. Use this after all your tests have been added and the document is ready.

Parameter | Type | Description
---| --- | ---
[event] | object | Optional: Event to prevent default if a test passes.

### `hurdler.setHash(id, event)`

Sets the URL hash and runs the tests.

Parameter | Type | Description
--- | --- | ---
id | string | A DOM element ID.
[event] | object | Optional: Event to prevent default if a test passes.

### `hurdler.clearHash(id)`

Clears the URL hash if a particular hash is active.

Parameter | Type | Description
--- | --- | ---
id | string | A DOM element ID.
