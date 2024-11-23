import { configureStore, createSlice } from '@reduxjs/toolkit';

const ordersSlice = createSlice({
  name: 'orders',
  initialState: [],
  reducers: {
    addOrder: (state, action) => {
      state.push(action.payload);
    },
    setOrders: (state, action) => {
      return action.payload; 
    },
    resetOrders: () => [],
  },
});

const sizeFilterSlice = createSlice({
  name: 'sizeFilter',
  initialState: 'All',
  reducers: {
    setSizeFilter: (state, action) => {
      return action.payload;
    },
  },
});

export const resetStore = () => {
  return configureStore({
    reducer: {
      orders: ordersSlice.reducer,
      sizeFilter: sizeFilterSlice.reducer,
    },
  });
};

export const { addOrder, setOrders, resetOrders } = ordersSlice.actions;
export const { setSizeFilter } = sizeFilterSlice.actions;
export const store = resetStore()