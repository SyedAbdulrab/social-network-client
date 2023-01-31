import React, { Fragment } from "react";
import { Button, Form } from "semantic-ui-react";
import { useForm } from "../hooks/hooks";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { FETCH_POST_QUERY } from "../utils/graphql";

function PostForm() {
  const { onSubmit, onChange, values } = useForm(createPostCallback, {
    body: "",
  });
  console.log(values);
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POST_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POST_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      console.log(data, "after writing to cache");
      values.body = "";
    },
  });

  function createPostCallback() {
    console.log(values);
    createPost();
  }
  return (
    <Fragment>
        <Form onSubmit={onSubmit}>
      <h2>Create a Post:</h2>
      <Form.Field>
        <Form.Input
          placeholder="Hi World"
          name="body"
          onChange={onChange}
          value={values.body}
          error={error ? true : false}
        />
        <Button type="submit" color="teal">
          Submit
        </Button>
      </Form.Field>
    </Form>
    {error && <div className="ui error message" style={{marginBottom:'20px'}}>
            <ul className="list">
                <li>{error.graphQLErrors[0].message}</li>
            </ul>
        </div>}
  
    </Fragment>);
}

const CREATE_POST_MUTATION = gql `
  mutation postCreate($body: String!) {
    createPost(body: $body) {
      id
      createdAt
      body
      username
      likesCount
      commentsCount
      likes {
        id
        username
        createdAt
      }
      comments {
        id
        body
        username
        createdAt
      }
    }
  }
`;
export default PostForm;
