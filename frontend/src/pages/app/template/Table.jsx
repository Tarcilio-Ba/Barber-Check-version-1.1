import React from 'react'
import DataTable, { createTheme } from 'react-data-table-component';
import ArrowDownward from '@material-ui/icons/ArrowDownward'
/* import { BsFillCaretDownFill, BsFillCaretUpFill } from 'react-icons/bs'; */



const sortIcon = <ArrowDownward />
createTheme('solarized', {
    text: {
        primary: '#333',
        secondary: '#2aa198',
    },
    background: {
        default: '#ccb8c0',
    },
    context: {
        background: '#cb4b16',
        text: '#FFFFFF',
    },
    /* divider: {
        default: '#073642',
    }, */
    action: {
        button: 'rgba(0,0,0,.54)',
        hover: 'rgba(0,0,0,.08)',
        disabled: 'rgba(0,0,0,.12)',
    },
})
const customStyles = {
    rows: {
        style: {
            minHeight: '42px', // override the row height
            justifyContent: 'center'
        }
    },
    headCells: {
        style: {
            background: '#c9c1c2',
            /* paddingLeft: '1px', // override the cell padding for head cells
            paddingRight: '1px', */
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1em',
            height: '50px'

        },
    },
    cells: {
        style: {
            /* paddingLeft: '1px', // override the cell padding for data cells
            paddingRight: '1px', */
            justifyContent: 'center'
        },
    },
}

/* const expandableIcon = {collapsed: <BsFillCaretDownFill />, expanded: <BsFillCaretUpFill/> } */
const rowsPerPage = [10, 15, 20, 25, 30]
export default props => {
    return (
        <DataTable
            title={props.title}
            columns={props.columns}
            data={props.data}
            sortIcon={sortIcon}
            defaultSortField="true"
            highlightOnHover
            fixedHeader
            responsive
            customStyles={customStyles}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={rowsPerPage}
            onRowDoubleClicked={props.doubleClick}
            /*selectableRows
            selectableRowsNoSelectAll
            clearSelectedRows
            selectableRowsHighlight */
            expandableRows 
            expandableRowsComponent={props.component}
            expandOnRowDoubleClicked
            expandableRowsHideExpander
        />
    )
}