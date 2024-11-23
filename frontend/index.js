import './styles/reset.css'
import './styles/styles.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import  { resetStore }  from './state/store'
import App from './components/App'

const domNode = document.getElementById('root')
const root = createRoot(domNode)

root.render(
  <Provider store={resetStore()}>
    <App />
  </Provider>
)
