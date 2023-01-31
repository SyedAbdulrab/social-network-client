import React, { useContext } from "react";
import moment from "moment";
import { Card, Image, Button, Label, Icon ,Popup} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
function PostCard({
  post: { body, createdAt, id, username, likesCount, commentsCount, likes },
}) {
  const { user } = useContext(AuthContext);

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>

       <LikeButton user={user} id={id} likesCount={likesCount} likes={likes}/>


        <Popup
         inverted
         content="Comment on post" 
        trigger={
          <Button as="div" labelPosition="right">
          <Button color="blue" basic as={Link} to={`/posts/${id}`}>
            <Icon name="comments" />
          </Button>
          <Label as="a" basic color="blue" pointing="left">
            {commentsCount}
          </Label>
        </Button>
        }/>

        {user && user.username === username && (
          <DeleteButton postId={id}/>
        )}
      </Card.Content>
    </Card>
  );
}

export default PostCard;
