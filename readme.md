# ![Hurdler](https://cdn.rawgit.com/jaydenseric/Hurdler/v4.0.1/hurdler-logo.svg)

![NPM version](https://img.shields.io/npm/v/hurdler.svg?style=flat-square) ![Github issues](https://img.shields.io/github/issues/jaydenseric/Hurdler.svg?style=flat-square) ![Github stars](https://img.shields.io/github/stars/jaydenseric/Hurdler.svg?style=flat-square)

Hurdler makes nested UI interactions simple to manage via URL hash.

- ES6 source with efficient transpilation in mind.
- Less than 1 KB compressed.
- IE 11 and modern browser support.
- [MIT license](https://en.wikipedia.org/wiki/MIT_License).

## How it works

1. A sprint is triggered manually or automatically when the URL hash changes with a valid target.
2. Hurdler sprints up the DOM from the target finding ancestor elements that match hurdles.
3. Jump callbacks run in top-down DOM order. Often components such as overlays need to be activated before descendants.

Lingo  | Meaning
:----- | :--------------------------------------------------------------------
Target | A DOM element targeted via ID in the URL hash; the sprint start line.
Sprint | A sprint up the DOM, looking for hurdles from the target.
Hurdle | A test and stuff to do when a DOM element passes.
Jump   | A hurdle that was found in a sprint.

## Benefits

When components such as modals and slideshows are navigated via URL hash:

- Controls are simple hash links; semantic with no click events to manage.
- Native browser back and forward controls navigate the UI.
- Component controls such as slideshow next buttons can be right-clicked and opened in a new tab, etc.
- Intuitively copy the URL to bookmark or share any part of the page.

With Hurdler:

- Even deeply nested pieces of content can be accessed by a short, single segment URL hash (e.g. `#/pricing`). Aside from looking nicer and being easier to tweet than multi-segment approaches (e.g. `#/section/overview/slide/pricing`), changing structure, components or content is less likely to break existing links.
- Components define their own hurdles; no centralized routes to setup.
- Dynamically inserting or moving components around is no problem; every sprint is a fresh search for hurdles to jump.

## Setup

Install Hurdler in your project as an NPM dependency:

```sh
npm install hurdler --save
```

Import it at the beginning of your app:

```javascript
import Hurdler from 'hurdler'
```

Initialize Hurdler:

```javascript
const hurdler = new Hurdler()
```

Setup hurdles:

```javascript
hurdler.addHurdle({
  test: element => {
    return element.tagName === 'SECTION'
  },
  onJump: element => {
    console.log('Jumped a section', element)
  }
})
```

Run a first sprint, after DOM ready:

```javascript
hurdler.sprint()
```

## API

### Hurdler

Creates a new Hurdler session. There should only be one instance per window.

**Parameters**

- `$0` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** (optional, default `{}`)

  - `$0.hashPrefix` **[[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** String between URL hash symbol and target element ID to denote Hurdler links. Prevents auto scroll. (optional, default `'/'`)
  - `$0.onSprintBefore` **[[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)]** Runs before each sprint.
  - `$0.onSprintAfter` **[[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)]** Runs after each sprint.
  - `$0.hurdles` **[[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[Hurdle](#hurdle)>]** List of hurdles. (optional, default `[]`)

**Examples**

```javascript
const hurdler = new Hurdler({
  hashPrefix: '!/'
})
```

#### target

The current URL hash target element, or null if nonexistent.

**Examples**

```javascript
console.log(hurdler.target)
```

#### addHurdle

Adds a hurdle.

**Parameters**

- `options` **[Hurdle](#hurdle)** A hurdle.

**Examples**

```javascript
hurdler.addHurdle({
  test: element => {
    return element.tagName === 'SECTION'
  },
  onJump: element => {
    console.log('Jumped a section', element)
  }
})
```

#### validateHash

Checks a provided URL hash matches the configured format.

**Parameters**

- `hash` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** A URL hash to validate.

**Examples**

```javascript
hurdler.validateHash(anExampleLinkElement.hash)
```

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** URL hash validity.

#### setTarget

Sets the URL hash target element, triggering a sprint.

**Parameters**

- `element` **[HTMLElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)** Element with an ID to target.

**Examples**

```javascript
hurdler.setTarget(anExampleElement)
```

#### clearTarget

Clears the window URL hash if a given element is targeted, or if the URL hash matches the configured Hurdler format.

**Parameters**

- `element` **[[HTMLElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)]** Element with an ID that you do not want targeted.

**Examples**

```javascript
hurdler.clearTarget(anExampleElement)
```

#### sprint

Jumps hurdles and runs callbacks for the current URL hash. Use after all hurdles have been added and the document is ready. Triggered automatically by URL hash changes.

**Examples**

```javascript
hurdler.sprint()
```

### Hurdle

An object holding a test and callbacks for when a DOM element passes.

**Properties**

- `test` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Accepts an element and returns a boolean if it matches the hurdle.
- `onJump` **[[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)]** Runs when the hurdle is jumped.

**Examples**

```javascript
{
  test: element => {
    return element.tagName === 'SECTION'
  },
  onJump: element => {
    console.log('Jumped a section', element)
  }
}
```
