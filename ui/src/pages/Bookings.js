import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import Loader from '../components/Loader/Loader';
import './Booking.css'

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: []
  }

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings()
  }

  fetchBookings() {
    this.setState({ isLoading: true })
    const reqBody = {
      query: `
          query {
              bookings {
                  _id
                  createdAt
                  event{
                    _id
                    title
                    description
                    date
                    price
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
    })
      .then(res => {
        console.log(res)
        this.setState({ bookings: res.data.bookings })
      }).catch(console.error)
      .finally(() => this.setState({ isLoading: false }))
  }

  cancelBookingHandler(bookingId) {
    if (!this.context.token) {
      return;
    }
    const reqBody = {
      query: `
          mutation {
              cancelBooking(bookingId: "${bookingId}") {
                  _id
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
        console.log(res.data)
      }).catch(console.error)
      .finally(() => this.setState({ selectedEvent: null })
      )
  }

  render() {
    return (
      <React.Fragment>
        {this.state.bookings.length ?
          (<ul className="bookings-list">
            {
              this.state.bookings.map(booking =>
                <li key={booking._id}>
                  <div>
                    <h2>{booking.event.title}</h2>
                    <strong>{new Date(booking.createdAt).toLocaleDateString()}</strong>
                  </div>
                  <button className="btn btn-secondary" onClick={() => this.cancelBookingHandler(booking._id)}>Cancel Booking</button>
                </li>
              )
            }
          </ul>) : <p><em>No Bookings</em></p>}

        {this.state.isLoading && <Loader />}
      </React.Fragment>
    )
  }
}

export default BookingsPage;