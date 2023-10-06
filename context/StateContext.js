//hook
import product from "@/sanityecommerce/schemas/product";
import React, { createContext, useContext, useState, UseEffect } from "react";
//pop up notification
import { toast } from "react-hot-toast";

const Context = createContext();

// props: children, whenever call the StateContext whatever pass into it, is going to be considered childern and render it out
export const StateContext = ({ children }) => {
  //default is false
  const [showCart, setshowCart] = useState(false);
  // default is empty
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);

  const [qty, setQty] = useState(1);

  let foundProduct;
  let index;

  const onRemove = (product) => {
    //找到我要操作的product
    foundProduct = cartItems.find((item) => item._id === product._id);
    // 删除
    const newCartItems = cartItems.filter((item) => item._id !== product._id)

    setTotalPrice((totalPrice) => totalPrice -foundProduct.price * foundProduct.quantity);
    setTotalQuantities(totalQuantities => totalQuantities - foundProduct.quantity);
    setCartItems(newCartItems);
  }

  const toggleCartItemQuantity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id);
    //index = cartItems.findIndex((item) => item._id === id);
    index = cartItems.findIndex((product) => product._id === id);
    // 定义一个新的 cartItem, 删掉原有的item，item id 等于想要操作的item的记录
    // 这样可以避免重复出现同一个Item好几行
    const newCartItems = cartItems.filter((item) => item._id !== id)

    if (value === "inc") {
      // newcartItems add new update
      setCartItems([
        ...newCartItems,
        { ...foundProduct, quantity: foundProduct.quantity + 1 },
      ]);
      setTotalPrice((totalPrice) => totalPrice + foundProduct.price);
      setTotalQuantities((totalQuantities) => totalQuantities + 1);
    } else if (value === "dec") {
      if (foundProduct.quantity > 1) {
        setCartItems([
          ...newCartItems,
          { ...foundProduct, quantity: foundProduct.quantity - 1 },
        ]);
        setTotalPrice((totalPrice) => totalPrice - foundProduct.price);
        setTotalQuantities((totalQuantities) => totalQuantities - 1);
      }
    }
  };

  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find(
      (item) => item._id === product._id
    );
    setTotalPrice((totalPrice) => totalPrice + product.price * quantity);
    setTotalQuantities((totalQuantities) => totalQuantities + quantity);

    if (checkProductInCart) {
      const updateCartItems = cartItems.map((cartPoduct) => {
        if (cartPoduct._id === product._id)
          return {
            ...cartPoduct,
            quantity: cartPoduct.quantity + quantity,
          };
      });
      setCartItems(updateCartItems);
    } else {
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);
    }
    toast.success(`${qty} ${product.name} added to the cart`);
  };

  const incQty = () => {
    setQty((qty) => qty + 1);
  };
  const decQty = () => {
    setQty((qty) => {
      if (qty - 1 < 1) return 1;
      return qty - 1;
    });
  };

  return (
    // not rendering anything, just wrapp everything with context provider and pass some value
    <Context.Provider
      value={{
        showCart,
        setshowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        setQty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuantity, 
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
