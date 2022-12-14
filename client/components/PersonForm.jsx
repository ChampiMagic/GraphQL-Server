import React, { useState } from "react"
import { gql, useMutation } from "@apollo/client"
import Notify from './Notify'
import { CREATE_PERSON } from "../utils/graphMutations"
import { ALL_PERSONS } from "../utils/graphQueries"




const PersonForm = () => {

    const [ errorMessage, setErrorMessage ] = useState(null)

    const notifyError = message => {
      setErrorMessage(message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

    const [ createPerson ] = useMutation(CREATE_PERSON, {
      refetchQueries: [ { query: ALL_PERSONS } ], //                   automatically (less efficient, error syntax null)
      onError: (error) => {
        notifyError(error.graphQLErrors[0].message)
      },
      // update: (store, response) => {                                 Manually (more efficient, but probability of syntax error is high)
      //   const dataInStore = store.readQuery({ query: ALL_PERSONS })
      //   store.writeQuery({
      //     query: ALL_PERSONS,
      //     data: {
      //       ...dataInStore,
      //       allPersons: [
      //         ...dataInStore.allPersons,
      //         response.data.addPerson
      //       ]
      //     }
      //   })
      // }
    })

    const [name, setName] = useState('')
    const [street, setStreet] = useState('')
    const [phone, setPhone] = useState('')
    const [city, setCity] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        if(name === "" || phone === "" || street === "" || city === ""){
          notifyError("complete all the fields")
        } else {
          createPerson({ variables: { name, street, phone, city } })

          setName('')
          setPhone('')
          setStreet('')
          setCity('')
        }
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
