## Task Management App

This is a simple Task Management application built with Node.js, Express, and MongoDB.


## Features

- Create, update, delete, and retrieve tasks.
- Validate task fields for requiredness, non-empty, and specific conditions.
- Handle MongoDB validation for task creation.

## Prerequisites
- Node.js installed on your machine.
- MongoDB server running locally on mongodb://127.0.0.1:27017/task-app.





## Installation

1. Clone the repository:

```bash
  git clone https://github.com/Rathan-07/task-management-app.git

```

## 

2. Install dependencies:

```bash
  cd task-management-app
  npm install
```

## Installation

3. Install my-project with npm

```bash
 npm start
```

## API Endpoints
- Create Task:
  
  POST /tasks
- Get All Tasks:

  GET /tasks

- Get Single Task:

  PUT /tasks/:id
- Delete Task:

  DELETE /tasks/:id



    
## Validation
- Request data is validated using Express Validator.

- Detailed error messages are returned for validation failures.

- MongoDB validation is utilized for task creation.

## Database
- MongoDB is used as the database.
- Connection string: mongodb://127.0.0.1:27017/task-app



## Contributing

Feel free to contribute by opening issues, providing feedback, or submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE file for details.


