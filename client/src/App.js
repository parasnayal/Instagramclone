import React, { createContext, useReducer, useContext, useEffect } from "react"
import { useHistory } from "react-router-dom";
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Profile from './Components/Profile';
import CreatePost from "./Components/CreatePost";
import SubscribeUserPost from "./Components/SubscribeUserPost";
import { reducer, initialState } from "../src/Reducers/reducer";
import Userprofile from "./Components/Userprofile";
export const userContext = createContext();
const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(userContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    }
    else {
      history.push("/signup");
    }
  }, [])
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/signup">
        <Signup />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route exact path="/profile/:userid">
        <Userprofile />
      </Route>
      <Route exact path="/createpost">
        <CreatePost />
      </Route>
      <Route exact path="/myfollowingpost">
        <SubscribeUserPost />
      </Route>
    </Switch>
  )
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div className="App">
      <userContext.Provider value={{ state, dispatch }}>
        <Router>
          <Navbar />
          <Routing />
        </Router>
      </userContext.Provider>
    </div>
  );
}
export default App;