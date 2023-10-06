import React, { useRef } from "react";
import Link from "next/link";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import toast from "react-hot-toast";

import { useStateContext } from "@/context/StateContext";
import { urlFor } from "@/lib/client";
import getStripe from "@/lib/getStripe";

const Cart = () => {
  const cartRef = useRef();
  const {
    totalPrice,
    totalQuantities,
    cartItems,
    setshowCart,
    toggleCartItemQuantity,
    onRemove,
  } = useStateContext();
  const handleCheckout = async () => {
    const stripe = await getStripe();

    // 创建支付会话
    //向指定的服务器端 API 发送 HTTP POST 请求
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItems),
    });
    
    // 检查从服务器返回的 HTTP 响应中的状态码
    // 如果状态码是 500，表示服务器端出现了错误，代码中通过 return 来提前结束函数执行。
    if (response.statusCode == 500) return;
    const data = await response.json();
    console.log("Session id is: ", data.id); // 确保这里的值不为 undefined
    toast.loading("Redirecting...");
    // Go to stripe
    // 将用户从你的网站导航到 Stripe 提供的结帐页面，使他们能够完成付款
    stripe.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          onClick={() => setshowCart(false)}
        >
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">({totalQuantities} items)</span>
        </button>
        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={100} />
            <h3>Your shopping bag is empty</h3>
            <Link href="/">
              <button
                type="button"
                onClick={() => setshowCart(false)}
                className="btn"
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}
        <div className="product-container">
          {cartItems.length >= 1 &&
            cartItems.map((item) => (
              <div className="product" key={item._id}>
                <img
                  src={urlFor(item?.image[0])}
                  className="cart-product-image"
                />
                <div className="item-desc">
                  <div className="flex top">
                    <h7>
                      <b>{item.name}</b>
                    </h7>
                    <h7>RM{item.price}</h7>
                  </div>
                  <div className="flex bottom">
                    <div>
                      <p className="quantity-desc">
                        <span
                          className="minus"
                          onClick={() =>
                            toggleCartItemQuantity(item._id, "dec")
                          }
                        >
                          <AiOutlineMinus />
                        </span>
                        <span className="num">{item.quantity}</span>
                        <span
                          className="plus"
                          onClick={() =>
                            toggleCartItemQuantity(item._id, "inc")
                          }
                        >
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      className="remove-item"
                      onClick={() => onRemove(item)}
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          {cartItems.length >= 1 && (
            <div className="cart-bottom">
              <div className="total">
                <h4>Subtotal:</h4>
                <h4>RM{totalPrice}</h4>
              </div>
              <div className="btn-container">
                <button type="button" className="btn" onClick={handleCheckout}>
                  Pay with Stripe
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Cart;
