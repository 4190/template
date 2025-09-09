#!/bin/bash

# Build the image with tag angular-1:latest
docker build -t angular-1:latest .

# Tag the image for Docker Hub
docker tag angular-1 michalkrupka77/angular-1:latest

# Push the image to Docker Hub
docker push michalkrupka77/angular-1:latest
