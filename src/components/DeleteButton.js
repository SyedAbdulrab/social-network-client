import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { Fragment, useState } from "react";
import { Button, Confirm, Icon,Popup } from "semantic-ui-react";
import { FETCH_POST_QUERY } from "../utils/graphql";

function DeleteButton(props) {
   
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = props.commentId
    ? DELETE_COMMENT_MUTATON
    : DELETE_POST_MUTATON;
  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy) {
        
      setConfirmOpen(false);
      if (!props.commentId) {
        const posts = proxy.readQuery({
          query: FETCH_POST_QUERY,
        });

        const filteredPosts = posts.getPosts.filter(
          (post) => post.id !== props.postId
        );

        proxy.writeQuery({
          query: FETCH_POST_QUERY,
          data: {
            getPosts: filteredPosts,
          },
        });
      }
      if (props.callback) {
        props.callback();
      }
    },
    variables: {
      postId: props.postId,
      commentId: props.commentId
    },
  });
  return (
    <Fragment>
      <Popup inverted content={props.commentId?'delete comment':'delete post'} trigger={
        <Button
        floated="right"
        as="div"
        color="red"
        onClick={() => {
          setConfirmOpen(true);
        }}
      >
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>
      }/>
      <Confirm
        open={confirmOpen}
        onCancel={() => {
          setConfirmOpen(false);
        }}
        onConfirm={deletePostOrComment}
      />
    </Fragment>
  );
}

const DELETE_POST_MUTATON = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;
const DELETE_COMMENT_MUTATON = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
  deleteComment(postId: $postId, commentId: $commentId){
    body
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentsCount
  }
}
`;

export default DeleteButton;
