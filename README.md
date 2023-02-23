## How To Install Node Module Dependency

`npm install`

## How To Install Redis On Docker

1. Run Redis Server on Docker

`docker run -itd --name redis-server -p 6379:6379 redis:6`

2. Console Redis Server

`docker exec -it redis redis-cli -u redis://panz:ijinmasuk@REDIS_HOST:REDIS_PORT`

## Redis ACL SETUSER

1. List User

`ACL LIST`

2. Create user with all privileges

`ACL SETUSER panz ON >ijinmasuk allkeys allcommands resetchannels &channel*`

3. Verify User

`AUTH panz ijinmasuk`

## How To Console Redis Server

`docker exec -it redis-server redis-cli -u redis://panz:ijinmasuk@REDIS_HOST:REDIS_PORT`

## How To Start this app

`node index.js`
