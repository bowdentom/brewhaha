import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import 'gestalt/dist/gestalt.css'

import App from './components/App'
import Navbar from './components/Navbar'
import registerServiceWorker from './registerServiceWorker'
import Signin from './components/Signin'
import Signup from './components/Signup'
import Checkout from './components/Checkout'
import Brews from './components/Brews'
import { getToken } from './utils'

// only allow authorized users to visit private routes
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      getToken() !== null ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location },
          }}
        />
      )
    }
  />
)

const Root = () => (
  <Router>
    <Fragment>
      <Navbar />
      <Switch>
        <Route component={App} exact path="/" />
        <Route component={Signin} path="/signin" />
        <Route component={Signup} path="/signup" />
        <PrivateRoute component={Checkout} path="/checkout" />
        <Route component={Brews} path="/:brandId" />
      </Switch>
    </Fragment>
  </Router>
)

ReactDOM.render(<Root />, document.getElementById('root'))
registerServiceWorker()
