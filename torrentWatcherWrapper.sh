#!/bin/bash

export PATH=/bin:/usr/bin

HOME=`dirname $0`

#$HOME/torrentWatcher.sh > out.log 2> err.log

cd $HOME

while [ 1 ]; do

    "/cygdrive/c/Program Files/nodejs/node.exe" torrentWatcher.js >> out.log 2>> err.log
    echo Dead - waiting 10s before restarting
    sleep 10

done
