#!/bin/bash

## Check if pgrep is available
if ! [ -x "$(command -v pgrep)" ]
then 
  echo "command pgrep is not available in this system";
  exit 1;
fi

## Find proccess id of server if already running in xterm
psid=`pgrep -fi "xterm.*run.sh"`

## If psid not found start server, else exit
if [ -z ${psid} ] 
then
  echo "Starting server";

  ## Start server on new terminal and release
  xterm -hold -e "cd $GOPATH/src/github.com/HeadlightLabs/Tournament-API/ && ./run.sh " &  
else
  echo "Server already running pid: ${psid}";
  exit 1;
fi