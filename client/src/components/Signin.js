import React, { Component } from 'react'
import { Box, Button, Container, Heading, Text, TextField } from 'gestalt'

import ToastMessage from './ToastMessage'
import { setToken } from '../utils'

import Strapi from 'strapi-sdk-javascript/build/main'
const apiUrl = process.env.API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl)

class Signin extends Component {
  state = {
    loading: false,
    password: '',
    toast: false,
    toastMessage: '',
    username: '',
  }

  handleChange = ({ event, value }) => {
    event.persist()
    this.setState({
      [event.target.name]: value,
    })
  }

  handleSubmit = async event => {
    event.preventDefault()
    const { password, username } = this.state

    if (this.isFormEmpty(this.state)) {
      this.showToast('Fill in all fields')
      return
    }

    // Sign in user
    try {
      this.setState({ loading: true })
      const response = await strapi.login(username, password)
      this.setState({ loading: false })
      setToken(response.jwt)
      this.redirectUser('/')
    } catch(err) {
      this.setState({ loading: false })
      this.showToast(err.message)
    }
  }

  redirectUser = path => this.props.history.push(path)

  isFormEmpty = ({ password, username }) => {
    return !password || !username
  }

  showToast = toastMessage => {
    this.setState({
      toast: true,
      toastMessage,
    })
    setTimeout(
      () => this.setState({
        toast: false,
        toastMessage: '',
      }),
      5000
    )
  }

  render() {
    const { loading, toast, toastMessage } = this.state

    return (
      <Container>
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: '#d6a3b1',
            },
          }}
          display="flex"
          justifyContent="center"
          margin={4}
          padding={4}
          shape="rounded"
        >
          {/* Sign In Form */}
          <form
            onSubmit={this.handleSubmit}
            style={{
              display: 'inline-block',
              textAlign: 'center',
              maxWidth: 450,
            }}
          >
            <Box alignItems="center" direction="column" display="flex" marginBottom={2}>
              <Heading color="midnight">Welcome Back!</Heading>
            </Box>

            {/* Username Input */}
            <TextField
              id="username"
              name="username"
              onChange={this.handleChange}
              placeholder="Username"
              type="text"
            />

            {/* Password Input */}
            <TextField
              id="password"
              name="password"
              onChange={this.handleChange}
              placeholder="Password"
              type="password"
            />

            <Button color="blue" disabled={loading} inline text="Submit" type="submit" />
          </form>
        </Box>
        <ToastMessage message={toastMessage} show={toast} />
      </Container>
    )
  }
}

export default Signin
