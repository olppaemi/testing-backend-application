import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cartsRouter from './routes/carts'
import usersRouter from './routes/users'

const app = new Koa()

app.use(bodyParser())

app.use(cartsRouter.routes())
app.use(cartsRouter.allowedMethods())
app.use(usersRouter.routes())
app.use(usersRouter.allowedMethods())

const server = app.listen(3000)
export default server
