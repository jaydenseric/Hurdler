/**
 * Constructs a new Hurdler instance.
 * @class
 * @classdesc Hurdler: Semantic URL hash routing using tests.
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
  // Polyfill Element.matches()
  var ep = Element.prototype;
  if (Element && !ep.matches) ep.matches = ep.matchesSelector || ep.webkitMatchesSelector || ep.mozMatchesSelector || ep.oMatchesSelector || ep.msMatchesSelector;
  // Prevent native scroll jump behavior for hash links that trigger an action
  document.addEventListener('click', function(event) {
    if (event.target.matches('a[href^="#"]')) self.setHash(event.target.hash.substr(1), event);
  });
};

/**
 * Adds a new unique action that can be triggered once per hash change by multiple tests.
 * @method
 * @param {string} id - Unique action ID.
 * @param {function} action - Can only run once per hash change.
 */
Hurdler.prototype.addUniqueAction = function(id, action) {
  this.uniqueActions[id] = action;
};

/**
 * Adds a new test.
 * @method
 * @param {string} id - Unique test ID.
 * @param {function} test - Must return a boolean determining if the action should run.
 * @param {function} action - Action to run if the test passes.
 * @param {array} uniqueActions - Unique actions to run if the test passes.
 */
Hurdler.prototype.addTest = function(id, test, action, uniqueActions) {
  this.tests.push({
    id: id,
    test: test,
    action: action,
    uniqueActions: uniqueActions
  });
};

/**
 * Runs tests and actions for the current URL hash.
 * @method
 * @param {object} event - Optional: Event to prevent default if a test matches.
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
 * @param {object} event - Optional: Event to prevent default if a test matches.
 */
Hurdler.prototype.setHash = function(id, event) {
  history.pushState(null, null, '#' + id);
  this.run(event);
};
