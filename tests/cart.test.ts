import createHttpError from 'http-errors'
import {
  carts,
  addItemToCart,
  compliesToItemLimit,
} from '../src/controllers/cart'
import { inventory } from '../src/controllers/inventory'

afterEach(() => inventory.clear())
afterEach(() => carts.clear())

describe('cart', () => {
  describe('addItemToCart', () => {
    test('adding unavailable items to cart', () => {
      carts.set('test_user', [])
      inventory.set('cheesecake', 0)

      try {
        addItemToCart('test_user', 'cheesecake')
      } catch (e) {
        const expectedError = createHttpError(400, 'cheesecake is unavailable')
        expect(e).toEqual(expectedError)
      }

      expect(carts.get('test_user')).toEqual([])
      expect.assertions(2)
    })
  })

  describe('compliesToItemLimit', () => {
    test('returns true for carts with no more than 3 items of a kind', () => {
      const cart = ['cheesecake', 'cheesecake', 'almond brownie', 'apple pie']
      expect(compliesToItemLimit(cart)).toBe(true)
    })

    test('returns false for carts with more than 3 items of a kind', () => {
      const cart = [
        'cheesecake',
        'cheesecake',
        'almond brownie',
        'cheesecake',
        'cheesecake',
      ]
      expect(compliesToItemLimit(cart)).toBe(false)
    })
  })
})
