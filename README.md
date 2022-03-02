# About

This project has started by Gregor Tokarev, if you have any question please contact me
by [telegram](https://t.me/gregortokarev)

Owner of project [Genrih](https://t.me/GenrihGrigoryan)

### Remotes

1. Ip address of production server: `51.250.11.39`
2. Domain of production server: `api.adviceday.me`
3. Documentation domain: `adviceday-docs.surge.sh`
4. Documentation ip `138.197.235.123` (to connect custom domain)
5. Organisation in github: https://github.com/adviceday
6. Ssh link to project repository `git@github.com:adviceday/nestjs-backend.git`
7. Link to ci/cd: https://app.circleci.com/pipelines/github/adviceday

### Development setup

1. Run `npm install`
2. Add .env.development in the root

```dotenv
POSTGRES_USER=root
POSTGRES_PASSWORD=root
POSTGRES_DB=main
POSTGRES_PORT=5432
POSTGRES_HOST=localhost

ADMINJS_ROOT_USER=root
ADMINJS_ROOT_PASSWORD=idfi3e8
ADMINJS_COOKIE_PASSWORD=sdfiuwher

JWT_SECRET=sdalfowiej
JWT_REFRESH_SECRET=weuhweur

ONESIGNAL_APP_ID=40e08ffa-6761-4ea6-99b2-15d899a17b9d
ONESIGNAL_API_KEY=ZDBjMTE4MmEtNzkyNy00NmNkLTk1ZGQtODkyODQ5YmQyZjc4

```

3. Run docker-compose to up postgres `sudo docker-compose -f docker-compose.development up -d`
4. Run app `npm run start:dev`
