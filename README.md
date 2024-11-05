# AI Story Generator

AI Story Generator is a web application that uses artificial intelligence to create unique stories based on user-provided topics. It features a user-friendly interface, story history, and an interactive book-like display for generated stories.

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
   - [With Docker](#with-docker)
   - [Without Docker](#without-docker)
4. [Environment Variables](#environment-variables)
5. [Running the Application](#running-the-application)
   - [Using Docker](#using-docker)
   - [Without Docker](#without-docker-1)
6. [API Endpoints](#api-endpoints)
7. [Contributing](#contributing)
8. [License](#license)

## Features

- ✨ **AI-powered story generation**
- 🔐 **User authentication**
- 📚 **Interactive book-like story display**
- 🕰 **Story history**
- ⭐ **Favorite stories functionality**

## Prerequisites

Before you begin, ensure you have met the following requirements:

-  **Git**
-  **An account with Clerk** for authentication
-  **An account with Hugging Face** for AI model access
-  **An account with Google Cloud** for Gemini API access

For Docker setup:
-  **Docker**
-  **Docker Compose**

For non-Docker setup:
-  **Node.js** (v14.0.0 or later)
-  **npm** (v6.0.0 or later)
-  **MongoDB** (v4.0 or later)

## Installation

First, clone the repository:

```bash
git clone https://github.com/ovi246/interview-project.git
cd interview-project

```
### With Docker
No additional installation steps are needed for Docker setup.

### Without Docker
1. Install the dependencies for *__Frontend__*:

```bash
cd frontend/
npm install
```

2. Set up a Python virtual environment (optional but recommended):
```
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

3. Install the dependencies for *__Backend__*:

```bash
cd backend/
pip install -r requirements.txt
```

## Environment Variables
Create a .env.local file in the root directory of the project and add the following variables:
```
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Hugging Face
HUGGINGFACE_API_KEY=your_huggingface_api_key

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```
Replace the placeholder values with your actual API keys and connection strings.

## Running the Application
### Using Docker
To start both the backend and frontend services with Docker, run:

```
docker-compose up --build
```
This command builds the Docker images (if they haven't been built before) and starts the containers.

### Without Docker
Ensure MongoDB is running on your system or you have a valid MongoDB connection string.

1. Start the Python backend:
```
# Make sure you're in the project root directory
python backend/main.py
```

2. In a new terminal, start the Next.js frontend:
```
npm run dev
```

Open your browser and navigate to http://localhost:3000.

## API Endpoints

* _POST `/api/generate-content` : Generate a new story_

* _GET `/api/history/{user_id}` : Get story history for a user_

* _GET `/api/story/{story_id}` : Get a specific story_

* _POST `/api/toggle-favorite/{user_id}/{story_id}` : Toggle favorite status of a story_

* _GET `/api/favorites/{user_id}` : Get favorite stories for a user_


## Contributing
> Contributions to the AI Story Generator are welcome. Please follow these steps:
> 
> Fork the repository
> 
> Create a new branch ( `git checkout -b feature/amazing-feature`)
> 
> Make your changes
> 
> Commit your changes ( `git commit -m 'Add some amazing feature'`)
> 
> Push to the branch ( `git push origin feature/amazing-feature`)
> 
> Open a Pull Request


## License
This project is licensed under the MIT License. See the LICENSE file for details.
