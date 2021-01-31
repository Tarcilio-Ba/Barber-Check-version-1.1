import React, { Component } from 'react'
import Dialog from '../../template/Dialog'

export default class ItensVenda extends Component {
    constructor(props) {
        super(props)
        this.state = {
            itensVenda: this.props.itensVenda,
            total: this.props.total
        }
    }

    click(){
        return window.location.reload()
    }

    renderTable() {
        return (
            <div>
                <div className="container-fluid">
                    <table className="table table-borderless">
                        <thead className="table-secondary">
                            <tr className="text-center">
                                <th>Cód. Item</th>
                                <th>Item</th>
                                <th>Valor Unitário</th>
                                <th>Quantidade</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderRows()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    renderRows() {
        return this.state.itensVenda.map(item => {
            return (
                <tr key={item.Coditemvenda} className="text-center">
                    <td>{item.itemId}</td>
                    <td>{item.item}</td>
                    <td>{item.preco.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                    <td>{item.qtvenda}</td>
                    <td>{(item.preco * item.qtvenda).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                </tr>
            )
        })
    }
    render() {
        return (
            <div className="container-fluid">
                <div>
                    {this.renderTable()}
                </div>
                <div className="d-flex flex-row-reverse border mr-2 ml-2">
                    <h4 className="font-weight-bold p-2 mr-2 lead">
                        Total: {this.state.total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                    </h4>
                </div>
                <div className="container-fluid text-center mt-3">
                     <Dialog 
                        color="success"
                        openLabel="Concluir"
                        title="Concluir Venda"
                        body="Deseja Concluir a venda?"
                        button="Concluir"
                        onClick={() => this.click()} />
                </div>
            </div>
        )
    }
}	