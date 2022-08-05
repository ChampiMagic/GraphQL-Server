import React from "react"

const Notify = ({errorMessage}) => {
    console.log(errorMessage)

    if(errorMessage === null) return null

    return (
        <div>
            <p style={{ color: "red" }}>{errorMessage}</p>
        </div>
    )
}

export default Notify