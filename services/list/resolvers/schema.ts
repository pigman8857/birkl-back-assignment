import { gql } from 'apollo-server'

export const typeDefs = gql`
  type Task {
    id: Int!
    title: String!
    status: String!
    position: Int
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

  input CreateTaskInput {
    title: String!
    listId: String!
  }

  type UpdateTaskResult {
    id: Int!
    title: String!
    status: String!
    list: List!
  }

  type CreateTaskResult {
    id: Int!
    title: String!
    status: String!
    list: List!
    position: Int!
  }

  type DeleteTaskResult {
    deletedRole : Int!
  }

  type DeleteListResult {
    deletedRole : Int!
  }

  type Mutation {
    createList(input: CreateListInput!): List!
    createTask(input: CreateTaskInput!): CreateTaskResult!
    updateTask(taskId: Int!, input: UpdateTaskInput!): UpdateTaskResult!
    deleteTask(taskId: Int!): DeleteTaskResult!
    deleteList(listId: ID!): DeleteListResult!
  }
`
