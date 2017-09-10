# Undocuhacks CBP/ICE Activity Map

Application that crowdsources user reports on possible immigration enforcement activity, displaying the data on a map using the Google Maps API.

## Build Instructions

### Clone Repository

  git clone https://github.com/madebycris/UndocuHacks

### Install dependencies

#### MongoDB Install

First, import the key of the official MongoDB repository.

  sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927

Add the MongoDB repository

  echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list

#### Install nodejs-legacy and npm

  sudo apt-get install npm nodejs-legacy

## Download npm packages

Run the following in the directory of the cloned repository

  npm install

## Known issues

MongoDB may exit with an exception. Execute the following commands if you encounter any issues.

  sudo mkdir -p /data/db
  sudo chown -r $USER /data/db

## Start it up!

1) Launch MongoDB
  mongod

2) Run server.js
  node server.js

3) Navigate to 'http://localhost:30000/'
