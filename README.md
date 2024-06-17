# Microservices Application: User Management & Discussion Services

This repository contains the implementation of a microservices-based application consisting of two services: User Management Service and Discussion Service. These services are designed to manage user-related operations and discussion functionalities within a social media platform.

## Table of Contents

1. Overview
2. Getting Started
3. API Documentation
4. Testing
5. Database Schema
6. Low Level Design 

## Overview

### User Management Service

The User Management Service handles user registration, authentication, and management. It supports features such as creating, updating, deleting users, listing users, searching users by name, and managing user relationships through following functionality.

### Discussion Service

The Discussion Service manages the creation, updating, deletion, and retrieval of discussions. It supports features like creating discussions with text and images, tagging discussions, liking and commenting on discussions, and searching discussions based on text or tags.

## Getting Started

### Prerequisites

Ensure you have Node.js installed on your machine. You can download it from Node.js official website (`https://nodejs.org/en`).

### Installation

1. Clone the repository to your local machine
``
https://github.com/saurabh78crypto/spyne-backend-assignment.git
``

2. Navigate to the root directory of your cloned repository
``
cd spyne-backend-assignment
``

#### Running the Service Locally

#### User Management Service 
3. Navigate to the directory containning the User Management Service
``
cd user-management-service
``

4. Create .env file in the directory including following variables
``
PORT, BASE_URL, CON_URL, JWT_SECRET_KEY, CORS_ORIGIN, CORS_METHODS
`` 

5. Install dependencies for User Management Service and Start the Service
``
npm install
npm start
``

#### Discussion Service 
3. Navigate to the directory containning the Discussion Service
``
cd discussion-service
``

4. Create .env file in the directory including following variables
``
PORT, BASE_URL, CON_URL, CORS_ORIGIN, CORS_METHODS
`` 

5. Install dependencies for Discussion Service and Start the Service
``
npm install
npm start
``

## API Documentation

### User Management Service

- Create User: POST `/users/reguser`
- Update User: PUT `/users/update/:id`
- Delete User: DELETE `/users/delete/:id`
- List Users: GET `/users/listusers`
- Search User: GET `/users/search`
- Follow User: POST `/users/follow/:userId`

### Discussion Service

- Create Discussion: POST `/discussions`
- Update Discussion: PUT `/discussion/:id`
- Like Discussion: POST `/discussion/like/:discussionid`
- Unlike Discussion: POST `/discussion/unlike/:discussionid`
- Add Comment to Discussion: POST `/discussion/comment`
- Edit Comment of Discussion: PATCH `/discussion/edit-comment/:commentId`
- Delete Comment of Discussion: DELETE `/discussion/delete-comment/:commentId`
- Like Comment of Discussion: POST `/discussion/like-comments/:commentId`
- Reply to Comment of Discussion: POST `/discussion/reply-comments/:commentId`
- Delete Discussion: DELETE `/discussions/discussion/delete/:id`
- Get List of Discussions by Text or Tag: GET `/discussions/discussions/search`
- Increment the View Count of Discussion: GET `/discussions/discussion/:id`


## Testing

Use the provided Postman collection to test the APIs of the User Management Service and the Discussion Service. The collection includes tests for various endpoints, covering CRUD operations, authentication, and more.

`https://elements.getpostman.com/redirect?entityId=25343998-ae8e919a-3145-44e2-bb1c-a9aa434c5074&entityType=collection`


## Database Schema

### User Management Service Schema

User Collection

+ Fields:
    - `_id`: ObjectId (MongoDB default)
    - `name`: String
    - `mobileNo`: String, Unique
    - `email`: String, Unique
    - `password`: String
    - `tokens`: Array of Objects, Each containing a token string
    - `followers`: Array of ObjectIds referencing other User documents
    - `following`: Array of ObjectIds referencing other User documents

Relationships:
- A user can follow another user (followers array in the User document).
- A user can be followed by another user (following array in the User document).

### Discussion Service Schema

Discussion Collection

+ Fields:
    - `_id`: ObjectId (MongoDB default)
    - `text`: String
    - `image`: Buffer (for storing images)
    - `hashtags`: Array of Strings
    - `createdAt`: Date
    - `userId`: ObjectId referencing User document
    - `isStandalone`: Boolean
    - `comments`: Array of ObjectIds referencing Comment documents
    - `views`: Number
    - `likes`: Array of ObjectIds referencing User documents

Comment Collection

+ Fields:
    - `_id`: ObjectId (MongoDB default)
    - `text`: String
    - `userId`: ObjectId referencing User document
    - `discussionId`: ObjectId referencing Discussion document
    - `createdAt`: Date
    - `likes`: Array of ObjectIds referencing User documents
    - `replies`: Array of ObjectIds referencing Reply documents

Reply Collection

+ Fields:
    - `_id`: ObjectId (MongoDB default)
    - `text`: String
    - `userId`: ObjectId referencing User document
    - `commentId`: ObjectId referencing Comment document
    - `createdAt`: Date

Relationships:
- A discussion can have multiple comments (comments array in the Discussion document).
- A comment can have multiple replies (replies array in the Comment document).
- A user can like a discussion (likes array in the Discussion document).
- A user can like a comment (likes array in the Comment document).


### Low Level Design

![alt text](/images/LLD.png)