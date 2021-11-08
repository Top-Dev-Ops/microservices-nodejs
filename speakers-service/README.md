# microservices - nodejs

The whole projects consists of 4 individual sub projects.

## Directories

1. Conference App

    Frontend written in NodeJS and PUG that shows the landing page, all speakers and feedbacks by communicating with microservices.
2. Service Registry

    NodeJS application which registers, unregisters and returns the information about microservices such as service name, service version, ip addr and port where they are running at. 
3. Speakers Service

    Microservice written in NodeJS, which returns all speakers' information and artworks.
4. Feedback Service

    Microservice written in NodeJS, which returns all feedbacks and functionality for adding feedback.

## Quickstart

- Install packages by running  ```npm install``` inside every directory.
- Run ```npm start``` in [Service Registry](https://github.com/Top-Dev-Ops/microservices-nodejs/tree/main/service-registry) folder.
    
  Service registry app will be runnin on port `:3000`.
- Run ```npm start``` in [Speakers Service](https://github.com/Top-Dev-Ops/microservices-nodejs/tree/main/speakers-service) folder.

  Speakers service(microservice) will run on random port and service registry app will register speakers service and update it every certain amount of time.
- Run ```npm start``` in [Feedback Service](https://github.com/Top-Dev-Ops/microservices-nodejs/tree/main/feedback-service) folder.

  Feedback service(microservice) will run on random port and service registry app will register feedback service and update it every certain amount of time.
- Run ```npm start``` in [Conference App](https://github.com/Top-Dev-Ops/microservices-nodejs/tree/main/conference-app) folder.

  Conference app will run on port `:3080`.<br />
  It first talks with service registry and gets the endpoints of microservices.<br />
  Conference app then talks with microservices, gets the data from them and displays it in frontend.

## Learn More

[Top-Dev-Ops](https://github.com/Top-Dev-Ops)

