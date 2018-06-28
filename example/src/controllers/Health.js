const Controller = require('tyboost/lib/tools/Controller')

class HealthController extends Controller {
  constructor () {
    super()

    // Load routes
    this.router.get('/health', this.async(this.checkHealth.bind(this)))
  }

  checkHealth (req, res) {
    res.json({route: 'health'})
  }
}

const controller = new HealthController()
module.exports = controller.router
