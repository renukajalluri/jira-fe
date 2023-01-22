// import classes from "../../styles/LoginForm.module.css"
import classes from "../../styles/AuthForm.module.css";

import userService from "../../services/auth";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid Email Format").required("Required"),
  password: Yup.string().required("Required"),
});

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const data = await userService.login({
        email: values.email,
        password: values.password,
      });
      window.localStorage.setItem("userToken", `bearer ${data.accessToken}`);
      window.localStorage.setItem("user", JSON.stringify(data.user));
      setEmail("");
      setPassword("");

      router.push("/dashboard/projectBoard");
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  return (
    // className='flex align-center jc-center'
    <div className={classes.grid}>
      <div className={classes.sideBar}>
        <h1>Tracker</h1>
      </div>

      <div>
        <div>
          <h1 className={classes.login}>Login</h1>
        </div>
        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <div className={classes["form-control"]}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              onChange={formik.handleChange}
              value={formik.values.email}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className={classes.error}>{formik.errors.email}</p>
            ) : null}
          </div>

          <div className={classes["form-control"]}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={formik.handleChange}
              value={formik.values.password}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className={classes.error}>{formik.errors.password}</p>
            ) : null}
          </div>

          {/* <div className={classes['password-forgot']}>
                  <p>Forgot Password?</p>
              </div> */}
          <div className={classes.btn}>
            {
              loading ? (
                <Backdrop className={classes.backdrop} open>
                  <CircularProgress color="inherit" />
                </Backdrop>
              ) : (
                //    <div >
                <button
                  disabled={!formik.isValid || formik.isSubmitting}
                  onSubmit={onSubmit}
                  type="submit"
                >
                  Login
                </button>
              )
              //    </div>
            }
          </div>
        </form>
      </div>
    </div>
  );
}
