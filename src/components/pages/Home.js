import React, { useContext } from "react";
import { useQuery, gql } from "@apollo/client";
import { Grid, Transition } from "semantic-ui-react";
import PostCard from "../PostCard";
import { AuthContext } from "../../context/AuthContext";
import PostForm from "../PostForm";
import { FETCH_POST_QUERY } from "../../utils/graphql";
function Home() {
  const context = useContext(AuthContext);

  const { loading, data } = useQuery(FETCH_POST_QUERY);

  if (loading) {
    return <p>loading...</p>;
  }
  if (data) {
    const { getPosts: posts } = data;
    return (
      <Grid columns={3}>
        <Grid.Row className="page-title">
          <h1>Recent posts</h1>
        </Grid.Row>
        <Grid.Row>
          {context.user && (
            <Grid.Column>
              <PostForm />
            </Grid.Column>
          )}
          {loading ? (
            <h1>Loading Posts...</h1>
          ) : (
            <Transition.Group>
              {posts &&
                posts.map((post) => (
                  <Grid.Column key={post.id} style={{ marginBottom: "20px" }}>
                    <PostCard post={post} />
                  </Grid.Column>
                ))}
            </Transition.Group>
          )}
        </Grid.Row>
      </Grid>
    );
  }
}

export default Home;
