module.exports = class Initializer {

  /**
   * Init steps
   * @param steps
   */
  constructor (steps = []) {
    this._steps = steps
  }

  /**
   * Run all steps
   * @param context
   * @returns {Promise<*>}
   */
  async process (context) {
    const steps = this._steps

    for (let step of steps) {
      try {
        await step.call(this, context)
      } catch (e) {
        return Promise.reject(e)
      }
    }

    return Promise.resolve()
  }

  /**
   * Add a new step in the list
   * @param func
   */
  addStep (func) {
    this._steps.push(func)
  }
}

