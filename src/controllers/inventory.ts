import createHttpError from 'http-errors'

export const inventory = new Map<string, number>()

export const removeFromInventory = (item: string) => {
  if (!inventory.has(item) || !(inventory.get(item)! > 0)) {
    throw createHttpError(400, `${item} is unavailable`)
  }
  inventory.set(item, inventory.get(item)! - 1)
}
