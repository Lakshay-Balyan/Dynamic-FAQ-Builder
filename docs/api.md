# API Documentation

This document provides details for all API endpoints in the Dynamic FAQ Builder.

**Base URL:** `http://localhost:5000/api`

## Authentication (`/api/auth`)

These endpoints handle user registration, login, and session management.

### 1. `POST /api/auth/register`

Registers a new user (Administrator or Editor).

-   **Body (JSON):**
    ```json
    {
      "username": "newadmin",
      "password": "password123",
      "role": "Administrator"
    }
    ```
-   **Success Response (201 Created):**
    ```json
    {
      "id": 5,
      "username": "newadmin",
      "role": "Administrator"
    }
    ```
-   **Error Responses:**
    -   `400 Bad Request`: If fields are missing or the role is invalid.
    -   `409 Conflict`: If the username is already taken.

### 2. `POST /api/auth/login`

Logs in a user and sets a secure, HttpOnly cookie for authentication.

-   **Body (JSON):**
    ```json
    {
      "username": "newadmin",
      "password": "password123"
    }
    ```
-   **Success Response (200 OK):**
    -   **Cookie:** `token=...` (HttpOnly, secure)
    -   **Body (JSON):**
        ```json
        {
          "id": 5,
          "username": "newadmin",
          "role": "Administrator"
        }
        ```
-   **Error Responses:**
    -   `401 Unauthorized`: If credentials are invalid.

### 3. `POST /api/auth/logout`

Logs out the user by clearing the auth cookie.

-   **Success Response (200 OK):**
    ```json
    { "message": "Logged out successfully" }
    ```

### 4. `GET /api/auth/verify`

Checks if the user has a valid auth cookie. This is used for session persistence on page load.

-   **Authentication:** Requires a valid `token` cookie.
-   **Success Response (200 OK):**
    ```json
    {
      "id": 5,
      "username": "newadmin",
      "role": "Administrator"
    }
    ```
-   **Error Responses:**
    -   `401 Unauthorized`: If no valid token cookie is present.

---

## FAQ Management (`/api/faqs`)

**Note:** All endpoints in this section require a valid admin/editor auth cookie.

### 1. `POST /api/faqs`

Creates a new FAQ.

-   **Body (JSON):**
    ```json
    {
      "question": "How do I get a refund?",
      "answer": "Contact support within 30 days.",
      "category_id": 1
    }
    ```
-   **Success Response (201 Created):**
    ```json
    {
      "faqId": 12,
      "status": "success",
      "data": { ... }
    }
    ```

### 2. `GET /api/faqs`

Gets a list of all FAQs for the admin dashboard.

-   **Success Response (200 OK):**
    ```json
    [
      {
        "id": 12,
        "question": "How do I get a refund?",
        "category_name": "Billing"
      }
    ]
    ```

### 3. `PUT /api/faqs/:id`

Updates an existing FAQ.

-   **Params:** `id` (The ID of the FAQ to update)
-   **Body (JSON):**
    ```json
    {
      "question": "How do I request a refund?",
      "answer": "Please email support@example.com.",
      "category_id": 1
    }
    ```
-   **Success Response (200 OK):** Returns the updated FAQ object.
-   **Error Responses:**
    -   `404 Not Found`: If FAQ with that `id` does not exist.

### 4. `DELETE /api/faqs/:id`

Deletes an existing FAQ.

-   **Params:** `id` (The ID of the FAQ to delete)
-   **Success Response (200 OK):**
    ```json
    { "message": "FAQ with id 12 deleted successfully." }
    ```
-   **Error Responses:**
    -   `404 Not Found`: If FAQ with that `id` does not exist.

### 5. `POST /api/faqs/categories`

Creates a new category.

-   **Body (JSON):** `{"name": "Technical"}`
-   **Success Response (201 Created):** Returns the new category object.

---

## Public API (`/api/public`)

These endpoints are open and do not require authentication.

### 1. `GET /api/public/categories`

Gets a list of all categories for the public search page.

-   **Success Response (200 OK):**
    ```json
    [
      { "id": 1, "name": "Billing" },
      { "id": 2, "name": "Technical" }
    ]
    ```

### 2. `GET /api/public/search?q=<term>`

Performs a full-text search across all FAQs.

-   **Query Parameter:** `q` (The search term)
-   **Success Response (200 OK):**
    ```json
    [
      {
        "id": 12,
        "question": "How do I request a refund?",
        "answer": "Please email support@example.com.",
        "category_name": "Billing",
        "rank": 0.06
      }
    ]
    ```

---

## Analytics API (`/api/analytics`)

### 1. `POST /api/analytics/view/:id`

Increments the view count for a specific FAQ. This is a public endpoint.

-   **Params:** `id` (The ID of the FAQ to increment)
-   **Success Response (200 OK):** Returns the updated view count object.

### 2. `GET /api/analytics/dashboard`

Gets all analytics data for the admin dashboard.

-   **Authentication:** Requires a valid admin/editor auth cookie.
-   **Success Response (200 OK):**
    ```json
    {
      "topSearches": [
        { "search_term": "refund", "frequency": "50" }
      ],
      "zeroResults": [
        { "search_term": "asdf", "frequency": "10" }
      ],
      "topViews": [
        { "question": "How do I request a refund?", "view_count": 102 }
      ]
    }
    ```