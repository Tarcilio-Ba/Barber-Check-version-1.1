import React from 'react'

import './Main.css'
import Footer from './Footer'
import Header from './Header'
import Nav from './Nav'

export default props =>
    <React.Fragment>
        <Nav />
        <Header {...props} />
        <main className="container-fluid">
            <div className="p-3">
                {props.children}
            </div>
        </main>
        <Footer /> 
    </React.Fragment>
