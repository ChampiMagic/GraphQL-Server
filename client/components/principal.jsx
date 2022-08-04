import React from "react"

const Principal = ({principal}) => {
    return (
        <div style={{ border: "2px solid yellow", padding: "1%", margin: "1em" }}>
            <h1>{principal.name}</h1>
            <h2>{principal.phone}</h2>
            <h4>Address: {principal.address.city}, {principal.address.street}</h4>
        </div>
    )
}

export default Principal