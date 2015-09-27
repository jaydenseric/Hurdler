# ![Hurdler](http://jaydenseric.com/shared/hurdler-logo.svg)

Hurdler enables hash links to web page content hidden beneath layers of interaction, written in lightweight plain JS.

Setup simple tests identifying hurdles along with callbacks for when they are encountered.

By default, only URL hashes prefixed with "/" are operated on to avoid browser scroll jumping and page tearing behaviours.

Try the [demo](http://rawgit.com/jaydenseric/Hurdler/master/demo.html) or check out [Skid](https://github.com/jaydenseric/Skid) to see a working implementation.

## Browser support

Evergreen browsers and IE9.

Be sure to include [a polyfill](https://plainjs.com/javascript/traversing/get-closest-element-by-selector-39) for [`Element.closest()`](https://developer.mozilla.org/docs/Web/API/Element/closest).

## Usage

Add [*hurdler.js*](https://github.com/jaydenseric/Hurdler/blob/master/hurdler.js) to your project before any scripts using it.

### Run session

All callbacks are passed a per-run `session` object containing:

- `target`: URL hash target element.
- `hurdles`: List of hurdles down to the target, including each hurdle element, test and callback.

You can add custom properties to the run session from within callbacks. Handy for tracking things you would like to happen once per run such as scrolling.

### Setup hurdles

To add a new hurdle test and callback:

```js
Hurdler.hurdles.push({
  test: function(session) {
    console.log(this, session);
    return /* Boolean logic */;
  },
  callback: function(session) {
    console.log(this, session);
  }
});
```

`test` must return a Boolean if the callback should fire, with `this` being the element to test. Every Hurdler run this test will be applied to the URL hash target element and each ancestor. For example, you may check if the element has a particular class.

`callback` runs if the test succeeds, with `this` being the tested element. To prevent [issues](https://github.com/jaydenseric/Hurdler/issues/1), callbacks for hurdles found in a run are triggered in order of DOM nesting.

### Before & after run callbacks

Run callbacks are only triggered if the URL hash is in the configured Hurdler format and it matches an element ID.

You can add as many callbacks as you like, with `this` being the URL hash target element:

```js
Hurdler.before.push(function(session) {
  console.log(this, session);
});

Hurdler.after.push(function(session) {
  console.log(this, session);
});
```

### Run

Use `Hurdler.run()` to find hurdles and run callbacks for the current URL hash. Use this after all hurdles have been setup and the document is ready. A run happens whenever the URL hash changes.

### Set hash

Use `Hurdler.setHash(id)`, with `id` being a target element ID string. Changing the URL hash triggers a run.

### Clear hash

Use `Hurdler.clearHash(id)` to clear the URL hash if it contains the specified element ID string.

### Get target ID

Use `Hurdler.getTargetId()` to get the target element ID from the URL hash. Returns `false` if no hash is set or the required prefix is missing.
