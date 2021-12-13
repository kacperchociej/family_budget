# Family budget

## Software

### Docker
https://docs.docker.com/engine/install/

### Docker-compose
https://docs.docker.com/compose/install/

## Quick start

```
> git clone https://github.com/kacperchociej/family_budget.git
> cd family_budget
> docker-compose build
> docker-compose up
```
Alternatively you can run:
```
> docker-compose up --build
```

## Testing
First, check CONTAINER_ID of the api container:
```
> docker ps
CONTAINER ID   IMAGE                   COMMAND                  CREATED          STATUS          PORTS                                       NAMES
34f6fcaa71cb   familybudget_api        "./entrypoint.sh"        20 minutes ago   Up 14 minutes   0.0.0.0:8010->8000/tcp, :::8010->8000/tcp   familybudget_api_1
7db614fdd8ea   familybudget_frontend   "docker-entrypoint.s…"   20 minutes ago   Up 14 minutes   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp   familybudget_frontend_1
7bdb027a65d1   postgres:10.0           "docker-entrypoint.s…"   4 hours ago      Up 14 minutes   5432/tcp                                    familybudget_postgres_1

```
Next, enter the api container:
```
> docker exec -it <CONTAINER_ID> bash
```
To run flake8 script in the container's bash:
```
> ./run_flake.sh
```
To run tests script in the container's bash:
```
> ./run_pytests.sh
```

## Details

### Front-end url
http://localhost:3000/

### Back-end url
http://0.0.0.0:8010/

### Test users
```
username: johnsmith
password: testpasswd
```
```
username: marywilliams
password: testpasswd
```