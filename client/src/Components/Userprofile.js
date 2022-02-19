import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { userContext } from "../App";
const Profile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const { state, dispatch } = useContext(userContext);
    const { userid } = useParams();
    // console.log(state);
    const [showfollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true);
    useEffect(() => {
        // const URI = `http://localhost:5000/api/auth/user/${userid}`;
        const URI = `/user/${userid}`;
        fetch(URI, {
            method: "get",
            headers: {
                "token": localStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                setUserProfile(data);
            })
            .catch(error => console.log(error));
    }, [])
    const followuser = () => {
        // const URI = "http://localhost:5000/api/auth/follow";
        const URI = "/follow";
        fetch(URI, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token")
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data);
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } });
                localStorage.setItem("user", JSON.stringify(data));
                setUserProfile(prevState => {
                    return {
                        ...prevState,
                        // user: data
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data.id]
                        }
                    }
                })
                setShowFollow(false);
            })
            .catch(error => console.log(error))
    }
    const unfollowuser = () => {
        // const URI = "http://localhost:5000/api/auth/unfollow";
        const URI = "/unfollow";
        fetch(URI, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {
                // console.log(data);
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } });
                localStorage.setItem("user", JSON.stringify(data));
                setUserProfile(prevState => {
                    const newFollowers = prevState.user.followers.filter(item => item !== data.id)
                    return {
                        ...prevState,
                        // user: data
                        user: {
                            ...prevState.user,
                            followers: newFollowers
                        }
                    }
                })
                setShowFollow(true);
            })
            .catch(error => console.log(error));
    }
    return (
        <>
            {
                userProfile
                    ?
                    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
                        <div style={{ display: "flex", justifyContent: "space-around", margin: "18px 0px", borderBottom: "1px solid grey" }}>
                            <div>
                                <img style={{ width: "160px", height: "160px", borderRadius: "80px" }} src={userProfile.user.pic} alt="nopic"  />
                            </div>
                            <div>
                                <h4>{userProfile.user.name}</h4>
                                <h4>{userProfile.user.email}</h4>
                                <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                                    <h6>{userProfile.posts.length} posts</h6>
                                    <h6>{userProfile.user.followers.length} Follower</h6>
                                    <h6>{userProfile.user.following.length} Following</h6>
                                </div>
                                {
                                    showfollow
                                        ?
                                        <button style={{ margin: "10px" }} className="btn waves-effect waves-light" onClick={() => followuser()}>
                                            Follow
                                        </button>
                                        :
                                        <button style={{ margin: "10px" }} className="btn waves-effect waves-light" onClick={() => unfollowuser()}>
                                            UnFollow
                                        </button>
                                }
                            </div>
                        </div>
                        <div className="gallery">
                            {
                                userProfile.posts.map(item => {
                                    return (
                                        <img className="item" src={item.image} alt={item.title} key={item._id} />
                                    )
                                })
                            }
                        </div>
                    </div>
                    :
                    <h2>loading....</h2>
            }
        </>
    )
}
export default Profile;