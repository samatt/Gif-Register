#!/bin/bash

# echo `pwd`
# DIR=`pwd`"/imgs/*.png"
DIR=`pwd`"/Processing/gifCapture_001/*.png"

file_name=$(date "+%Y.%m.%d-%H.%M.%S").gif
# echo "Current Time : $current_time"
 
echo "New FileName: " "$file_name"

# echo $DIR
convert -delay 12 -loop 0 $DIR $file_name

mv $file_name `pwd`"/public/gifs"