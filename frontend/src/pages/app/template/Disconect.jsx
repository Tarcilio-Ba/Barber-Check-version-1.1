import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'


export default props => {
    const [show, setShow] = useState(false)

    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)
    return (
        <>
            <Button variant="link" block onClick={handleShow} className="dropdown-item">
                Sair
            </Button>
            <Modal show={show} onHide={handleClose} animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Sair</Modal.Title>
                </Modal.Header>
                <Modal.Body>Deseja realmente sair?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Fechar
                         </Button>
                    <Button variant="primary" onClick={props.onClick}>
                        Sair
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
