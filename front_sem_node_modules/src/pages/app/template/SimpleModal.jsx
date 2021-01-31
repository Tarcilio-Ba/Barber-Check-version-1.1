import React, { Component } from 'react'
import Modal from 'react-modal'



export default class ModalApp extends Component {
    constructor() {
        super();
        this.state = {
            showModal: false
        };

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleOpenModal() {
        this.setState({ showModal: true });
    }

    handleCloseModal() {
        this.setState({ showModal: false })
    }

    render() {
        return (
            <span>
                <button className={`btn btn-${this.props.tam} btn-${this.props.color} mb-2`} onClick={this.handleOpenModal}>
                    {this.props.icon}
                    {this.props.buttonLabel}
                </button>
                <Modal
                    isOpen={this.state.showModal}
                    ariaHideApp={true}
                    autoFocus={true}
                >
                    <div className="row">
                        <div className="col-3">
                            <button className="btn btn-sm btn-danger" onClick={this.handleCloseModal}>
                                <i className="fa fa-close"></i> Cancelar
                            </button>
                        </div>
                        <div className="container-fluid text-center">
                            <span>
                                <strong><h3>{this.props.edit}</h3></strong>
                            </span>
                        </div>
                    </div>
                    <div>
                        <hr />
                        <div>
                            {this.props.component}
                        </div>
                    </div>
                </Modal>
            </span>
        );
    }
}