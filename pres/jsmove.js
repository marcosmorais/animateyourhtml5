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

// global animation control
var animation = null;


function modelshow(el, modelURL)
{	
	if (animation !== null)
		return;
	
	el.classList.add('modellaunch-central');
    document.body.classList.add('modellaunch');
	el.onclick = function()
	{
		modelhide(el, modelURL);
	};
	
	
	// dimensions
	var canvascontainer = document.getElementById('modelcontainer');
	var width = canvascontainer.clientWidth;
	var height = canvascontainer.clientHeight-2; // unfathomable bug: why do I get a scroll bar with the full height ???
	
	// renderer
	var renderer = new THREE.WebGLRenderer ({antialias: true});
	renderer.setSize(width, height);
	
	// glue to HTML element
	canvascontainer.insertBefore(renderer.domElement,canvascontainer.firstChild);
	renderer.setClearColorHex(0x000000, 0);
	renderer.clear();
	
	// camera
	var camera = new THREE.PerspectiveCamera(35, width / height, 1, 3000);
	camera.position.x = 0;
	camera.position.y = 40;
	camera.position.z = 110;
	camera.rotation.x = -Math.PI/2/10;
	
	// scene
	var scene = new THREE.Scene();
	
	// lights
	var light1 = new THREE.DirectionalLight(0xffffff, 1);
	light1.position.set(1, 1, 0.3);
	scene.add(light1);
	
	var light2 = new THREE.DirectionalLight(0xffffff, 1);
	light2.position.set(-1, 1, -0.3);
	scene.add(light2);
	
	var light3 = new THREE.DirectionalLight(0xffffff, 0.4);
	light3.position.set(0, 0, 1);
	scene.add(light3);
	
	// launch animation
	animation = new Object();
	animation.renderer = renderer;
	animation.scene    = scene;
	animation.camera   = camera;
	animation.controls = null;
	animation.clock    = null;
	animation.gettingclose_event = null;
	window.requestAnimationFrame(animate);
	
	var vec0 = new THREE.Vector3(0,0,0);
	var vec111 = new THREE.Vector3(1,1,1);
	
	var sequencer = new Object();
	sequencer.todo = new Object();
	sequencer.begin = 0;
	sequencer.end = 0;
	sequencer.add = function(f) {sequencer.todo[sequencer.end++] = f;};
	sequencer.go = function() {if (sequencer.begin < sequencer.end) sequencer.todo[sequencer.begin++]();};
	
	loadModel(scene, modelURL, new THREE.Vector3(0,0,0), vec0, vec111, "androidmodel-gingerbread", sequencer);
	
	window.setTimeout(function(){sequencer.go();}, 1000);
}

function modelhide(el, modelURL)
{
	var canvascontainer = document.getElementById('modelcontainer');
	el.classList.remove('modellaunch-central');
    document.body.classList.remove('modellaunch');
	el.onclick = function() {modelshow(el, modelURL);};
	
	// kill the 3D canvas too
	window.setTimeout( function() {
	if (canvascontainer !== null && canvascontainer.firstChild.tagName == 'CANVAS')
		canvascontainer.removeChild(canvascontainer.firstChild);
	if (animation !== null && animation.controls !== null)
		animation.controls.removeEventListeners();
	animation = null;
	}, 100);
}

function spaceland()
{
	var el     = document.querySelector('.current');
	var elNext = document.querySelector('.next');
	var elPrev = document.querySelector('.past');
	var body   = document.querySelector('body');
	
	if (el !== null)
		el.classList.remove('spacelaunch-central');
	if (elNext !== null)
		elNext.classList.remove('spacelaunch-right');
	if (elPrev !== null)
		elPrev.classList.remove('spacelaunch-left');
	if (body !== null)
		body.classList.remove('spacelaunch');
	
	// kill the 3D canvas too
	window.setTimeout( function() {
	if (body !== null && body.firstChild.tagName == 'CANVAS')
		body.removeChild(body.firstChild);
	if (animation !== null)
		animation.controls.removeEventListeners();
	animation = null;
	}, 100);
}

