import React, { useEffect } from "react"
import { gql, useLazyQuery } from "@apollo/client"


const FIND_PERSON = gql`
  query FindPerson($personName: String!) {
    findPerson(name: $personName) {
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

const Person = ({person, updatePrincipal}) => {
    if(person === null) return null

    const [getPerson, result] = useLazyQuery(FIND_PERSON)

    const nameToSearch = (name) => {
        getPerson({ variables: { personName: name } })
      }

    useEffect(() => {
        if(result.data) {
            updatePrincipal(result.data.findPerson)
        }
    }, [result])

    return (
        <div style={{border: "1px solid #fff", padding: "1%", margin: "5%"}}>
            <h2>{person.name}</h2>
            <h4>{person.phone}</h4>
            <br></br>
            <p>{person.address.city} {person.address.street}</p>
            <button onClick={() => nameToSearch(person.name)}>Details</button>
        </div>
    )
}

export default Person