import React,{useState,useEffect} from 'react';
import './App.css';
import Navbar from './Navbar';
import Post from './Post';
import {db,auth} from './firebase'
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ImageUpload from './ImageUpload';
  
function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes =useStyles();
  const modalStyle = getModalStyle();
  const[posts,setposts] = useState([]);
  const[open,setopen] = useState(false);
  const[email,setEmail] = useState('');
  const[password,setPassword] = useState('');
  const[userName,setUserName] = useState('');
  const[user,setUser] = useState(null);
  const[openSignin,setopenSignIn] = useState(false);

  useEffect(() => {
    db.collection('post')
      .onSnapshot(snapshot =>{
      setposts(snapshot.docs.map(doc =>({
        post:doc.data(),
        id:doc.id
      }))); 
    })
  },[]);
  
  useEffect(() => {
   const unSubScribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        //user loggedin
        setUser(authUser);
      if(authUser.displayName){
        // dont update username
      }
    }
      else{
        //use logged out
        setUser(null);
      }
    })
    return ()=>{
      unSubScribe();
    }

  },[userName,user]);



  const signUp =(e) =>{
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser) =>{
      return authUser.user.updateProfile({
        displayName:userName
      })
    })
    .catch((err)=>alert(err.message))

    setopen(false)
  }

  const signIn = (e)=>{
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email,password)
      .catch((err) =>console.log(err))
      setopenSignIn(false);
  }

  return (
    <div className="app"> 
      <Modal
        open = {open}
        onClose={() => setopen(false)}
      >
       <div style={modalStyle} className={classes.paper}>
        <center className ="app__center">
          <img className="app__signup__logo" src = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/240px-Instagram_logo_2016.svg.png" alt="instagram logo"/>
          <input className= 'app__signup__input'   type="text" placeholder="userName" value={userName} onChange ={(e)=> setUserName(e.target.value)} />
          <input className="app__signup__input"  type="email" placeholder="Email"value={email} onChange={(e)=> setEmail(e.target.value)} />
          <input className="app__signup__input" type="password" placeholder="Password"value={password} onChange={(e)=> setPassword(e.target.value)} />    
          <Button type='submit' variant="contained" color="default" onClick={signUp} >
            Sign Up
          </Button>     
          </center>   
      </div>
      </Modal>

      <Modal
        open = {openSignin}
        onClose={() => setopenSignIn(false)}
      >
       <div style={modalStyle} className={classes.paper}>
        <center className ="app__center">
          <img className="app__signup__logo" src = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/240px-Instagram_logo_2016.svg.png" alt="instagram logo"/>
          <input className="app__signup__input"  type="email" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)} />
          <input className="app__signup__input" type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} />    
          <Button type='submit' variant="contained" color="default" onClick={signIn} >
            Sign In
          </Button>     
          </center>   
      </div>
      </Modal>
      <div className="app__navbar">
        <div>
        <img className="navbar__logo" src = "https://ya-webdesign.com/transparent450_/instagram-logo-png-2016-6.png"/>
        </div>
        <div className="app__button">
        {user !==null ?  <Button variant="contained" color="secondary" onClick = {() => {auth.signOut();setUser(null)}}>
        Logout
      </Button>:
      <div>
        <Button style={{marginRight:"10px"}} variant="contained" color="secondary" onClick={() => setopenSignIn(true)}>
        signIn
      </Button>
      <Button variant="contained" color="secondary" onClick={() => setopen(true)}>
        signUp
      </Button>
      </div> }
        </div>
      </div>
      { user && posts.map(({post,id}) => {
        return <Post key={id} postId={id} user={user} name={post.name} imageUrl={post.imageUrl} caption={post.caption} />
      })}
       {user?.displayName ? <ImageUpload user ={user.displayName}/> : <h3 className="default__login">
        <img src="https://cdn.pixabay.com/photo/2016/06/09/20/38/woman-1446557__340.jpg" />
         login to enjoy all new features of facebook</h3>}
   </div>
   
  )
}

export default App;
