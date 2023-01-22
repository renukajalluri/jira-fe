import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "../../styles/issueDetails.module.css";
import { useEffect, useState } from "react";
import commentService from "../../services/comment";
// import styles from "../../styles/CreateProjectForm.module.css"
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Comment = ({ issueId, token }) => {
  const [load, setLoad] = useState(true);
  const [text, setText] = useState(null);
  const [comments, setComments] = useState(null);
  const getComments = async () => {
    try {
      const res = await commentService.getComments(issueId, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Application/json",
          Authorization: token,
        },
      });

      setComments(res);
      setLoad(false);
    } catch (e) {
      console.log(e);
    }
  };
  const addComment = async () => {
    setText("");
    setLoad(true);
    try {
      const res = await commentService.addComment(
        {
          issue: issueId,
          text: text,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: token,
          },
        }
      );
      getComments();
      setLoad(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (issueId) {
      getComments();
    }
  }, []);
  return (
    <>
      {load ? (
        <Backdrop open>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <div className={classes.comment}>
          <h3>Comments </h3>
          <div>
            <p>
              <label htmlFor="w3review">Write a comment:</label>
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="2"
              cols="50"
            ></textarea>
            <br></br>
            <button className={classes.createBtn} onClick={addComment}>
              post
            </button>
          </div>
          {comments
            ? comments.map((comment) => {
                return (
                  <div key={comment._id} className={classes.comments}>
                    <p>{comment.text}</p>
                    <div className={classes.cFlex}>
                      <p>Posted on {comment.date_of_creation}</p>
                      <p>Added by {comment.user.name}</p>
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      )}
    </>
  );
};

export default Comment;
