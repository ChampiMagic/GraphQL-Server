import React, { useState } from "react"
import { gql, useMutation } from "@apollo/client"
import Notify from "./Notify"



const EDIT_PHONE = gql`
mutation EditPhone($name: String!, $phone: String!) {
    editPhone(
      name: $name
      phone: $phone
    ) {
      id
      name
      phone
    }
  }
`

const PhoneForm = () => {


    const [ errorMessage, setErrorMessage ] = useState(null)

    const notifyError = message => {
      setErrorMessage(message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
        
      }

    const [ changePhone ] = useMutation(EDIT_PHONE, {
        onError: (error) => {
            notifyError(error.graphQLErrors[0].message)
        }
    })

    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()

        changePhone({ variables: { name, phone} })

        setName("")
        setPhone("")
    }

    return (
        <div>
            <h1>Change Phone Number</h1>
            <Notify errorMessage={errorMessage}/>
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1em" }}>
                <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
                <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)}/>
                <button type="submit">Change</button>
            </form>
        </div>
    )
}

export default PhoneForm
