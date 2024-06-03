import React from 'react'
import { Container } from 'reactstrap'

const Loading = ({show}) => {
  return show && (
    <Container className='text-center p-4'>
        <h1>Loading....</h1>
    </Container>
  )
}

export default Loading
