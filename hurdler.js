/**
 * Constructs a new Hurdler instance.
 * @class
 * @classdesc Hurdler enables hash links to web page content that is hidden beneath layers of interaction.
 * @version 1.0.0-alpha
 * @author Jayden Seric
 * @copyright 2015
 * @license MIT
 */
function Hurdler() {
  var self = this;
  self.uniqueActions = [];
  self.tests = [];
  // Ensure URL hash change triggers tests
  window.addEventListener('hashchange', self.run);
  // Prevent native scroll jump for same-page hash links that match a test
  document.addEventListener('click', function(event) {
    if (
      event.target.hash
      && event.target.search == location.search
      && (event.target.pathname == location.pathname || '/' + event.target.pathname == location.pathname)
      && event.target.host == location.host
    ) self.setHash(event.target.hash.substr(1), event);
  });
};

/**
 * Adds a new unique action that can be triggered once per hash change by multiple tests.
 * @method
 * @param {string} id - Unique action ID.
 * @param {function} action - Action intended to run only once per hash change.
 */
Hurdler.prototype.addUniqueAction = function(id, action) {
  this.uniqueActions[id] = action;
};

/**
 * Adds a new test.
 * @method
 * @param {object} options - Options for the test.
 * @param {string} options.id - Unique test ID.
 * @param {function} options.test - Must return a boolean determining if the action should run.
 * @param {function} options.action - Action to run if the test passes.
 * @param {array} [options.uniqueActions] - Optional: Unique actions to run if the test passes.
 */
Hurdler.prototype.addTest = function(options) {
  this.tests.push(options);
};

/**
 * Runs tests and actions for the current URL hash.
 * @method
 * @param {object} [event] - Optional: Event to prevent default if a test passes.
 */
Hurdler.prototype.run = function(event) {
  var self = this;
  // Abandon if no URL hash
  if (!location.hash) return;
  // Record used unique actions
  var usedUniqueActions = [];
  // Start at the hash target and loop up the DOM
  var node = document.querySelector(location.hash);
  for (; node && node !== document; node = node.parentNode) {
    // Run the tests on this DOM node
    for (var id in self.tests) {
      if (self.tests[id].test.call(node)) {
        // Test passed, prevent default event action (if supplied)
        if (event !== undefined) event.preventDefault();
        // Run the test passed action
        self.tests[id].action.call(node);
        // Check for unique actions
        if (self.tests[id].uniqueActions !== undefined) {
          for (var index in self.tests[id].uniqueActions) {
            // Get the unique action ID
            var uniqueActionID = self.tests[id].uniqueActions[index];
            // Check unique action unused
            if (usedUniqueActions.indexOf(uniqueActionID) == -1) {
              // Record unique action as used
              usedUniqueActions.push(uniqueActionID);
              // Run unique action
              self.uniqueActions[uniqueActionID].call(node);
            }
          }
        }
      }
    }
  }
};

/**
 * Sets the URL hash and runs the tests.
 * @method
 * @param {string} id - A DOM element ID.
 * @param {object} [event] - Optional: Event to prevent default if a test passes.
 */
Hurdler.prototype.setHash = function(id, event) {
  history.pushState(null, null, '#' + id);
  this.run(event);
};
