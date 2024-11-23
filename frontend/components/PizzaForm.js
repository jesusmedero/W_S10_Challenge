import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addOrder, setOrders, } from '../state/store';
import axios from 'axios';

const initialFormState = {
  fullName: '',
  size: '',
  '1': false,
  '2': false,
  '3': false,
  '4': false,
  '5': false,
};

export default function PizzaForm() {
  const dispatch = useDispatch();
  const [formState, setFormState] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

 

  const validate = () => {
    const newErrors = {};

    
    if (!formState.fullName) {
      newErrors.fullName = 'fullName is required.';
    } else if (formState.fullName.length < 3) {
      newErrors.fullName = 'fullName must be at least 3 characters.';
    } else if (formState.fullName.length > 20) {
      newErrors.fullName = 'fullName cannot exceed 20 characters.';
    }

    
    if (!formState.size) {
      newErrors.size = 'Size must be one of the following values: S, M, L';
    }

    
    const allErrors = Object.values(newErrors).join(' ');
    setErrors({ all: allErrors });

    return !allErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    console.log('Order in progress');
    setIsSubmitting(true);

    const fullName = formState.fullName || '';
    const size = formState.size || '';

    const toppings = Object.keys(formState)
      .filter((key) => ['1', '2', '3', '4', '5'].includes(key) && formState[key])
      .map((key) => parseInt(key, 10));

    const newOrder = {
      fullName,
      size,
      toppings,
    };

    try {
      const response = await axios.post('http://localhost:9009/api/pizza/order', newOrder);

      dispatch(addOrder(response.data));

      const ordersResponse = await axios.get('http://localhost:9009/api/pizza/history');
      dispatch(setOrders(ordersResponse.data)); 

    
      setFormState(initialFormState);
      setErrors({});
    } catch (error) {
      console.error('Error', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Pizza Form</h2>

      {isSubmitting && <div className='pending'>Order in progress</div>}
      {errors.all && <div className="failure">Order failed: {errors.all}</div>}

      <div className="input-group">
        <label htmlFor="fullName">Full Name</label>
        <input
          data-testid="fullNameInput"
          id="fullName"
          name="fullName"
          value={formState.fullName}
          onChange={handleChange}
          placeholder="Type full name"
          type="text"
        />
      </div>

      <div className="input-group">
        <label htmlFor="size">Size</label>
        <select
          data-testid="sizeSelect"
          id="size"
          name="size"
          value={formState.size}
          onChange={handleChange}
        >
          <option value="">----Choose size----</option>
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
        </select>
        {errors.size && <div className="error">{errors.size}</div>}
      </div>

      <div className="input-group">
        <label>
          <input
            data-testid="checkPepperoni"
            name="1"
            type="checkbox"
            checked={formState['1']}
            onChange={handleChange}
          />
          Pepperoni
        </label>
        <label>
          <input
            data-testid="checkGreenpeppers"
            name="2"
            type="checkbox"
            checked={formState['2']}
            onChange={handleChange}
          />
          Green Peppers
        </label>
        <label>
          <input
            data-testid="checkPineapple"
            name="3"
            type="checkbox"
            checked={formState['3']}
            onChange={handleChange}
          />
          Pineapple
        </label>
        <label>
          <input
            data-testid="checkMushrooms"
            name="4"
            type="checkbox"
            checked={formState['4']}
            onChange={handleChange}
          />
          Mushrooms
        </label>
        <label>
          <input
            data-testid="checkHam"
            name="5"
            type="checkbox"
            checked={formState['5']}
            onChange={handleChange}
          />
          Ham
        </label>
      </div>

      <input data-testid="submit" type="submit" />
    </form>
  );
}
