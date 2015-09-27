/**
 * Enables hash links to web page content hidden beneath layers of interaction.
 * @see https://github.com/jaydenseric/Hurdler
 * @version 1.2.0
 * @author Jayden Seric
 * @license MIT
 */
var Hurdler = {

  /**
   * @property {string} hashPrefix - String Hurdler expects between the hash character and the element ID string.
   */
  hashPrefix: '/',

  /**
   * @property {function[]} before - List of functions to run before each Hurdler run.
   */
  before: [],

  /**
   * @property {Array<{test: function, callback: function}>} tests - List of objects containing a test and callback function.
   */
  tests: [],

  /**
   * @property {function[]} after - List of functions to run after each Hurdler run.
   */
  after: [],

  /**
   * Gets the target element ID from the URL hash.
   * @returns {string|boolean} Target element ID or false if hash not set or invalid.
   */
  getTargetId: function() {
    var hash = location.hash.split('#' + this.hashPrefix);
    return hash.length == 2 ? hash[1] : false;
  },

  /**
   * Sets the URL hash and runs the tests.
   * @param {string} id - A DOM element ID.
   */
  setHash: function(id) {
    location.hash = this.hashPrefix + id;
  },

  /**
   * Clears the URL hash if a particular hash is active.
   * @param {string} id - A DOM element ID.
   */
  clearHash: function(id) {
    if (location.hash == '#' + this.hashPrefix + id) {
      if (history.pushState) history.pushState('', document.title, location.pathname + location.search);
      else location.hash = this.hashPrefix;
    }
  },

  /**
   * Runs tests and callbacks for the current URL hash. Use this after all your tests have been added and the document is ready.
   */
  run: function() {
    // Abandon if no URL hash
    if (location.hash) {
      // Check hash matches the configured Hurdler format
      var id = Hurdler.getTargetId();
      if (id) {
        var element = document.querySelector('#' + id);
        // Only progress if the element exists
        if (element) {
          // Establish the run session and store the target element
          var session = { target: element };
          // Run any before run functions
          for (var i in Hurdler.before) { Hurdler.before[i].call(Hurdler, session) }
          // Start at the hash target and loop up the DOM
          for (; element && element !== document; element = element.parentNode) {
            // Run all tests on this DOM element
            for (var i in Hurdler.tests) {
              // Check test passes
              var passes = false;
              try { passes = Hurdler.tests[i].test.call(element, session) }
              catch(error) {} // Swallow test errors
              // Run the callback if the test passes
              if (passes) Hurdler.tests[i].callback.call(element, session);
            }
          }
          // Run any after run functions
          for (var i in Hurdler.after) { Hurdler.after[i].call(Hurdler, session) }
        }
      }
    }
  }

};

// Run Hurdler every URL hash change
window.addEventListener('hashchange', function() { Hurdler.run() });
