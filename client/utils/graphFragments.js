import { gql } from "@apollo/client";

export const ALL_PERSON_DETAILS = gql`
    fragment AllPersonDetails on Person {
        id
        name
        phone
        address {
            street
            city
        }
    }
`