import { Button, TextField } from '@mui/material'
import propTypes from 'prop-types';
import { clearMessage } from "../../redux/reducers/auth";
import { useNavigate } from 'react-router-dom'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { asyncLoginAction } from '../../redux/actions/auth';
import { Formik } from "formik";
import * as Yup from 'yup';

const validationSechema = Yup.object({
  email: Yup.string().email('Email is invalid'),
  password: Yup.string().required('Password is invalid')
})

const FormLogin = ({ values, handleChange, handleBlur, handleSubmit}) => {
  const errorMessage = useSelector(state => state.auth.errorMessage)
  const warningMessage = useSelector(state => state.auth.warningMessage)

  return (
    <form onSubmit={handleSubmit} action='submit' className='flex flex-col gap-5 justify-center items-center'>
      {errorMessage &&
        (<div>
          <div className="alert alert-error danger text-[12px] text-white">{errorMessage}</div>
        </div>)}
      {warningMessage &&
        (<div>
          <div className="alert alert-warning danger text-[11px]">{warningMessage}</div>
        </div>)}
      <div className='flex flex-col gap-4'>
        <div>
          <TextField
            name='userName'
            type='text'
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.userName}
            className='max-w-lg'
            id="outlined-basic"
            label="Username"
            variant="outlined" />
        </div>
        <div>
          <TextField
            name='password'
            type='password'
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.password}
            className='max-w-lg'
            id="outlined-basic"
            label="Password"
            variant="outlined" />
        </div>
      </div>
      <div>
        <Button type='submit' className='w-[220px]' variant="contained">Login</Button>
      </div>
    </form>
  )
}

FormLogin.propTypes = {
  values: propTypes.string,
  errors: propTypes.string,
  touched: propTypes.string,
  handleBlur: propTypes.func,
  handleChange: propTypes.func,
  handleSubmit: propTypes.func,
  isSubmitting: propTypes.bool,
}

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const formError = useSelector(state => state.auth.formError)

  React.useEffect(() => {
    if (token) {
      setTimeout(() => {
        navigate("/")
      }, 1000);
    }
  }, [token, navigate])

  const doLogin = async (values, { setSubmitting, setError }) => {
    dispatch(clearMessage())
    dispatch(asyncLoginAction(values))
    if (formError.length) {
      setError({
        password: formError.filter(item => item.param === "password")[0].message,
      })
    }
    setTimeout(() => {
    }, 800);
    setSubmitting(false)
  }
  return (
    <>
      <div className='flex justify-center mt-52'>
        <Formik
          initialValues={{
            userName: '',
            password: ''
          }}
          validationSchema={validationSechema}
          onSubmit={doLogin}
        >
          {(props) => (
            <FormLogin {...props} />
          )}
        </Formik>
      </div>
    </>
  )
}

export default Login