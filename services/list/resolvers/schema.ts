import { gql } from 'apollo-server'

export const typeDefs = gql`
  type Task {
    id: Int!
    title: String!
    status: String!
  }


  type List {
    id: ID!
    listName: String!
    tasks: [Task]
  }

  type Query {
    lists: [List!]!
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

  input UpdateTaskInput {
    title: String!
    status: String!
  }

  type UpdateResult {
    id: Int!
    title: String!
    status: String!
    list: List!
  }

  type Mutation {
    createList(input: CreateListInput!): List!
    updateTask(taskId: Int!,input: UpdateTaskInput!): UpdateResult!
  }
`
