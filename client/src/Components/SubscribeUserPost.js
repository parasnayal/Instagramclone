import React, { useState, useEffect, useContext } from "react";
import { userContext } from "../App";
import { Link } from "react-router-dom";
const Home = () => {
    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(userContext);
    useEffect(() => {
        // const URI = "http://localhost:5000/api/auth/getsubpost";
        const URI = "/getsubpost";
        fetch(URI, {
            method: "get",
            headers: {
                "token": localStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(data => setData(data.data))
            .catch(error => console.log(error));
    }, [])
    const likePost = id => {
        // const URI = "http://localhost:5000/api/auth/likes";
        const URI = "/likes";
        fetch(URI, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token")
            },
            body: JSON.stringify({
                postId: id
            })
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result;
                    }
                    else {
                        return item;
                    }
                })
                setData(newData);
            })
            .catch(error => console.log(error));
    }
    const unlikePost = id => {
        // const URI = "http://localhost:5000/api/auth/unlike";
        const URI = "/unlike";
        fetch(URI, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token")
            },
            body: JSON.stringify({
                postId: id
            })
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result;
                    }
                    else {
                        return item;
                    }
                })
                setData(newData);
            })
            .catch(error => console.log(error));
    }
    const makeComment = (text, postId) => {
        // const URI = "http://localhost:5000/api/auth/comments";
        const URI = "/comments";
        fetch(URI, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token")
            },
            body: JSON.stringify({
                text,
                postId
            })
        })
            .then(res => res.json())
            .then(result => {
                // console.log(result);
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result;
                    }
                    else {
                        return item;
                    }
                })
                setData(newData);
            })
            .catch(error => console.log(error));
    }
    const deletePost = id => {
        // const URI = `http://localhost:5000/api/auth/deletepost/${id}`;
        const URI = `/deletepost/${id}`;
        fetch(URI, {
            method: "delete",
            headers: {
                "token": localStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(result => {
                // console.log(result);
                const newData = data.filter(item => {
                    return item.id !== result.id
                })
                setData(newData);
            })
            .catch(error => console.log(error));
    }
    return (
        <div className="home" >
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5 style={{padding:"5px"}}><Link to={item.postedBy._id !== state.id ? "/profile/" + item.postedBy._id : "/profile"}>{item.postedBy.name}</Link>{item.postedBy._id === state.id && <i className="material-icons" style={{ float: "right" }} onClick={() => deletePost(item._id)}>delete</i>}
                            </h5>
                            <div className="card-image">
                                <img src={item.image} />
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{ color: "red" }}>favorite</i>
                                {
                                    item.likes.includes(state.id)
                                        ?
                                        <i className="material-icons" onClick={() => unlikePost(item._id)}>thumb_down</i>
                                        :
                                        <i className="material-icons" onClick={() => likePost(item._id)}>thumb_up</i>
                                }
                                <h6>{item.likes.length} likes</h6>
                                <h4>{item.title}</h4>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id}><span style={{ fontWeight: "500px" }}>{record.postedBy.name} </span>{record.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(event) => {
                                    event.preventDefault();
                                    makeComment(event.target[0].value, item._id)
                                }}>
                                    <input type="text" placeholder="Add a comment" />
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div >
    )
}
export default Home;