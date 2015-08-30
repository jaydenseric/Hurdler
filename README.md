# ![Hurdler logo](http://jaydenseric.com/shared/hurdler-logo.svg)

Hurdler enables hash links to web page content that is hidden beneath layers of interaction. Ultra-lightweight with zero dependancies.

On document ready or whenever the URL fragment identifier changes, Hurdler finds the hash target element and runs the configured tests. Each passing test triggers an action. Tests are repeated for each ansestor up the DOM.

Native scroll-jump behavior when a same-page hash link is clicked and a test passes is prevented with `event.preventDefault()`.

## Demo

Try out *demo.html* [via RawGit](http://rawgit.com/jaydenseric/Hurdler/master/demo.html).

## Browser support

Evergreen browsers.

## API

### `new Hurdler()`

Constructs a new Hurdler instance.

### `hurdler.addUniqueAction(id, action)`

Adds a new unique action that can be triggered once per hash change by multiple tests.

Param  | Type       | Description
------ | ---------- | -------------------------------------------------
id     | `string`   | Unique action ID.
action | `function` | Action intended to run only once per hash change.

### `hurdler.addTest(options)`

Adds a new test.

Param                   | Type       | Description
----------------------- | ---------- | -----------------------------------------------------------
options                 | `object`   | Options for the test.
options.id              | `string`   | Unique test ID.
options.test            | `function` | Must return a boolean determining if the action should run.
options.action          | `function` | Action to run if the test passes.
[options.uniqueActions] | `array`    | Optional: Unique actions to run if the test passes.

### `hurdler.run(event)`

Runs tests and actions for the current URL hash.

Param   | Type     | Description
------- | -------- | ----------------------------------------------------
[event] | `object` | Optional: Event to prevent default if a test passes.

### `hurdler.setHash(id, event)`

Sets the URL hash and runs the tests.

Param   | Type     | Description
------- | -------- | ----------------------------------------------------
id      | `string` | A DOM element ID.
[event] | `object` | Optional: Event to prevent default if a test passes.
