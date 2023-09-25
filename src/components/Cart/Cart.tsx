import { FunctionComponent, useEffect } from 'react'
import useLocalStorageState from 'use-local-storage-state'

import { Quantifier } from '../Quantifier'
import { CartProps } from '../Products/Products.tsx'
import { TotalPrice } from '../TotalPrice'
import { Operation } from '../Quantifier/Quantifier.tsx'
import classes from './cart.module.scss'
import { useLocation } from 'react-router-dom'
import emptyCartImage from '../../assets/empty-cart.jpeg'


export const Cart: FunctionComponent = () => {
  const [cart, setCart] = useLocalStorageState<CartProps>('cart', {})
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  const handleRemoveProduct = (productId: number): void => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart }
      delete updatedCart[productId]
      return updatedCart
    })
  }

  const handleUpdateQuantity = (productId: number, operation: Operation) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart }
      if (updatedCart[productId]) {
        if (operation === 'increase') {
          updatedCart[productId] = { ...updatedCart[productId], quantity: updatedCart[productId].quantity + 1 }
        } else {
          updatedCart[productId] = { ...updatedCart[productId], quantity: updatedCart[productId].quantity - 1 }
        }
      }
      return updatedCart
    })
  }


  const getProducts = () => Object.values(cart || {})

  const totalPrice = getProducts().reduce((accumulator, product) => accumulator + (product.price * product.quantity), 0)

  return (
    <section className={classes.cart}>
       <h1>Cart</h1>
       
       {getProducts().length === 0 ? (
        <div className={classes.emptyCart}>
          <img src={emptyCartImage} alt="Empty Cart" />
          <h3> Your cart is empty.</h3>
          <p> Looks like you have not added anything to your cart. 
            Go ahead and explore products.</p>
        </div>
       ) : (
      <div className={classes.container}>
        {getProducts().map(product => (
          <div className={classes.product} key={product.id}>
            <img src={product.thumbnail} alt={product.title} />
            <h3>{product.title}</h3>
            <Quantifier
              removeProductCallback={() => handleRemoveProduct(product.id)}
              productId={product.id}
              handleUpdateQuantity={handleUpdateQuantity} />
          </div>
        ))}
      </div>
       )}
       {getProducts().length > 0 && <TotalPrice amount={totalPrice} />}
      </section>
  )
}
