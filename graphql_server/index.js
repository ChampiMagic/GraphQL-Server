import {gql, ApolloServer, UserInputError} from "apollo-server";
import { v1 as uuid } from "uuid";
import axios from "axios";
import './db.js'
import Person from './models/Person.js'


/*const Persons = [
      {
        "id": "62eac9fecaf7d96211f397a0",
        "name": "Vazquez Pena",
        "phone": "+54 (860) 481-3060",
        "street": "586 Emerson Place",
        "city": "Tuskahoma"
      },
      {
        "id": "62eac9fe9c0eeb6d6b2369b6",
        "name": "Angelica Cross",
        "phone": "+54 (868) 534-3086",
        "street": "228 Bancroft Place",
        "city": "Choctaw"
      },
      {
        "id": "62eac9fecdfcd7ea585265d4",
        "name": "Jimmie Potts",
        "street": "376 Kingston Avenue",
        "city": "Allamuchy"
      },
      {
        "id": "62eac9fe7f5eaaf7b9e677e2",
        "name": "Cleo Dunlap",
        "phone": "+54 (966) 533-2286",
        "street": "228 Bancroft Place",
        "city": "Marenisco"
      }
]*/


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
        personCount: () => Person.collection.countDocuments(),
        allPersons: async (root, args) => {
            //const {data: personsData} = await axios.get("http://localhost:3000/persons");

            return Person.find({})
        },
        findPerson: async (root, args) => {
            const { name } = args;
            //const {data: personsData} = await axios.get("http://localhost:3000/persons");

            return Person.findOne({ name })
        }
    },
    Mutation: {
        addPerson: (root, args) => {
            //const {data: personsData} = await axios.get("http://localhost:3000/persons");


            const person = new Person({ ...args })
            return person.save()

            //await axios.post("http://localhost:3000/persons", JSON.stringify(person), {'Content-Type': 'application/json'})
        },
        editPhone: async (root, args) => {
            //const {data: personsData} = await axios.get("http://localhost:3000/persons");

            const person = await Person.findOne({ name: args.name })
            person.phone = args.phone
            return person.save()
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