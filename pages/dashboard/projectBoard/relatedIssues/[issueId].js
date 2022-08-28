import { useEffect } from "react";
import { useRouter } from 'next/router'
import Layout from '../../../../layout/layout'
import RelatedIssue from "../../../../components/cards/relatedIssues"
import Header from '../../../../components/headers/searchbar'

export default function RelatedIssuePage({user,token}){
    const router = useRouter()
    useEffect(() =>{
        
        if(!user){
            router.push('/login')
        }
    })

    
    return(
        <>
            <Layout role={user ? JSON.parse(user).job_role : null}>
                <Header/>
                <RelatedIssue issueId={router.query.issueId} user={user} token={token}/>
            </Layout> 
        </>
    )
}