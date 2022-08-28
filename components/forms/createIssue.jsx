import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import * as Yup from 'yup'
import classes from '../../styles/CreateProjectForm.module.css'
import { useEffect, useState } from 'react'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { MultiSelect } from 'react-multi-select-component'
import projectService from '../../services/project'
import issueService from '../../services/issue'

const initialValues = {
  summary: '',
  status: '',
  project: '',
  description: '',
  priority: '',
  storyPoints: '',
}

const validationSchema = Yup.object({
  summary: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  priority: Yup.string()
    .oneOf(['high', 'low', 'medium'], 'Please Select')
    .required('Required'),
  status: Yup.string()
    .oneOf(['todo', 'development', 'testing'], 'Please Select')
    .required('Required'),
  storyPoints: Yup.number().required('Required'),
})

const CreateIssueForm = ({ token }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [projectName, setProjectName] = useState([])
  const [project, setProject] = useState(null)
  const [selected, setSelected] = useState([])
  const [a, setA] = useState(JSON.stringify([]))
  const [issueId, setIssueId] = useState('')

  async function getAssignees(projectId) {
    try {
      const project = await projectService.getProjectById(projectId, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-type': 'Application/json',
          Authorization: token,
        },
      })
      const a = project.members.map((m) => {
        return { value: m._id, label: m.name }
      })

      setA(JSON.stringify(a))
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    async function getData() {
      try {
        const project = await projectService.getProjects({
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'Application/json',
            Authorization: token,
          },
        })
        if (!project) {
          setLoading(false)
          return
        }
        setProjectName(project)
        setLoading(true)
      } catch (e) {
        console.log(e)
      }
    }
    setLoading(true)
    getData()
    setLoading(false)

    console.log(a)
  }, [])

  const onSubmit = async (values, actions) => {
    console.log('hello')
    const issued_to = selected.map((values) => {
      return values.value
    })
    setLoading(false)
    const data = await issueService.createIssue(
      {
        project_id: project,
        issued_to: issued_to,
        status: values.status,
        priority: values.priority,
        summary: values.summary,
        description: values.description,
        story_points: values.storyPoints,
      },

      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-type': 'Application/json',
          Authorization: token,
        },
      },
    )
    if (data) {
      setIssueId(data._id)
      setLoading(true)
    } else {
      setLoading(false)
    }

    router.push('/dashboard/projectBoard')
  }

  const resetForm = () => {
    formik.resetForm()
    setSelected([])
  }
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    resetForm,
  })

  if (!loading) {
    return (
      <Backdrop open>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  } else {
    return (
      <div className={classes.createForms}>
        <h1 className={classes.head}>Create User Tasks/Bugs</h1>
        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <div className={classes.grid}>
            {/* summary */}
            <div className={classes['form-control']}>
              <label htmlFor="summary">Summary <span className={classes.star}>*</span></label>
              <input
                name="summary"
                type="text"
                placeholder="Add Summary"
                onChange={formik.handleChange}
                value={formik.values.summary}
                onBlur={formik.handleBlur}
              />
              {formik.touched.summary && formik.errors.summary ? (
                <p className={classes.error}>{formik.errors.summary}</p>
              ) : null}
            </div>

            {/* description */}
            <div className={classes['form-control']}>
              <label htmlFor="description">Description <span className={classes.star}>*</span></label>
              <input
                onChange={formik.handleChange}
                value={formik.values.description}
                onBlur={formik.handleBlur}
                name="description"
                type="text"
                placeholder="Write Description"
              />
              {formik.touched.description && formik.errors.description ? (
                <p className={classes.error}>{formik.errors.description}</p>
              ) : null}
            </div>

            {/* priority */}
            <div className={classes['form-control']}>
              <label htmlFor="priority">Priority <span className={classes.star}>*</span></label>
              <select
                name="priority"
                placeholder="Select"
                onChange={formik.handleChange}
                value={formik.values.priority}
                onBlur={formik.handleBlur}
              >
                <option disabled value="">
                  {' '}
                  -- select an option --{' '}
                </option>
                <option value="high">High</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
              </select>
              {formik.touched.priority && formik.errors.priority ? (
                <p className={classes.error}>{formik.errors.priority}</p>
              ) : null}
            </div>

            {/* project */}
            <div className={classes['form-control']}>
              <label htmlFor="project">Project <span className={classes.star}>*</span></label>
              <select
                name="project"
                value={project}
                required
                onChange={(event) => {
                  event.preventDefault()
                  setProject(event.target.value)
                  getAssignees(event.target.value)
                }}
              >
                <option disabled selected value>
                  {' '}
                  -- select an option --{' '}
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
                  )
                })}
              </select>
            </div>

            {/* assignee */}
            <div className={classes.assignee}>
              <label className={classes.label} htmlFor="assignees">
                Assignees <span className={classes.star}>*</span>
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
                  console.log(event)
                }}
              ></MultiSelect>
            </div>

            {/* status */}
            <div className={classes['form-control']}>
              <label htmlFor="status">Status <span className={classes.star}>*</span></label>
              <select
                name="status"
                onChange={formik.handleChange}
                value={formik.values.status}
                onBlur={formik.handleBlur}
              >
                <option disabled value>
                  -- select an option --
                </option>
                <option value="todo">To do</option>
                <option value="development">Development</option>
                <option value="testing">Testing</option>
              </select>
              {formik.touched.status && formik.errors.status ? (
                <p className={classes.error}>{formik.errors.status}</p>
              ) : null}
            </div>

            <div className={classes['form-control']}>
              <label htmlFor="storyPoints">Story Points <span className={classes.star}>*</span></label>
              <input
                onChange={formik.handleChange}
                value={formik.values.storyPoints}
                onBlur={formik.handleBlur}
                name="storyPoints"
                type="number"
                placeholder="0"
                min="0"
              />
              {formik.touched.description && formik.errors.description ? (
                <p className={classes.error}>{formik.errors.description}</p>
              ) : null}
            </div>
          </div>
          <div className={classes['pro-btn']}>
            <button
              className={classes.resetBtn}
              onClick={resetForm}
              type="reset"
            >
              Reset
            </button>

            <button
              disabled={!formik.isValid || formik.isSubmitting}
              className={classes.createBtn}
              type="submit"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default CreateIssueForm
