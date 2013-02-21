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

// Box2D simulated to real world scale
var scale = 200;

// -------------------- shortcuts ----------------------------

var b2Vec2         = Box2D.Common.Math.b2Vec2;
var b2World        = Box2D.Dynamics.b2World;
var b2FixtureDef   = Box2D.Dynamics.b2FixtureDef;
var b2BodyDef      = Box2D.Dynamics.b2BodyDef;
var b2Body         = Box2D.Dynamics.b2Body;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape  = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw    = Box2D.Dynamics.b2DebugDraw;

// ---------------------your code here-------------------------


//           ___________  __,__
//     ----- | ||| |||| | | |__|
//      ---- | ._    _. |_|code|
//       --- `-(o)--(o)----(o)-'


// ------------------- helpers functions ----------------------

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
    fixDef.restitution = 0.4;

    var bodyDef = new b2BodyDef;
    bodyDef.type = (!fixed) ? b2Body.b2_dynamicBody : b2Body.b2_staticBody;

    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(width/2.0/scale, height/2.0/scale);
    bodyDef.position.Set(x/scale, y/scale);
    var body = world.CreateBody(bodyDef);
    body.CreateFixture(fixDef);

    return body;
}

function createBall(world, r, x, y, fixed)
{
    var fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.8;

    var bodyDef = new b2BodyDef;
    bodyDef.type = (!fixed) ? b2Body.b2_dynamicBody : b2Body.b2_staticBody;

    fixDef.shape = new b2CircleShape(r/scale);
    bodyDef.position.Set(x/scale, y/scale);
    var body = world.CreateBody(bodyDef);
    body.CreateFixture(fixDef);

    return body;
}

function drawTarget(ctx)
{
    // paints a circle centered on (400, 400)
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "#FFCC00";
    ctx.lineWidth = 5;
    ctx.arc(400, 400, 60, 0, 2*Math.PI, true);
    ctx.stroke();
    ctx.restore();
}

function drawGuy(ctx)
{
    // total size: 250 x 300

    // head
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 300);
    ctx.lineTo(0, 100);
    ctx.bezierCurveTo(0,60, 36,0, 118,0);
    ctx.bezierCurveTo(196,0, 227,65, 248,151);
    ctx.lineTo(191, 151);
    ctx.lineTo(191, 251);
    ctx.bezierCurveTo(191, 276, 167, 300, 137, 300);
    ctx.closePath();
    ctx.fillStyle = "#E21E23";
    ctx.shadowColor = "grey";
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();

    //right eye
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "#ffd400";
    ctx.arc(205, 90, 38, 0, 2*Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle="black";
    ctx.arc(205, 90, 20, 0, 2*Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle="white";
    ctx.arc(212, 90, 7, 0, 2*Math.PI);
    ctx.fill();

    //left eye
    ctx.beginPath();
    ctx.fillStyle = "#ffd400";
    ctx.arc(105, 90, 55, 0, 2*Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle="black";
    ctx.arc(105, 90, 30, 0, 2*Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle="white";
    ctx.arc(115, 90, 10, 0, 2*Math.PI);
    ctx.fill();

    //mouth
    ctx.beginPath();
    ctx.moveTo(170, 180);
    ctx.bezierCurveTo(164, 202, 134, 244, 101, 245);
    ctx.bezierCurveTo(69, 243, 72, 204, 78, 182);
    ctx.fillStyle="white";
    ctx.fill();
    ctx.restore();
}

function setupDebugDraw(world, ctx)
{
    //setup debug draw
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(ctx);
    debugDraw.SetDrawScale(scale);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);
}

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