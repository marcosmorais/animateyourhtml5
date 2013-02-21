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

// drawing for slide "HTML canvas: drawing primitives"
function slide_canvas_primitives_draw()
{
	// 386 x 565
	var context = initCanvas("canvas-primitives");
	// delay of canvas is not ready
	if (context === null || context.canvas === null || context.canvas.height == 0 || context.canvas.width == 0) { window.setTimeout(slide_canvas_primitives_draw, 200); return; }
	
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	
	context.strokeStyle = "#f9ae3b";
	context.fillStyle = "#DDDDFF";
	context.lineWidth = 5;
	
	context.beginPath();
	context.moveTo(50, 50);
	context.lineTo(350, 150);
	context.lineTo(300, 40);
	context.lineTo(230, 160);
	context.lineTo(180, 60);
	context.lineTo(100, 100);
	context.stroke();
	
	context.beginPath();
	context.lineWidth = 10;
	context.strokeStyle = "#4b7bea";
	context.rect(220, 200, 100, 100);
	context.stroke();
	context.fill();
	
	context.beginPath();
	context.lineWidth = 5;
	context.strokeStyle = "#10b73a";
	context.arc(120, 370, 60, 0, 2*Math.PI);
	context.stroke();
	
	context.beginPath();
	context.translate(180, 250);
	context.scale(0.5, 0.5);
	context.lineWidth = 10;
	context.strokeStyle = "#f33034";
	context.moveTo(200, 400);
	context.bezierCurveTo(200, 300, 350, 300, 350, 400);
	context.bezierCurveTo(350, 500, 200, 500, 200, 600);
	context.bezierCurveTo(200, 500,  50, 500,  50, 400);
	context.bezierCurveTo( 50, 300, 200, 300, 200, 400);
	context.stroke();
}