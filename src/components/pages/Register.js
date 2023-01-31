import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button } from "semantic-ui-react";
import { AuthContext } from "../../context/AuthContext";
import { useForm } from "../../hooks/hooks";


function Register(props) {
    const context = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation()
  const [errors, setErrors] = useState({});
  const initialState = {
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  }
  const {onChange,onSubmit,values} = useForm(registerUser,initialState)

  useEffect(()=>{
    const user = localStorage.getItem("jwtToken")
    if (user){
        console.log('yess we have a user')
        console.log(location.pathname)
        if (location.pathname.startsWith('/register')){
            navigate('/')
        }
    }
  },[location.pathname,navigate])
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, {data:{register:userData}}) {
      console.log(userData);
      context.login(userData)
       navigate('/')
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  function registerUser(){
    addUser()
  }
  

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h2>Register</h2>
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
          error={errors.email ? true : false}
          label="Email"
          type="email"
          placeholder="Email..."
          name="email"
          value={values.email}
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
        <Form.Input
          error={errors.confirmPassword ? true : false}
          label="Confirm Password"
          type="password"
          placeholder="Confirm Password..."
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={onChange}
        />
        <Button type="submit" primary>
          register
        </Button>
      </Form>
     {Object.keys(errors).length > 0 &&
         (<div className="ui error message">
         <ul className="list">
           {
             Object.values(errors).map((value) => {
               return <li key={value}>{value}</li>;
             })}
         </ul>
       </div>)
     }
    </div>
  );
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
