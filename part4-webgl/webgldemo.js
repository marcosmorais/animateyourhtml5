/*
 * Copyright 2013 Google Inc.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 *   Author: Martin Gorner (mgorner@google.com)
 */

var renderer;
var camera;
var currentScene = 0;
var nbScenes = 8;
var sceneDistance = 300;
var sceneTransitionT0;
var sceneTransitionV0;
var sceneTransitionDuration = 500;
var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis= true;
loader.options.upAxis = 'Y';
var androidscale = new THREE.Vector3(3, 3, 3);

document.addEventListener("DOMContentLoaded", startTHREE);
window.addEventListener('resize', resizeTHREE);
document.addEventListener('keydown', handleKeyDown);

//-----------------------------------------------------------------------------------

function startTHREE()
{
    arrowVisibility();

    var container = document.getElementById('canvas-container');
    renderer = new THREE.WebGLRenderer ( {antialias: true, alpha: true});
    renderer.setSize(container.clientWidth, container.clientHeight);

    // THREE.js creates the 3D <canvas> element for you
    container.appendChild(renderer.domElement);

    // make it pretty (black and transparent)
    renderer.setClearColor(0x000000, 0);
    renderer.clear();

    // CAMERA: field of view (angle), aspect ratio, near, far
    var aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(35, aspect, 1, 3000);
    camera.position.copy(cameraPositionsForScene(currentScene));

    var scene = new THREE.Scene();

    // STUFF
    createScene0(scene);
    createLights(scene);
    createScene1(scene);
    createScene2(scene);
    createScene3(scene);
    createScene4(scene);
    createScene5(scene);
    createScene6(scene);
    createScene7(scene);

    // ANIMATION LOOP
    function animate()
    {
    	var t = new Date().getTime();
        var scale;
        scene.traverse(function(obj) {
            if (obj instanceof THREE.Object3D)
            {
                switch (obj.name)
                {
                    case "scene-0-wireframe-cube":
                        scale = obj._scenescale;
                        obj.position.set(0, 0, 0);
                        obj.rotation.set(t/4000, t/1000, t/2000);
                        break;

                    case "scene-0-wireframe-sphere":
                        scale = obj._scenescale;
                        var r = 100*scale;
                        var a = 50*scale;
                        obj.rotation.y = t/400;
                        obj.position.set(r*Math.cos(t/400), a*Math.cos(t/2000), r*Math.sin(t/400));
                        break;

                    case "scene-1-lambert-cube":
                        obj.position.set(0,0,0);
                        obj.rotation.set(t/4000, t/1000, t/2000);
                        break;

                    case "scene-2-textured-cube":
                        obj.position.set(0,0,0);
                        obj.rotation.set(t/4000, t/1000, t/2000);
                        break;

                    case "scene-3-android":
                        obj.position.set(0,-80,0);
                        obj.rotation.set(0, t/1000, 0);
                        break;

                    case "scene-4-textured-android":
                        obj.position.set(0,-80,0);
                        obj.rotation.set(0, t/1000, 0);
                        break;

                    case "scene-5-brushed-android":
                        obj.position.set(0,-80,0);
                        obj.rotation.set(0, t/1000, 0);
                        break;

                    case "scene-6-bump-android":
                        obj.position.set(0,-80,0);
                        obj.rotation.set(0, t/1000, 0);
                        break;

                    case "scene-7-mirror-android":
                        obj.position.set(0,-80,0);
                        obj.rotation.set(Math.cos(t/3000)/4, t/1000, 0);
                        //object.rotation.x = Math.cos((t-t0)/3000)/4;
                        break;
                }
                for (var i=0; i<nbScenes; i++)
                {
                    if (obj.name.startsWith("scene-" + i))
                    {
                        obj.position.add(new THREE.Vector3(i*sceneDistance, 0, 0));
                    }
                }

                // move camera if in transition
                if (sceneTransitionT0 !== undefined && sceneTransitionV0 !== undefined)
                {
                    // parameter between 0 and 1, ease-in speed profile
                    var s = (t - sceneTransitionT0)/sceneTransitionDuration;
                    if (s<=1)
                    {
                        // V = s * V1 + (1-s) * V0
                        s = Math.sqrt(1-(s-1)*(s-1)); // ease-in speed profile
                        var v = new THREE.Vector3();
                        v.copy(sceneTransitionV0);
                        v.multiplyScalar(1-s);
                        var w = cameraPositionsForScene(currentScene);
                        w.multiplyScalar(s);
                        camera.position.addVectors(v, w);
                    }
                    else
                    {
                        sceneTransitionT0 = undefined;
                        sceneTransitionV0 = undefined;
                    }
                }
            }
        })

        renderer.render(scene, camera);

        // let the browser decide the tempo
        requestAnimationFrame(animate);
    }
    animate();
}

