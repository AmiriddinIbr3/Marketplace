"use client";
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const ApiUrl = process.env.NEXT_PUBLIC_API_URL;

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: `http://localhost:3000/graphql`,
      credentials: 'include',
    }),
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;