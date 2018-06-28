const Controller = require('tyboost/lib/tools/Controller')

class UserController extends Controller {
  constructor () {
    super()

    // Load routes
    this.router.get('/user', this.async(this.getUser.bind(this)))
  }

  getUser (req, res) {
    const container = req.app.get('context')
    const result = container.get('user').getById(2)
    res.json(result)
  }
}

const controller = new UserController()
module.exports = controller.router
