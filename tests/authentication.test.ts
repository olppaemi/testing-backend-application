import * as crypto from 'crypto'
import { hashPassword } from '../src/middleware/authentication'

describe('hashPassword', () => {
  test('hashing passwords', () => {
    const plainTextPassword = 'password_example'
    const hash = crypto.createHash('sha256')

    hash.update(plainTextPassword)
    const expectedHash = hash.digest('hex')
    const actualHash = hashPassword(plainTextPassword)
    expect(actualHash).toBe(expectedHash)
  })
})
