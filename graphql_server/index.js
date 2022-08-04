import {gql, ApolloServer, UserInputError} from "apollo-server";
import { v1 as uuid } from "uuid";
import axios from "axios";





const typeDefs = gql`

enum YesNo {
    YES
    NO
}

 type Address {
    street: String!
    city: String!
 }

 type Person {
    id: ID!
    name: String!
    phone: String
    address: Address!
    console: String
 }

 type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person
 }

 type Mutation {
    addPerson(
        name: String!
        phone: String
        street: String!
        city: String!
    ): Person
    editPhone (
        name: String!
        phone: String!
    ): Person
 }
`

const resolvers = {
    Query: {
        personCount: () => Persons.length,
        allPersons: async (root, args) => {

            const {data: personsData} = await axios.get("http://localhost:3000/persons");

            if(!args.phone) return personsData

            return personsData
                .filter(person => args.phone === "YES"? person.phone : !person.phone)
        },
        findPerson: async (root, args) => {
            const { name } = args;
            const {data: personsData} = await axios.get("http://localhost:3000/persons");

            return personsData.find(person => person.name === name);
        }
    },
    Mutation: {
        addPerson: async (root, args) => {
            const {data: personsData} = await axios.get("http://localhost:3000/persons");

            if(personsData.find(p => p.name === args.name)) {
                throw new UserInputError("Name must be unique", {
                    argsError: args.name
                })
            }
            const person = {id: uuid(), ...args}
            await axios.post("http://localhost:3000/persons", JSON.stringify(person), {'Content-Type': 'application/json'});
            return person
        },
        editPhone: async (root, args) => {
            const {data: personsData} = await axios.get("http://localhost:3000/persons");

            const personIndex = personsData.findIndex(p => p.name === args.name)
            if(!personIndex === -1) return null

            const person = personsData[personIndex]

            const updatePerson = {...person, phone: args.phone}
            personsData[personIndex] = updatePerson

            return updatePerson
        }
    },
    Person: {
        address: (root) => {
            return {
                city: root.city,
                street: root.street
            }
            
        } 
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({url}) => {
    console.log(`Server on port ${url}`)
})