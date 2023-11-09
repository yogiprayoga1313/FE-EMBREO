import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage'

import authReducer from './auth'
import profileReducer from "./profile"

const authConfig = {
    key:'auth',
    storage
}

const reducer = combineReducers ({
    auth: persistReducer(authConfig, authReducer),
    profile: profileReducer
})


export default reducer 