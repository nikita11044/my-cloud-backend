<h1 style="text-align: center">My Cloud</h1>
<h3 style="text-align: center">A file storage</h3>
<p style="text-align: center">Build on top of <br /><a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="16" alt="Nest Logo" /> Nest.js</a></p>

## Description
This is a backend service for my "My Cloud" pet project. Here I try to experiment and enhance my skills as a developer.
<hr />

## App installation & running
### Step 1
To run the application, you need to create an `.env` file in the project directory with the following variables (note that some values need to be personalized):
```
PORT=7777
MODE=dev
LOG_DIRECTORY=logs

JWT_SECRET_KEY=secret123
JWT_EXPIRES_IN=30d

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=my-cloud-db

MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=ROOTNAME
MINIO_SECRET_KEY=ROOTPASSWORD
```
<hr />

### Step 2
Install backend dependencies:

```
npm install
```
<hr />

### Step 3
Run backend service:

```
npm run start
```
## API documentation
<a href="http://localhost:7777/swagger">http://localhost:7777/swagger
<hr />

### License
My Cloud is [MIT licensed].
