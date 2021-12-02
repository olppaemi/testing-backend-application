import createHttpError from 'http-errors'
import { Context } from 'koa'
import Router from 'koa-router'
import { hashPassword, users } from '../middleware/authentication'

const router = new Router()

router.put('/users/:username', (ctx: Context) => {
  const { username } = ctx.params
  const { email, password } = ctx.request.body
  const userAlreadyExists = users.has(username)
  if (userAlreadyExists) {
    throw createHttpError(400, `${username} already exists`)
  }
  users.set(username, { email, passwordHash: hashPassword(password) })
  return (ctx.body = { message: `${username} created successfully` })
})

export default router
