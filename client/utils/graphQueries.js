import { gql } from "@apollo/client"
import { ALL_PERSON_DETAILS } from "./graphFragments"

export const ALL_PERSONS = gql`
  query {
    allPersons {
    ...AllPersonDetails
    }
  }

  ${ALL_PERSON_DETAILS}
`

export const FIND_PERSON = gql`
  query FindPerson($personName: String!) {
    findPerson(name: $personName) {
      ...AllPersonDetails
    }
  }

  ${ALL_PERSON_DETAILS}
`