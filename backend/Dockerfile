# To run it locally:
# First you have to install Docker and enable virtualization (if you already done earlier it you can skip this step)
# Run in cmd to pull databse container: docker run --name database -e MYSQL_ROOT_PASSWORD=passin -p 3306:3306 -d mysql:8.4
# Start "database" container
# Connect to mysql server with the given user
# Upload in mysql server: database_file_path
# Run in cmd to pull backend container: docker run -t --name backend --link database:mysql -p 8080:8080 kamikou/universe:v1.0

# to build:
# docker build -t kamikou/universe:v1.0 .

# syntax=docker/dockerfile:1.5
FROM maven:3.9.5-eclipse-temurin-17 AS builder
WORKDIR /app
RUN --mount=type=bind,source=pom.xml,target=/app/pom.xml,readonly \
    --mount=type=bind,source=src,target=/app/src,readonly \
    mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]