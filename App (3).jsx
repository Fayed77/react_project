
import { useState, useRef, useEffect } from 'react'
import { Radio, RadioGroup } from '@sajari/react-components'
import './App.css'

function App() {
  useEffect(() => {getMenu();  }, []);

  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [orderId, setOrderId] = useState(-1);
  const addItemToCart = (item) => {
  setSelectedItems([...selectedItems, item]);  };
  const removeItemFromCart = (item) => {
  setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
  };
  const [uploadDone, setUploadDone] = useState(false);
  const [mealCategory, setMealCategory] = useState('breakfast');
  const filteredMenuItems = menuItems.filter((menuItem) => menuItem.meal === mealCategory);

  const handleClick = (category) => {
  setMealCategory(category);
  };

  function getMenu() {
    fetch('https://cmsc106.net/cafe/item')
    .then((response) => response.json())
    .then((response) => {
    setMenuItems(response);
      });
  }

  function uploadOrder(toPost) {
    fetch('https://cmsc106.net/cafe/purchase', {
    method: 'POST',
    body: JSON.stringify(toPost),
    headers: {
    'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((response) => {
      setOrderId(response);
      setUploadDone(true);
      });
  }

  if (!uploadDone) {
    return (
    <div>
    <div className="menu">
    <h3>Menu Items</h3>
    <table>
    <thead>
      <tr>
      <th>Item</th>
      <th>Price</th>
      <th>Add to Cart</th>
      </tr>
      </thead>
      <tbody>{filteredMenuItems.map((menuItem) => (  <MenuItemTable key={menuItem.iditem} menuItem={menuItem} addItemToCart={addItemToCart} />
  ))}
      </tbody>
      </table>
      </div>

      <div className="category-buttons">
      <button className={mealCategory =='breakfast' ? 'active' : ''} onClick={() => handleClick('breakfast')}>
      Breakfast
      </button>
      <button className={mealCategory == 'lunch' ? 'active' : ''} onClick={() => handleClick('lunch')}>
      Lunch
     </button>
      <button className={mealCategory =='dinner' ? 'active' : ''} onClick={() => handleClick('dinner')}>
      Dinner
      </button>
        </div>
        <hr />
        <Cart selectedItems={selectedItems} removeItemFromCart={removeItemFromCart} />
        <hr />
        <OrderPoster handlePost={uploadOrder} selectedItems={selectedItems} />
      </div>
    );
  } else {
return <div>Your order has been placed. Your order ID is {orderId}.</div>;}
}

function MenuItemTable({ menuItem, addItemToCart }) {
  return (
    <tr>
    <td>{menuItem.name}</td>
    <td>${menuItem.cost / 100}</td>
    <td>
    <AddToCartButton menuItem={menuItem} addItemToCart={addItemToCart} />
    </td>
    </tr>
  );
}

function CartItemTable({ cartItem, removeItemFromCart }) {
  return (
  <tr>
  <td>{cartItem.name}</td>
  <td>${cartItem.cost / 100}</td>
  <td><RemoveFromCartButton cartItem={cartItem} removeItemFromCart={removeItemFromCart} /></td>
  </tr>
  );
}

function RemoveFromCartButton({ cartItem, removeItemFromCart }) {
  const handleRemove = () => {removeItemFromCart(cartItem);};

return (<button onClick={handleRemove}>Remove</button>);
}

function AddToCartButton({ menuItem, addItemToCart }) {
const handleAddToCart = () => {addItemToCart(menuItem);};

return (  <button onClick={handleAddToCart}>Add to Cart</button>);
}

function Cart({ selectedItems, removeItemFromCart }) {
  if (selectedItems.length > 0) {
    return (
    <div className="cart">
    <h3>Cart</h3>
    <table>
    <thead>
    <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Remove</th>
   </tr>
  </thead>
  <tbody>
            {selectedItems.map((cartItem) => (
              <CartItemTable key={cartItem.iditem} cartItem={cartItem} removeItemFromCart={removeItemFromCart} />
            ))}
  </tbody>
  </table>
 </div>
    );
  } else {
    return (
    <div className="cart">
    <p>No items added to the cart</p>
    </div>
    );
  }
}

function OrderPoster({ handlePost, selectedItems }) {
  const nameField = useRef();
  const phoneField = useRef();
const handleSubmit = (e) => {
    e.preventDefault();

    const itemIds = selectedItems.map((item) => item.iditem);
const orderData = {
      customer: nameField.current.value,
      phone: phoneField.current.value,
      items: itemIds,
    };

  handlePost(orderData);  };

  return (
    <div className="order-poster">
    <h4>Order Information</h4>
    <form onSubmit={handleSubmit}>
  <p>Name: <input type="text" ref={nameField} /></p>
  <p>Phone Number: <input type="text" ref={phoneField} /></p>
    <p><button type="submit">Place Order</button></p>
      </form>
    </div>
  );
}

export default App