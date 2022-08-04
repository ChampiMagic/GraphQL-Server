import {gql, ApolloServer, UserInputError} from "apollo-server";
import { v1 as uuid } from "uuid";


const Persons = [
    {
      "_id": "62eac9fecaf7d96211f397a0",
      "name": "Vazquez Pena",
      "phone": "+54 (860) 481-3060",
      "street": "586 Emerson Place",
      "city": "Tuskahoma"
    },
    {
      "_id": "62eac9fe9c0eeb6d6b2369b6",
      "name": "Angelica Cross",
      "phone": "+54 (868) 534-3086",
      "street": "228 Bancroft Place",
      "city": "Choctaw"
    },
    {
      "_id": "62eac9fecdfcd7ea585265d4",
      "name": "Jimmie Potts",
      "street": "376 Kingston Avenue",
      "city": "Allamuchy"
    },
    {
      "_id": "62eac9fe7f5eaaf7b9e677e2",
      "name": "Cleo Dunlap",
      "phone": "+54 (966) 533-2286",
      "street": "228 Bancroft Place",
      "city": "Marenisco"
    }
  ]


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
    _id: ID!
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
        allPersons: (root, args) => {
            if(!args.phone) return Persons

            return Persons
                .filter(person => args.phone === "YES"? person.phone : !person.phone)
        },
        findPerson: (root, args) => {
            const { name } = args;
            return Persons.find(person => person.name === name);
        }
    },
    Mutation: {
        addPerson: (root, args) => {
            if(Persons.find(p => p.name === args.name)) {
                throw new UserInputError("Name must be unique", {
                    argsError: args.name
                })
            }
            const person = {_id: uuid(), ...args}
            Persons.push(person) 
            return person
        },
        editPhone: (root, args) => {
            const personIndex = Persons.findIndex(p => p.name === args.name)
            if(!personIndex === -1) return null

            const person = Persons[personIndex]

            const updatePerson = {...person, phone: args.phone}
            Persons[personIndex] = updatePerson

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