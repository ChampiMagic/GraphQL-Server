import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { gql, useQuery, useLazyQuery } from '@apollo/client'
import Person from '../components/Person'
import Principal from '../components/principal'

const ALL_PERSONS = gql`
  query {
    allPersons {
      id
      name
      phone
      address {
        city
        street
      }
    }
  }
`


function App() {

  const {data, loading, error} = useQuery(ALL_PERSONS)

  const [person, setPerson] = useState(null)
  

  
  if(loading) {
    return <h1>LOADING....</h1>
  }

  if(error) {
    return <span>{error}</span>
  }

  const updatePrincipal = (principal) => {
    setPerson(principal)
  }

 

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>GraphQL + React</h1>
      {person && <Principal principal={person} key={person.id} />}
      {data.allPersons?.map(person => (<Person person={person} updatePrincipal={updatePrincipal} key={person.id}/>))}
    </div>
  )
}

export default App
