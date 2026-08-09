# Mayan Solution Practical Exam

## QuickStart

1. Go to [backend](./backend/)
1. Install the dependencies

   `pnpm i`

1. copy the `.env.example` and rename it to `.env`
1. Run the postgres docker

   `docker compose up -d`

1. Update the database schema with prisma

   `pnpx db:setup`

1. Run the backend server
   `pnpm run start`

1. Open a new terminal

1. Go to [frontend](./frontend/)

1. Install the dependencies

   `pnpm i`

1. copy the `.env.example` and rename it to `.env`

1. Run the frontend website

   `pnpm run dev`

## Problem

Build a Task Management App With the following features:

- Add Task
- Mark task as complete or incomplete
- Edit task details
- Delete Task
- Search Task
- Filter Functionality
  - Filter by All, Active, Inactive, Completed
  - Work together with search (e.g., search + "Completed")

### Solution

- Just do a database insert
- do a database Update with parameters of id and status
- do an UPDATE on task with parameters of id and task details (title, description, status)
- To delete a task, I'm going for a hard delete instead of a soft delete to make things simple
- For the search, I'm going with client side search since I'm going to assume that the tasks are less than 10000 rows and its simplier to implement
- For filtering I will also do client side filtering, I will store the state of the filter in the search parameters. To add the search + status filter, I will split the filter with spaces and try to match the first string that has compelete, inactive, active, all. (e.g. calendar all, excel inactive)

### Techstack

- Vite + React + Tanstack Router
  - Why: It provides a simple and file based structure where it provides the best developer experience and fast prototyping.
- Tanstack Query
  - Why: This is the standard for querying API endpoints as it handles alot of the necessary features of a fetch requests such as caching and invalidation
- Zod
  - Why: This helps validate the payload in runtime ensuring all data conforms with the schema.\
- react-hook-form
  - Why: This makes it easier to create a form and handle complex state like error handling.
- NestJS
  - Why: It is a structured MVC architecture which makes it easier for other developer to understand.
- Prisma ORM
  - Why: This allows an easy database migration which makes it simple to setup
- Postgres with docker
  - Why: Postgres is the standard for databases and with docker it makes it simple and repeatable to setup.

I value structured architecture when working with other people.

### Database schema

Table Name: task

|      column | type                       |
| ----------: | :------------------------- |
|          id | SERIAL PRIMARY KEY         |
|       title | TEXT NOT NULL UNIQUE       |
| description | TEXT default ""            |
|      status | VARCHAR default "inactive" |
