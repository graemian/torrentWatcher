#!/bin/bash

export PATH=/bin:/usr/bin

HOME=`dirname $0`

while [ 1 ]; do

  date

  if [ ! -x $HOME/ignore ]; then 

  ACCOUNT=`wget -O - http://192.168.1.3/getActiveAccount 2>/dev/null`

  echo Active account is $ACCOUNT

  if [ "$ACCOUNT" != "uncapped" ]; then

    if $HOME/pslist.exe | grep -i utorrent; then

      echo Found torrent process, trying to close

      $HOME/closeTorrent.exe
      sleep 10

    fi

    echo Killing torrent process
    $HOME/pskill.exe utorrent

  else

    echo Starting torrent client
    /cygdrive/c/Users/Graeme/AppData/Roaming/uTorrent/uTorrent.exe

  fi

  else

    echo Ignore file found, ignoring

  fi

  echo Sleeping for 5 minutes
  sleep 600

done
