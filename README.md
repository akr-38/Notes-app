# Notes App

A simple and efficient Notes application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). This application allows users to create, edit, and manage notes effectively.

## Features

- 📝 Create, update, and delete notes
- 🔒 User authentication (if implemented)
- 📂 Organized and easy-to-use UI
- 🚀 Fast and responsive

## Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **State Management**: Redux Toolkit (if used)
- **Authentication**: JWT (if implemented)

## Installation

### Prerequisites
Make sure you have the following installed:
- Node.js
- MongoDB

### Steps to Run the Project

#### 1. Clone the repository
```sh
git clone https://github.com/akr-38/Notes-app.git
cd Notes-app
```

#### 2. Install dependencies
##### Backend
```sh
cd backend
npm install
```
##### Frontend
```sh
cd frontend
npm install
```

#### 3. Set up environment variables
Create a `.env` file in the backend directory and configure the necessary variables such as:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

#### 4. Run the project
##### Start Backend Server
```sh
cd backend
npm start
```
##### Start Frontend
```sh
cd frontend
npm start
```

The app will be running at `http://localhost:3000`.

## API Endpoints
| Method | Endpoint        | Description             |
|--------|----------------|-------------------------|
| GET    | /api/notes     | Get all notes           |
| POST   | /api/notes     | Create a new note       |
| PUT    | /api/notes/:id | Update a note by ID     |
| DELETE | /api/notes/:id | Delete a note by ID     |

## Contributing
Feel free to fork this repository and contribute by submitting pull requests.

## License
This project is licensed under the MIT License.

## Contact
For any queries, feel free to reach out:
- GitHub: [akr-38](https://github.com/akr-38)
- Email: your-email@example.com


