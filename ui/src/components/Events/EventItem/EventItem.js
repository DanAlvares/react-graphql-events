import React, { useContext } from 'react'
import AuthContext from '../../../context/auth-context';

const EventItem = (props) => {
  const authContext = useContext(AuthContext)
  return (
    <li>
      <div>
        <h2>{props.event.title}</h2>
        <time>{new Date(props.event.date).toLocaleDateString()}</time>
      </div>

      {authContext.userId !== props.event.creator._id
        ? <button className="btn btn-primary" onClick={props.onDetail.bind(this, props.event._id)}>Book for ${props.event.price}</button>
        : <p>You are the owner of the event</p>
      }

    </li>
  )
}

export default EventItem