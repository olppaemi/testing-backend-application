import Koa, { Context, Next } from 'koa'
import bodyParser from 'koa-bodyparser'
import { authentication } from './middlewares/authentication'
import cartsRouter from './routes/carts'
import usersRouter from './routes/users'

const app = new Koa()

app.use(bodyParser())

app.use(async (ctx: Context, next: Next) => {
  if (ctx.url.startsWith('/carts')) {
    return await authentication(ctx, next)
  }

  await next()
})

app.use(cartsRouter.routes())
app.use(cartsRouter.allowedMethods())
app.use(usersRouter.routes())
app.use(usersRouter.allowedMethods())

const server = app.listen(3000)
export default server
