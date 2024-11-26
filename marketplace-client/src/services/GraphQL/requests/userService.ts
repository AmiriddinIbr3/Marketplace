import { gql } from "@apollo/client";
import createApolloClient from "..";

export async function getUserById(id: string) {
    const client = createApolloClient();

    const { data } = await client.query({
        query: gql`
            query GetUserById($id: String!) {
                getUserById(id: $id) {
                    id
                    email
                    name
                    surname
                    username
                    role
                    likes {
                        id
                        authorId
                        productId
                        createdAt
                        updatedAt
                    }
                    products {
                        id
                        title
                        price
                        description
                        likes
                        mainImageId
                        authorId
                        createdAt
                        updatedAt
                        images {
                            id
                            createdAt
                            updatedAt
                        }
                    }
                    profile {
                        id
                        description
                        userId
                        avatars {
                            id
                            createdAt
                            updatedAt
                        }
                    }
                }
            }
        `,
        variables: { id },
    });

    return data;
}