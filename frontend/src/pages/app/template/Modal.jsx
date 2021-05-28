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
                <button className={`btn btn-sm btn-${this.props.color}`} onClick={this.handleOpenModal}>
                    <i className={`fa fa-${this.props.icon}`}></i>
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
                                <i className="fa fa-close"></i> Fechar
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