function spacelaunch()
{
	var el     = document.querySelector('.current');
	var elNext = document.querySelector('.next');
	var elPrev = document.querySelector('.past');
	var body   = document.querySelector('body');
	
	el.classList.add('spacelaunch-central');
	elNext.classList.add('spacelaunch-right');
	elPrev.classList.add('spacelaunch-left');
	body.classList.add('spacelaunch');
	
	// dimensions
	var canvascontainer = document.getElementById('canvas3D');
	var width = canvascontainer.clientWidth;
	var height = canvascontainer.clientHeight-4; // unfathomable bug: why do I get a scroll bar with the full height ???
	
	// renderer
	var renderer = new THREE.WebGLRenderer ({antialias: true});
	renderer.setSize(width, height);
	
	// glue to HTML element
	canvascontainer.insertBefore(renderer.domElement,canvascontainer.firstChild);
	//canvas.appendChild(renderer.domElement);
	renderer.setClearColorHex(0x000000, 0);
	renderer.clear();
	
	// camera
	var camera = new THREE.PerspectiveCamera(35, width / height, 1, 3000);
	camera.position.x = 0;
	camera.position.y = 360;
	camera.position.z = 1800;
	camera.rotation.x = -Math.PI/2/10;
	
	// scene
	var scene = new THREE.Scene();
	
	//var controls = new THREE.MyFlyControls(camera, renderer.domElement);
	var controls = new THREE.MyFlyControls(camera, document.body); // unfathomable bug: if the canvas is passed here then events are never received
	controls.movementSpeed = 100;
	controls.rollSpeed = 0.5;
	//controls.autoForward = true;
	
	// READY >
	
	// lights
	var light1 = new THREE.DirectionalLight(0xffffff, 1);
	light1.position.set(1, 1, 0.3);
	scene.add(light1);
	
	var light2 = new THREE.DirectionalLight(0xffffff, 1);
	light2.position.set(-1, 1, -0.3);
	scene.add(light2);
	
	var light3 = new THREE.DirectionalLight(0xffffff, 0.4);
	light3.position.set(0, 0, 1);
	scene.add(light3);
	
	// ground plane
	var groundTex = THREE.ImageUtils.loadTexture('../models/ground.png');
	groundTex.wrapS = groundTex.wrapT = THREE.RepeatWrapping;
	groundTex.repeat.set(50, 50);
	var groundGeo = new THREE.CubeGeometry(3000, 3000, 10, 1, 1, 1);
	var groundMat = new THREE.MeshBasicMaterial({map: groundTex, emissive:0x444444});
	var ground    = new THREE.Mesh(groundGeo, groundMat);
	ground.rotation.x = Math.PI/2;
	ground.rotation.z = 1;
	ground.translateY(-5);
	scene.add(ground);
	
	// launch animation
	animation = new Object();
	animation.renderer = renderer;
	animation.scene    = scene;
	animation.camera   = camera;
	animation.controls = controls;
	animation.clock    = new THREE.Clock();
	animation.gettingclose_event = spacelaunch_close;
	animation.gettingclose_event_fired = false;
	window.requestAnimationFrame(animate);
	
	var vec0 = new THREE.Vector3(0,0,0);
	var vec111 = new THREE.Vector3(1,1,1);
	
	var sequencer = new Object();
	sequencer.todo = new Object();
	sequencer.begin = 0;
	sequencer.end = 0;
	sequencer.add = function(f) {sequencer.todo[sequencer.end++] = f;};
	sequencer.go = function() {if (sequencer.begin < sequencer.end) sequencer.todo[sequencer.begin++]();};
	animation.sequencer = sequencer;
	animation.sequencer_fired = false;
	
	loadModel(scene, "../models/Cupcake.dae",          new THREE.Vector3(-175,0,0), vec0, vec111, "androidmodel-cupcake", sequencer);
	loadModel(scene, "../models/Donut.dae",            new THREE.Vector3(-125,0,0), vec0, vec111, "androidmodel-donut", sequencer);
	loadModel(scene, "../models/Eclair.dae",           new THREE.Vector3(-75,0,0),  vec0, vec111, "androidmodel-eclair", sequencer);
	loadModel(scene, "../models/Froyo.dae",            new THREE.Vector3(-25,0,0),  vec0, vec111, "androidmodel-froyo", sequencer);
	loadModel(scene, "../models/Gingerbread.dae",      new THREE.Vector3(25,0,0),   vec0, vec111, "androidmodel-gingerbread", sequencer);
	loadModel(scene, "../models/Honeycomb.dae",        new THREE.Vector3(75,0,0),   vec0, vec111, "androidmodel-honeycomb", sequencer);
	loadModel(scene, "../models/IceCreamSandwich.dae", new THREE.Vector3(125,0,0),  vec0, vec111, "androidmodel-icecreamsandwich", sequencer);
	loadModel(scene, "../models/JellyBean.dae",        new THREE.Vector3(175,0,0),  vec0, vec111, "androidmodel-jellybean", sequencer);
}

function spacelaunch_close()
{
	// launch loading sequence when you get sufficiently close to the models
	animation.sequencer.go();
}

