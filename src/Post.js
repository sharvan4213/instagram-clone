import { Button } from '@material-ui/core';
import {db } from "./firebase";
import firebase from 'firebase';
import React,{useState,useEffect} from 'react'
import Avatar from './Avatar'
import './posts.css'
import InstagramEmbed from 'react-instagram-embed';


function Posts({name,user, imageUrl,caption, postId}) {
    const[comments,setComments] = useState([]);
    const[comment,setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if(postId){
            console.log('yes')
            unsubscribe = db
            .collection('post')
            .doc(postId)
            .collection('comments')
            .orderBy('timestamp')
            .onSnapshot(snapshot => {
                setComments(snapshot.docs.map(doc => ({
                    comment_data:doc.data(),
                    id: doc.id })
                ))});
        }      
        return ()=>{unsubscribe();}
    },[postId]);


    const handlePost =(e)=>{
        e.preventDefault();
        db
        .collection('post')
        .doc(postId)
        .collection('comments')
        .add({
            username:user?.displayName,
            comment:comment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
     }
    
    return (
        <div className="posts">
            <div className="left__div">
            {/* titel_name + avatar */}
            <div className ="post__profile">
            <Avatar image={imageUrl}/>
            <h4>{name}</h4>
            </div>
            {/* image */}
            <img className="post__image" src ={imageUrl} />
            {/* caption */}
            <h4 className="post__caption"><strong>{name}:  </strong>{caption}</h4>
            {
                comments.map(({comment_data,id}) =>{
                    return(<h4 className="post__comment" key={id} ><strong>{comment_data.username}</strong>:     {comment_data.comment}</h4>)
                })
            }
            {user &&<div className="post__comment__div">
                <input className="post__comment__text" placeholder="Enter the comments..." value ={comment} onChange={(e)=>{setComment(e.target.value)}}/>
                <button className='post__comment__button' onClick={handlePost}>post</button>
            </div>
            }
            </div>
            <div className="rigth__div">
            <InstagramEmbed
            url='https://instagr.am/p/Zw9o4/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
            />
            </div>
        </div>
    )
}

export default Posts
