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

// the physical world
var physicalWorld = null;
// the ground of the physical world
var physicalGround = null;
// where to draw the world
var drawingCanvas = null;
// wait until N images are loaded
var nbModelAnimToLoad = 4;

var modelImage1 = new Image();
modelImage1.src = "../images/tile_bberry.png";
var modelImage2 = new Image();
modelImage2.src = "../images/tile_user.png";
var modelImage3 = new Image();
modelImage3.src = "../images/tile_computer.png";
var modelImage4 = new Image();
modelImage4.src = "../images/tile_world.png";

var tileScale = 0.6;
var scale = 50;

function runModelAnimation()
{
	WakeWorld(physicalWorld);
	runWorld();
	runAnimation();
}

function runWorld()
{
	// starts a loop that moves the physical simulation of the world forward
	// does nothing if no objects are moving so as to preserve the battery
	// the world is updated 60 times per second.
	if (!IsWorldAsleep(physicalWorld))
	{
		physicalWorld.Step(1.0/60, 1);
		setTimeout(runWorld, 1000/60);
	}
}

function runAnimation()
{
	// starts a loop that displays the state of the world
	// does nothing if no objects are moving so as to preserve the battery
	// the display is updated as often as the browser sees fit thanks to requestAnimationFrame
	if (!IsWorldAsleep(physicalWorld))
	{
		drawWorldIn(physicalWorld, drawingCanvas);
		requestAnimationFrame(runAnimation);
	}
}

function startupModelAnimation()
{
	drawingCanvas = initCanvas('canvas-fall');
	// delay of canvas is not ready
	if (drawingCanvas === null || drawingCanvas.canvas === null || drawingCanvas.canvas.height == 0 || drawingCanvas.canvas.width == 0) { window.setTimeout(startupModelAnimation, 200); return; }
	// delay if images not ready
	if (!modelImage1.complete || !modelImage2.complete || !modelImage3.complete || !modelImage4.complete) { window.setTimeout(startupModelAnimation, 200); return; }
	
	physicalWorld = setupWorld(drawingCanvas.canvas.width, drawingCanvas.canvas.height);
	//adjustToWindow();
	drawWorldIn(physicalWorld, drawingCanvas);
}

function setupWorld(width, height)
{
	var world = createWorldWithGravity();
	
	// add the ground
	var fixed = true;
	var thickness = 170;
	physicalGround = createBox(world, width/2/scale, (height+thickness/2-8)/scale, width/scale, thickness/scale, fixed); // center_x, center_y, width, height.
	
	// obstacle
	createBox(world, (width/2-18)/scale, (height/2-8)/scale, 188/scale, 44/scale, fixed);
	
	//walls
	createBox(world, (-thickness/2+2)/scale, (height/2)/scale, thickness/scale, height/scale, fixed);
	createBox(world, (width+thickness/2-4)/scale, (height/2)/scale, thickness/scale, height/scale, fixed);
	
	// add 4 tile bodies
	var tile;
	var size = 270*tileScale;
	tile = createBox(world, (140+8)/scale, 122/scale, size/scale, size/scale); // center_x, center_y, width, height
	tile.SetCenterPosition(tile.GetCenterPosition(), 0.05); // rotate it slightly in box2D
	tile.image = modelImage1; // adding custom property to the object: its image
	
	tile = createBox(world, (345+4)/scale, 130/scale, size/scale, size/scale); // center_x, center_y, width, height
	tile.SetCenterPosition(tile.GetCenterPosition(), 0.02);
	tile.image = modelImage2; // adding custom property to the object: its image
	
	tile = createBox(world, (545-4)/scale, 130/scale, size/scale, size/scale); // center_x, center_y, width, height
	tile.SetCenterPosition(tile.GetCenterPosition(), -0.02); // rotate it slightly in box2D
	tile.image = modelImage3; // adding custom property to the object: its image
	
	tile = createBox(world, (750-8)/scale, 122/scale, size/scale, size/scale); // center_x, center_y, width, height
	tile.SetCenterPosition(tile.GetCenterPosition(), -0.05);
	tile.image = modelImage4; // adding custom property to the object: its image
	
	SleepWorld(world); // initially, do not run the physics
	return world;
}

function drawWorldIn(world, canvas)
{	
	// erase canvas
	canvas.clearRect(0,0,canvas.canvas.width, canvas.canvas.height);
	
	// our tiles: those that have the 'image' property set
	for (var b = world.GetBodyList(); b; b = b.GetNext())
	{
		if (typeof(b.image) != 'undefined')
		{
			canvas.save();
			var tile = b.image;
			var posV = b.GetCenterPosition();
			canvas.translate(posV.x*scale, posV.y*scale);
			canvas.rotate(b.GetRotation());
			canvas.scale(tileScale, tileScale);
			var L = 270;
			canvas.drawImage(tile, -L/2, -L/2);
			canvas.restore();
		}
	}
	
	// wireframes for debugging
	//drawWorldWireframe(world, canvas, scale);
}

window.onresize = doResize;

function doResize()
{
	adjustToWindow();
	
	// wake everyone up on a resize event
	if (IsWorldAsleep(physicalWorld))
		runModelAnimation();
}

function adjustToWindow()
{	
	// get the size from the new window size
	var margin = 10;
	var width  = window.innerWidth - 2*margin;
	var height = window.innerHeight - 2*margin;
	
	if (drawingCanvas != null)
	{	// resize the coordinate system of the canvas
		drawingCanvas.canvas.width = width;
		drawingCanvas.canvas.height = height;
		// resize the canvas element itself
		drawingCanvas.canvas.style.width  = width +"px";
		drawingCanvas.canvas.style.height = height + "px";
	}
	
	if (physicalGround != null)
	{	// reposition the ground
		var thickness = 100;
		var center_x = width/2;
		var center_y = height + thickness/2 - 10;
		physicalGround.SetCenterPosition(new b2Vec2(center_x / scale, center_y / scale), 0);
	}
}

