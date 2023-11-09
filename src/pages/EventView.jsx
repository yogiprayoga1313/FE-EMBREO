import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import http from '../helpers/http'
import moment from 'moment'
import { jwtDecode } from 'jwt-decode'
import { Button, CircularProgress, TextareaAutosize } from '@mui/material'

function EventView() {
  const { id } = useParams()
  const [eventVIew, setEventView] = React.useState({})
  const token = useSelector(state => state.auth.token)
  const navigate = useNavigate()
  const [rejectionReason, setRejectionReason] = React.useState('');
  const [isApproving, setIsApproving] = React.useState(false)
  const [isRejecting, setIsRejecting] = React.useState(false);

  React.useEffect(() => {
    if (token) {
      const { role } = jwtDecode(token)
      if (role !== "Vendor_Admin") {
        navigate('/')
      }
    }
  }, [id, navigate, token])


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

  const accReqEvent = async () => {
    const qs = new URLSearchParams({ eventId: id }).toString();
    setIsApproving(true);
    await http(token).post('/request/acc_event', qs);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const rejectReqEvent = async () => {
    if (!rejectionReason) {
      alert('Please provide a rejection reason.'); 
    } else {
      const qs = new URLSearchParams({ eventId: id, rejectionReason }).toString();
      setIsRejecting(true); 
      await http(token).post('/request/reject_event', qs);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };


  return (
    <>
      <div className='flex flex-col justify-center items-center mt-56'>
        <div className='flex flex-col justify-center items-center'>
          <span className='text-black text-xl'>Event Name: {eventVIew.event_name}</span>
          <span className='text-black opacity-60'>Vendor Name: {eventVIew.vendor_name}</span>
          <span className='opacity-90'>User Created: {eventVIew.creator_name}</span>
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

        {eventVIew.status_event === 'Pending' ? (
          <>
            <div className='flex flex-col gap-3 justify-center items-center'>
              <div className='flex gap-3'>
                <Button onClick={accReqEvent} variant="contained" color="success" disabled={isApproving}>
                  {isApproving ? <CircularProgress size={20} /> : 'Approve'}
                </Button>
                <Button onClick={rejectReqEvent} variant="outlined" color="error" disabled={isRejecting}>
                  {isRejecting ? 'Rejecting...' : 'Reject'}
                </Button>
              </div>
              <TextareaAutosize
                className='w-[300px] border border-blue-400 rounded-md p-3'
                placeholder="Rejection Reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                disabled={isRejecting}
                rowsMin={5}
              />
            </div>
          </>
        ) : null}
      </div>
    </>
  )
}

export default EventView