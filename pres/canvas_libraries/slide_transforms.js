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

var platformImg = new Image();
platformImg.src = "images/platform.png";
var mouseX = null;
var mouseY = null;
var slide_canvas_transforms_running = false;


function drawLittleGuy(context)
{
	// total size: 250 x 300
	
	// head
	context.save();
	context.beginPath();
	context.moveTo(0, 300);
	context.lineTo(0, 100);
	context.bezierCurveTo(0,60, 36,0, 118,0);
	context.bezierCurveTo(196,0, 227,65, 248,151);
	context.lineTo(191, 151);
	context.lineTo(191, 251);
	context.bezierCurveTo(191, 276, 167, 300, 137, 300);
	context.closePath();
	context.fillStyle = "#E21E23";
	context.shadowColor = "grey";
	context.shadowOffsetX = 5;
	context.shadowOffsetY = 5;
	context.shadowBlur = 10;
	context.fill();
	context.restore();
	
	//right eye
	context.save();
	context.beginPath();
	context.fillStyle = "#ffd400";
	context.arc(205, 90, 38, 0, 2*Math.PI);
	context.fill();
	
	context.beginPath();
	context.fillStyle="black";
	context.arc(205, 90, 20, 0, 2*Math.PI);
	context.fill();
	
	context.beginPath();
	context.fillStyle="white";
	context.arc(212, 90, 7, 0, 2*Math.PI);
	context.fill();
	
	//left eye
	context.beginPath();
	context.fillStyle = "#ffd400";
	context.arc(105, 90, 55, 0, 2*Math.PI);
	context.fill();
	
	context.beginPath();
	context.fillStyle="black";
	context.arc(105, 90, 30, 0, 2*Math.PI);
	context.fill();
	
	context.beginPath();
	context.fillStyle="white";
	context.arc(115, 90, 10, 0, 2*Math.PI);
	context.fill();
	
	//mouth
	context.beginPath();
	context.moveTo(170, 180);
	context.bezierCurveTo(164, 202, 134, 244, 101, 245);
	context.bezierCurveTo(69, 243, 72, 204, 78, 182);
	context.fillStyle="white";
	context.fill();
	context.restore();
}

function phys_update(phys, dt)
{
	if (dt > 0.05)
		dt = 0.05;
	phys.x  += dt * phys.vx;
	phys.y  += dt * phys.vy;
	phys.vx += dt * phys.ax;
	phys.vy += dt * phys.ay;
	phys.r  += dt * phys.vr; // rotation speed
}

function apply_forces(context, phys, mousex, mousey)
{
	var objectradius = 135*0.4;
	
	// gravity
	if (phys.y > context.canvas.height - 1.1 * objectradius && phys.vy > 0)
	{
		// if lying on the floor, gravity + reaction = 0 (almost)
		phys.ax = phys.ax0/10;
		phys.ay = phys.ay0/10;
	}
	else
	{
		phys.ax = phys.ax0;
		phys.ay = phys.ay0;
	}
	
	// cursor force
	if (mousex !== null && mousey !== null)
	{
		var d = 150;
		var dx = mousex - phys.x;
		var dy = mousey - phys.y;
		if (dx*dx + dy*dy < d*d)
		{
			var norm = Math.sqrt(dx*dx + dy*dy);
			var fx = dx - dx/norm*d;
			var fy = dy - dy/norm*d;
			phys.ax += fx*50;
			phys.ay += fy*50;
		}
	}
}

function still_moving(phys)
{
	var v_epsilon = 10;
	var a_epsilon = 200;
	if (phys.vx*phys.vx + phys.vy*phys.vy < v_epsilon*v_epsilon && 
			phys.ax*phys.ax + phys.ay*phys.ay < a_epsilon*a_epsilon	)
		return false;
	else
		return true;
}

function draw_little_guy_with_phys(context, phys)
{
	// compose the oprations in the opposite order of 
	// what you would do if you started with "draw"
	// and then applied transformations to bring the
	// drawing to the right position and scale
	context.save();
	context.translate(phys.x, phys.y);
	context.scale(0.4, 0.4);
	context.scale(1+phys.z, 1+phys.z);
	context.rotate(phys.r);
	context.translate(-125, -150); // center on the little guy
	drawLittleGuy(context);
	context.restore();
}

// object is on a platform located at "groundLevel", centerd on phys.x0, with size "groundRadius"
// the borders of the canvas also act like bouncing walls
function applybox(context, phys, platformLevel, platformRadius)
{
	var objectradius = 135*0.4;
	var restitution = 0.8;
	
	// bounce on platform
	onPlatform = (Math.pow(phys.x - phys.x0, 2) < platformRadius*platformRadius) && (phys.y <= platformLevel+50) ;
	
	if (phys.y>platformLevel && onPlatform)
		phys.vy = phys.v0;
	
	// bounce on all borders of the canvas
	if (phys.x < objectradius && phys.vx < 0)
	{
		phys.vx = -phys.vx * restitution;
		phys.vy = phys.vy * restitution;
	}
	
	if (phys.x > context.canvas.width - objectradius && phys.vx > 0)
	{
		phys.vx = -phys.vx * restitution;
		phys.vy = phys.vy * restitution;
	}
		
	if (phys.y > context.canvas.height - objectradius && phys.vy > 0)
	{
		phys.vx = phys.vx * restitution;
		phys.vy = -phys.vy * restitution;
	}
	
	// if falling off the platform, add rotation
	var v = Math.sqrt(phys.vx*phys.vx + phys.vy*phys.vy);
	var vr = v/500;
	if (!onPlatform)
	{
		if (phys.x > phys.x0)
			phys.vr = vr;
		else
			phys.vr = -vr;
	}
	
	return onPlatform;
}

