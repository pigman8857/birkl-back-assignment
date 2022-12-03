import { gql } from 'apollo-server'

export const typeDefs = gql`
  type List {
    id: Int!
    tasks: [Task]
  }

  type Task {
    id: Int!
    title: String!
    status: String!
  }

  type Query {
    list(id: Int!): List
  }

  input CreateListInput {
    tasks: [CreateTaskInput!]!
  }

  input CreateTaskInput {
    title: String!
    status: String!
  }

  type Mutation {
    createList(input : CreateListInput!): List
  }
`
