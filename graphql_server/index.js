import {gql, ApolloServer, UserInputError} from "apollo-server";
import { v1 as uuid } from "uuid";
import axios from "axios";


const Persons = [
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
        personCount: () => Persons.length,
        allPersons: async (root, args) => {

            //const {data: personsData} = await axios.get("http://localhost:3000/persons");

            if(!args.phone) return Persons

            return Persons
                .filter(person => args.phone === "YES"? person.phone : !person.phone)
        },
        findPerson: async (root, args) => {
            const { name } = args;
            //const {data: personsData} = await axios.get("http://localhost:3000/persons");

            return Persons.find(person => person.name === name);
        }
    },
    Mutation: {
        addPerson: async (root, args) => {
            //const {data: personsData} = await axios.get("http://localhost:3000/persons");

                
            if(Persons.find(p => p.name === args.name)) {
                throw new UserInputError("Name must be unique", {
                    argsError: args.name
                })
            }

            const person = {id: uuid(), ...args}
            //await axios.post("http://localhost:3000/persons", JSON.stringify(person), {'Content-Type': 'application/json'});
            Persons.push(person)
            return person
        },
        editPhone: async (root, args) => {
            //const {data: personsData} = await axios.get("http://localhost:3000/persons");

            const personIndex = Persons.findIndex(p => p.name === args.name)

            if(personIndex === -1){
                throw new UserInputError("Name not Found", {
                    argsError: args.name
                })
            }
            
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