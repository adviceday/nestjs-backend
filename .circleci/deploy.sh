#!/usr/bin/expect -f

eval `ssh-agent -s`
cat ~/.ssh/gregor.t_github.pass | setsid -w ssh-add ~/.ssh/gregor.t_github

cd /home/adviceday/app || exit
git checkout master
git pull origin master

sudo $(cat .env.production) docker-compose -f docker-compose.production.yml up --build --no-deps -d server

exit
