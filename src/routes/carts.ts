import { HttpError } from 'http-errors'
import { Context } from 'koa'
import Router from 'koa-router'
import { addItemToCart, carts } from '../controllers/cart'
import { inventory } from '../controllers/inventory'

const router = new Router()

router.get('/carts/:username/items', (ctx: Context) => {
  const cart = carts.get(ctx.params.username)
  cart ? (ctx.body = cart) : (ctx.status = 404)
})

router.post('/carts/:username/items', (ctx: Context) => {
  const { username } = ctx.params
  const { item, quantity } = ctx.request.body

  for (let i = 0; i < quantity; i++) {
    try {
      const newItems = addItemToCart(username, item)
      ctx.body = newItems
    } catch (e) {
      if (e instanceof HttpError) {
        ctx.body = { message: e.message }
        ctx.status = e.statusCode
        return
      }
    }
  }
})

router.post('/carts/:username/items/:item', (ctx: Context) => {
  try {
    const { username, item }: { username: string; item: string } = ctx.params
    const newItems = addItemToCart(username, item)
    ctx.body = newItems
  } catch (e) {
    if (e instanceof HttpError) {
      ctx.body = { message: e.message }
      ctx.status = e.statusCode
      return
    }
  }
})

router.delete('/carts/:username/items/:item', (ctx: Context) => {
  const { username, item } = ctx.params
  if (!carts.has(username) || !carts.get(username)!.includes(item)) {
    ctx.body = { message: `${item} is not in the cart` }
    ctx.status = 400
    return
  }
  const newItems = (carts.get(username) || []).filter(i => i !== item)
  inventory.set(item, (inventory.get(item) || 0) + 1)
  carts.set(username, newItems)
  ctx.body = newItems
})

export default router
