import * as crypto from 'crypto'
import { Context } from 'koa'
import {
  authentication,
  credentialsAreValid,
  hashPassword,
  users,
} from '../src/middlewares/authentication'

afterEach(() => users.clear())

describe('hashPassword', () => {
  test('hashing passwords', () => {
    const plainTextPassword = 'password_example'
    const hash = crypto.createHash('sha256')

    hash.update(plainTextPassword)
    const expectedHash = hash.digest('hex')
    const actualHash = hashPassword(plainTextPassword)
    expect(actualHash).toBe(expectedHash)
  })

  test('validating credentials', () => {
    users.set('test_user', {
      email: 'test_user@example.org',
      passwordHash: hashPassword('a_password'),
    })

    const hasValidCredentials = credentialsAreValid('test_user', 'a_password')
    expect(hasValidCredentials).toBe(true)
  })

  describe('authentication', () => {
    test('returning an erro if the credentials are not valid', async () => {
      const fakeAuth = Buffer.from('invalid:credentials').toString('base64')
      const ctx: Context = {
        request: {
          headers: { authorization: `Basic ${fakeAuth}` },
        },
      } as Context
      const next = jest.fn()
      await authentication(ctx, next)
      expect(next.mock.calls).toHaveLength(0)
      expect(ctx).toEqual({
        ...ctx,
        status: 401,
        body: { message: 'please provide valid credentials' },
      })
    })
  })
})
