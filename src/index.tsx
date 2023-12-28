import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import App from './App'
import { ConfigProvider } from 'antd'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: 'darkblue',
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
