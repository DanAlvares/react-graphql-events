import React from 'react'
import EventItem from './EventItem/EventItem';

const EventsList = props => {
  const events = props.events.map(event => {
    return <EventItem key={event._id} eventId={event._id} event={event} onDetail={props.onViewDetail} />
  });

  return (<ul className="events-list">{events}</ul>)
}


export default EventsList