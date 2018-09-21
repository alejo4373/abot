#!/bin/bash

## Check if pgrep is available
if ! [ -x "$(command -v pgrep)" ]
then 
  echo "command pgrep is not available in this system";
  exit 1;
fi

## Find proccess id of server if already running in xterm
# psid=`pgrep -fi "xterm.*run.sh"`
psid=`pgrep -fi "xfce4-terminal.*run.sh"`


## If psid not found start server, else exit
if [ -z ${psid} ] 
then
  echo "Starting server";

  ## Start server on new terminal and release
  # xterm -hold -e "cd $GOPATH/src/github.com/HeadlightLabs/Tournament-API/ && ./run.sh " &  

  ## Start server on searchable terminal and release for easy lookup in the server logs. Will not work if xfce4-terminal is not installed
  ## this is temporary
  xfce4-terminal -H -e 'bash -c "cd $GOPATH/src/github.com/HeadlightLabs/Tournament-API/ && ./run.sh"' &

else
  echo "Server already running pid: ${psid}";
fi