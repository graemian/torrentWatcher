#!/bin/bash

export PATH=/bin:/usr/bin

HOME=`dirname $0`

$HOME/torrentWatcher.sh > out.log 2> err.log
