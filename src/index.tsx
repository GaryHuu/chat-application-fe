import ReactDOM from 'react-dom/client'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import App from 'App'
import { BrowserRouter } from 'react-router-dom'
import Provider from 'services/store'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <Provider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
