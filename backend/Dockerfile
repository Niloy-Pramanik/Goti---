# Build stage
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
# Make sure the wrapper is executable
RUN chmod +x mvnw
# Download dependencies
RUN ./mvnw dependency:go-offline
# Copy source code and build
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
# Copy the built jar from the build stage
COPY --from=build /app/target/prokoi-backend-0.1.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
