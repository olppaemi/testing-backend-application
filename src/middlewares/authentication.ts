import * as crypto from 'crypto'
import { Context, Next } from 'koa'

export const users = new Map<string, { email: string; passwordHash: string }>()

export const hashPassword = (password: string) => {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export const credentialsAreValid = (username: string, password: string) => {
  const userExists = users.has(username)
  if (!userExists) return false
  const currentPasswordHash = users.get(username)!.passwordHash
  return hashPassword(password) === currentPasswordHash
}

export const authentication = async (ctx: Context, next: Next) => {
  try {
    const authHeader = ctx.request.headers.authorization
    if (!authHeader || !authHeader.startsWith('Basic')) {
      throw new Error('invalid credentials')
    }

    const credentials = Buffer.from(
      authHeader.slice('Basic'.length + 1),
      'base64'
    ).toString()
    const [username, password] = credentials.split(':')

    if (!credentialsAreValid(username, password)) {
      throw new Error('invalid credentials')
    }
  } catch (e) {
    ctx.status = 401
    ctx.body = { message: 'please provide valid credentials' }
    return
  }

  await next()
}
