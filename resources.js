var events = require("./events");
var Racket = require("./racket");
if(window._GAME_RESOURCES_) {
    exports.Resources =  window._GAME_RESOURCES_;
    return;
}
var meshLoader = null;
var audio = /(wav$|mp3$|ogg$)/;
var mesh = /(3d$|js$|json$)/;
var resources = {
    loaded: 0,
    load: function(files) {
        resources.load.total = 0;
        resources.load.loaded = 0;
        function loaded(file) {
            resources.load.loaded++;
            resources.fire("progress", file);
            if(resources.load.loaded === resources.load.total) {
                resources.fire("load");
            }
        }
        for(var file in files) {
            if(resources[file]) {
                throw "naming conflict: cannot load resource named " + file;
            }
            var type = "image";
            console.log(file + " is audio: " + audio.test(files[file]));
            if(audio.test(files[file])) {
                type = "audio";
            }
            if(mesh.test(files[file])) {
                type = "mesh";
            }
            resources.load.total++;
            switch(type) {
                case "audio":
                    (function(file) {
                        resources[file] = Racket.create(files[file], function(success) {
                            if(!success) {
                                console.log("failed to load: " + files[file]);
                            }
                            loaded(file);
                        });
                    }(file));
                break;
                case "mesh":
                    if(meshLoader === null) {
                        meshLoader = new THREE.JSONLoader();
                    }
                    (function(file) {
                        meshLoader.load(files[file], function(geometry, material) {
                            console.log(material);
                            console.log("3d file loaded: " + file);
                            for(var i = 0; i < material.length; i++) {
                                material[i].shading = THREE.FlatShading;
                            }
                            var faceMaterial = new THREE.MeshFaceMaterial(material);
                            resources[file] = { geometry: geometry, material: faceMaterial }; //new THREE.Mesh(geometry, faceMaterial);
                            loaded(file);
                        });
                    }(file));
                break;
                default:
                    var img = new Image();
                    (function(img, file){
                        img.onload = function() {
                            loaded(file);
                        };
                        img.onerror = function() {
                            //fail silently.
                            console.log("failed to load: " + files[file]);
                            loaded(file);
                        };
                    }(img, file));
                    img.src = files[file];
                    img.setAttribute("class", "resources");
                    img.setAttribute("name", file);
                    resources[file] = img;
                break;
            }
        }
    }
};

events.attach(resources);
window._GAME_RESOURCES_ = resources;
module.exports = resources;
