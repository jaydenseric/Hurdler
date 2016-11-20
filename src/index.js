/*!
 * Hurdler: https://github.com/jaydenseric/Hurdler
 * @version v4.0.1
 * @author Jayden Seric
 * @license MIT
 */

/**
 * Creates a new Hurdler session. There should only be one instance per window.
 * @class
 * @param {String} [$0.hashPrefix='/'] - String between URL hash symbol and target element ID to denote Hurdler links. Prevents auto scroll.
 * @param {function} [$0.onSprintBefore] - Runs before each sprint.
 * @param {function} [$0.onSprintAfter] - Runs after each sprint.
 * @param {Hurdle[]} [$0.hurdles=[]] - List of hurdles.
 * @example
 * const hurdler = new Hurdler({
 *   hashPrefix: '!/'
 * })
 */
function Hurdler ({
  hashPrefix = '/',
  onSprintBefore,
  onSprintAfter,
  hurdles = []
} = {}) {
  this.hashPrefix = hashPrefix
  this.onSprintBefore = onSprintBefore
  this.onSprintAfter = onSprintAfter
  this.hurdles = hurdles

  /**
   * The current URL hash target element, or null if nonexistent.
   * @type {HTMLElement|null}
   * @example
   * console.log(hurdler.target)
   */
  this.target = null

  // Sprint every URL hash change
  window.addEventListener('hashchange', this.sprint.bind(this))
}

/**
 * Adds a hurdle.
 * @param {Hurdle} options - A hurdle.
 * @example
 * hurdler.addHurdle({
 *   test: element => {
 *     return element.tagName === 'SECTION'
 *   },
 *   onJump: element => {
 *     console.log('Jumped a section', element)
 *   }
 * })
 */
Hurdler.prototype.addHurdle = function (options) {
  this.hurdles.push(options)
}

/**
 * Checks a provided URL hash matches the configured format.
 * @param {string} hash - A URL hash to validate.
 * @returns {boolean} URL hash validity.
 * @example
 * hurdler.validateHash(anExampleLinkElement.hash)
 */
Hurdler.prototype.validateHash = function (hash) {
  // http://stackoverflow.com/a/4579228/1596978
  return hash.lastIndexOf(this.hashPrefix, 0) === 0
}

/**
 * Gets the URL hash target element.
 * @private
 * @returns {HTMLElement|null} Element with the ID targeted, or null if nonexistent.
 */
Hurdler.prototype.getTarget = function () {
  const hash = window.location.hash.split(`#${this.hashPrefix}`)
  return hash.length === 2 ? document.getElementById(hash[1]) : null
}

/**
 * Sets the URL hash target element, triggering a sprint.
 * @param {HTMLElement} element - Element with an ID to target.
 * @example
 * hurdler.setTarget(anExampleElement)
 */
Hurdler.prototype.setTarget = function (element) {
  window.location.hash = this.hashPrefix + element.id
}

/**
 * Clears the window URL hash if a given element is targeted, or if the URL hash matches the configured Hurdler format.
 * @param {HTMLElement} [element] - Element with an ID that you do not want targeted.
 * @example
 * hurdler.clearTarget(anExampleElement)
 */
Hurdler.prototype.clearTarget = function (element) {
  if (
    element === undefined && this.validateHash(window.location.hash) ||
    window.location.hash === `#${this.hashPrefix}${element.id}`
  ) this.constructor.clearHash()
}

/**
 * Jumps hurdles and runs callbacks for the current URL hash. Use after all hurdles have been added and the document is ready. Triggered automatically by URL hash changes.
 * @example
 * hurdler.sprint()
 */
Hurdler.prototype.sprint = function () {
  // Update the target DOM element
  this.target = this.getTarget()
  // Only sprint if there is a target to start at
  if (this.target) {
    // Run before sprint callback
    if (typeof this.onSprintBefore === 'function') this.onSprintBefore()
    // Search from the target up the DOM for hurdles
    let jumps = []
    let testElement = this.target
    do {
      // Test every hurdle against the element
      this.hurdles.forEach(hurdle => {
        if (hurdle.test(testElement)) {
          // Store hurdle jump for callbacks later
          jumps.unshift({
            element: testElement,
            hurdle
          })
        }
      })
    } while ((testElement = testElement.parentElement))
    // Run hurdle jump callbacks
    jumps.forEach(jump => {
      if (typeof jump.hurdle.onJump === 'function') jump.hurdle.onJump(jump.element)
    })
    // Run after sprint callback
    if (typeof this.onSprintAfter === 'function') this.onSprintAfter()
  }
}

/**
 * Clears the URL hash.
 * @private
 */
Hurdler.clearHash = function () {
  window.history.pushState('', document.title, window.location.pathname + window.location.search)
}

/**
 * An object holding a test and callbacks for when a DOM element passes.
 * @typedef {Object} Hurdle
 * @property {function} test - Accepts an element and returns a boolean if it matches the hurdle.
 * @property {function} [onJump] - Runs when the hurdle is jumped.
 * @example
 * {
 *   test: element => {
 *     return element.tagName === 'SECTION'
 *   },
 *   onJump: element => {
 *     console.log('Jumped a section', element)
 *   }
 * }
 */

export default Hurdler
