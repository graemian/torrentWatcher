var express = require('express');
var app = express();

var request = require('request');
var cp = require('child_process');

function exec(cmd, callback) {

    var stdout="";
    var stderr="";

    var cmd = cp.spawn(process.env.comspec,['/c',cmd]);

    cmd.stdout.on('data', function (data) {
        stdout += data;
    });

    cmd.stderr.on('data', function (data) {
        stderr += data;
    });

    cmd.on('close', function (code) {

        if (callback)
            callback(code, stdout, stderr);

    });

}

app.get("/torrentClient", function(req, res) {

    torrentClientRunning(function() {

        res.send("on");

    }, function() {

        res.send("off");

    });

});

app.put("/torrentClient", function(req, res) {

    if ("on" in req.query) {

        startTorrentClient();

    } else {

        closeTorrentClient();
    }

    res.send("OK");

});


app.get("/sleep", function(req, res) {

    console.log("Sleeping");

    res.send("OK");

    exec("c:/windows/system32/powercfg.exe -h off");
    exec("c:/windows/system32/rundll32.exe powrprof.dll,SetSuspendState Sleep");

});

function torrentUncapped(onCallback, offCallback) {

    request('http://192.168.1.3/torrentUncapped', function (error, response, body) {

        // Must explicitly be off, assume on otherwise
        var off = (body == "off");

        if (off)
            offCallback();

        else
            onCallback();

    });

}

function torrentClientRunning(runningCallback, notRunningCallback) {

    exec(__dirname + '/pslist.exe', function (error, stdout, stderr) {

        if (stdout.toLowerCase().indexOf("utorrent") != -1) {

            if (runningCallback)
                runningCallback();

        } else {

            if (notRunningCallback)
                notRunningCallback();

        }

    });

}

var killTorrentClientIfStillAlive;

function startTorrentClient() {

    console.log("Starting torrent client");

    killTorrentClientIfStillAlive = false;

    exec("c:/Users/Graeme/AppData/Roaming/uTorrent/uTorrent.exe", function (code, stdout, stderr) {

        console.log(code);
        console.log(stdout);
        console.log(stderr);


    });

}


function closeTorrentClient() {

    console.log("Closing torrent client");

    exec(__dirname + "/closeTorrent.exe");

    killTorrentClientIfStillAlive = true;

    setTimeout(function () {

        torrentClientRunning(function() {

            if (killTorrentClientIfStillAlive) {

                console.log("Still alive - grrr! Killing!");

                exec(__dirname + '/pskill.exe utorrent');

            }

        });

    }, 30 * 1000);

}


function run() {

    console.log(new Date());


    torrentUncapped(function() {

        console.log("Torrent uncapped on, checking");

        request('http://192.168.1.3:81/activeAccount', function (error, response, body) {

            if (error || response.statusCode != 200) {

                console.error("Problem while determining active account, aborting");
                console.error("Error [" + error + "], status code [" + response.statusCode + "], body [" + body + "]");

            } else {

                var account = body;

                console.log("Active account is [" + account + "]");

                if (account != "uncapped") {

                    torrentClientRunning(function() {

                        console.log("Found torrent process, trying to close");

                        closeTorrentClient();

                    });

                } else {

                    torrentClientRunning(function() {

                        console.log("Found torrent process, all good");

                    }, function() {

                        console.log("Torrent process not found, starting");

                        startTorrentClient();

                    });

                }

            }

        })

    }, function() {

        console.log("Torrent uncapped is off, doing nothing");

    })

    console.log("Sleeping for 5 minutes");

    setTimeout(run, 5 * 60 * 1000);

}

run();

var port = process.env.PORT || 8080;

app.listen(port);
console.log('Listening on port '+port);