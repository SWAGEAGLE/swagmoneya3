read -p "Enter username: " user
read -p "Enter DB Name: " dbname
read -p "Enter PWD: " passwd
read -p "Absolute path in to current directory: " path



establishConnection="pg_connect(\"host=mcsdb.utm.utoronto.ca dbname=$dbname user=$user password=$passwd\");"
sed -i "s/pg_connect(\".*/${establishConnection}/g" ./express-static.js
