class Service3 {
  constructor (service2, param2, param1) {
    this.service2= service2
    this.param2 = param2
    this.param1 = param1
  }

  getTestData () {
    return {data_service2: this.service2.getTestData(), data_service3: {param1: this.param1, param2: this.param2}}
  }
}


module.exports = ['service3', Service3, ['service2','%conf.param2%','%otherconf.param1%'], true]
