#!/bin/bash

read -p "Enter username: " user
read -p "Enter DB Name: " dbname
read -p "Enter PWD: " passwd
read -p "PORT" port

establishConnection="\'mongodb:\/\/$user:$passwd@mcsdb.utm.utoronto.ca\/$dbname\');"
portstuff="app.listen($port,function (){";
sed -i "s/'mongodb:/${establishConnection}/g" ./express-static.js
sed -i "s/'app.listen(.*,function (){/${establishConnection}/g" ./express-static.js
