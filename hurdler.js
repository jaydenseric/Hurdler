/**
 * Enables hash links to web page content hidden beneath layers of interaction.
 * @see https://github.com/jaydenseric/Hurdler
 * @version 1.0.0
 * @author Jayden Seric
 * @license MIT
 */
var Hurdler = {

  /**
   * @property {string} hashPrefix - String Hurdler expects between the hash character and the element ID string.
   */
  hashPrefix: '/',

  /**
   * @property {Array<{test: function, callback: function}>} tests - List of objects containing a test and callback function.
   */
  tests: [],

  /**
   * Runs tests and callbacks for the current URL hash. Use this after all your tests have been added and the document is ready.
   */
  run: function() {
    // Abandon if no URL hash
    if (location.hash) {
      var self = this;
      // Check hash matches the configured Hurdler format
      var hash = location.hash.split('#' + self.hashPrefix);
      if (hash.length == 2) {
        var element = document.querySelector('#' + hash[1]);
        // Only progress if the element exists
        if (element) {
          var session = {};
          // Start at the hash target and loop up the DOM
          for (; element && element !== document; element = element.parentNode) {
            // Run all tests on this DOM element
            for (var i in self.tests) {
              // Check test passes
              var passes = false;
              try { passes = self.tests[i].test.call(element, session) }
              catch(error) {} // Swallow test errors
              // Run the callback if the test passes
              if (passes) self.tests[i].callback.call(element, session);
            }
          }
        }
      }
    }
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
  }

};

// Run Hurdler on URL hash change
window.addEventListener('hashchange', function() { Hurdler.run() });
