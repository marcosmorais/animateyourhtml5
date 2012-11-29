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

var b2Vec2         = Box2D.Common.Math.b2Vec2;
var b2World        = Box2D.Dynamics.b2World;
var b2FixtureDef   = Box2D.Dynamics.b2FixtureDef;
var b2BodyDef      = Box2D.Dynamics.b2BodyDef;
var b2Body         = Box2D.Dynamics.b2Body;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

// the physical world
var physicalWorld;
// the ground of the physical world
var physicalGround;
// where to draw the world
var drawingCanvas;

window.onresize = doResize;

var scale = 200;

function run()
{
	wakeWorld(physicalWorld);
	runWorld();
	runAnimation();
}

function runWorld()
{
	// starts a loop that moves the physical simulation of the world forward
	// does nothing if no objects are moving so as to preserve the battery
	// the world is updated 60 times per second.

	physicalWorld.Step(1.0/60, 10, 10);
    physicalWorld.ClearForces();

    // continue animation loop (if needed)
    if (!isWorldAsleep(physicalWorld))
		setTimeout(runWorld, 1000/60);
}

function runAnimation()
{
	// starts a loop that displays the state of the world
	// does nothing if no objects are moving so as to preserve the battery
	// the display is updated as often as the browser sees fit thanks to requestAnimationFrame

    drawWorldIn(physicalWorld, drawingCanvas);

    // continue animation loop (if needed)
	if (!isWorldAsleep(physicalWorld))
		requestAnimationFrame(runAnimation);
}

function startup()
{
	//nbtoload--;
	//if (nbtoload > 0)
	//	return;

	physicalWorld = setupWorld(900, 600);
	drawingCanvas = setupCanvas('canvas');
	adjustToWindow();
    setupDebugDraw(physicalWorld, drawingCanvas);
	drawWorldIn(physicalWorld, drawingCanvas);
}

function setupWorld(width, height)
{
	var world = createWorldWithGravity();
	
	// add the ground
	var fixed = true;
	physicalGround = createBox(world, 0, 0, 2000/scale, 100/scale, fixed); // center_x, center_y, width, height. The position does not matter, it will be repositioned in adjustToWindow()
	
	// add 4 tile bodies
	var tile;
	var size = 270;
    var xofs=30;
	tile = createBox(world, (190+xofs)/scale, 450/scale, size/scale, size/scale); // center_x, center_y, width, height
	tile.SetAngle(1.1); // rotate it slightly in box2D
    tile.image = new Image();
	tile.image.src = "../images/tile_bberry.png"; // adding custom property to the object: its image
    tile.image.onload = function() {drawWorldIn(physicalWorld, drawingCanvas);}
	
	tile = createBox(world, (420+xofs)/scale, 150/scale, size/scale, size/scale); // center_x, center_y, width, height
    tile.image = new Image();
	tile.image.src = "../images/tile_user.png"; // adding custom property to the object: its image
    tile.image.onload = function() {drawWorldIn(physicalWorld, drawingCanvas);}
	
	tile = createBox(world, (670+xofs)/scale, 450/scale, size/scale, size/scale); // center_x, center_y, width, height
	tile.SetAngle(0.2); // rotate it slightly in box2D
    tile.image = new Image();
	tile.image.src = "../images/tile_computer.png"; // adding custom property to the object: its image
    tile.image.onload = function() {drawWorldIn(physicalWorld, drawingCanvas);}
	
	tile = createBox(world, (890+xofs)/scale, 150/scale, size/scale, size/scale); // center_x, center_y, width, height
    tile.image = new Image();
	tile.image.src = "../images/tile_world.png"; // adding custom property to the object: its image
    tile.image.onload = function() {drawWorldIn(physicalWorld, drawingCanvas);}
	
	sleepWorld(world); // initially, do not run the physics
	return world;
}

function setupCanvas(id)
{
	var canvas;
	var nod = document.getElementById(id);
	if (nod != null)
		canvas = nod.getContext('2d');
	return canvas;
	
}

function setupDebugDraw(world, canvas)
{
    //setup debug draw
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(canvas);
    debugDraw.SetDrawScale(scale);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);
}

function drawWorldIn(world, canvas)
{
    if (world === undefined || canvas === undefined )
        return;

	// erase canvas
	canvas.clearRect(0,0,drawingCanvas.canvas.clientWidth, drawingCanvas.canvas.clientHeight);


	// our tiles: those that have the 'image' property set
	for (var b = world.GetBodyList(); b; b = b.GetNext())
	{
		if (typeof(b.image) != 'undefined')
		{
			canvas.save();
			var posV = b.GetPosition();
			canvas.translate(posV.x*scale, posV.y*scale);
			canvas.rotate(b.GetAngle());
			canvas.drawImage(b.image, -b.image.width/2, - b.image.height/2);
			canvas.restore();
		}
	}

    // wireframes for debugging
    //world.DrawDebugData();
}

function doResize()
{
	adjustToWindow();
	
	// wake everyone up on a resize event
	if (isWorldAsleep(physicalWorld))
		run();
}

function adjustToWindow()
{	
	// get the size from the new window size
	var margin = 10;
	var width  = window.innerWidth - 2*margin;
	var height = window.innerHeight - 2*margin;
	
	if (drawingCanvas !== undefined)
	{	// resize the coordinate system of the canvas
		drawingCanvas.canvas.width = width;
		drawingCanvas.canvas.height = height;
		// resize the canvas element itself
		drawingCanvas.canvas.style.width  = width +"px";
		drawingCanvas.canvas.style.height = height + "px";
	}
	
	if (physicalGround !== undefined)
	{	// reposition the ground
		var thickness = 100;
		var center_x = width/2;
		var center_y = height + thickness/2 - 10;
		physicalGround.SetPosition(new b2Vec2(center_x / scale, center_y / scale), 0);
	}
}

// ------------------- helpers ----------------------

function createWorldWithGravity()
{
    var gravity = new b2Vec2(0, 20); // used o be 100!
    var allowSleep = true;
    var world = new b2World(gravity, allowSleep);
    return world;
}

function createBox(world, x, y, width, height, fixed)
{
    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;

    var bodyDef = new b2BodyDef;

    // fixed objects
    if (!fixed)
        bodyDef.type = b2Body.b2_dynamicBody;
    else
        bodyDef.type = b2Body.b2_staticBody;

    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(width/2.0, height/2.0);
    bodyDef.position.Set(x, y);
    var body = world.CreateBody(bodyDef);
    body.CreateFixture(fixDef);

    return body;
}

/*
function createBall(world, r, x, y, fixed) {
    if (typeof(fixed) == 'undefined') fixed = false;
    var ballSd = new b2CircleDef();
    if (!fixed) ballSd.density = 1.0;
    ballSd.radius = r;
    ballSd.restitution = 0.5;
    ballSd.friction = 0.3;
    var ballBd = new b2BodyDef();
    ballBd.AddShape(ballSd);
    ballBd.position.Set(x,y);
    return world.CreateBody(ballBd);
}
*/

function sleepWorld(world)
{
    for (var b = world.GetBodyList(); b; b = b.GetNext())
    {
        b.SetAwake(false);
    }
}

function wakeWorld(world)
{
    for (var b = world.GetBodyList(); b; b = b.GetNext())
    {
        b.SetAwake(true);
    }
}

function isWorldAsleep(world)
{
    var asleep = true;
    for (var b = world.GetBodyList(); b; b = b.GetNext())
    {
        asleep = asleep && (!b.IsAwake() || b.GetType() == b2Body.b2_staticBody);
    }
    return asleep;
}
