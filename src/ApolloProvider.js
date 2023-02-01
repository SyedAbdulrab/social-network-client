import React from "react";
import App from "./App";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "apollo-link-context";
// import {ApolloClient} from 'apollo-client'
// import {ApolloProvider} from '@apollo/react-hooks'
// import {createHttpLink} from 'apollo-link-http'
// import { InMemoryCache } from 'apollo-cache-inmemory'

const httpLink = createHttpLink({
  uri: "https://lavender-macaw-kit.cyclic.app/",
});
const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
