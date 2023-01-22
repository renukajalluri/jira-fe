import issueServices from "../../services/issue";
import React, { useEffect, useState } from "react";
import classes from "../../styles/issueDetails.module.css";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import Comment from "../forms/comment";

export default function ProjectDetails({ issueId, token, user }) {
  const [load, setLoad] = useState(false);
  const [issue, setIssue] = useState(null);
  const [creater, setCreater] = useState(false);

  let puser = user ? JSON.parse(user) : null;
  useEffect(() => {
    const getIssue = async () => {
      try {
        // const token = window.localStorage.getItem('userToken')
        const data = await issueServices.getIssueById(issueId, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: token,
          },
        });
        if (!data) {
          setLoad(true);
          return;
        } else {
          if (puser.id == data.created_by._id) {
            setCreater(true);
          }
          setIssue(data);
        }
        // setIssue(JSON.stringify(data))
      } catch (e) {
        console.log(e);
      }
    };
    getIssue();
  }, []);
  return !issue ? (
    <Backdrop open>
      <CircularProgress color="inherit" />
    </Backdrop>
  ) : (
    <div className={classes.issueDetails}>
      <div className={classes.sub}>
        <p>
          {" "}
          <span className={classes.color}>Project Board</span>/Issue Details
        </p>
      </div>
      <div className={classes.project}>
        <h1>{issue.project_id.name} </h1>
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
                <p>
                  {" "}
                  <span>{issue.story_points ? issue.story_points : "3"}</span>
                </p>
              </div>
            </div>
          </div>
          <hr />
          <Comment issueId={issueId} token={token} />
        </div>
        <div>
          <div className={classes.right}>
            {/* {puser.job_role == "manager" ? (
              ""
            ) : (
              <Link href={`/dashboard/projectBoard/relatedIssues/${issue._id}`}>
                <a>Related Issues</a>
              </Link>
            )} */}
            {issue.status == "completed" ? (
              ""
            ) : creater ? (
              <Link href={`/dashboard/projectBoard/editIssue/${issue._id}`}>
                <a href="">Edit Issue</a>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
