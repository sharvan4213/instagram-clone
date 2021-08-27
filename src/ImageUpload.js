import React,{useState} from 'react'
import Button from '@material-ui/core/Button';
import {db,storage} from './firebase';
import firebase from 'firebase';
import './imageupload.css'

function ImageUpload({user}) {
    const[caption,setCaption] = useState('');
    const[image,setImage] = useState(null);
    const[progress,setProgress] = useState(0);
    const[fileChoose,setFileChoose] = useState(false);
    
    const takeFile = (e)=>{
    setFileChoose(true);
    if(e.target.files[0]){
        setImage(e.target.files[0]);
    }
    }

    const handleChange= ()=>{
        if(fileChoose){
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
        'state_changed',
        (snapshot) => {
        var p = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        // console.log('Upload is ' + progress + '% done');
        setProgress(p);
        console.log(progress)
        },
        (err)=>{
            alert(err);
            console.log(err);
        },
        () => {
            storage
            .ref('images')
            .child(image.name)
            .getDownloadURL()
            .then(
                (url)=>{
                    db.collection('post').add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption:caption,
                        name:user,
                        imageUrl:url
                    });
                    setCaption('');
                    setFileChoose(false);
                    setImage(null);
                    setProgress(0); 
                   
                }).catch(err=>console.log(err))
                    
            
        
            })
        }
    }


    return (
        <div className="image__upload">
            <progress className="image__upload__progress" value={progress} max='100'/>
            <input className="image__upload__file" type='file' onChange={takeFile} />
            <input className="image__upload__caption" value={caption} type='text' placeholder="Enter the Caption..." onChange={(e)=>setCaption(e.target.value)} />
            <Button variant="contained" color="primary" onClick={handleChange}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
