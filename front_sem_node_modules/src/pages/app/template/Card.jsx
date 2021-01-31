import React from 'react'
import './Card.css'

function getColor(props){
    if(props.red) return "Red"
    if(props.green) return "Green"
    if(props.purple) return "Purple"
    if(props.blue) return "Blue"
    if(props.gray) return "Gray"
    return ""
}

export default props => {
    return (
        <div className={`Card ${getColor(props)}`}>
            <div className="Header">
                <span className="Title">
                    <strong>{props.title}</strong>
                </span>
            </div>
            <div className="Content">
                {props.children}
            </div>
        </div>
    )
}