import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Home from "./pages/Home"
import Login from './pages/auth/Login'
import EventView from './pages/EventView';
import EventViewUser from './pages/EventViewUser';


import { store, persistor } from "./redux/store"

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/auth-login' element={<Login />} />
            <Route path='/event/:id' element={<EventView />} />
            <Route path='/user/event/:id' element={<EventViewUser />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}