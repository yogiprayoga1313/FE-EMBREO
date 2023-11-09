import React from 'react'
import { logout as logoutAction } from '../redux/reducers/auth'
import { Button, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import http from '../helpers/http'
import moment from 'moment'
import { getProfileAction } from '../redux/actions/profile'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import "react-datepicker/dist/react-datepicker.css";
import { Formik } from 'formik'
import { GiHamburgerMenu } from 'react-icons/gi'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai'


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function Home() {
  // const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)
  const profile = useSelector((state) => state.profile.data)
  const [eventWait, setEventWait] = React.useState([])
  const [event, setEvent] = React.useState([])
  const [sort, setSort] = React.useState('DESC')
  const [tabEvent, setTabEvent] = React.useState(1)
  const [totalPage, setTotalPage] = React.useState()
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [searchParams, setSearchParams] = useSearchParams('')
  const [startDate, setStartDate] = React.useState(new Date());



  React.useEffect(() => {
    if (token) {
      dispatch(getProfileAction(token))
    }else{
      navigate('/auth-login')
    }
  }, [dispatch, token, navigate]);



  const getDataEvent = React.useCallback(async () => {
    const { data } = await http().get(`/events/manage?sort=${sort}&page=${tabEvent}&limit=5&${searchParams}`)
    setTotalPage(data.pageInfo.totalPage)
    console.log(data.pageInfo.totalPage)
    setEvent(data.results)
  }, [sort, tabEvent, searchParams])

  React.useEffect(() => {
    getDataEvent()
  }, [getDataEvent])

  const getDataEventWait = React.useCallback(async () => {
    const { data } = await http().get(`/events/admin_list?sort=${sort}&page=${tabEvent}&limit=5&${searchParams}`)
    setTotalPage(data.pageInfo.totalPage)
    setEventWait(data.results)
  }, [sort, tabEvent, searchParams])

  React.useEffect(() => {
    getDataEventWait()
  }, [getDataEventWait])

  const handleSort = (sort) => {
    setSort(sort)
    const elem = document.activeElement;
    elem?.blur();
  }

  const onSearch = (values) => {
    setSearchParams(`search=${values.search}`);

  };

  const handlePrevPage = () => {
    if (tabEvent > 1) {
      setTabEvent(tabEvent - 1);
    }
  }

  const handleNextPage = () => {
    if ((tabEvent + 1) <= totalPage) {
      setTabEvent(tabEvent + 1);
    }
  };
  console.log(totalPage)

  const doLogout = () => {
    dispatch(logoutAction()),
      navigate('/auth-login')
  }


  const createEvent = async values => {
    try {
      const form = new URLSearchParams(values)
      if (startDate) {
        form.append('date', moment(startDate).format('DD-MM-YYYY'));
      }

      const { data } = await http(token).post('/events/manage', form.toString())
      console.log(data)
      if (data) {
        getDataEvent()
      }
      getDataEventWait()
      getDataEvent()
      setOpen(false)
      setStartDate(false)
    } catch (error) {
      console.log('Error:', error);
    }
  }


  return (
    <>
      <div>
      </div>

      <div className='flex justify-around pt-10'>
        <div className='text-2xl text-black'>Dashboard</div>
        <div>
          <Button onClick={handleOpen}>Create Event</Button>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
          >
            <Fade in={open}>
              <Box sx={style}>
                <Typography id="transition-modal-title" variant="h6" component="h2" className='text-black'>
                  Create New Event!
                </Typography>
                <Formik
                  initialValues={{
                    event_name: '',
                    vendor_name: '',
                    date_confirmation: ''
                  }}
                  onSubmit={createEvent}>
                  {({ handleBlur, handleChange, handleSubmit, values }) => (
                    <>

                      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-2'>
                          <input
                            type='text'
                            placeholder="Event Name"
                            className="input input-bordered input-primary w-full w-auto text-black"
                            name='event_name'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.event_name}
                          />
                          <input
                            type='text'
                            placeholder="Vendor Name"
                            className="input input-bordered input-primary w-full w-auto text-black"
                            name='vendor_name'
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.vendor_name} />
                        </div>
                        <div className='flex flex-col'>
                          <input
                            name='date_confirmation'
                            className="input input-bordered w-auto"
                            type="date"
                            placeholder='Input date'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.date_confirmation} />
                          {values.date_confirmation && (
                            <span>
                              {moment(values.date_confirmation).format('D MMMM YYYY')}
                            </span>
                          )}
                        </div>
                        <div>
                          <button type='submit' className="btn btn-accent w-full normal-case">Save</button>
                        </div>
                      </form>
                    </>
                  )}
                </Formik>
              </Box>
            </Fade>
          </Modal>
        </div>
        <div className='flex gap-1 justify-center items-center'>
          <Formik
            initialValues={{
              search: ""
            }}
            onSubmit={onSearch}
          >
            {({ handleBlur, handleChange, handleSubmit, values }) => (
              <>
                <div className='md:flex-row flex-col flex gap-5 justify-center items-center'>
                  <form onSubmit={handleSubmit} className='md:flex-row  flex flex-col gap-5'>
                    <div>
                      <input
                        type="text"
                        placeholder="Search Event..."
                        className="input input-bordered md:w-[300px]"
                        name='search'
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.search} />
                    </div>
                    <div>
                      <button type='submit' className='normal-case text-white btn btn-primary st'>
                        Search
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </Formik>
          <div>
            <div className="dropdown dropdown-bottom">
              <label tabIndex={0} className="btn m-1"><GiHamburgerMenu size={20} /></label>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-gray-300 text-blue-500 rounded-box w-52">
                <li onClick={() => { handleSort('DESC') }}><a>Latest</a></li>
                <li onClick={() => { handleSort('ASC') }}><a>Longest</a></li>
              </ul>
            </div>
          </div>
          <div>
            <Button onClick={doLogout} type='submit' className='w-[100px]' color='error' variant="contained">logout</Button>
          </div>
        </div>
      </div>
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: '#810034', fontWeight:'bold' }}>No</TableCell>
              <TableCell style={{ color: '#810034', fontWeight:'bold' }}>Vendor Name</TableCell>
              <TableCell style={{ color: '#810034', fontWeight:'bold' }}>Event Name</TableCell>
              <TableCell style={{ color: '#810034', fontWeight:'bold' }}>Date Confirmation</TableCell>
              <TableCell style={{ color: '#810034', fontWeight:'bold' }}>Status</TableCell>
              <TableCell style={{ color: '#810034', fontWeight:'bold' }}>Created</TableCell>
              <TableCell style={{ color: '#810034', fontWeight:'bold' }}>Detail</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {token !== '' && (
              profile?.roleCode === "Vendor_Admin"
                ? (
                  <>
                    {eventWait.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item && item.vendor}</TableCell>
                        <TableCell>{item && item.event}</TableCell>
                        <TableCell>{item && moment(item?.date_confirmation).format('ddd, DD MMM YYYY')}</TableCell>
                        <TableCell>
                          <span style={{
                            color:
                              item && item.status === 'Approve' ? 'green' :
                                item && item.status === 'Rejected' ? 'red' :
                                  item && item.status === 'Pending' ? 'blue' : 'black'
                          }}>
                            {item && item.status}
                          </span>
                        </TableCell>
                        <TableCell>{item && moment(item.createdAt).add(420, 'date').startOf('date').fromNow()}</TableCell>
                        <TableCell>
                          <div className=''>
                            <Link
                              to={`/event/${item.id}`}
                              className='hover:opacity-50 text-blue-900 inline-block px-4 py-2 bg-blue-200 rounded-lg cursor-pointer'
                            >
                              View
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : (
                  <>
                    {event.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item && item.vendor}</TableCell>
                        <TableCell>{item && item.event}</TableCell>
                        <TableCell>{item && moment(item?.date_confirmation).format('ddd, DD MMM YYYY')}</TableCell>
                        <TableCell>
                          <span style={{
                            color:
                              item && item.status === 'Approve' ? 'green' :
                                item && item.status === 'Rejected' ? 'red' :
                                  item && item.status === 'Pending' ? 'blue' : 'black'
                          }}>
                            {item && item.status}
                          </span>
                        </TableCell>
                        <TableCell>{item && moment(item.createdAt).add(420, 'date').startOf('date').fromNow()}</TableCell>
                        <TableCell>
                          <Link to={`/user/event/${item.id}`}>View</Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )
            )}
            {profile?.roleCode === "Company_Hr_Admin" && (
              <>
                {eventWait
                  .filter((item) => item.status === 'Rejected')
                  .map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item && item.vendor}</TableCell>
                      <TableCell>{item && item.event}</TableCell>
                      <TableCell>{item && moment(item?.date_confirmation).format('ddd, DD MMM YYYY')}</TableCell>
                      <TableCell>
                        <span style={{ color: 'red' }}>{item && item.status}</span>
                      </TableCell>
                      <TableCell>{item && moment(item.createdAt).add(420, 'date').startOf('date').fromNow()}</TableCell>
                      <TableCell>
                        <Link to={`/user/event/${item.id}`}>View</Link>
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center items-center gap-5 mt-10 mb-10">
        <div className="flex justify-center items-center">
          <div>
            <button className="btn btn-base-100 shadow-lg shadow-black-500/70" onClick={handlePrevPage}><AiOutlineArrowLeft size={20} color="white" /></button>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div>
            <button className="btn btn-primary shadow-lg shadow-black-500/70" onClick={handleNextPage}><AiOutlineArrowRight size={20} color="white" /></button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home