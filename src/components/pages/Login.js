import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useContext, useEffect, useState } from "react";
import {  redirect, useLocation, useNavigate } from "react-router-dom";
import { Form, Button } from "semantic-ui-react";
import { AuthContext } from "../../context/AuthContext";
import { useForm } from "../../hooks/hooks";

function Login(props) {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation() 

  const [errors, setErrors] = useState({});
  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: "",
    password: "",
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, result) {
      //console.log(result);
      context.login(result.data.login)
      navigate("/");
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  function loginUserCallback() {
    loginUser();
  }

  useEffect(()=>{
    const user = localStorage.getItem("jwtToken")
    if (user){
        console.log('yess we have a user')
        console.log(location.pathname)
        if (location.pathname.startsWith('/login')){
            navigate('/')
        }
    }
  },[location.pathname,navigate])

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h2>Login</h2>
        <Form.Input
          error={errors.username ? true : false}
          label="Username"
          type="text"
          placeholder="Username..."
          name="username"
          value={values.username}
          onChange={onChange}
        />

        <Form.Input
          error={errors.password ? true : false}
          label="Password"
          placeholder="Password..."
          name="password"
          type="password"
          value={values.password}
          onChange={onChange}
        />

        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => {
              return <li key={value}>{value}</li>;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
