# ![Hurdler](http://jaydenseric.com/shared/hurdler-logo.svg)

Hurdler enables links direct to content deeply nested in UI components (hurdles), using URL hashes containing just the target element id. Try the [demo](http://rawgit.com/jaydenseric/Hurdler/master/demo.html) or check out [Skid](https://github.com/jaydenseric/Skid) for a working implementation.

Setup simple tests identifying hurdles along with callbacks for when they are encountered. By default, only URL hashes prefixed with `/` (eg. `href="#/menu"`) are operated on to avoid scroll jumping and page tearing. The prefix can be customized to avoid conflicts with other scripts using the URL hash.

General benefits to controlling components via URL hash:

- Links to specific, nested pieces of content can be bookmarked or shared.
- Users can intuitively right-click on a control (eg. a menu button) and open in a new tab.

Why Hurdler, and not a URL hash router like [director](https://github.com/flatiron/director) or [page.js](https://github.com/visionmedia/page.js)?

- No route configuration. Nest components in layouts however you like and even move them around on the fly!
- Components can be super portable with internally defined hurdles.
- Much shorter links.

Compare these equivalent links:

Hurdler     | Director/page.js
:-----------|:-------------------------------------------
`#/about`   | `#/section/about`
`#/gallery` | `#/section/about/tab/gallery`
`#/slide-1` | `#/section/about/tab/gallery/slide/slide-1`

## Browser support

[Evergreen browsers](http://stackoverflow.com/a/19060334) and IE 9+.

Be sure to polyfill:

- [`closest`](https://dom.spec.whatwg.org/#dom-element-closest)

## Usage

### Setup

1. Add [*hurdler.js*](https://github.com/jaydenseric/Hurdler/blob/master/hurdler.js) and [required polyfills](https://github.com/jaydenseric/Hurdler#browser-support).
2. Initiaze Hurdler.
3. Setup hurdles.
4. After adding hurdles and the document is ready, run a first sprint.

### Initiaze Hurdler

```js
var hurdler = new Hurdler({
  // option: value
});
```

Here are the available constructor options:

Option       | Type     | Description                                                  | Default
:------------|:---------|:-------------------------------------------------------------|:-------
`hashPrefix` | string   | String between the hash character and the element ID string. | `/`
`before`     | Array    | Functions for before each sprint.                            |
`after`      | Array    | Functions for after each sprint.                             |

### Add a hurdle

```js
hurdler.addHurdle({
  test: function(sprint) {
    return // Boolean test on this
  },
  callback: function(sprint) {
    // Runs if test succeeds
  }
});
```

Hurdle options:

Option     | Type     | Description
:----------|:---------|:----------------------------------------------------------
`test`     | function | Element test returning a boolean if it matches the hurdle.
`callback` | function | Callback to run if the test passes.

Every Hurdler sprint the `test` function will be applied to the URL hash target element and each ancestor. For example, the presence of a particular class name may trigger the callback.

Inside both the `test` and `callback` functions `this` is the test element. Both are passed the active sprint object, containing the target element and hurdles encountered so far. You can add to the sprint object to set custom flags accessible in callbacks for following hurdle encounters.

To prevent [issues](https://github.com/jaydenseric/Hurdler/issues/1), callbacks for hurdles found in a sprint are triggered in order of DOM nesting.

### Before & after sprint callbacks

Run callbacks are only triggered if the URL hash is in the configured Hurdler format and it matches an element ID.

You can add as many callbacks as you like, with `this` being the URL hash target element:

```js
hurdler.before.push(function(sprint) {
  // Do stuff
});
hurdler.after.push(function(sprint) {
  // Do stuff
});
```

### Run a sprint

Use `hurdler.sprint()` to find hurdles and run callbacks for the current URL hash. Use this after all hurdles have been added and the document is ready. A sprint happens whenever the URL hash changes.

### Working with the URL hash

#### Set the hash

Use `hurdler.setHash(id)`, with `id` being a target element ID string. Changing the URL hash triggers a sprint.

#### Clear the hash

Use `hurdler.clearHash(id)` to clear the URL hash if it contains the specified element ID string.

#### Get the hash target ID

Use `hurdler.getTargetId()` to get the target element ID from the URL hash. Returns `false` if no hash is set or the required prefix is missing.
