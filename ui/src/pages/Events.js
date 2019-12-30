import React, { Component } from 'react';
import Modal from '../components/Modal/Modal'
import AuthContext from '../context/auth-context'
import EventsList from '../components/Events/EventsList';

import './Events.css'
import Loader from '../components/Loader/Loader';

class EventsPage extends Component {
  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null
  }

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  startCreatingEventHandler = () => {
    this.setState({ creating: true })
  }

  componentDidMount() {
    this.fetchEvents()
  }

  modalConfirmHandler() {
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (!title.trim() || !date.trim() || !description.trim()) { return }

    const reqBody = {
      query: `
          mutation {
              createEvent(eventInput: {title: "${title}", price: ${price}, description: "${description}", date: "${date}"}) {
                  _id
                  title
                  description
                  date
                  price
                  creator {
                    _id
                    email
                  }
              }
          }
      `
    }

    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ` + this.context.token
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    }).then(res => {
      this.setState(prevState => {
        const updatedEvents = [...prevState.events];
        updatedEvents.push({
          ...res.data.createEvent,
          creator: {
            _id: this.context.userId
          }
        });
        return { events: updatedEvents }
      })
    }).catch(console.error)
      .finally(() => this.setState({ creating: false }))
  }

  modalCancelHandler() {
    this.setState({ creating: false, selectedEvent: null })
  }

  modalBookHandler() {
    if (!this.context.token) {
      this.setState({ selectedEvent: null })
      return;
    }
    const reqBody = {
      query: `
          mutation {
              bookEvent(eventId: "${this.state.selectedEvent._id}") {
                  _id
                  createdAt
                  updatedAt
              }
          }
      `
    }

    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ` + this.context.token
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
      .then(res => {
      }).catch(console.error)
      .finally(() => this.setState({ selectedEvent: null })
      )
  }

  fetchEvents() {
    this.setState({ isLoading: true })
    const reqBody = {
      query: `
          query {
              events {
                  _id
                  title
                  description
                  date
                  price
                  creator {
                    _id
                    email
                  }
              }
          }
      `
    }

    fetch('http://localhost:3001/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
      return res.json();
    })
      .then(res => {
        this.setState({ events: res.data.events })
      }).catch(console.error)
      .finally(() => this.setState({ isLoading: false }))
  }

  showDetailHandler = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(evt => evt._id === eventId);
      return { selectedEvent }
    })
  }

  render() {

    return (
      <React.Fragment>
        {this.state.creating &&
          <Modal title="Add Event" canCancel canConfirm onCancel={this.modalCancelHandler.bind(this)} onConfirm={this.modalConfirmHandler.bind(this)}>
            <form>
              <div className="form-control">
                <label htmlFor="Title">Title</label>
                <input type="text" id="Title" ref={this.titleElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="Price">Price</label>
                <input type="number" id="Price" ref={this.priceElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="Date">Date</label>
                <input type="datetime-local" id="Date" ref={this.dateElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="Description">Description</label>
                <textarea id="Description" ref={this.descriptionElRef}></textarea>
              </div>
            </form>
          </Modal>}
        {this.state.selectedEvent &&
          <Modal
            title={this.state.selectedEvent.title} canCancel canConfirm
            confirmText={this.context.token ? `Book for $` + this.state.selectedEvent.price : 'Confirm'}
            onCancel={this.modalCancelHandler.bind(this)}
            onConfirm={this.modalBookHandler.bind(this)}>
            <pre>{JSON.stringify(this.state.selectedEvent, null, 2)}</pre>
          </Modal>
        }
        {this.context.token &&
          <div className="events-control">
            <button className="btn btn-primary" onClick={this.startCreatingEventHandler}>Create Event</button>
          </div>
        }
        {this.state.isLoading && <Loader />}
        <EventsList events={this.state.events} onViewDetail={this.showDetailHandler} />
      </React.Fragment>
    )
  }
}

export default EventsPage;