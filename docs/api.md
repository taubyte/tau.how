# API Reference

This section contains the API documentation for the project.

## Overview

The API provides endpoints for various operations. All endpoints return JSON responses and use standard HTTP status codes.

## Base URL

```
https://api.example.com/v1
```

## Authentication

All API requests require authentication using an API key:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.example.com/v1/endpoint
```

## Endpoints

### GET /users

Retrieve a list of users.

**Parameters:**

| Parameter | Type    | Required | Description               |
| --------- | ------- | -------- | ------------------------- |
| `limit`   | integer | No       | Number of users (max 100) |
| `offset`  | integer | No       | Pagination offset         |

**Example Request:**

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     "https://api.example.com/v1/users?limit=10&offset=0"
```

**Example Response:**

```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2023-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

### POST /users

Create a new user.

**Request Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Example Response:**

```json
{
  "id": 2,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "created_at": "2023-01-02T00:00:00Z"
}
```

## Error Responses

The API uses standard HTTP status codes:

| Status Code | Description  |
| ----------- | ------------ |
| 200         | Success      |
| 400         | Bad Request  |
| 401         | Unauthorized |
| 404         | Not Found    |
| 500         | Server Error |

**Error Response Format:**

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is invalid",
    "details": "Additional error details"
  }
}
```
