import projectService from '../../services/project'
import userService from '../../services/user'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import classes from '../../styles/CreateProjectForm.module.css'
import 'react-datepicker/dist/react-datepicker.css'
import { MultiSelect } from 'react-multi-select-component'
import { useRouter } from 'next/router'

const initialValues = {
  projectName: '',
  projectOwner: '',
}

const validationSchema = Yup.object({
  projectName: Yup.string().required('Project Name is required'),
})

const CreateProjectForm = ({ token }) => {
  const router = useRouter()
  const [owners, setOwners] = useState('[]')
  const [name, setName] = useState('')
  const [owner, setOwner] = useState(null)
  const [loading, setLoading] = useState(false)
  const [member, setMember] = useState('[]')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState(false)
  const [selected, setSelected] = useState([])

  const onSubmit = async (values) => {
    try {
      setLoading(false)
      const data = await projectService.createProject(
        {
          name: name,
          owner: owner,
          start_date: startDate,
          end_date: endDate,
          members: selected.map((s) => s.value),
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'Application/json',
            Authorization: token,
          },
        },
      )
      resetData()
      setLoading(true)
      router.push('/dashboard/projectBoard')
    } catch (e) {
      resetData()
      console.log(e)
    }
  }

 
  useEffect(() => {
    async function getData(token) {
      try {
        const users = await userService.getUsers({
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'Application/json',
            Authorization: token,
          },
        })
        // console.log("users",users)
        if (!users) {
          setLoading(false)
          return
        }
        const members = users.filter(function (user) {
          return user.job_role == 'developer'
        })

        setMember(JSON.stringify(members))

        // console.log("members",members)
        const owners = users.filter(function (user) {
          return user.job_role == 'manager'
        })
        setOwners(JSON.stringify(owners))
        
        setLoading(true)
      } catch (e) {
        console.log(e)
      }
    }

    getData(token)
  }, [])
 
  const assignee = JSON.parse(member).map((m) => {
    return { value: m._id, label: m.name }
  })
  
  const resetForm = () => {
    formik.resetForm()
    setStartDate('')
    setEndDate('')
    setError(false)
    setSelected([])
    setMember('[]')
    setOwner(null)
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
      <div>
        <h1 className={classes.head}>Create Project</h1>
        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <div className={classes.grid}>
            {/* project name */}
            <div className={classes['form-control']}>
              <label htmlFor="projectName">Project Name</label>
              <input
                name="projectName"
                type="text"
                placeholder="Project Name"
                onChange={formik.handleChange}
                value={formik.values.projectName}
                onBlur={formik.handleBlur}
              />
              {formik.touched.projectName && formik.errors.projectName ? (
                <p className={classes.error}>{formik.errors.projectName}</p>
              ) : null}
            </div>

            {/* project owner */}
            <div className={classes['form-control']}>
              <label htmlFor="projectOwner">Project Owner</label>
              <select
                name="projectOwner"
                onChange={(e) => {
                  e.preventDefault()
                  setOwner(e.target.value)
                }}
                value={owner}
                required="true"
              >
                <option value="">Please select</option>
                {JSON.parse(owners).map((value) => {
                  return (
                    <option
                      className={classes.option}
                      key={value._id}
                      value={value._id}
                    >
                      {value.name}
                    </option>
                  )
                })}
              </select>
            </div>

            {/* start date */}
            <div className={classes.date}>
              <label htmlFor="startDate">
                Start Date <span className={classes.star}>*</span>
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                type="string"
                startDate={startDate}
                ariaRequired="true"
                required="true"
                endDate={endDate}
                maxDate={endDate}
                className={classes.dateInput}
                placeholderText="MM/DD/YYYY"
                name="startDate"
              />

              {error ? <p className={classes.error}>Required</p> : ''}
            </div>

            {/* end date */}
            <div className={classes.date}>
              <label htmlFor="endDateDate">
                End Date <span className={classes.star}>*</span>
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                type="string"
                ariaRequired="true"
                required="true"
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className={classes.dateInput}
                placeholderText="MM/DD/YYYY"
                name="endDate"
              />
              {error ? <p className={classes.error}>Required</p> : <p></p>}
            </div>

            {/* members */}
            <div>
              <label className={classes.label} htmlFor="members">
                Members <span className={classes.star}>*</span>
              </label>
              <div className={classes.members}>
                <MultiSelect
                  options={assignee}
                  name="members"
                  ariaRequired
                  required
                  displayValue="value"
                  value={selected}
                  onChange={setSelected}
                  className={classes.multiInput}
                  onRemove={(event) => {
                    console.log(event)
                  }}
                />
              </div>
            </div>

            <div></div>

            <div className={classes['pro-btn']}>
              <button
                onClick={resetForm}
                className={classes.resetBtn}
                type="reset"
              >
                Reset
              </button>
              <button
                disabled={!formik.isValid || formik.isSubmitting}
                onSubmit={onSubmit}
                className={classes.createBtn}
                type="submit"
              >
                Create
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default CreateProjectForm
