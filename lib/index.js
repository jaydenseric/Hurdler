/**
 * Enables hash links to web page content hidden beneath layers of interaction.
 * @see https://github.com/jaydenseric/Hurdler
 * @version 3.0.0
 * @author Jayden Seric
 * @license MIT
 */
class Hurdler {

  /**
   * Constructs a new Hurdler instance with options.
   * @param {string} [hashPrefix='/'] - String between URL hash symbol and target element ID to denote Hurdler links. Prevents auto scroll.
   * @example
   * // Operates on URL hash changes via href="#/my-element-id"
   * const hurdler = new Hurdler()
   * @example
   * // Operates on URL hash changes via href="#!/my-element-id"
   * const hurdler = new Hurdler('!/')
   */
  constructor (hashPrefix = '/') {
    this.hashPrefix = hashPrefix
    this.before = this.hurdles = this.after = []
    // Run Hurdler every URL hash change
    window.addEventListener('hashchange', () => {
      this.run()
    })
  }

  /**
   * Sets the URL hash, triggering a run.
   * @param {string} id - Target element ID.
   * @example
   * hurdler.setHash('my-element-id')
   */
  static setHash (id) {
    window.location.hash = this.hashPrefix + id
  }

  /**
   * Gets the target element ID from the URL hash.
   * @returns {string|boolean} Target element ID or false if the URL hash is not set or invalid.
   */
  static getTargetId () {
    const hash = window.location.hash.split(`#${this.hashPrefix}`)
    return hash.length === 2 ? hash[1] : false
  }

  /**
   * Clears the URL hash if it contains a specific ID.
   * @param {string} id - Element ID.
   * @example
   * hurdler.clearHash('my-element-id')
   */
  static clearHash (id) {
    if (window.location.hash === `#${this.hashPrefix}${id}`) {
      if (window.history.pushState) window.history.pushState('', document.title, window.location.pathname + window.location.search)
      else window.location.hash = this.hashPrefix
    }
  }

  /**
   * Finds hurdles and runs callbacks for the current URL hash. Use this after all hurdles have been setup and the document is ready. URL hash changes automatically trigger a run.
   */
  run () {
    // Progress if a URL hash is set
    if (window.location.hash) {
      // Check hash matches the configured Hurdler format
      const id = this.getTargetId()
      if (id) {
        let element = document.querySelector(`#${id}`)
        // Progress if the element exists
        if (element) {
          // Establish the run session
          const session = {
            target: element,
            hurdles: []
          }
          // Start at the hash target and loop up the DOM
          for (; element && element !== document; element = element.parentNode) {
            // Check if element is a hurdle
            this.hurdles.forEach((hurdle) => {
              let passes = false
              try {
                passes = hurdle.test.call(element, session)
              } catch (error) {
                // Swallow errors
              }
              if (passes) {
                // Update list of found hurdles
                session.hurdles.unshift({
                  element,
                  test: hurdle.test,
                  callback: hurdle.callback
                })
              }
            })
          }
          // Run before run callbacks
          this.before.forEach((callback) => {
            callback.call(session.target, session)
          })
          // Run hurdle callbacks
          session.hurdles.forEach((hurdle) => {
            hurdle.callback.call(hurdle.element, session)
          })
          // Run after run callbacks
          this.after.forEach((callback) => {
            callback.call(session.target, session)
          })
        }
      }
    }
  }
}

export default Hurdler
