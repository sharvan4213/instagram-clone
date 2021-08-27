import React from 'react'
import './avatar.css'
function Avatar({image,alt}) {
    return (
        <div className ="avatar_border"><img className="avatar_logo" src={image} alt ={alt}/></div>
        )
}

export default Avatar
