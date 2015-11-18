/**
 * Enables hash links to web page content hidden beneath layers of interaction.
 * @version 3.0.0
 * @author Jayden Seric
 * @license MIT
 * @see https://github.com/jaydenseric/Hurdler
 * @param {Object}     [options]              - Initialization options.
 * @param {string}     [options.hashPrefix=/] - String between the hash character and the element ID string.
 * @param {function[]} [options.before=[]]    - Functions for before each sprint.
 * @param {function[]} [options.after=[]]     - Functions for after each sprint.
 */
function Hurdler(options) {
  var self = this;
  options            = options            || {};
  self.hashPrefix    = options.hashPrefix || '/';
  self.before        = options.before     || [];
  self.after         = options.after      || [];
  self.hurdles       = [];
  self.lastSprint    = null;
  self.currentSprint = null;
  // Sprint Hurdler every URL hash change
  window.addEventListener('hashchange', function() { self.sprint() });
}

/**
 * Adds a new hurdle.
 * @param {Object}   options                - Hurdle options.
 * @param {function} options.test           - Element test returning a boolean if it matches the hurdle.
 * @param {function} options.callback       - Callback to run if the test passes.
 * @param {boolean}  [options.repeat=false] - Should the callback repeat if the same hurdle is encountered next sprint.
 */
Hurdler.prototype.addHurdle = function(options) {
  this.hurdles.push({
    test     : options.test,
    callback : options.callback,
    repeat   : options.repeat || false
  });
};

/**
 * Gets the target element ID from the URL hash.
 * @returns {string|boolean} Target element ID or false if hash not set or invalid.
 */
Hurdler.prototype.getTargetId = function() {
  var hash = location.hash.split('#' + this.hashPrefix);
  return hash.length == 2 ? hash[1] : false;
};

/**
 * Sets the URL hash.
 * @param {string} id - A DOM element ID.
 */
Hurdler.prototype.setHash = function(id) {
  location.hash = this.hashPrefix + id;
};

/**
 * Clears the URL hash if a particular hash is active.
 * @param {string} id - A DOM element ID.
 */
Hurdler.prototype.clearHash = function(id) {
  if (location.hash == '#' + this.hashPrefix + id) {
    if (history.pushState) history.pushState('', document.title, location.pathname + location.search);
    else location.hash = this.hashPrefix;
  }
};

/**
 * Finds hurdles and runs callbacks for the current URL hash. Use after hurdles added and document ready.
 */
Hurdler.prototype.sprint = function() {
  var self = this;
  // Shift current sprint to last sprint
  self.lastSprint = self.currentSprint;
  // Clear current sprint
  self.currentSprint = null;
  // Progress if a URL hash is set
  if (location.hash) {
    // Check hash matches the configured Hurdler format
    var id = self.getTargetId();
    if (id) {
      var element = document.querySelector('#' + id);
      // Progress if the element exists
      if (element) {
        // Update current sprint
        self.currentSprint = {
          target  : element,
          hurdles : []
        };
        // Start at the hash target and loop up the DOM
        for (; element && element !== document; element = element.parentNode) {
          // Check if element is a hurdle
          self.hurdles.forEach(function(hurdle) {
            var passes = false;
            try { passes = hurdle.test.call(element) }
            catch (error) {} // Swallow errors
            if (passes) {
              // Update list of hurdles found this sprint
              self.currentSprint.hurdles.unshift({
                element : element,
                hurdle  : hurdle
              });
            }
          });
        }
        // Run before sprint callbacks
        self.before.forEach(function(callback) {
          callback.call(self.currentSprint.target);
        });
        // Run sprint hurdle callbacks
        self.currentSprint.hurdles.forEach(function(currentSprintEncounter) {
          // Only allow callback to run if repeat allowed or not a repeat
          var run = true;
          if (!currentSprintEncounter.hurdle.repeat && self.lastSprint) {
            self.lastSprint.hurdles.forEach(function(lastSprintEncounter) {
              if (
                lastSprintEncounter.element == currentSprintEncounter.element &&
                lastSprintEncounter.hurdle  == currentSprintEncounter.hurdle
              ) run = false;
            });
          }
          if (run) currentSprintEncounter.hurdle.callback.call(self.currentSprint.target);
        });
        // Run after sprint callbacks
        self.after.forEach(function(callback) {
          callback.call(self.currentSprint.target);
        });
      }
    }
  }
};
