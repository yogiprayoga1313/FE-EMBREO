import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PropTypes from 'prop-types';

function PrivateRoute({ children }) {
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        if (!token) {
            navigate("/auth/login");
        }
    }, [navigate, token]);

    return token ? children : null;
}

PrivateRoute.PropTypes = {
    children: PropTypes.string
}
export default PrivateRoute;
