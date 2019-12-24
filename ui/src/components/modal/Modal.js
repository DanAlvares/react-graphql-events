import React from 'react';
import './Modal.css';

const modal = props => (
  <React.Fragment>
    <div className="overlay"></div>
    <div className="modal">
      <header>{props.title}</header>
      <section className="modal__content">
        {props.children}
      </section>
      <section className="modal__actions">
        {props.canCancel && <button className="btn" onClick={props.onCancel}>Cancel</button>}
        {props.canConfirm && <button className="btn btn-secondary" onClick={props.onConfirm}>{props.confirmText || 'Confirm'}</button>}
      </section>
    </div>
  </React.Fragment>
)

export default modal;