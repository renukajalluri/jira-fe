import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import issueServices from "../../services/issue"
import classes from "../../styles/ProjectDetails.module.css"
import Link from 'next/link'
import RelatedIssueCard from "./relatedIssueCard"
import functions from '../functions'
import { useEffect,useState } from "react"

const RelatedIssue= ({issueId,token})=>{

   const [development,setDevelopment] = useState([])
   const [todo,setTodo] = useState([])
   const [testing,setTesting] = useState([])
   const [completed,setCompleted] = useState([])
   const [loading,setLoading] = useState(true)
//    const [status,setStatus] = useState([])
   const [relatedIssues,setRelatedIssues] = useState([])


   const filter = issues=>{
// console.log("i",issues)
    setTodo(functions.filterByStatus('todo',issues))
    setDevelopment(functions.filterByStatus('development',issues))
// console.log("d",development)
    setTesting(functions.filterByStatus('testing',issues))
    setCompleted(functions.filterByStatus('completed',issues))
}


    useEffect(()=>{
       
        async function getRelatedIssues(issueId){
            console.log("issueId",issueId)
            try {
           
                const data = await issueServices.getRelatedIssuesByIssueId(issueId,{
                    headers :{ "Access-Control-Allow-Origin" : "*",
                "Content-type": "Application/json",
                'Authorization' : token}
                })

                // console.log("re",data)
                if(data){
                    // setLoading(true)
                    
                   console.log(data,"re")
                   setRelatedIssues(data)
                    filter(data)
                   
                    setLoading(false)

               
                }else{
                    setLoading(true)
                }
               

            } catch (e) {
                console.log(e)
            }
        }
        getRelatedIssues(issueId)
        // console.log("relatedIssues",relatedIssues)
    //    console.log("related",relatedIssues)
  

       
    },[])

    
    return (
        loading?
        <Backdrop open>
                <CircularProgress color="inherit" />
            </Backdrop>:
        <div>
            <h1>Related Issues</h1>
            <div className={classes["related-issue-grid"]}>
                <div>
                <h3>To Do</h3>
                {todo? todo.map(r=>{return(<Link key={r._id} href={`/dashboard/projectBoard/relatedIssueDetails/${r._id}`}>
                    <a><RelatedIssueCard issue={r}/></a>
                </Link>)} )   
           :"" }
                </div>
                <div>
                <h3>Development</h3>
                {development? development.map(r=>{return(<Link key={r._id} href={`/dashboard/projectBoard/relatedIssueDetails/${r._id}`}>
                    <a><RelatedIssueCard issue={r}/></a>
                </Link>)} ) 
            :""}
                </div>
                <div>
                <h3>Testing</h3>
                {testing? testing.map(r=>{return( <Link key={r._id} href={`/dashboard/projectBoard/relatedIssueDetails/${r._id}`}>
                    <a><RelatedIssueCard issue={r}/></a>
                </Link>)} )  
          :""  }
                </div>

                <div>
                <h3>Completed</h3>
                {completed? completed.map(r=>{return(<Link key={r._id} href={`/dashboard/projectBoard/relatedIssueDetails/${r._id}`}>
                    <a><RelatedIssueCard issue={r}/></a>
                </Link>)} )   
         :""   }
                </div>

            </div>
           
        </div>
    )
}


export default RelatedIssue