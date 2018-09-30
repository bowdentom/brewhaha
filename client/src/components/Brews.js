import React, { Component, Fragment } from 'react'
import { Box, Button, Card, Heading, IconButton, Image, Mask, Text } from 'gestalt'
import { Link } from 'react-router-dom'

import { calculatePrice, getCart, setCart } from '../utils'
import Loader from './Loader'

import Strapi from 'strapi-sdk-javascript/build/main'
const apiUrl = process.env.API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl)

class Brews extends Component {
  state = {
    brews: [],
    brand: '',
    cartItems: [],
    loadingBrews: true,
  }

  async componentDidMount() {
    try {
      const response = await strapi.request('POST', '/graphql', {
        data: {
          query: `{
            brand(id: "${this.props.match.params.brandId}") {
              _id
              name
              brews {
                _id
                name
                description
                image {
                  url
                }
                price
              }
            }
          }`,
        },
      })
      this.setState({
        brews: response.data.brand.brews,
        brand: response.data.brand.name,
        cartItems: getCart(),
        loadingBrews: false,
      })
    } catch (err) {
      console.error(err)
    }
  }

  addToCart = brew => {
    const alreadyInCartItemIndex = this.state.cartItems.findIndex(item => item._id === brew._id)
    if (alreadyInCartItemIndex === -1) {
      // brew is NOT in cart, so add it with quantity of one
      const updatedItems = [...this.state.cartItems, {...brew, quantity: 1}]
      this.setState(
        { cartItems: updatedItems },
        () => setCart(updatedItems)
      )
    } else {
      // brew is in cart, so increase quantity by one
      const updatedItems = [...this.state.cartItems]
      updatedItems[alreadyInCartItemIndex].quantity += 1
      this.setState(
        { cartItems: updatedItems },
        () => setCart(updatedItems)
      )
    }
  }

  deleteItemFromCart = itemToDeleteId => {
    const filteredItems = this.state.cartItems.filter(item => item._id !== itemToDeleteId)
    this.setState(
      { cartItems: filteredItems },
      () => setCart(filteredItems)
    )
  }

  render() {
    const { brand, brews, cartItems, loadingBrews } = this.state

    return (
      <Fragment>
        { !loadingBrews &&
          (<Box
            alignItems="start"
            dangerouslySetInlineStyle={{
              __style: {
                flexWrap: "wrap-reverse",
              },
            }}
            display="flex"
            justifyContent="center"
            marginTop={4}
          >
            {/* Brews Section */}
            <Box alignItems="center" direction="column" display="flex">

              {/* Brews Heading */}
              <Box margin={2}>
                <Heading color="orchid">{brand}</Heading>
              </Box>

              {/* Brews */}
              <Box
                dangerouslySetInlineStyle={{
                  __style: {
                    backgroundColor: '#bdcdd9',
                  },
                }}
                display="flex"
                justifyContent="center"
                padding={4}
                shape="rounded"
                wrap
              >
                {brews.map(brew => (
                  <Box key={brew._id} margin={2} paddingY={4} width={210}>
                    <Card
                      image={
                        <Box height={250} width={200}>
                          <Image
                            alt="Brew"
                            fit="cover"
                            naturalHeight={1}
                            naturalWidth={1}
                            src={`${apiUrl}${brew.image.url}`}
                          />
                        </Box>
                      }
                    >
                      <Box
                        alignItems="center"
                        direction="column"
                        display="flex"
                        justifyContent="center"
                      >
                        <Box marginBottom={2}>
                          <Text bold size="xl">
                            {brew.name}
                          </Text>
                        </Box>
                        <Text>{brew.description}</Text>
                        <Text color="orchid">${brew.price}</Text>
                        <Box marginTop={2}>
                          <Text size="xl">
                            <Button
                              color="blue"
                              onClick={() => this.addToCart(brew)}
                              text="Add to Cart"
                            />
                          </Text>
                        </Box>
                      </Box>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* User Cart */}
            <Box alignSelf="end" marginTop={2} marginLeft={8}>
              <Mask shape="rounded" wash>
                <Box alignItems="center" direction="column" display="flex" padding={2}>
                  {/* User Cart Heading */}
                  <Heading align="center" size="sm">
                    Your Cart
                  </Heading>
                  <Text color="gray" italic>
                    {cartItems.length === 1
                      ? `${cartItems.length} item selected`
                      : `${cartItems.length} items selected`}
                  </Text>

                  {/* User Cart Items */}
                  {
                    cartItems.map(item => (
                      <Box alignItems="center" display="flex" key={item._id}>
                        <Text>
                          {item.name} × {item.quantity} = ${(item.quantity * item.price).toFixed(2)}
                        </Text>
                        <IconButton
                          accessibilityLabel="Delete Item"
                          icon="cancel"
                          iconColor="red"
                          onClick={() => this.deleteItemFromCart(item._id)}
                          size="xs"
                        />
                      </Box>
                    ))
                  }

                  <Box alignItems="center" direction="column" display="flex" justifyContent="center">
                    <Box margin={2}>
                      {cartItems.length === 0 && <Text color="red">Please select some items</Text>}
                    </Box>
                    <Text bold size="lg">Total: ${calculatePrice(cartItems)}</Text>
                    <Text>
                      <Link to="/checkout">Checkout</Link>
                    </Text>
                  </Box>
                </Box>
              </Mask>
            </Box>
          </Box>)
        }
        <Loader show={loadingBrews} />
      </Fragment>
    )
  }
}

export default Brews
