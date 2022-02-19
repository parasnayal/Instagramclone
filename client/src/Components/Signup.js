import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { userContext } from "../App";
const Signup = () => {
    const { state, dispatch } = useContext(userContext);
    const history = useHistory();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // const [image, setImage] = useState("");
    const [url, seturl] = useState(undefined);
    const handleChange1 = event => setName(event.target.value);
    const handleChange2 = event => setEmail(event.target.value);
    const handleChange3 = event => setPassword(event.target.value);
    const handleSignup = () => {
        // const URI = "http://localhost:5000/api/auth/signup";
        const URI = "/signup";
        fetch(URI, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                pic: url
            })
        }).then(res => res.json())
            .then(data => {
                localStorage.setItem("token", data.TOKEN);
                localStorage.setItem("user", JSON.stringify(data.user));
                dispatch({ type: "USER", payload: data.user });
                history.push("/");
            })
            .catch(error => console.log(error));
    }
    return (
        <div className="mycard">
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input type="text" placeholder="name" value={name} onChange={handleChange1} />
                <input type="email" placeholder="email" value={email} onChange={handleChange2} />
                <input type="password" placeholder="password" value={password} onChange={handleChange3} />
                <button className="btn waves-effect waves-light" onClick={handleSignup}>
                    Signup
                </button>
                <h5>
                    <Link to="/login">Already have an account?</Link>
                </h5>
            </div>
        </div>
    )
}
export default Signup;