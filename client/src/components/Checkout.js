import React, { Component, Fragment } from 'react'
import { Box, Button, Container, Heading, Modal, Spinner, Text, TextField } from 'gestalt'

import ToastMessage from './ToastMessage'
import { getCart, calculatePrice } from '../utils'

import Strapi from 'strapi-sdk-javascript/build/main'
const apiUrl = process.env.API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl)

class Checkout extends Component {
  state = {
    address: '',
    cartItems: [],
    city: '',
    confirmationEmail: '',
    modal: false,
    orderProcessing: false,
    postalCode: '',
    toast: false,
    toastMessage: '',
  }

  componentDidMount() {
    this.setState({ cartItems: getCart() })
  }

  handleChange = ({ event, value }) => {
    event.persist()
    this.setState({
      [event.target.name]: value,
    })
  }

  handleConfirmOrder = async event => {
    event.preventDefault()

    if (this.isFormEmpty(this.state)) {
      this.showToast('Fill in all fields')
      return
    }

    this.setState({ modal: true })
  }

  handleSubmitOrder = () => {}

  closeModal = () => this.setState({ modal: false })

  redirectUser = path => this.props.history.push(path)

  isFormEmpty = ({ address, city, confirmationEmail, postalCode }) => {
    return !address || !city || !confirmationEmail || !postalCode
  }

  showToast = toastMessage => {
    this.setState({
      toast: true,
      toastMessage,
    })
    setTimeout(
      () =>
        this.setState({
          toast: false,
          toastMessage: '',
        }),
      5000,
    )
  }

  render() {
    const { cartItems, modal, orderProcessing, toast, toastMessage } = this.state

    return (
      <Container>
        <Box
          alignItems="center"
          color="darkWash"
          direction="column"
          display="flex"
          justifyContent="center"
          margin={4}
          padding={4}
          shape="rounded"
        >
          <Heading color="midnight">Checkout</Heading>

          {cartItems.length > 0 ? (
            <Fragment>
              {/* User Cart */}
              <Box
                alignItems="center"
                direction="column"
                display="flex"
                justifyContent="center"
                marginTop={2}
                marginBottom={6}
              >
                <Text color="darkGray" italic>
                  {cartItems.length === 1
                    ? `${cartItems.length} Item for Checkout`
                    : `${cartItems.length} Items for Checkout`}
                </Text>

                <Box padding={2}>
                  {cartItems.map(item => (
                    <Box key={item._id} padding={1}>
                      <Text color="midnight">
                        {item.name} × {item.quantity} = ${(item.quantity * item.price).toFixed(2)}
                      </Text>
                    </Box>
                  ))}
                </Box>
                <Text bold>Total Amount: {calculatePrice(cartItems)}</Text>
              </Box>

              {/* Checkout Form */}
              <form
                onSubmit={this.handleConfirmOrder}
                style={{
                  display: 'inline-block',
                  textAlign: 'center',
                  maxWidth: 450,
                }}
              >
                {/* Shipping Address Input */}
                <TextField
                  id="address"
                  name="address"
                  onChange={this.handleChange}
                  placeholder="Shipping Address"
                  type="text"
                />

                {/* Postal Code Input */}
                <TextField
                  id="postalCode"
                  name="postalCode"
                  onChange={this.handleChange}
                  placeholder="Postal Code"
                  type="text"
                />

                {/* City Input */}
                <TextField
                  id="city"
                  name="city"
                  onChange={this.handleChange}
                  placeholder="City of Residence"
                  type="text"
                />

                {/* Confirmation Email Input */}
                <TextField
                  id="confirmationEmail"
                  name="confirmationEmail"
                  onChange={this.handleChange}
                  placeholder="Confirmation Email"
                  type="email"
                />

                {/* Stripe Submit Button */}
                <button id="stripe__button" type="submit">
                  Submit
                </button>
              </form>
            </Fragment>
          ) : (
            // Default text if no items in cart
            <Box color="darkWash" padding={4} shape="rounded">
              <Heading align="center" color="watermelon" size="xs">
                Your Cart is Empty
              </Heading>
              <Box marginTop={1}>
                <Text align="center" color="green" italic>
                  Add some Brews!
                </Text>
              </Box>
            </Box>
          )}
        </Box>
        <ToastMessage message={toastMessage} show={toast} />

        {/* Confirmation Modal */}
        {modal && (
          <ConfirmationModal
            cartItems={cartItems}
            closeModal={this.closeModal}
            handleSubmitOrder={this.handleSubmitOrder}
            orderProcessing={orderProcessing}
          />
        )}
      </Container>
    )
  }
}

const ConfirmationModal = ({ cartItems, closeModal, handleSubmitOrder, orderProcessing }) => (
  <Modal
    accessibilityCloseLabel="close"
    accessibilityModalLabel="Confirm Your Order"
    footer={
      <Box display="flex" justifyContent="center" marginLeft={-1} marginRight={-1}>
        <Box padding={1}>
          <Button disabled={orderProcessing} onClick={closeModal} size="lg" text="Cancel" />
        </Box>
        <Box padding={1}>
          <Button
            color="red"
            disabled={orderProcessing}
            onClick={handleSubmitOrder}
            size="lg"
            text="Submit"
          />
        </Box>
      </Box>
    }
    heading="Confirm Your Order"
    onDismiss={closeModal}
    role="alertdialog"
    size="sm"
  >
    {/* Order Summary */}
    {!orderProcessing && (
      <Box
        alignItems="center"
        color="lightWash"
        direction="column"
        display="flex"
        justifyContent="center"
        padding={2}
      >
        {cartItems.map(item => (
          <Box key={item._id} padding={1}>
            <Text color="red" size="lg">
              {item.name} × {item.quantity} = ${(item.quantity * item.price).toFixed(2)}
            </Text>
          </Box>
        ))}
        <Box paddingY={2}>
          <Text bold size="lg">
            Total: {calculatePrice(cartItems)}
          </Text>
        </Box>
      </Box>
    )}

    {/* Order Processing Spinner */}
    <Spinner accessibilityLabel="Order Processing Spinner" show={orderProcessing} />
    {orderProcessing && (
      <Text align="center" italic>
        Submitting Order...
      </Text>
    )}
  </Modal>
)

export default Checkout
