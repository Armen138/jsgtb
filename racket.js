/*jshint newcap:false, nonew:true */
/*global console, define */
"use strict";
function audio(files, callback) {
    var file = new Audio(),
        maxChannels = 3,
        channels = [],
        fileType = files.substr(files.lastIndexOf(".") + 1).toLowerCase();

    callback = callback || function(success) { console.log("no callback set for loading audio."); };
    var rfile = {
        canPlay: {
            "mp3": file.canPlayType("audio/mpeg"),
            "ogg": file.canPlayType("audio/ogg"),
            "wav": file.canPlayType("audio/wav")
        },
        volume: function(vol) {
            for(var i = 0; i < channels.length; i++) {
                channels[i].volume = vol;
            }
        },
        play: function(loop) {
            for(var i = 0; i < maxChannels; i++) {
                if(i >= channels.length) {
                    channels[i] = new Audio(files);
                    if(channels[i].load) {
                        channels[i].load();
                    }
                }
                if(channels[i].currentTime === 0 || channels[i].ended) {
                    channels[i].loop = loop;
                    channels[i].play();
                    return;
                }
            }
            //if all else fails.
            channels[0].pause();
            channels[0].loop = loop;
            channels[0].currentTime = 0;
            channels[0].play();
        },
        stop: function() {
            for(var i = 0; i < channels.length; i++) {
                if(channels[i] && !channels[i].paused) {
                    channels[i].pause();
                    channels[i].currentTime = 0;
                }
            }
        }
    };
    if(!rfile.canPlay[fileType]) {
        callback(false);
        console.log("This filetype cannot be played on this browser: " + fileType);
    } else {
        //for(var i = 0; i < maxChannels; i++) {
            channels.push(new Audio(files));
            if(channels[0].load) {
                channels[0].load();
            }
        //}
        callback(true);
    }
    return rfile;
}

exports.Racket = {
    create: audio
};

