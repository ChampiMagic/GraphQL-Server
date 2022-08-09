import { gql } from "@apollo/client";
import { ALL_PERSON_DETAILS } from "./graphFragments";

export const LOGIN = gql`
mutation Login($username: String!, $password: String!) {
    login(
      username: $username
      password: $password
    ) {
      value
    }
  }
`

export const CREATE_PERSON = gql`
mutation AddPerson($name: String!, $phone: String!, $street: String!, $city: String!) {
   addPerson(
      name: $name
      phone: $phone
      street: $street
      city: $city
    ) {
     ...AllPersonDeatils
    }
  }

  
  ${ALL_PERSON_DETAILS}
`

export const EDIT_PHONE = gql`
mutation EditPhone($name: String!, $phone: String!) {
    editPhone(
      name: $name
      phone: $phone
    ) {
      id
      phone
    }
  }
`