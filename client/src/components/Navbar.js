import React from 'react'
import { Box, Heading, Image, Text } from 'gestalt'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
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
      {/* Sign in link */}
      <NavLink activeClassName="active" to="/signin">
        <Text color="white" size="xl">
          Sign In
        </Text>
      </NavLink>

      {/* Title and Logo */}
      <NavLink activeClassName="active" exact to="/">
        <Box alignItems="center" display="flex">
          <Box height={50} margin={2} width={50}>
            <Image alt="BrewHaha logo" naturalHeight={1} naturalWidth={1} src="./icons/logo.svg" />
          </Box>
          <Heading color="orange" size="xs">
            BrewHaha
          </Heading>
        </Box>
      </NavLink>

      {/* Sign up link */}
      <NavLink activeClassName="active" to="/signup">
        <Text color="white" size="xl">
          Sign Up
        </Text>
      </NavLink>
    </Box>
  )
}

export default Navbar
