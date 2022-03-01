#!/usr/bin/expect -f

eval `ssh-agent -s`
cat ~/.ssh/gregor.t_github.pass | setsid -w ssh-add ~/.ssh/gregor.t_github

cd /home/adviceday/app
git checkout master
git pull origin master

exit