function slide_canvas_transforms()
{
	if (slide_canvas_transforms_running)
		return;
	
	var context = initCanvas("canvas-transforms");
	
	// delay of canvas is not ready
	if (context === null || context.canvas === null || context.canvas.height == 0 || context.canvas.width == 0)
	{
		window.setTimeout(slide_canvas_transforms, 200);
		return;
	}
	slide_canvas_transforms_running = true;
	var origin = context.canvas.offsetTop;
	
	context.canvas.onmousemove = onmousemove_slide_transforms;
	context.canvas.onmouseout  = onmouseout_slide_transforms;
	
	var phys1 = new Object();
	phys1.v0 = -500;
	phys1.x0 = 200;
	phys1.ax0 = 0;
	phys1.ay0 = 1200;
	phys1.ax = 0;
	phys1.ay = 0;
	phys1.vx = 0;
	phys1.vy = phys1.v0;
	phys1.x = phys1.x0;
	phys1.y = 250 - origin;
	phys1.vr = 0;
	phys1.r = 0;
	phys1.z = 0;
	
	var phys2 = new Object();
	phys2.v0 = -550;
	phys2.x0 = 460;
	phys2.ax0 = 0;
	phys2.ay0 = 1150;
	phys2.ax = 0;
	phys2.ay = 0;
	phys2.vx = 0;
	phys2.vy = phys2.v0;
	phys2.x = phys2.x0;
	phys2.y = 250 - origin;
	phys2.vr = 0;
	phys2.r = 0;
	phys2.z = 0;
	
	var phys3 = new Object();
	phys3.v0 = -500;
	phys3.x0 = 720;
	phys3.ax0 = 0;
	phys3.ay0 = 1250;
	phys3.ax = 0;
	phys3.ay = 0;
	phys3.vx = 0;
	phys3.vy = phys3.v0;
	phys3.x = phys3.x0;
	phys3.y = 250 - origin;
	phys3.vr = 0;
	phys3.r = 0;
	phys3.z = 0;
	
	var oldt = new Date().getTime();

	var worldtimer = window.setInterval(function() {
		// update position
		var t  = new Date().getTime();
		var dt = (t - oldt)/1000.0;
		oldt   = t;
		
		// gravity + cursor force
		apply_forces(context, phys1, mouseX, mouseY);
		apply_forces(context, phys2, mouseX, mouseY);
		apply_forces(context, phys3, mouseX, mouseY);
		
		phys_update(phys1, dt);
		phys_update(phys2, dt);
		phys_update(phys3, dt);
		
		var onPlatform1 = applybox(context, phys1, 250 - origin, 50);
		var onPlatform2 = applybox(context, phys2, 250 - origin, 50);
		var onPlatform3 = applybox(context, phys3, 250 - origin, 50);
		
		var effectCeil = 200 - origin;
		
		// object 2: rotate above effectCeil
		if (phys2.y<effectCeil)
			phys2.vr = 8.5;
		else if (onPlatform2)
		{
			phys2.vr = 0;
			phys2.r = 0;
		}
		
		// object 3: zoom above effectCeil
		if (phys3.y<effectCeil)
			phys3.z = (effectCeil-phys3.y)/80;
		else
			phys3.z = 0;
		
		// stop if nothing moving anymore
		if (!still_moving(phys1) && !still_moving(phys2) && !still_moving(phys3))
		{
			window.clearInterval(worldtimer);
			slide_canvas_transforms_running = false;
		}
	}, 1000/60);
	
	var run_anim = function(t) {
		context.clearRect(0,0,context.canvas.width, context.canvas.height);
		var origin = context.canvas.offsetTop;
		
		// draw the platforms
		context.drawImage(platformImg, 200-80, 280-origin, 120, 80);
		context.drawImage(platformImg, 460-80, 280-origin, 120, 80);
		context.drawImage(platformImg, 720-80, 280-origin, 120, 80);
		
		draw_little_guy_with_phys(context, phys1);
		draw_little_guy_with_phys(context, phys2);
		draw_little_guy_with_phys(context, phys3);
		
		// stop if nothing moving anymore
		if (still_moving(phys1) || still_moving(phys2) || still_moving(phys3))
			window.requestAnimationFrame(run_anim);
		else
			return;
		
		// draw cursor
		if (mouseX !== null && mouseY !== null)
		{
			context.save();
			context.beginPath();
			context.lineWidth = 5;
			context.strokeStyle="red";
			context.arc(mouseX, mouseY, 10, 0, 2*Math.PI);
			context.stroke();
			
			// for debugging: centers of the little guys
//			context.beginPath();
//			context.strokeStyle="grey";
//			context.arc(phys1.x, phys1.y, 10, 0, 2*Math.PI);
//			context.stroke();
//			context.beginPath();
//			context.strokeStyle="grey";
//			context.arc(phys2.x, phys2.y, 10, 0, 2*Math.PI);
//			context.stroke();
//			context.beginPath();
//			context.strokeStyle="grey";
//			context.arc(phys3.x, phys3.y, 10, 0, 2*Math.PI);
//			context.stroke();
			
			context.restore();
		}
	};
	
	window.requestAnimationFrame(run_anim);
}

function onmousemove_slide_transforms(e)
{
	mouseX = e.offsetX || e.layerX;
	mouseY = e.offsetY || e.layerY;
	return false;
}

function onmouseout_slide_transforms(e)
{
	mouseX = null;
	mouseY = null;
}