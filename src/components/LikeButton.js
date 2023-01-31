import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Button,Icon,Label, Popup } from 'semantic-ui-react';

function LikeButton(props) {

    const [liked,setLiked] = useState(false) 
    useEffect(()=>{
        if (props.user && props.likes.find(like=> like.username === props.user.username)){
                setLiked(true)
        } else {
            setLiked(false)
        }
    },[props.likes,props.user])


    const [likePost] = useMutation(LIKE_POST_MUTATION,{
        variables:{postId:props.id}
    })

const likeButton =  props.user ? (
    liked ? (
        <Button color="teal" >
          <Icon name="heart" />
        </Button>
    ): (
        <Button color="teal" basic >
          <Icon name="heart" />
        </Button>
    )
): (
    <Button as={Link} to='/login' color="teal" basic >
          <Icon name="heart" />
        </Button>
)
    return ( 
        <Popup inverted content='Like Post' trigger={
            <Button as="div" labelPosition="right" onClick={likePost}>
            {likeButton}
        <Label as="a" basic color="teal" pointing="left">
          {props.likesCount}
        </Label>
      </Button>
        }/>
     );
}

const LIKE_POST_MUTATION = gql`
mutation likePost($postId:ID!){
    likePost(postId: $postId){
        id 
        likes {
            id username
        }
        likesCount
    }
}
`

export default LikeButton;