//-----------------------------------------------------------------------------------

function createScene0(scene)
{
    var scale = 1;
    var geo = new THREE.BoxGeometry(100, 100, 100, 10, 10, 10); // w, h, d
    var mat = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true, wireframeLinewidth:1});
    var cube = new THREE.Mesh(geo, mat);
    cube.scale.set(scale, scale, scale);
    cube._scenescale = scale;
    cube.name = "scene-0-wireframe-cube";
    scene.add(cube);

    var geo2 = new THREE.SphereGeometry(10, 20, 20);
    var sphere = new THREE.Mesh(geo2, mat);
    sphere.scale.set(scale, scale, scale);
    sphere._scenescale = scale;
    sphere.name = "scene-0-wireframe-sphere";
    scene.add(sphere);
}

//-----------------------------------------------------------------------------------

function createScene1(scene)
{
    var geo = new THREE.BoxGeometry(100, 100, 100); // w, h, d
    var mat = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
    var cube = new THREE.Mesh(geo, mat);
    cube.name = "scene-1-lambert-cube";
    scene.add(cube);
}

//-----------------------------------------------------------------------------------

function createScene2(scene)
{
    var texture = THREE.ImageUtils.loadTexture('../textures/FernandoTogni.png');

    var geo = new THREE.BoxGeometry(100, 100, 100); // w, h, d
    var mat = new THREE.MeshLambertMaterial({map: texture});
    var cube = new THREE.Mesh(geo, mat);
    cube.name = "scene-2-textured-cube";
    scene.add(cube);
}

//-----------------------------------------------------------------------------------

function createScene3(scene)
{
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis= true;
    loader.options.upAxis = 'Y';

    var material; // = new THREE.MeshPhongMaterial({color: 0xA4C639});

    loadSkinnedModel(scene, "../models/Android.dae", "scene-3-android", material, androidscale);
}

//-----------------------------------------------------------------------------------

function createScene4(scene)
{
    var texture = THREE.ImageUtils.loadTexture("../textures/FernandoTogniBW.png");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 2;
    texture.repeat.y = 2;
    var material = new THREE.MeshPhongMaterial({color: 0xA4C639, map: texture});

    loadSkinnedModel(scene, "../models/Android.dae", "scene-4-textured-android", material, androidscale);
}

//-----------------------------------------------------------------------------------

function createScene5(scene)
{
    var texture = THREE.ImageUtils.loadTexture("../textures/brushedV.png");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 2;
    texture.repeat.y = 1;

    var material = new THREE.MeshPhongMaterial( {
            color: 0xA4C639+0x202020,
            normalMap: texture,
            normalScale: new THREE.Vector2(0.5, 0.5)
        });

    loadSkinnedModel(scene, "../models/Android.dae", "scene-5-brushed-android", material, androidscale);
}

//-----------------------------------------------------------------------------------

function createScene6(scene)
{
    var texture = THREE.ImageUtils.loadTexture("../textures/FernandoTogniBW.png");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 3;
    texture.repeat.y = 3;

    var material =
        new THREE.MeshPhongMaterial( {
            color: 0xA4C639+0x101010,
            bumpMap: texture,
            bumpScale: 3
        });

    loadSkinnedModel(scene, "../models/Android.dae", "scene-6-bump-android", material, androidscale);
}

