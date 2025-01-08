
# GroceryAPI

This project provides a simple API for managing grocery-related data. It includes functionality for user management and the ability to interact with a MySQL database.

## Project Structure

- **api**: The backend API for the grocery application, built using Node.js.
- **docker**: Docker configuration for setting up the environment.
- **grocery_db_backup.sql**: A SQL dump of the `grocery_db` used to initialize the MySQL database.

## Prerequisites

Before running the project, ensure you have the following installed on your system:

- Docker and Docker Compose
- Node.js (for development)

## Setup

Follow the steps below to set up and run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/groceryapi.git
cd groceryapi
```

### 2. Build the Docker Containers

In the project root, run the following command to build and start the Docker containers:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

This command will:

- Start the API in a Docker container on port 3000.
- Start the MySQL database container on port 3307 and initialize it with the `grocery_db_backup.sql` file.

### 3. Import Database

When the MySQL container starts, it will automatically import the database from `grocery_db_backup.sql`. This will set up the necessary tables and initial data.

### 4. Access the API

Once the containers are running, you can access the API at `http://localhost:3000`.

To interact with the database, use the MySQL client:

```bash
mysql -u root -p -h 127.0.0.1 -P 3307 grocery_db
```

Use the password defined in the `docker-compose.dev.yml` file (e.g., `root_password`).

### 5. Manage the Project

To view the API logs:

```bash
docker-compose logs api
```

To stop the containers:

```bash
docker-compose -f docker-compose.dev.yml down  
```

### 6. Adding Records

You can add new records to the tables using SQL queries or through the API endpoints once the API is running.

---

## Additional Configuration

- If you wish to customize the database name or password, update the `docker-compose.dev.yml` file under the MySQL service configuration.
- If you need to reset the database or re-import the backup, you can delete the current data volume and re-run `docker-compose -f docker-compose.dev.yml up --build`.

---

## Troubleshooting

If you encounter any issues, here are some common problems and solutions:

- **ECONNREFUSED (Connection refused to MySQL)**: Ensure MySQL is up and running. Check the status with `docker ps`.
- **Table doesn't exist (ER_NO_SUCH_TABLE)**: Ensure that the backup file is correctly imported or try re-importing it by restarting the MySQL container.

---

# Grocery Application API Documentation

This document provides the details of the APIs for the Grocery Application. The API includes endpoints for admin and user functionalities like managing items, cart operations, and user login.


## Admin APIs

### 1. Login API
- **Endpoint**: `POST /api/v1/userController/login`
- **Description**: Logs in an admin user with the provided credentials.
- **Request Body**:
    ```json
    {
        "emailId": "kamblepurushottam26@gmail.com",
        "password": "Abcd@1234"
    }
    ```
- **Response**: Returns a login token if successful.

### 2. Add Item
- **Endpoint**: `POST /api/v1/adminController/addItem`
- **Description**: Adds a new item to the inventory.
- **Request Body**:
    ```json
    {
        "name": "Toor Dal",
        "description": "Unpolished Toor Dal/Arhar Dal, 1kg.",
        "price": 211,
        "quantity": 50
    }
    ```
- **Response**: Returns the newly added item data.

### 3. Update Item
- **Endpoint**: `POST /api/v1/adminController/updateItem`
- **Description**: Updates an existing item's details.
- **Request Body**:
    ```json
    {
        "id": 1,
        "name": "Rice",
        "description": "Superior Quality Grains: Basmati rice boasts quality with long, slender grains, ensuring an elegant appearance and fluffy texture when cooked.",
        "price": 599,
        "quantity": 10
    }
    ```
- **Response**: Returns the updated item data.

### 4. Update Quantity
- **Endpoint**: `POST /api/v1/adminController/updateQuantity`
- **Description**: Updates the quantity of an existing item in inventory.
- **Request Body**:
    ```json
    {
        "id": 1,
        "quantity": -5
    }
    ```
- **Response**: Returns the updated quantity information.

### 5. Delete Item
- **Endpoint**: `POST /api/v1/adminController/deleteItem`
- **Description**: Deletes an item from the inventory.
- **Request Body**:
    ```json
    {
        "id": 1
    }
    ```
- **Response**: Returns a success message if the item is deleted.

### 6. Get Item List
- **Endpoint**: `GET /api/v1/adminController/getItemList`
- **Description**: Retrieves the list of all items in the inventory.
- **Response**: Returns a list of items with their details (name, price, quantity, etc.).

---

## User APIs

### 1. Get Item List
- **Endpoint**: `GET /api/v1/userController/getItemList`
- **Description**: Retrieves the list of items available for purchase.
- **Response**: Returns a list of available items.

### 2. Get User Cart
- **Endpoint**: `POST /api/v1/userController/getUserCart`
- **Description**: Retrieves the items in a user's shopping cart.
- **Request Body**:
    ```json
    {
        "userId": 2
    }
    ```
- **Response**: Returns the list of items in the user's cart.

### 3. Add to Cart
- **Endpoint**: `POST /api/v1/userController/addToCart`
- **Description**: Adds an item to the user's shopping cart.
- **Request Body**:
    ```json
    {
        "userId": 2,
        "itemId": 2,
        "price": 211,
        "quantity": 10
    }
    ```
- **Response**: Returns a success message with updated cart details.

### 4. Remove from Cart
- **Endpoint**: `POST /api/v1/userController/removeFromCart`
- **Description**: Removes an item from the user's shopping cart.
- **Request Body**:
    ```json
    {
        "userId": 2,
        "itemId": 2
    }
    ```
- **Response**: Returns a success message with updated cart details.

### 5. Complete Order
- **Endpoint**: `POST /api/v1/userController/completeOrder`
- **Description**: Completes the user's order and processes payment.
- **Request Body**:
    ```json
    {
        "userId": 2
    }
    ```
- **Response**: Returns an order confirmation message.

---

## Notes
- Ensure the server is running on `localhost:3000` for API calls to be executed successfully.
- The APIs are divided into Admin and User sections for better organization.
- Update the `userId` and `itemId` in the respective API calls to match the actual data.
- For each `POST` request, make sure the `Content-Type` header is set to `application/json`.

---

## Contact
For any issues, please contact [kamblepurushottam26@gmail.com].
