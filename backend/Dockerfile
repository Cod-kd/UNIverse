# docker pull kamikou/universe:v1.0
# docker run --name database -e MYSQL_ROOT_PASSWORD=passin -p 3306:3306 -d mysql:8.4 # 5.7 on server 😅
# docker run -t --name backend --link database:mysql -p 8080:8080 kamikou/universe:v1.0

# to build:
# docker build -t kamikou/universe:v1.0 .

# Step 1: Use an official Maven image to build the application
FROM maven:3.9.5-eclipse-temurin-17 AS builder

# Set working directory
WORKDIR /app

# Copy the project files
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Step 2: Use a lightweight JDK image to run the application
FROM eclipse-temurin:17-jre

# Set working directory
WORKDIR /app

# Copy the built JAR file from the builder stage
COPY --from=builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the application's port
EXPOSE 8080

# Define the entrypoint to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]