import React, { useState } from "react"
import { gql, useMutation } from "@apollo/client"
import { ALL_PERSONS } from "../src/App"
import Notify from './Notify'


const CREATE_PERSON = gql`
mutation AddPerson($name: String!, $phone: String!, $street: String!, $city: String!) {
   addPerson(
      name: $name
      phone: $phone
      street: $street
      city: $city
    ) {
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

const PersonForm = () => {

    const [ errorMessage, setErrorMessage ] = useState(null)

    const notifyError = message => {
      setErrorMessage(message)
    }

    const [ createPerson ] = useMutation(CREATE_PERSON, {
      refetchQueries: [ { query: ALL_PERSONS } ],
      onError: (error) => {
        notifyError(error.graphQLErrors[0].message)
      }
    })

    const [name, setName] = useState('')
    const [street, setStreet] = useState('')
    const [phone, setPhone] = useState('')
    const [city, setCity] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        createPerson({ variables: { name, street, phone, city } })

        setName('')
        setPhone('')
        setStreet('')
        setCity('')
    }


    return (
        <div>
            <h1>Create a Person</h1>
            <Notify errorMessage={errorMessage}/>
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1em" }}>
                <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
                <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)}/>
                <input placeholder="Street" value={street} onChange={(e) => setStreet(e.target.value)}/>
                <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)}/>
                <button type="submit">Create</button>
            </form>
        </div>
    )
}

export default PersonForm
