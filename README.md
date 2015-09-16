# ![Hurdler](http://jaydenseric.com/shared/hurdler-logo.svg)

Hurdler enables hash links to web page content hidden beneath layers of interaction, written in ultra-lightweight plain JS.

Setup simple tests identifying components along with callbacks for when they are encountered. When a valid URL hash is set all tests are run against the target element and ancestors.

By default, only URL hashes prefixed with "/" are operated on to avoid browser scroll jumping and page tearing behaviours.

Check out [Skid](https://github.com/jaydenseric/Skid) to see a working implementation.

## Browser support

Evergreen browsers and IE9.

Be sure to include [a polyfill](https://plainjs.com/javascript/traversing/get-closest-element-by-selector-39) for [`Element.closest()`](https://developer.mozilla.org/docs/Web/API/Element/closest).

## Usage

Add [*hurdler.js*](https://github.com/jaydenseric/Hurdler/blob/master/hurdler.js) to your project before any scripts using it.

### Setup tests

To add a new test and callback action:

```js
Hurdler.tests.push({
  test: function() {
    return // Logic resulting in true or false
  },
  callback: function(session) {
    // Test success actions
  }
});
```

- `test` must return a Boolean if the callback should fire. Every Hurdler run this test will be applied to the URL hash target element and each ancestor. For example, you may check if the element has a particular class.
- `callback` runs on a successful test. Hurdler passes it a per-run `session` object, handy for creating flags to ensure certain things (such as scrolling the page) only happen once per run. The tested element is available as `this`.

### Run

Use `Hurdler.run()` after all your tests have been added and the document is ready. A run happens automatically whenever the URL hash changes.

### Set hash

Use `Hurdler.setHash(id)`, with `id` being a target element ID string. Changing the URL hash triggers a run.

### Clear hash

Use `Hurdler.clearHash(id)` to clear the URL hash if it contains the specified element ID string.

### Get target ID

Use `Hurdler.getTargetId()` to get the target element ID from the URL hash. Returns `false` if no hash is set or the required prefix is missing.
