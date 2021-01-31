import React from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal'


export default props => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Button variant={props.color} size={props.size} onClick={handleShow} 
                block={props.block} className={props.class}>
                {props.openLabel}
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body><span style={{fontSize: '20px'}}>{props.body}</span></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                        <Button variant="success" onClick={props.onClick}>
                        {props.button}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}