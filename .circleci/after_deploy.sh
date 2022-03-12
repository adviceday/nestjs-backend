#!/bin/bash

cd /home/adviceday/app
# remove all intermediate images
sudo docker image rm $(sudo docker images --filter "dangling=true" -q)
