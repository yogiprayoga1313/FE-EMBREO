import React from 'react'
import { useParams } from 'react-router-dom'
import http from '../helpers/http'
import moment from 'moment'

function EventViewUser() {
  const { id } = useParams()
  const [eventVIew, setEventView] = React.useState({})

  
  React.useEffect(() => {
    const getEventView = async (id) => {
      const { data } = await http().get(`/events/${id}`)
      console.log(data)
      setEventView(data.results)
    }
    if (id) {
      getEventView(id)
    }
  }, [id])


  return (
    <>
      <div className='flex flex-col justify-center items-center mt-56 text-balck'>
        <div className='flex flex-col justify-center items-center'>
          <span className='text-xl text-black'>Event Name: {eventVIew.event_name}</span>
          <span className='text-black opacity-60'>Vendor Created: {eventVIew.vendor_name}</span>
          <span className='opacity-90'>Role User: {eventVIew.creator_name}</span>
          <span className='text-md opacity-90 text-green-600'>Date Confirmation: {moment(eventVIew?.date_confirmation).format('ddd, DD MMM YYYY')}</span>
          <span className='text-md opacity-90 text-blue-600'>Event Created: {moment(eventVIew.createdAt).add(420, 'date').startOf('date').fromNow()}
          </span>
          <span style={{
            color:
              eventVIew.status_event === 'Approve' ? 'green' :
                eventVIew.status_event === 'Rejected' ? 'red' :
                  eventVIew.status_event === 'Pending' ? 'blue' : 'black'
          }}>
            Status Event: {eventVIew.status_event}
          </span>       
          <span className='text-xl opacity-70 text-black'>
            {eventVIew.status_event === 'Rejected' && (
              <>Rejection Reason: {eventVIew.rejectionReason}</>
            )}
          </span>
        </div>
      </div>
    </>
  )
}

export default EventViewUser