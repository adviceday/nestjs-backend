#!/bin/bash

cd /home/adviceday/app || exit
# remove all intermediate images
sudo docker image rm $(sudo docker images --filter "dangling=true" -q)

exit
