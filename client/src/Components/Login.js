import React, { useState ,useContext} from "react";
import { Link, useHistory } from "react-router-dom";
import { userContext } from "../App";

const Login = () => {
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {state,dispatch} = useContext(userContext);
    const handleChange1 = event => setEmail(event.target.value);
    const handleChange2 = event => setPassword(event.target.value);
    const handleLogin = () => {
        // const URI = "http://localhost:5000/api/auth/login";
        const URI = "/login";
        fetch(URI, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => res.json())
            .then(data => {
                // console.log(data);
                localStorage.setItem("token", data.TOKEN);
                localStorage.setItem("user", JSON.stringify(data.user));
                dispatch({ type: "USER", payload: data.user })
                history.push("/");
            })
            .catch(error => console.log(error));
    }
    return (
        <div className="mycard">
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input type="email" placeholder="email" value={email} onChange={handleChange1} />
                <input type="password" placeholder="password" value={password} onChange={handleChange2} />
                <button className="btn waves-effect waves-light" onClick={handleLogin}>
                    Login
                </button>
                <h5>
                    <Link to="/signup">Create an account?</Link>
                </h5>
            </div>
        </div>
    )
}
export default Login;