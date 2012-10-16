/*
  Copyright 2011 Google Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

  Original version: Martin Gorner (mgorner@google.com)
*/

// the physical world
var physicalWorld = null;
// the ground of the physical world
var physicalGround = null;
// where to draw the world
var drawingCanvas = null;
// wait until N images are loaded
var nbtoload = 4;

var scale = 50;

function run()
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
		physicalWorld.Step(1.0/50, 1);
		setTimeout(runWorld, 1000/50);
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
		webkitRequestAnimationFrame(runAnimation);
	}
}

function startup()
{
	nbtoload--;
	if (nbtoload > 0)
		return;

	physicalWorld = setupWorld(900, 600);
	drawingCanvas = setupCanvas('canvas');
	adjustToWindow();
	drawWorldIn(physicalWorld, drawingCanvas);
}

function setupWorld(width, height)
{
	var world = createWorldWithGravity();
	
	// add the ground
	var fixed = true;
	physicalGround = createBox(world, 0, 0, 3000/scale, 100/scale, fixed); // center_x, center_y, width, height. The position does not matter, it will be repositioned in adjustToWindow()
	
	// add 4 tile bodies
	var tile;
	var size = 270;
	tile = createBox(world, 190/scale, 450/scale, size/scale, size/scale); // center_x, center_y, width, height
	tile.SetCenterPosition(tile.GetCenterPosition(), 1.1); // rotate it slightly in box2D
	tile.image = "img/tile_bberry.png"; // adding custom property to the object: its image
	
	tile = createBox(world, 420/scale, 150/scale, size/scale, size/scale); // center_x, center_y, width, height
	tile.image = "img/tile_user.png"; // adding custom property to the object: its image
	
	tile = createBox(world, 670/scale, 450/scale, size/scale, size/scale); // center_x, center_y, width, height
	tile.SetCenterPosition(tile.GetCenterPosition(), 0.2); // rotate it slightly in box2D
	tile.image = "img/tile_computer.png"; // adding custom property to the object: its image
	
	tile = createBox(world, 890/scale, 150/scale, size/scale, size/scale); // center_x, center_y, width, height
	tile.image = "img/tile_world.png"; // adding custom property to the object: its image
	
	SleepWorld(world); // initially, do not run the physics
	return world;
}

function setupCanvas(id)
{
	var canvas = null;
	var nod = document.getElementById(id);
	if (nod != null)
		canvas = nod.getContext('2d');
	return canvas;
	
}

function drawWorldIn(world, canvas)
{	
	// erase canvas
	canvas.clearRect(0,0,drawingCanvas.canvas.clientWidth, drawingCanvas.canvas.clientHeight);
	
	// our tiles: those that have the 'image' property set
	for (var b = world.GetBodyList(); b; b = b.GetNext())
	{
		if (typeof(b.image) != 'undefined')
		{
			canvas.save();
			var tile = new Image();
			tile.src = b.image;
			var posV = b.GetCenterPosition();
			canvas.translate(posV.x*scale, posV.y*scale);
			canvas.rotate(b.GetRotation());
			canvas.drawImage(tile, -tile.width/2, - tile.height/2);
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
		run();
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
