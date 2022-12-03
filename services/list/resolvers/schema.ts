import { gql } from 'apollo-server'

export const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
    status: String!
  }


  type List {
    id: ID!
    listName: String!
    tasks: [Task]
  }

  type Query {
    list(id: ID!): List
  }

  input CreateTaskInput {
    title: String!
    status: String!
  }


  input CreateListInput {
    listName: String!
    tasks: [CreateTaskInput!]!
  }

  type CreateResult {
    success: Boolean!
  }

  type Mutation {
    createList(input: CreateListInput!): List!

  }
`
