var request = require('request');
var exec = require('child_process').exec;


function run() {

    console.log(new Date());

    function killTorrent() {

        console.log("Killing torrent process");
        exec(__dirname + '/pskill.exe utorrent');

    }

    request('http://192.168.1.3/getActiveAccount', function (error, response, body) {

        var account = body;

        console.log("Active account is [" + account + "]");

        if (account != "uncapped") {

            exec(__dirname + '/pslist.exe', function (error, stdout, stderr) {

                if (stdout.toLowerCase().indexOf("utorrent") != -1) {

                    console.log("Found torrent process, trying to close")

                    exec(__dirname + "/closeTorrent.exe");

                    setTimeout(function() {

                        killTorrent();

                    }, 10 * 1000)

                } else

                    killTorrent();

            });

        } else {

            console.log("Starting torrent client");
            exec("/cygdrive/c/Users/Graeme/AppData/Roaming/uTorrent/uTorrent.exe");

        }

    })

    setTimeout(run, 5 * 60 * 1000);

}

run();