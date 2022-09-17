import {gql, ApolloServer, UserInputError, AuthenticationError} from "apollo-server";
import { v1 as uuid } from "uuid";
import axios from "axios";
import './db.js'
import Person from './models/Person.js'
import User from './models/User.js'
import 'dotenv/config'
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET

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

 type User {
    id: ID!
    username: String!
    friend: [Person]!
 }

 type Token {
    value: String!
 }

 type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person
    me: User
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
    createUser (
        username: String!
    ) : User
    login (
        username: String!
        password: String!
    ) : Token
    addAsFriend (
        name: String!
    ) : User
 }
`

const resolvers = {
    Query: {
        personCount: () => Person.collection.countDocuments(),
        allPersons: async (root, args) => {
            //const {data: personsData} = await axios.get("http://localhost:3000/persons");

            if(!args.name) return Person.find({})

            return Person.find({ phone: { exists: args.phone === "YES" }})
        },
        findPerson: async (root, args) => {
            const { name } = args; 
            //const {data: personsData} = await axios.get("http://localhost:3000/persons");

            return Person.findOne({ name })
        },
        me: (root, args, context) => {
            return context.currentUser
        }
    },
    Mutation: {
        addPerson: async (root, args, context) => {
            //const {data: personsData} = await axios.get("http://localhost:3000/persons");
            const { currentUser } = context

            if(!currentUser) throw new AuthenticationError("not authenticated")

            const person = new Person({ ...args })

            try {
                await person.save()
               
              } catch (error) {
                 throw new UserInputError(error.message, {
                     invalidArgs: args
                 })
              }

            return person

            //await axios.post("http://localhost:3000/persons", JSON.stringify(person), {'Content-Type': 'application/json'})
        },
        editPhone: async (root, args) => {
            //const {data: personsData} = await axios.get("http://localhost:3000/persons");

            const person = await Person.findOne({ name: args.name })

            if(!person) return 

            person.phone = args.phone

            try {
               await person.save()
             } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args
                })
             }

             return person 
            
        },
        createUser: async (root, args) => {
            const newUser = new User({ username: args.username })
            console.log(args)
            try {

                await newUser.save()

            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args
                })
            }

            return newUser

        },
        login: async (root, args) => {
            const logedUser = await User.findOne({ username: args.username })

            if(!logedUser || args.password !== 'secret') {
                throw new UserInputError('wrong credentials')
            }

            const userForToken = {
                username: logedUser.username,
                id: logedUser._id
            }

            return {
                value: jwt.sign(userForToken, JWT_SECRET)
            }
        },
        addAsFriend: async (root, args, context) =>  {
            const { currentUser } = context
            if(!currentUser) throw new AuthenticationError("not authenticated")

            const person = Person.findOne({ name: args.name})

            const notInList = person => !currentUser.friends
                .map(p => p._id)
                .include(person._id)
            

            if(notInList(person)) {
                currentUser.friends = currentUser.friends.concat(person)
                await currentUser.save()
            }

            return currentUser
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
    resolvers,
    context: async ({ req }) => {

        
        const auth = req? req.headers.authorization : null
        
        if(auth && auth.toLowerCase().startsWith('bearer ')) {
            const token = auth.substring(7)
            
            const { id } = jwt.verify(token, JWT_SECRET) 
           
            const currentUser = await User.findById(id).populate('friends')
            return { currentUser }
        }
    }
})

server.listen().then(({url}) => {
    console.log(`Server on port ${url}`)
})