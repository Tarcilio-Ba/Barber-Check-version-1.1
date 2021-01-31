import React from 'react'
import SearchField from 'react-search-field'


export default props => {
    return (
        <div className="input-group col-12 mb-4">
            <div className="input-group-prepend ">
                <label className="input-group-text" htmlFor="search">
                    {props.label}
                </label>
            </div>
            <SearchField
                classNames="col-4 h-auto font-weight-bold"
                id='search'
                placeholder={props.placeholder}
                onChange={props.onChange} />
        </div>
    )
}