function loadModel(scene, url, position, rotation, scale, name, sequencer)
{	
	// instantiate a loader
	var loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis= true;
	loader.options.upAxis = 'Y';
	
	var loadheight = 50;
	
	// create a loding shape (kind of 3D progres bar)
	var loadingGeometry = new THREE.CylinderGeometry(20, 20, loadheight, 20, 10, false);
	var loadingMaterial = new THREE.MeshBasicMaterial({color: 0x8888ff, wireframe: true, wireframeLinewidth: 1});
	var loadingShape    = new THREE.Mesh(loadingGeometry, loadingMaterial);
	
	var loadedGeometry  = new THREE.CylinderGeometry(15, 15, loadheight, 20, 10, false);
	var loadedMaterial  = new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0x444444});
	var loadedShape     = new THREE.Mesh(loadedGeometry, loadedMaterial);
	
	loadingShape.name = "loading-" + name;
	loadingShape.translateX(position.x);
	loadingShape.translateY(position.y + loadheight/2);
	loadingShape.translateZ(position.z);
	loadingShape.rotation.copy(rotation);
	
	loadedShape.scale.set(1, 0.01, 1);
	loadedShape.name = "loaded-" + name;
	loadedShape.translateX(position.x);
	loadedShape.translateY(position.y + 0.01*loadheight/2);
	loadedShape.translateZ(position.z);
	loadedShape.rotation.copy(rotation);
	
	// make the loading shape appear
	scene.add(loadingShape);
	scene.add(loadedShape);
	
	// add the actual loading task into a sequential queue
	sequencer.add( function() {
		loader.load(url,
				function(collada)
				{
					console.log("MARTIN: finished loading model " + name);
					var model = collada.scene;
					model.position.copy(position);
					model.rotation.copy(rotation);
					model.scale.copy(scale);
					model.name = name;
					setProgress3D(scene, model, loadingShape, loadedShape, loadheight, 100);
					
					window.setTimeout(function(){sequencer.go();}, 300);
				},
				function(progress)
				{
					var percent = 0;
					if (progress.lengthComputable)
						percent = progress.loaded / progress.total*100;
					else
						percent = progress.loaded / (1024*1024) * 100;
					console.log("MARTIN: progress loading model " + name + ":" + percent + "%");
					setProgress3D(scene, null, loadingShape, loadedShape, loadheight, percent);
				}
		);}
	);
}

function setProgress3D(scene, model, waitShape, progressShape, progressShapeMaxHeight, percent)
{
	var f = percent/100;
	if (f>1)
		f = 1;
	var t0 = new Date().getTime();
	var f0 = progressShape.scale.y;
	if (f0 == f)
		return;
	progressShape.continuousUpdate = function(t)
	{
		var duration = 300;
		var intermediateScale = f;
		if (t-t0 <= duration)
			intermediateScale = (t-t0)/duration*f + (1-(t-t0)/duration)*f0;
		
		progressShape.translateY((intermediateScale-progressShape.scale.y)*progressShapeMaxHeight/2);
		progressShape.scale.set(1, intermediateScale, 1);
		
		// if animation time exhausted
		// undefine the function and if the loading is finished, also swap in the real model
		if (t-t0 > duration)
		{
			if (f == 1)
			{
				scene.remove(waitShape);
				scene.remove(progressShape);
				if (model !== null)
					scene.add(model);
			}
			delete this.continuousUpdate;
		}
	};
}

function animate()
{
	var t = new Date().getTime();
	
	// if no animation, return and don't relaunch animation loop
	if (animation == null)
		return;
	
	var renderer = animation.renderer;
	var scene    = animation.scene;
	var camera   = animation.camera;
	var controls = animation.controls;
	var clock    = animation.clock;
	
	var objectsToUpdate = new Object();
	var nbObjectsToUpdate = 0;
	
	scene.traverse(function(object)
	{
		// models: slow rotation
		if (object instanceof THREE.Object3D && object.name.indexOf("androidmodel") >= 0)
		{
			object.rotation.y = t/1000;
		}
		
		// loading shapes: fast rotation
		if (object instanceof THREE.Object3D && object.name.indexOf("loading") >= 0)
		{
			object.rotation.y = t/500;
		}
		
		// loading progress shapes: continuously update height
		if (object instanceof THREE.Object3D && object.name.indexOf("loaded") >= 0)
		{
			if (object.continuousUpdate !== undefined)
				objectsToUpdate[nbObjectsToUpdate++] = object;
		}
	});
	
	// the progress shape animation also switches in the final loading shape
	// when it finishes so these calls must be made outside of the scene traversal loop
	for (var i=nbObjectsToUpdate-1; i>=0; i--)
	{
		objectsToUpdate[i].continuousUpdate(t);
		delete objectsToUpdate[i];
	}
	
	if (clock !== null && controls !== null)
	{
		var delta = clock.getDelta();
		controls.update(delta);
	}
	renderer.render(scene, camera);
	
	// launch an event if the camera gets closer than 900px
	if (animation.gettingclose_event !== null && !animation.gettingclose_event_fired && camera.position.lengthSq() < 900*900)
	{
		animation.gettingclose_event();
		animation.gettingclose_event_fired = true;
	}
	
	// keep going
	window.requestAnimationFrame(animate);
}

