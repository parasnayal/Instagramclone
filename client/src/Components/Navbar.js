import React, { useContext } from "react"
import "../App.css"
import { Link, useHistory } from "react-router-dom"
import { userContext } from "../App"
const Navbar = () => {
    const history = useHistory();
    const { state, dispatch } = useContext(userContext);
    const handleLogout = () => {
        localStorage.clear();
        dispatch({ type: "CLEAR" });
        history.push("/signup");
    }
    const renderList = () => {
        if (state) {
            return [
                <li key="1"><Link to="/profile">Profile</Link></li>,
                <li key="2"><Link to="/createpost">Create Post</Link></li>,
                <li key="3"><Link to="/myfollowingpost">My Following posts</Link></li>,
                <li key="4">
                    <button className="btn waves-effect waves-light" onClick={handleLogout}>
                        Logout
                    </button>
                </li>
            ]
        } else {
            return [
                <li key="5"><Link to="/signup">Signup</Link></li>,
                <li key="6"><Link to="/login">Login</Link></li>
            ]
        }
    }
    return (
        <div>
            <nav>
                <div className="nav-wrapper white" >
                    <Link to={state ? "/" : "/signup"} className="brand-logo left">Instagram</Link>
                    <ul id="nav-mobile" className="right">
                        {renderList()}
                    </ul>
                </div>
            </nav>
        </div>
    )
}
export default Navbar;