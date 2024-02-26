import { create } from 'zustand'
import { round2 } from '../utils'
import { OrderItem } from '../models/OrderModels'
import { persist } from 'zustand/middleware'

type Cart = {
  items: OrderItem[]
  itemPrice: number
  taxPrice: number
  shippingPrice: number
  totalPrice: number
}

const initialState: Cart = {
  items: [],
  itemPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
}

export const cartStore = create<Cart>()(
  persist(() => initialState, { name: 'cartStore' })
)

export default function useCartService() {
  const { items, itemPrice, taxPrice, shippingPrice, totalPrice } = cartStore()
  return {
    items,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    increase: (item: OrderItem) => {
      const exist = items.find((i) => i.slug === item.slug)
      const updateCartItems = exist
        ? items.map((i) =>
            i.slug === item.slug ? { ...exist, qty: exist.qty + 1 } : i
          )
        : [...items, { ...item, qty: 1 }]
      const { itemPrice, taxPrice, shippingPrice, totalPrice } =
        calcPrice(updateCartItems)
      cartStore.setState({
        items: updateCartItems,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      })
    },
    decrease: (item: OrderItem) => {
      const exist = items.find((i) => i.slug === item.slug)
      if (!exist) return
      const updateCartItems =
        exist.qty === 1
          ? items.filter((i: OrderItem) => i.slug !== item.slug)
          : items.map((i) =>
              i.slug === item.slug ? { ...exist, qty: exist.qty - 1 } : i
            )
      const { itemPrice, taxPrice, shippingPrice, totalPrice } =
        calcPrice(updateCartItems)
      cartStore.setState({
        items: updateCartItems,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      })
    },
  }
}

const calcPrice = (items: OrderItem[]) => {
  const itemPrice = round2(items.reduce((a, c) => a + c.price * c.qty, 0)),
    shippingPrice = round2(itemPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemPrice),
    totalPrice = round2(itemPrice + taxPrice + shippingPrice)
  return {
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  }
}
