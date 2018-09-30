import React from 'react'
import { Box, Button, Heading, Image, Text } from 'gestalt'
import { NavLink, withRouter } from 'react-router-dom'

import { clearCart, clearToken, getToken } from '../utils'

class Navbar extends React.Component {
  handleSignout = () => {
    clearToken()
    clearCart()
    this.props.history.push('/')
  }

  render() {
    return getToken() !== null ? <AuthNav handleSignout={this.handleSignout} /> : <UnAuthNav />
  }
}

const TitleAndLogo = () => (
  <NavLink activeClassName="active" exact to="/">
    <Box alignItems="center" display="flex">
      <Box height={50} margin={2} width={50}>
        <Image alt="Buy-a-Brew logo" naturalHeight={1} naturalWidth={1} src="./icons/logo.svg" />
      </Box>
      <div className="wordmark">
        <Heading color="orange" size="xs">
          Buy-a-Brew
        </Heading>
      </div>
    </Box>
  </NavLink>
)

const LinkOnNavbar = ({ linkLabel, linkToPath }) => (
  <NavLink activeClassName="active" to={linkToPath}>
    <Text color="white" size="xl">
      {linkLabel}
    </Text>
  </NavLink>
)

const AuthNav = ({ handleSignout }) => {
  return (
    <Box
      alignItems="center"
      color="midnight"
      display="flex"
      height={70}
      justifyContent="around"
      padding={1}
      shape="roundedBottom"
    >
      <LinkOnNavbar linkLabel="Checkout" linkToPath="/checkout" />
      <TitleAndLogo />
      {/* Sign out button */}
      <Button color="transparent" inline onClick={handleSignout} size="md" text="Sign Out" />
    </Box>
  )
}

const UnAuthNav = () => {
  return (
    <Box
      alignItems="center"
      color="midnight"
      display="flex"
      height={70}
      justifyContent="around"
      padding={1}
      shape="roundedBottom"
    >
      <LinkOnNavbar linkLabel="Sign In" linkToPath="/signin"/>
      <TitleAndLogo />
      <LinkOnNavbar linkLabel="Sign Up" linkToPath="/signup"/>
    </Box>
  )
}

export default withRouter(Navbar)
