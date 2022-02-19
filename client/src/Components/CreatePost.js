import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
const CreatePost = () => {
    const history = useHistory();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, seturl] = useState("");
    const handleChange1 = event => setTitle(event.target.value);
    const handleChange2 = event => setBody(event.target.value);
    const handleChange3 = event => setImage(event.target.files[0]);
    useEffect(() => {
        if (url) {
            // const URI = "http://localhost:5000/api/auth/createpost";
            const URI = "/createpost";
            fetch(URI, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "token": localStorage.getItem("token")
                },
                body: JSON.stringify({
                    title,
                    body,
                    image: url
                })
            })
                .then(res => res.json())
                .then(data => {
                    // console.log(data);
                    history.push("/");
                })
                .catch(error => console.log(error));
        }
    }, [url])
    const handleSubmit = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "project");
        data.append("cloud_name", "paras0904");
        fetch("https://api.cloudinary.com/v1_1/paras0904/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => seturl(data.url))
            .catch(error => console.log(error));
    }
    return (
        <div className='card input-filed' style={{ margin: "30px auto", maxWidth: "500px", padding: "20px", textAlign: "center" }}>
            <input type="text" placeholder='title' value={title} onChange={handleChange1} />
            <input type="text" placeholder='body' value={body} onChange={handleChange2} />
            <div className="file-field input-field">
                <div className="btn">
                    <span>Upload image</span>
                    <input type="file" style={{color:"black",top:"20px",left:"144px",opacity:"1"}} onChange={handleChange3} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light" onClick={handleSubmit}>
                Submit
            </button>
        </div>
    )
}
export default CreatePost;