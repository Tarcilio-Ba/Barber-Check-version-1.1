import React from 'react'
import '../Nav.css'
import { NavLink } from 'react-router-dom'

export default props =>

    <NavLink to={props.path} className="text-light" activeClassName="active">
        <i className={`fa fa-${props.icon}`}></i>
        {props.label}
    </NavLink>
    
