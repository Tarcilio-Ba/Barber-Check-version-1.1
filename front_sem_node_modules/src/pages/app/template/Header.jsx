import React from 'react'
import './Header.css'

export default props =>
    <header className="page-header">
        <div className="navbar navbar-inverse">
            <div className="container-fluid row">
                <h4 className="p-2">
                    <i className={`fa fa-${props.icon}`} ></i>
                    {props.title} - <small>{props.subtitle}</small>
                </h4>
                {props.button}
            </div>
        </div>

    </header>
