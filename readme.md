# ![Hurdler](http://jaydenseric.com/shared/hurdler-logo.svg)

![NPM version](https://img.shields.io/npm/v/hurdler.svg?style=flat-square)
![Github issues](https://img.shields.io/github/issues/jaydenseric/Hurdler.svg?style=flat-square)
![Github stars](https://img.shields.io/github/stars/jaydenseric/Hurdler.svg?style=flat-square)

Hurdler enables modular client-side URL hash routing. Each URL hash route only contains a target element ID. Hurdler runs up the DOM from the target, finding ancestor elements that match defined hurdles. It then triggers their actions from top to bottom.

- Setup simple tests identifying hurdles along with callbacks for when they are encountered.
- By default, only URL hashes with the configured prefix are operated on. This prevents auto scroll and allows you to run Hurdler alongside other routers.
- Implements UMD.
- IE 11 and modern browser support. IE 9+ may work without guarantee.
- [MIT license](https://en.wikipedia.org/wiki/MIT_License).

## Use cases

- A user should be able to navigate to a slide in a tab of a section, copy the URL and share a direct link with a friend. The URL hash should be short and describe the target content.
- A user should be able to right-click a slideshow next button and open that content in a new browser tab.
- A developer should be able to build a modular UI component library with self contained URL hash behaviors to allow ad hoc component nesting.

## Limitations

- Hurdler only works when the URL hash target element exists on the page. You will need a traditional router to load in nested fetched content.
- State can not be held in Hurdler URL hashes as with other routers that allow URL hash segment parameters.

## Setup

Install Hurdler in your project as an NPM dependency:

```shell
npm install hurdler --save
```

Hurdler implements UMD. Import it at the beginning of your app:

```js
import Hurdler from 'hurdler'
```

Initialize Hurdler:

```js
const hurdler = new Hurdler()
```

An app should only have one Hurdler instance. Pass it as an initialization parameter to components so they can define hurdles internally.

## Define hurdles

To add a new hurdle test and callback:

```js
hurdler.hurdles.push({
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

## Before & after run callbacks

Run callbacks are only triggered if the URL hash is in the configured Hurdler format and it matches an element ID.

You can add as many callbacks as you like, with `this` being the URL hash target element:

```js
hurdler.before.push(function(session) {
  console.log(this, session);
});

hurdler.after.push(function(session) {
  console.log(this, session);
});
```

## Run sessions

All callbacks are passed a per-run `session` object containing:

- `target`: URL hash target element.
- `hurdles`: List of hurdles down to the target, including each hurdle element, test and callback.

You can add custom properties to the run session from within callbacks. Handy for tracking things you would like to happen once per run such as scrolling.

## API

<a name="new_Hurdler_new"></a>

### new Hurdler([hashPrefix])
Constructs a new Hurdler instance with options.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [hashPrefix] | <code>string</code> | <code>&quot;&#x27;/&#x27;&quot;</code> | String between URL hash symbol and target element ID to denote Hurdler links. Prevents auto scroll. |

**Example**  
```js
// Operates on URL hash changes via href="#/my-element-id"
const hurdler = new Hurdler()
```
**Example**  
```js
// Operates on URL hash changes via href="#!/my-element-id"
const hurdler = new Hurdler('!/')
```
<a name="Hurdler+run"></a>

### hurdler.run()
Finds hurdles and runs callbacks for the current URL hash. Use this after all hurdles have been setup and the document is ready. URL hash changes automatically trigger a run.

**Kind**: instance method of <code>[Hurdler](#Hurdler)</code>  
<a name="Hurdler.setHash"></a>

### Hurdler.setHash(id)
Sets the URL hash, triggering a run.

**Kind**: static method of <code>[Hurdler](#Hurdler)</code>  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Target element ID. |

**Example**  
```js
hurdler.setHash('my-element-id')
```
<a name="Hurdler.getTargetId"></a>

### Hurdler.getTargetId() ⇒ <code>string</code> &#124; <code>boolean</code>
Gets the target element ID from the URL hash.

**Kind**: static method of <code>[Hurdler](#Hurdler)</code>  
**Returns**: <code>string</code> &#124; <code>boolean</code> - Target element ID or false if the URL hash is not set or invalid.  
<a name="Hurdler.clearHash"></a>

### Hurdler.clearHash(id)
Clears the URL hash if it contains a specific ID.

**Kind**: static method of <code>[Hurdler](#Hurdler)</code>  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | Element ID. |

**Example**  
```js
hurdler.clearHash('my-element-id')
```
