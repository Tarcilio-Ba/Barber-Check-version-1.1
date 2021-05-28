import React, { Component } from 'react'
import api from '../../../../services/api'

export default class ItemForm extends Component {

    state = {
        item: { ...this.props.item, error: '' }
    }

    change(event) {
        const item = { ...this.state.item }
        item[event.target.name] = event.target.value
        this.setState({ item })
    }

    clear() {
        this.setState({ ...this.props.item })
    }

    save = async e => {
        e.preventDefault();
        const item = { ...this.state.item }
        const { nome, tipo, quantidade, preco } = this.state.item
        try {
            await api.put(`/itens/${item.Coditem}`, { nome, tipo, quantidade, preco })
        } catch (err) {
            return this.setState({
                error: 'Não foi possível alterar, favor verifique!'
            })
        }
        window.location.reload()
    }

    render() {
        return (
            <div className="form">
                {this.state.error && <p className="text-danger">{this.state.error}</p>}
                <div className="row mb-3" >
                    <div className="input-group col-6">
                        <div className="input-group-prepend">
                            <label className="input-group-text" htmlFor="nome">Nome</label>
                        </div>
                        <input className="form-control" id="nome"
                            type="text"
                            name="nome"
                            value={this.state.item.nome}
                            onChange={e => this.change(e)}
                            placeholder="Nome..." />
                    </div>
                    <div className="input-group col-6">
                        <div className="input-group-prepend">
                            <label className="input-group-text" htmlFor="tipo">Tipo</label>
                        </div>
                        <input className="form-control" id="tipo"
                            type="text"
                            name="tipo"
                            value={this.state.item.tipo}
                            onChange={e => this.change(e)}
                            placeholder="Tipo..." />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="input-group col-6">
                        <div className="input-group-prepend">
                            <label className="input-group-text" htmlFor="price">Preço R$</label>
                        </div>
                        <input className="form-control" id="price"
                            type="number"
                            name="preco"
                            min="0.00"
                            value={this.state.item.preco}
                            onChange={e => this.change(e)}
                            placeholder="Preço..." />
                    </div>
                    <div className="input-group col-6">
                        <div className="input-group-prepend">
                            <label className="input-group-text" htmlFor="qtd">Quantidade</label>
                        </div>
                        <input className="form-control" id="qtd"
                            type="number"
                            min="0"
                            name="quantidade"
                            value={this.state.item.quantidade}
                            onChange={e => this.change(e)}
                            placeholder="Quantidade..." />
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-center" >
                        <button className="btn btn-primary "
                            onClick={() => this.clear()} >
                            Cancelar
                            </button>
                        <button className="btn btn-success ml-3"
                            onClick={e => this.save(e)} >
                            Editar
                            </button>
                    </div>
                </div>
            </div>
        )
    }
}
