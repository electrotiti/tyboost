class Service2 {
  constructor (conf1, conf2 = 'default') {
    this.conf1 = conf1
    this.conf2 = conf2
  }

  getTestData () {
    return {res1: this.conf1, res2: this.conf2}
  }
}


module.exports = ['service2', Service2, ['%conf.param1%'], true]
