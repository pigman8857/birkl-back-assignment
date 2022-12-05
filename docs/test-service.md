## Test List Service

## Introducing the Alpha

In order to test the service we will use Apollo server

1. Go to http://localhost:4002/

2. Click on `Query your server`. This will navigate to https://studio.apollographql.com/sandbox/explorer with http://localhost:4002/ at the sandbox indicator at the top-left. If green light is on, means it is connecting to our localhost backend

Operation tab is for Graphql. The variable tab is for JSON body.

GraphQl operation createList exmaple

```
mutation Mutation($input: CreateListInput!) {
  createList(input: $input) {
    id,
    listName,
    tasks {
      id,
      position,
      status,
      title
    }
  }
}
```

JSON for the operation

```
{
  "input": {
    "listName": "test enum when create list",
    "tasks": [
      {
        "status": "TO_DO",
        "title": "Task that use enum type"
      }
    ]
  }
}

```

## Functionality

### Task management

- Create a new list
- Create a new task in a list (the task should be prepended to the list and the
  status should indicate it has not been completed)
- Update a task (title and status)
- Delete a task or list
- Move a task to a specific position in the list
- Retrieve all lists and their tasks

#### Task status enum
```
    - COMPLETED
    - TO_DO
    - REJECTED
    - IN_PROGRESS
```

List structure

```
{
    "id" : "string",
    "listName" : "string",
    "tasks" : []
}
```

Task Structure
```
{
    "id" : 0,
    "title" : "string",
    "status" : "status enum",
    "listId" : "string",
    "list" : { optional }
    "position" : 0
}

```

#### Create a new list

GQL operation
```
mutation Mutation($input: CreateListInput!) {
  createList(input: $input) {
    id,
    listName,
    tasks {
      id,
      position,
      status,
      title
    }
  }
}

```

JSON
```
{
  "input": {
    "listName": "List name",
    "tasks": [
      {
        "status": "TO_DO",
        "title": "title"
      }
    ]
  }
}

//or

{
  "input": {
    "listName": "List name",
    "tasks": []
  }
}

```

Response
```
{
  "data": {
    "createList": {
      "id": "list Id",
      "listName": "list name",
      "tasks": [
        {
          "id": 1,
          "position": 0,
          "status": "TO_DO",
          "title": "title"
        }
      ]
    }
  }
}

```

#### Create a new task in a list
A newly created task has status as TO_DO and its position will always be the latest.

GQL Operation
```
mutation Mutation($input: CreateTaskInput!) {
  createTask(input: $input) {
    list {
      id,
      listName,
      tasks {
        id,
        position,
        status,
        title
      }
    }
  }
}
```

JSON
```
{
  "input": {
    "listId": "list id",
    "title": "title"
  }
}
```

RESPONSE

```
{
  "data": {
    "createTask": {
      "list": {
        "id": "ab232902-492f-4ec7-895f-d55aebf03baa",
        "listName": "list name",
        "tasks": [
          {
            "id": 1,
            "position": 0,
            "status": "TO_DO",
            "title": "title name"
          }
        ]
      }
    }
  }
}

```

#### Update a task (title and status)

GQL Operation


```
mutation UpdateTask($taskId: Int!, $input: UpdateTaskInput!) {
  updateTask(taskId: $taskId, input: $input) {
    list {
      id,
      tasks {
        id,
        position,
        status,
        title
      }
    },
  }
}
```

JSON

```
{
  "input": {
    "status" : "IN_PROGRESS",
    "title": "title name"
  },
  "taskId": 1
}
```
RESPONSE

```
{
  "data": {
    "updateTask": {
      "list": {
        "id": "ab232902-492f-4ec7-895f-d55aebf03baa",
        "tasks": [
          {
            "id": 1,
            "position": 0,
            "status": "IN_PROGRESS",
            "title": "title name"
          },
        ]
      }
    }
  }
}

```

#### Delete a task

When deleting a task, will also cause the tasks to reposition.

GQL Operation
```
mutation DeleteTask($taskId: Int!, $listId: ID!) {
  deleteTask(taskId: $taskId, listId: $listId) {
    id,
    status,
    title,
    position
    
  }
}
```

JSON
```
{
  "taskId": 1,
  "listId": "ab232902-492f-4ec7-895f-d55aebf03baa"
}
```

Response

List of remaining tasks that have been repositioned
```
{
  "data": {
    "deleteTask": [
      {
        "id": 1,
        "status": "TO_DO",
        "title": "test",
        "position": 0
      }
    ]
  }
}

```

#### Delete a list

Delete a list will cause all tasks that belong to deleted list to be cleared out.

GQL Operation
```
mutation DeleteList($listId: ID!) {
  deleteList(listId: $listId) {
    deletedRole
  }
}
```

JSON

```
{
  "listId": "ab232902-492f-4ec7-895f-d55aebf03baa"
}
```

Response

```
{
  "data": {
    "deleteList": {
      "deletedRole": 1
    }
  }
}

```


#### Move a task to a specific position in the list

When even a task is relocated, other tasks will also reposition.

GQL Operation
```
mutation ChangeTaskPosition($taskId: Int!, $newPosition: Int!, $listId: ID!) {
  changeTaskPosition(taskId: $taskId, newPosition: $newPosition, listId: $listId) {
    id,
    position,
    status,
    title
  }
}

```

JSON

```
{
  "taskId": 1,
  "newPosition": 3,
  "listId": "3068802c-a32f-4806-8305-041b57cfeb8c"
}

```

Response
Response data is the list of tasks that are repositioned.
```
{
  "data": {
    "changeTaskPosition": [
      {
        "id": 6,
        "position": 0,
        "status": "TO_DO",
        "title": "Title # 3"
      },
     ...
    ]
  }
}

```