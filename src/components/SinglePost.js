import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useContext, useRef, useState } from "react";
import {
  Button,
  Card,
  Form,
  Grid,
  Icon,
  Image,
  Label,
  Loader,
} from "semantic-ui-react";
import moment from "moment";
import { AuthContext } from "../context/AuthContext";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import { useNavigate, useParams } from "react-router-dom";

function SinglePost(props) {
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);
  let { postId } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const { loading, data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  function deletePostCallback() {
    navigate("/");
  }

  let postMarkup;

  if (loading) {
    postMarkup = <p>Loading Post...</p>;
  }
  if (data) {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likesCount,
      commentsCount,
    } = data.getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              size="small"
              floated="right"
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton
                  user={user}
                  id={id}
                  likesCount={likesCount}
                  likes={likes}
                />
                <Button
                  as="div"
                  labelPosition="right"
                  onClick={() => {
                    console.log("Comment on post");
                  }}
                >
                  <Button basic color="blue">
                    <Icon name="comments" />
                  </Button>
                  <Label color="blue" basic pointing="left">
                    {commentsCount}
                  </Label>
                </Button>
                {user && user.username === username && (
                  <DeleteButton postId={postId} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a Comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="comment.."
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                      />

                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === ""}
                        onClick={submitComment}
                        ref={commentInputRef}
                      >
                        submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation createComment($body: String!, $postId: String!) {
    createComment(body: $body, postId: $postId) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentsCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likes {
        username
      }
      commentsCount
      likesCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
