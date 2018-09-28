import React from 'react'
import { GridLoader } from 'react-spinners'
import { Box } from 'gestalt'

const Loader = ({ show }) => (
  show && <Box
    dangerouslySetInlineStyle={{
      __style: {
        left: "50%",
        top: "50%",
        transform: "translate(-50%)",
      }
    }}
    position="fixed"
  >
    <GridLoader color="darkorange" margin="3px" size={25} />
  </Box>
)

export default Loader
