// App.js
import React from 'react'
import Layout from './components/Layout/Layout'
import { RegisterClientForm } from './components/Client/RegisterClientForm'

function App() {
  return (
    <>
      <Layout>
        <RegisterClientForm /> {/* Correct way to pass child component */}
      </Layout>
    </>
  )
}

export default App
