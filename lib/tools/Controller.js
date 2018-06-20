const express = require('express')

module.exports = class Controller {
  constructor() {
    this.router = express.Router()

    this.async = fn =>
      (req, res, next, ...args) => {
        Promise.resolve(fn(req, res, next, ...args)).catch(next);
      }
  }
}