function move(id)
{
	var nod = document.getElementById(id);
	if (nod != null)
	{
		if (!nod.classList.contains('begin') && !nod.classList.contains('end'))
			nod.classList.add('end');
		else
		{
			nod.classList.toggle('begin');
			nod.classList.toggle('end');
		}
	}
}

function step(id, classroot, max)
{
	var el = document.getElementById(id);
	for (var i=1; i<=max; i++)
	{
		if (el.classList.contains(classroot + i))
		{
			el.classList.remove(classroot + i);
			if (i+1<=max)
				el.classList.add(classroot + (i+1));
			else
				el.classList.add(classroot + 1);
			break;
		}
	}
}

function stepSVGanimation(id, stepCount, stepTime)
{
	  if (window['animstate-'+id] === undefined || window['animstate-'+id] == 0 || window['animstate-'+id] > stepCount)
	  {
		  document.getElementById(id).pauseAnimations();
		  document.getElementById(id).setCurrentTime(0);
		  window['animstate-'+id] = 1;
	  }
	  else if (window['animstate-'+id] <= stepCount)
	  {
		  document.getElementById(id).unpauseAnimations();
		  window['animstate-'+id] += 1;
		  if (window['animstate-'+id] <= stepCount)
			  setTimeout(function timeout(){document.getElementById(id).pauseAnimations();}, stepTime);
	  }
}

function toggleSVGanimation(id)
{
	  if (window['binaryanimstate-'+id] === undefined || window['binaryanimstate-'+id] == 0)
	  {
		  document.getElementById(id).pauseAnimations();
		  window['binaryanimstate-'+id] = 1;
	  }
	  else if (window['binaryanimstate-'+id] >= 1)
	  {
		  document.getElementById(id).unpauseAnimations();
		  window['binaryanimstate-'+id] = 0;
	  }
}

function stepSplineSVGanimation()
{	
	var stringValues = ["0 0 1 1", "0 0.6 0.4 1", "0.35 0 0.65 1"];
	var splineline1dValues = ["M 100,100 L 100,100", "M 100,100 L 100,40", "M 100,100 L 100,65"];
	var splineline2dValues = ["M 0,0 L 0,0", "M 0,0 L 60,0", "M 0,0 L 0,35"];
	var splinecircle1cxValues = [100, 100, 100];
	var splinecircle1cyValues = [100,  40,  65];
	var splinecircle2cxValues = [  0,  60,   0];
	var splinecircle2cyValues = [  0,   0,  35];
	var splinecurve1dValue = ["M 0,0 L 100,100", "M 0,0 C 60,0 100,40 100,100", "M 0,0 C 0,35 100,65 100,100"];
	
	if (window['splineanimstate'] === undefined || window['splineanimstate'] == 3)
		window['splineanimstate'] = 0;
	else
		window['splineanimstate'] += 1;
	
	var i = window['splineanimstate'];
	
	document.getElementById('wavesurf4').setAttributeNS(null,"keySplines", stringValues[i]+"; "+stringValues[i]);
	document.getElementById('splinecnt1').firstChild.innerHTML = stringValues[i]+"; "+stringValues[i];
	document.getElementById('splinecnt2').innerHTML = stringValues[i];
	document.getElementById('splinecircle1').setAttributeNS(null,"cx", splinecircle1cxValues[i]);
	document.getElementById('splinecircle1').setAttributeNS(null,"cy", splinecircle1cyValues[i]);
	document.getElementById('splinecircle2').setAttributeNS(null,"cx", splinecircle2cxValues[i]);
	document.getElementById('splinecircle2').setAttributeNS(null,"cy", splinecircle2cyValues[i]);
	document.getElementById('splineline1').setAttributeNS(null,"d", splineline1dValues[i]);
	document.getElementById('splineline2').setAttributeNS(null,"d", splineline2dValues[i]);
	document.getElementById('splinecurve1').setAttributeNS(null,"d", splinecurve1dValue[i]);
}
