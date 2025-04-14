# Frontend
## Structure
Here you can see our Angular project as a responsive webpage for all device


# Running the Project with Docker

This project is configured to run using Docker. Below are the specific instructions and requirements:

## Requirements

- Docker version 20.10 or higher.
- Docker Compose version 1.29 or higher.

## Build and Run Instructions

1. Ensure Docker and Docker Compose are installed on your system.
2. Clone the repository to your local machine.
3. Navigate to the project directory.
4. Build and start the services using Docker Compose:

   ```bash
   docker-compose up --build
   ```

5. Access the application at `http://localhost:80`.

## Configuration

- The application is served using Nginx.
- No additional environment variables are required.

## Ports

- The application is exposed on port `80`.

For further details, refer to the Dockerfile and Docker Compose file included in the repository.
