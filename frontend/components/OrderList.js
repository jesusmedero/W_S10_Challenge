import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setOrders, setSizeFilter } from '../state/store'; 
import axios from 'axios';

export default function OrderList() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders);
  const sizeFilter = useSelector((state) => state.sizeFilter);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:9009/api/pizza/history');
        
        dispatch(setOrders(response.data)); 
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [dispatch]);

  const filteredOrders = sizeFilter === 'All'
    ? orders
    : orders.filter((order) => order.size === sizeFilter);

  return (
    <div id="orderList">
      <h2>Pizza Orders</h2>
      <ol>
        {filteredOrders.map((order, index) => (
          <li key={index}>
            
            
            <div>
              {order.customer} ordered a size {order.size} with{' '}
              {order.toppings && Array.isArray(order.toppings) && order.toppings.length > 0
                ? `${order.toppings.length} topping${order.toppings.length !== 1 ? 's' : ''}`
                : 'no toppings'}
            </div>
          </li>
        ))}
      </ol>
      <div id="sizeFilters">
        Filter by size:
        {['All', 'S', 'M', 'L'].map((size) => {
          const className = `button-filter${size === sizeFilter ? ' active' : ''}`;
          return (
            <button
              data-testid={`filterBtn${size}`}
              className={className}
              key={size}
              onClick={() => dispatch(setSizeFilter(size))}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
