import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import 'gestalt/dist/gestalt.css'

import App from './components/App'
import Navbar from './components/Navbar'
import registerServiceWorker from './registerServiceWorker'
import Signin from './components/Signin'
import Signup from './components/Signup'
import Checkout from './components/Checkout'
import Brews from './components/Brews'

const Root = () => (
  <Router>
    <Fragment>
      <Navbar />
      <Switch>
        <Route component={App} exact path="/" />
        <Route component={Signin} path="/signin" />
        <Route component={Signup} path="/signup" />
        <Route component={Checkout} path="/checkout" />
        <Route component={Brews} path="/:brandId" />
      </Switch>
    </Fragment>
  </Router>
)

ReactDOM.render(<Root />, document.getElementById('root'))
registerServiceWorker()
