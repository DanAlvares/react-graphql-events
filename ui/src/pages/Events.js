import React, { Component } from 'react';
import Modal from '../components/modal/Modal'
import './Events.css'

class EventsPage extends Component {
  state = {
    creating: false
  }

  startCreatingEventHandler = () => {
    this.setState({ creating: true })
  }

  modalConfirmHandler() {
    this.setState({ creating: false })
  }

  modalCancelHandler() {
    this.setState({ creating: false })
  }

  render() {
    return (
      <React.Fragment>
        {this.state.creating && <Modal title="Add Event" canCancel canConfirm onCancel={this.modalCancelHandler.bind(this)} onConfirm={this.modalConfirmHandler.bind(this)}>
          <p>Modal Content</p>
        </Modal>}
        <div className="events-control">
          <button className="btn btn-primary" onClick={this.startCreatingEventHandler}>Create Event</button>
        </div>
      </React.Fragment>
    )
  }
}

export default EventsPage;