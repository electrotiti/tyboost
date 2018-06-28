let chai = require('chai')
chai.should()

const Container = require('../../../lib/core/Container')

describe('Container', function () {

  describe('empty', function () {
    const container = new Container()

    it('should be empty', () => {
      container._services.size.should.be.eq(0)
      container._singletons.size.should.be.eq(0)
      container._config.should.be.deep.eq({})
    })

    it('should be throw exception on unknown service', () => {
      (function () {
        container.get('foo')
      }).should.throw(Error, 'Unknown service with name foo')
    })
  })

  describe('simple register', function () {
    const container = new Container()

    class myClassTest1 {
    }

    class myClassTest2 {
      constructor () {
        this.random = Math.random()
      }
    }

    it('should register a service', () => {
      (function () {
        container.register('myservice', myClassTest1)
        container._services.size.should.be.eq(1)
      }).should.not.throw(Error)
    })

    it('should get the service', () => {
      const myservice = container.get('myservice')
      myservice.should.be.instanceOf(myClassTest1)
    })

    it('should throw error with invalid name', () => {
      (function () {
        container.register('', myClassTest1)
      }).should.throw(Error, 'Invalid name. Name should be a string')
    })

    it('should throw error with name already used', () => {
      (function () {
        container.register('myservice', myClassTest1)
      }).should.throw(Error, 'A service is already register with the name: myservice')
    })

    it('should get a new service each call (not singleton)', () => {
      container.register('myservice2', myClassTest2, [], false)
      const myservice = container.get('myservice2')
      const myservice2 = container.get('myservice2')
      myservice.random.should.be.not.eq(myservice2.random)
    })

    it('should get a the service on each call (singleton)', () => {
      container.register('myservice3', myClassTest2, [], true)
      const myservice3 = container.get('myservice3')
      const myservice4 = container.get('myservice3')
      myservice3.random.should.be.eq(myservice4.random)
    })
  })

  describe('register with services dependencies', function () {
    const container2 = new Container()

    class myClassTest3 {
    }

    class myClassTest4 {
      constructor (dep1) {
        this.dep1 = dep1
      }
    }

    it('should register with dependencies', () => {
        container2.register('myservice', myClassTest3)
        container2._services.size.should.be.eq(1)
        container2.register('myservice2', myClassTest4, ['myservice'])
        container2._services.size.should.be.eq(2)
    })

    it('should have dependencies instantiate', () => {
      const myservice2 = container2.get('myservice2')
      myservice2.should.be.instanceOf(myClassTest4)
      myservice2.dep1.should.be.instanceOf(myClassTest3)
    })
  })

  describe('register with config', function () {
    const container3 = new Container({param1: "val1", param2: {sub_param1: "val2"}})

    class myClassTest5 {
      constructor (param1, param2) {
        this.param1 = param1
        this.param2 = param2
      }
    }

    it('should register with params', () => {
      container3.register('myservice', myClassTest5, ['%param1%', '%param2.sub_param1%'])
      container3._services.size.should.be.eq(1)
      const myservice3 = container3.get('myservice')
      myservice3.should.be.instanceOf(myClassTest5)
      myservice3.param1.should.be.eq('val1')
      myservice3.param2.should.be.eq('val2')
    })

    it('should throw error with unknown params level1', () => {
      (function () {
        container3.register('myservice2', myClassTest5, ['%param3%', '%param2.sub_param1%'])
      }).should.throw(Error, 'Unable to get config: param3')
    })

    it('should throw error with unknown params level2', () => {
      (function () {
        container3.register('myservice2', myClassTest5, ['%param1%', '%param2.sub_param2%'])
      }).should.throw(Error, 'Unable to get config: param2.sub_param2')
    })
  })
})
