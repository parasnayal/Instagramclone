import React, { useEffect, useState, useContext } from "react";
import { userContext } from "../App";
const Profile = () => {
    const { state, dispatch } = useContext(userContext);
    const [profile, setProfile] = useState([]);
    const [image, setImage] = useState("");
    useEffect(() => {
        // const URI = "http://localhost:5000/api/auth/mypost";
        const URI = "/mypost";
        fetch(URI, {
            method: "get",
            headers: {
                "token": localStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(data => setProfile(data.data))
            .catch(error => console.log(error));
    }, []);
    useEffect(() => {
        if (image) {
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "project");
            data.append("cloud_name", "paras0904");
            fetch("http://api.cloudinary.com/v1_1/paras0904/image/upload", {
                method: "post",
                body: data,
            })
                .then(res => res.json())
                .then(data => {
                    fetch("http://localhost:5000/api/auth/updatepic", {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "token": localStorage.getItem("token")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    }).then(res => res.json())
                        .then(data => {
                            // console.log(data);
                            localStorage.setItem("user", JSON.stringify({ ...state, pic: data.pic }));
                            dispatch({ type: "UPDATEPIC", payload: data.pic });
                        })
                }
                )
                .catch(error => console.log(error));
        }
    }, [image])
    const updatePhoto = (file) => {
        // console.log(file);
        setImage(file);
    }
    return (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
            <div style={{ margin: "18px 0px", borderBottom: "1px solid grey" }}>
                <div style={{ display: "flex", justifyContent: "space-around", }}>
                    <div>
                        <img style={{ width: "160px", height: "160px", borderRadius: "80px" }} src={state ? state.pic : "loading"} alt="no image" />
                    </div>
                    <div>
                        <h4>{state ? state.name : "loading"}</h4>
                        <h5>{state ? state.email : "loading"}</h5>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                            <h6>{profile.length} posts</h6>
                            <h6>{state ? state.followers.length : "0"} Follower</h6>
                            <h6>{state ? state.following.length : "0"} Following</h6>
                        </div>
                    </div>
                </div>
                <div className="file-field input-field" style={{ margin: "10px" }}>
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Update pic</span>
                        <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    profile.map(item => {
                        return (
                            <img className="item" src={item.image} alt={item.title} key={item._id} />
                        )
                    })
                }
            </div>
        </div>
    )
}
export default Profile;