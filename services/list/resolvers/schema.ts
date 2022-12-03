import { gql } from 'apollo-server'

export const typeDefs = gql`
  type List {
    id: ID!
    listName: String!
  }

  type Query {
    list(id: ID!): List
  }

  input CreateListInput {
    listName: String!
  }

  type CreateResult {
    success: Boolean!
  }

  type Mutation {
    createList(input: CreateListInput!): List!
  }
`
