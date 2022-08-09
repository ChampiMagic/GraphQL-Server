import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { gql, useQuery } from '@apollo/client'
import Person from '../components/Person'
import Principal from '../components/principal'
import PersonForm from '../components/PersonForm'
import PhoneForm from '../components/PhoneForm'
import LoginForm from '../components/LoginForm'
import { useApolloClient } from '@apollo/client'
import { ALL_PERSONS } from '../utils/graphQueries'




function App() {
                                      /*{pollInterval: 2000}*/
  const {data, loading, error} = useQuery(ALL_PERSONS)

  const [person, setPerson] = useState(null)

  const [token, setToken] = useState(null)

  const client = useApolloClient()
  

  
  if(loading) {
    return <h1>LOADING....</h1>
  }

  if(error) {
    return <span>{error}</span>
  }

  const updatePrincipal = (principal) => {
    setPerson(principal)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
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
      {token?
        <button onClick={() => logout()} >Log out</button>
      :
      <LoginForm setToken={setToken} />
      }
      
      <PhoneForm />
      <PersonForm />
    </div>
  )
}

export default App
