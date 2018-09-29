import React, { Component } from 'react'
import { Box, Card, Container, Heading, Icon, Image, SearchField, Text } from 'gestalt'
import { Link } from 'react-router-dom'

import './App.css'
import Loader from './Loader'

import Strapi from 'strapi-sdk-javascript/build/main'
const apiUrl = process.env.API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl)

class App extends Component {
  state = {
    brands: [],
    loadingBrands: true,
    searchTerm: '',
  }

  async componentDidMount() {
    try {
      const response = await strapi.request('POST', '/graphql', {
        data: {
          query: `query {
            brands {
              _id
              name
              description
              image {
                _id
                url
              }
            }
          }`,
        },
      })
      this.setState({
        brands: response.data.brands,
        loadingBrands: false,
      })
    } catch (err) {
      console.error(err)
      this.setState({
        loadingBrands: false,
      })
    }
  }

  handleChange = ({ value }) => {
    this.setState(
      { searchTerm: value },
      () => this.searchBrands()
    )
  }

  // Search on brand names on backend
  searchBrands = async () => {
    const response = await strapi.request('POST', '/graphql', {
      data: {
        query: `query {
          brands(where: {
            name_contains: "${this.state.searchTerm}"
          }) {
            _id
            name
            description
            image {
              _id
              url
            }
          }
        }`
      }
    })
    this.setState({
      brands: response.data.brands,
      loadingBrands: false,
    })
  }

  // filteredBrands = ({ searchTerm, brands }) => {
  //   return brands.filter(brand => {
  //     return (
  //       brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       brand.description.toLowerCase().includes(searchTerm.toLowerCase())
  //     )
  //   })
  // }

  render() {
    const { brands, loadingBrands, searchTerm } = this.state

    return (
      <Container>
        {/* Brands Search Field */}
        <Box display="flex" justifyContent="center" marginTop={4}>
          <SearchField
            accessibilityLabel="Brands Search Field"
            id="searchField"
            onChange={this.handleChange}
            placeholder="Search Brands"
            value={searchTerm}
          />
          <Box margin={3}>
            <Icon
              accessibilityLabel="Filter"
              color={searchTerm ? 'orange' : 'gray'}
              icon="filter"
              size={20}
            />
          </Box>
        </Box>

        {/* Brands Section */}
        <Box display="flex" justifyContent="center" marginBottom={2}>
          {/* Brands Header */}
          <Heading color="midnight" size="md">
            Brew Brands
          </Heading>
        </Box>

        {/* Brands */}
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: '#d6c8ec',
            },
          }}
          display="flex"
          justifyContent="around"
          shape="rounded"
          wrap
        >
          {brands.map(brand => (
            <Box key={brand._id} margin={2} paddingY={4} width={200}>
              <Link to={`/${brand._id}`}>
                <Card
                  image={
                    <Box height={200} width={200}>
                      <Image
                        alt="Brand"
                        fit="cover"
                        naturalHeight={1}
                        naturalWidth={1}
                        src={`${apiUrl}${brand.image.url}`}
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
                    <Text bold size="xl">
                      {brand.name}
                    </Text>
                    <Text>{brand.description}</Text>
                    <Box marginTop={2}>
                      <Text color="orange" size="xl">See Brews</Text>
                    </Box>
                  </Box>
                </Card>
              </Link>
            </Box>
          ))}
        </Box>
        <Loader show={loadingBrands} />
      </Container>
    )
  }
}

export default App
