![Hurdler logo](https://raw.github.com/jaydenseric/hurdler/master/hurdler-logo.svg)

# Hurdler hash routing

Semantic URL hash routing using tests. Ultra-lightweight with zero dependancies.

## Demo

Try out *demo.html* [via RawGit](http://rawgit.com/jaydenseric/Hurdler/master/demo.html).

## Browser support

Evergreen browsers and IE9.

## API

### `new Hurdler()`

Constructs a new Hurdler instance.

### `hurdler.addUniqueAction(id, action)`

Adds a new unique action that can be triggered once per hash change by multiple tests.

Param  | Type       | Description
------ | ---------- | ----------------------------------
id     | `string`   | Unique action ID.
action | `function` | Can only run once per hash change.

### `hurdler.addTest(id, test, action, uniqueActions)`

Adds a new test.

Param         | Type       | Description
------------- | ---------- | -----------------------------------------------------------
id            | `string`   | Unique test ID.
test          | `function` | Must return a boolean determining if the action should run.
action        | `function` | Action to run if the test passes.
uniqueActions | `array`    | Unique actions to run if the test passes.

### `hurdler.run(event)`

Runs tests and actions for the current URL hash.

Param | Type     | Description
----- | -------- | -----------------------------------------------------
event | `object` | Optional: Event to prevent default if a test matches.

### `hurdler.setHash(id, event)`

Sets the URL hash and runs the tests.

Param | Type     | Description
----- | -------- | -----------------------------------------------------
id    | `string` | A DOM element ID.
event | `object` | Optional: Event to prevent default if a test matches.