//-----------------------------------------------------------------------------------

function createScene7(scene)
{
    var enviro = new THREE.ImageUtils.loadTextureCube(
        ["../textures/cnitcube3.jpg", "../textures/cnitcube1.jpg", "../textures/cnitcube5.jpg",
         "../textures/cnitcube6.jpg", "../textures/cnitcube2.jpg", "../textures/cnitcube4.jpg"]);

    var material = new THREE.MeshPhongMaterial({envMap: enviro});

    loadSkinnedModel(scene, "../models/Android.dae", "scene-7-mirror-android", material, androidscale);
}

//-----------------------------------------------------------------------------------

function loadSkinnedModel(scene, modelURL, newName, newMaterial, scale)
{
    loader.load(modelURL,
        function(collada) {
            model = collada.scene;
            if (scale !== undefined)
                model.scale.copy(scale);
            model.name = newName;
            model.traverse(function(child) {
                if (child instanceof THREE.Mesh
                    && (child.parent.name != 'eye' )) { // keep eyes white :)
                    child.geometry.computeTangents(); // ask Mr. Doob
                    if (newMaterial !== undefined)
                        child.material = newMaterial;
                }
            });
            scene.add(model);
        });
}
//-----------------------------------------------------------------------------------

function createLights(scene)
{
    var light1 = new THREE.DirectionalLight(0xffffff, 0.6); // color, intens.
    light1.position.set(-1, -1, 0.3); // SW directional light

    var light2 = new THREE.PointLight(0xffffff, 0.6); // color, intens.
    light2.position.set(200, 200, 300); // NE point light

    var light3 = new THREE.DirectionalLight(0xffffff, 0.5); // color, intens.
    light3.position.set(0, 0, 1); // frontal light

    scene.add(light1);
    scene.add(light2);
    scene.add(light3); // add them all
}

//-----------------------------------------------------------------------------------

function resizeTHREE()
{
    var container = document.getElementById('canvas-container');
    if (container !== undefined && renderer !== undefined && camera !== undefined)
    {
        renderer.setSize(container.clientWidth, container.clientHeight);
        camera.aspect	= container.clientWidth/ container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.clear();
    }
}

//-----------------------------------------------------------------------------------

function handleKeyDown(event)
{
    var change = false;
    switch (event.keyCode)
    {
        case 39: // right arrow
            nextScene();
            event.preventDefault();
            break;

        case 37: // left arrow
            prevScene();
            event.preventDefault();
            break;
    }
}

//-----------------------------------------------------------------------------------

function nextScene()
{
    var change = false;
    currentScene++;
    if (currentScene >= nbScenes)
        currentScene = nbScenes-1;
    else
        change = true;

    if (change)
        moveCamera();

    arrowVisibility();
}

//-----------------------------------------------------------------------------------

function prevScene()
{
    var change = false;
    currentScene--;
    if (currentScene < 0)
        currentScene = 0;
    else
        change = true;

    if (change)
        moveCamera();

    arrowVisibility();
}

//-----------------------------------------------------------------------------------

function arrowVisibility()
{
    var leftArrow = document.getElementById('prev');
    if (currentScene == 0)
        leftArrow.classList.add('hide');
    else
        leftArrow.classList.remove('hide');

    var rightArrow = document.getElementById('next');
    if (currentScene == nbScenes-1)
        rightArrow.classList.add('hide');
    else
        rightArrow.classList.remove('hide');
}

//-----------------------------------------------------------------------------------

function moveCamera()
{
    sceneTransitionT0 = new Date().getTime();
    sceneTransitionV0 = new THREE.Vector3();
    sceneTransitionV0.copy(camera.position);
}

//-----------------------------------------------------------------------------------

function cameraPositionsForScene(sceneNumber)
{
    var v = new THREE.Vector3();
    v.x = sceneNumber * sceneDistance;
    v.z = 300;
    return v;
}

//-----------------------------------------------------------------------------------

if (typeof String.prototype.startsWith != 'function')
{
    String.prototype.startsWith = function (str)
    {
        return this.slice(0, str.length) == str;
    };
}
