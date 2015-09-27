/**
 * Enables hash links to web page content hidden beneath layers of interaction.
 * @see https://github.com/jaydenseric/Hurdler
 * @version 2.0.0
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
   * @property {Array<{test: function, callback: function}>} hurdles - List of hurdle objects containing a test and callback function.
   */
  hurdles: [],

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
   * Sets the URL hash.
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
   * Finds hurdles and runs callbacks for the current URL hash. Use this after all hurdles have been setup and the document is ready.
   */
  run: function() {
    // Progress if a URL hash is set
    if (location.hash) {
      // Check hash matches the configured Hurdler format
      var id = Hurdler.getTargetId();
      if (id) {
        var element = document.querySelector('#' + id);
        // Progress if the element exists
        if (element) {
          // Establish the run session
          var session = {
            target  : element,
            hurdles : []
          };
          // Start at the hash target and loop up the DOM
          for (; element && element !== document; element = element.parentNode) {
            // Check if element is a hurdle
            Hurdler.hurdles.forEach(function(hurdle) {
              var passes = false;
              try { passes = hurdle.test.call(element, session) }
              catch(error) {} // Swallow errors
              if (passes) {
                // Update list of found hurdles
                session.hurdles.unshift({
                  element  : element,
                  test     : hurdle.test,
                  callback : hurdle.callback
                });
              }
            });
          }
          // Run before run callbacks
          Hurdler.before.forEach(function(callback) {
            callback.call(session.target, session);
          });
          // Run hurdle callbacks
          session.hurdles.forEach(function(hurdle) {
            hurdle.callback.call(hurdle.element, session);
          });
          // Run after run callbacks
          Hurdler.after.forEach(function(callback) {
            callback.call(session.target, session);
          });
        }
      }
    }
  }

};

// Run Hurdler every URL hash change
window.addEventListener('hashchange', function() { Hurdler.run() });
