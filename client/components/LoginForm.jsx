import React, { useState, useEffect } from "react"
import { gql, useMutation } from "@apollo/client"
import Notify from "./Notify"
import { LOGIN } from "../utils/graphMutations"





const LoginForm = ({setToken}) => {


    const [ errorMessage, setErrorMessage ] = useState(null)

    const notifyError = message => {
      setErrorMessage(message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
        
      }

    const [ login, result ] = useMutation(LOGIN, {
        onError: (error) => {
            notifyError(error.graphQLErrors[0].message)
        }
    })

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()

        login({ variables: { username, password} })

        setUsername("")
        setPassword("")
    }

    useEffect(() => {

      const localToken = localStorage.getItem("user-token")

    if(result.data) {
        const token = result.data.login.value
        localStorage.setItem("user-token", token)
        setToken(token)
    }   
    if(localToken) {
      setToken(localToken)
    }
    }, [result])


    return (
        <div>
            <h1>Login</h1>
            <Notify errorMessage={errorMessage}/>
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1em" }}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit">Sing In</button>
            </form>
        </div>
    )
}

export default LoginForm
