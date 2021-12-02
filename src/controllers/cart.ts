import { removeFromInventory } from './inventory'

export const carts = new Map<string, string[]>()

export const addItemToCart = (username: string, item: string) => {
  removeFromInventory(item)
  const newItems = (carts.get(username) || []).concat(item)
  carts.set(username, newItems)
  return newItems
}

export const compliesToItemLimit = (cart: string[]) => {
  const unitsPerItem = cart.reduce(
    (itemMap: { [item: string]: number }, itemName) => {
      const quantity = (itemMap[itemName] || 0) + 1
      return { ...itemMap, [itemName]: quantity }
    },
    {}
  )

  return Object.values(unitsPerItem).every(quantity => quantity < 3)
}
