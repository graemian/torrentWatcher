#!/bin/bash

export PATH=/bin:/usr/bin

HOME=`dirname $0`

#$HOME/torrentWatcher.sh > out.log 2> err.log

cd $HOME
"/cygdrive/c/Program Files/nodejs/node.exe" torrentWatcher.js > out.log 2> err.log
