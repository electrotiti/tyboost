module.exports =  class Service4 {
  constructor (param1, service = null) {
    this.param1 = param1
    this.service = service
  }

  getTestData () {
    return {res1: this.param1, service: this.service}
  }
}
