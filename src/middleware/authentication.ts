import * as crypto from 'crypto'

export const users = new Map()

export const hashPassword = (password: string) => {
  return crypto.createHash('sha256').update(password).digest('hex')
}
