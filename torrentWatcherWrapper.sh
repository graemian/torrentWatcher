#!/bin/bash

export PATH=/bin:/usr/bin

HOME=`dirname $0`

#$HOME/torrentWatcher.sh > out.log 2> err.log

cd $HOME

while [ 1 ]; do

    "/cygdrive/c/Program Files/nodejs/node.exe" torrentWatcher.js >> out.log 2>> err.log
    (date; echo Node died, waiting 10s before restarting) >> err.log
    sleep 10

done
