import { useFormik } from "formik";
import classes from "../../styles/CreateProjectForm.module.css";
import { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { MultiSelect } from "react-multi-select-component";
import projectService from "../../services/project";
import issueService from "../../services/issue";
import { useRouter } from "next/router";

const initialValues = {
  status: "",

  priority: "",
  storyPoints: "",
};

const EditIssueForm = ({ token, issueId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState([]);
  const [project, setProject] = useState(null);
  const [selected, setSelected] = useState([]);
  const [a, setA] = useState(JSON.stringify([]));
  const [status, setStatus] = useState(null);
  const [priority, setPriority] = useState(null);
  const [summary, setSummary] = useState(null);
  const [description, setDescription] = useState(null);
  const [storyPoints, setStoryPoints] = useState(null);

  async function getAssignees(projectId) {
    try {
      const project = await projectService.getProjectById(projectId, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Application/json",
          Authorization: token,
        },
      });

      const a = project.members.map((m) => {
        return { value: m._id, label: m.name };
      });

      setA(JSON.stringify(a));
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    async function getIssueData() {
      try {
        const data = await issueService.getIssueById(issueId, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: token,
          },
        });
        if (!data) {
          setLoading(false);
          return;
        }
        setStoryPoints(data.story_points);
        setStatus(data.status);
        setPriority(data.priority);
        setProject(data.project_id._id);
        let arr = data.issued_to.map((assignee) => {
          return { value: assignee._id, label: assignee.name };
        });
        getAssignees(data.project_id._id);
        setSummary(data.summary);
        setDescription(data.description);
        setSelected(arr);
      } catch (e) {
        console.log(e);
      }
    }
    async function getData() {
      try {
        const project = await projectService.getProjects({
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "Application/json",
            Authorization: token,
          },
        });
        if (!project) {
          setLoading(false);
          return;
        }
        setProjectName(project);
        setLoading(true);
      } catch (e) {
        console.log(e);
      }
    }
    setLoading(true);
    getData();
    getIssueData();
    setLoading(false);

    console.log(a);
  }, []);
  const onSubmit = async (values, { resetForm }) => {
    const issued_to = selected.map((values) => {
      return values.value;
    });
    setLoading(false);
    const data = await issueService.updateIssue(
      issueId,
      {
        project_id: project,
        issued_to: issued_to,
        status: status,
        priority: priority,
        summary: summary,
        description: description,
        story_points: storyPoints,
      },

      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Application/json",
          Authorization: token,
        },
      }
    );

    router.push(`/dashboard/projectBoard`);
  };

  const resetForm = () => {
    formik.resetForm();
    setPriority(null);
    setStatus(null);
    setStoryPoints(null);
  };
  const formik = useFormik({
    initialValues,
    onSubmit,
    resetForm,
  });
  if (!loading) {
    return (
      <Backdrop open>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else {
    return (
      <div>
        <h1 className={classes.head}>Edit User Tasks/Bugs</h1>
        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <div className={classes.grid}>
            {/* summary */}
            <div className={classes["form-control"]}>
              <label htmlFor="summary">Summary</label>
              <input
                label="Summary"
                name="summary"
                type="text"
                placeholder="Add Summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                disabled
              />
            </div>

            {/* description */}
            <div className={classes["form-control"]}>
              <label htmlFor="description">Description </label>

              <input
                label="Description"
                name="description"
                type="text"
                placeholder="Write Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled
              />
            </div>

            {/* priority */}
            <div className={classes["form-control"]}>
              <label htmlFor="priority">Priority </label>
              <select
                label="Priority"
                name="priority"
                placeholder="Select"
                value={priority}
                onChange={(e) => {
                  e.preventDefault();
                  setPriority(e.target.value);
                }}
              >
                <option disabled selected value>
                  {" "}
                  -- select an option --{" "}
                </option>
                <option value="high">High</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
              </select>
            </div>

            {/* project */}
            <div className={classes["form-control"]}>
              <label htmlFor="project">Project </label>

              <select
                label="Project"
                name="project"
                placeholder="Select"
                value={project}
                onChange={(event) => {
                  event.preventDefault();
                  setProject(event.target.value);
                  getAssignees(event.target.value);
                }}
                disabled
              >
                <option disabled selected value>
                  {" "}
                  -- select an option --{" "}
                </option>
                {projectName.map((v) => {
                  {
                  }
                  return (
                    <option
                      className={classes.option}
                      key={v._id}
                      value={v._id}
                    >
                      {v.name}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* assignee */}
            <div className={classes.assignee}>
              <label className={classes.label} htmlFor="assignees">
                Assignees
              </label>
              <MultiSelect
                options={JSON.parse(a)}
                name="assignees"
                required="true"
                displayValue="value"
                value={selected}
                onChange={setSelected}
                className={classes.multiInput}
                onRemove={(event) => {
                  //   console.log(event)
                }}
                disabled
              ></MultiSelect>
            </div>
            <div className={classes["form-control"]}>
              <label htmlFor="status">Status </label>
              <select
                label="Status"
                name="status"
                placeholder="Select"
                value={status}
                onChange={(e) => {
                  e.preventDefault();
                  setStatus(e.target.value);
                }}
              >
                <option disabled selected value>
                  {" "}
                  -- select an option --{" "}
                </option>
                <option value="todo">To do</option>
                <option value="development">Development</option>
                <option value="testing">Testing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className={classes["form-control"]}>
              <label htmlFor="storyPoints">
                Story Points <span className={classes.star}>*</span>
              </label>
              <input
                onChange={(e) => {
                  e.preventDefault();
                  setStoryPoints(e.target.value);
                }}
                value={storyPoints ? storyPoints : ""}
                name="storyPoints"
                min="0"
                type="number"
                placeholder="0"
              />
              {formik.touched.description && formik.errors.description ? (
                <p className={classes.error}>{formik.errors.description}</p>
              ) : null}
            </div>
          </div>
          <div className={classes["pro-btn"]}>
            <button
              className={classes.resetBtn}
              onClick={resetForm}
              type="reset"
            >
              Reset
            </button>
            <button className={classes.createBtn} type="submit">
              Update
            </button>
          </div>
        </form>
      </div>
    );
  }
};

export default EditIssueForm;
