import issueServices from "../../services/issue"

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link'
import { useState,useEffect } from 'react';
import classes from "../../styles/issueDetails.module.css"
import comment from "../../services/comment";


const RelatedIssueDetails = ({issueId,token})=>{
    console.log(issueId,"......")
    const [issue,setIssue] = useState(null)

    // console.log(issue,"issue")
    // issue.comments.map((comment)=>{console.log(comment.text)})
       
    useEffect( () => {
        const getIssue = async ()=>{
             try{
                 // const token = window.localStorage.getItem('userToken')
                 const data = await issueServices.getIssueById(issueId,
                     { headers :{ "Access-Control-Allow-Origin" : "*",
                         "Content-type": "Application/json",
                         'Authorization' : token}})
                 if(!data){
                     setLoad(true)
                     return
                 }
                 // setIssue(JSON.stringify(data))
                 
                 setIssue(data)
             }catch(e){
                 console.log(e)
             }
         }
         getIssue()
     },[])
{/* <Backdrop open>
                <CircularProgress color="inherit" />
            </Backdrop> */}
    return (
        !issue?
        <p>No related issues</p>
        :
         <div className={classes.issueDetails}>
            <div className={classes.sub}>
            <p> <span className={classes.color}>Project Board</span>/Related Issues</p>
            </div>
            <div className={classes.project}>
                <h1>{issue.name} Project</h1>
                <p>{issue.summary} </p>
            </div>
         <div className={classes.container}>
          <div className={classes.left}>
            <div className={classes.desc}>
              <p>Description:</p>
              <h4>{issue.description}</h4>
                <hr />
            </div>
          <div className={classes.details}>
              <h2>Details</h2>
              <div className={classes.dGrid}>
                     
                    
                      <div className={classes.tFlex}>
                          <p>Priority:</p>
                          <p className={classes.high}>{issue.priority}</p>
                      </div>
                      <div className={classes.tFlex}>
                          <p>Story Points:</p>
                          <p> <span>{issue.story_points?issue.story_points:"3"}</span></p>
                      </div>
                      
              </div>
          </div>
          <hr />
          {/* <Comment issueId={issueId} token={token}/> */}
          <div>
            Comments:
            {issue.comments?issue.comments.map((comment)=>{return( <span><h4>{comment.text}</h4> <p style={{color:"grey",fontSize:"10px"}}>{comment.date_of_creation}</p></span> )
           
            }):<p>No Comments</p>}
          </div>
          {/* <h5>Comments {}</h5> */}
        
          
          </div>
          <div>

         
          </div>
         </div>



      </div>
    )
}


export default RelatedIssueDetails