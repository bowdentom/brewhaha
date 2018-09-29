const CART_KEY = 'cart'
const TOKEN_KEY = 'jwt'

export const calculatePrice = items => {
  const totalPrice = items.reduce((acc, item) => acc + item.quantity * item.price, 0)
  return totalPrice.toFixed(2)
}

/* Local Storage */
export const setCart = (value, cartKey=CART_KEY) => {
  if (localStorage) {
    localStorage.setItem(cartKey, JSON.stringify(value))
  }
}

export const getCart = (cartKey=CART_KEY) => {
  if (localStorage && localStorage.getItem(cartKey)) {
    return JSON.parse(localStorage.getItem(cartKey))
  } else {
    return []
  }
}

export const clearCart = (cartKey=CART_KEY) => {
  if (localStorage) {
    localStorage.removeItem(cartKey)
  }
}

/* Auth */
export const setToken = (value, tokenKey=TOKEN_KEY) => {
  if (localStorage) {
    localStorage.setItem(tokenKey, JSON.stringify(value))
  }
}

export const getToken = (tokenKey=TOKEN_KEY) => {
  if (localStorage && localStorage.getItem(tokenKey)) {
    return JSON.parse(localStorage.getItem(tokenKey))
  } else {
    return null
  }
}

export const clearToken = (tokenKey=TOKEN_KEY) => {
  if (localStorage) {
    localStorage.removeItem(tokenKey)
  }
}
