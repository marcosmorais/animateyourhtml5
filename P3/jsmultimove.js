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

// the set of ongoing animations
var animations = new Object;

// move an HTML object with smooth animation
// id:         the HTML id of the object
// relx, rely: the translation vector
// duration:   time of the animation in milliseconds
function move (id, relx, rely, duration)
{
	if (relx == 0 && rely == 0)
		return;
	
	nod = document.getElementById(id);
	if (nod != null)
	{
		// define new animation
		animations[id] = new Object;
		animations[id].node = nod; // the HTML object to animate
		animations[id].start = new Date().getTime(); // the starting time of the animation
		animations[id].duration  = duration; // the duration of the animation
		animations[id].relx = relx; // the target offset
		animations[id].rely = rely;
		animations[id].startx = nod.offsetLeft; // the starting position 
		animations[id].starty = nod.offsetTop;
		
		requestAnimationFrame(on_move);
	}
}

function on_move(time)
{
	var need_another_frame = false;
	
	// loop on all ongoing animations
	for (var id in animations)
	{	
		var nod = animations[id].node;
		if (nod != null)
		{	
			// test if the animation is finished
			// if so, adjust the last position to be exactly the target position
			var done = false;
			if ((time - animations[id].start) >= animations[id].duration)
			{
				time = animations[id].start + animations[id].duration;
				done = true;
			}
			
			// modify the position according to where we are in the animation (t between 0 and 1)
			var t = (time - animations[id].start) / animations[id].duration;
			
			// ---jitter added for a bit of extra fun, you can ignore it
			var sinewave = 30*Math.sin(3*Math.PI*t);
			var norm = Math.sqrt(Math.pow(animations[id].relx, 2), Math.pow(animations[id].rely, 2));
			var jitterx = -sinewave * animations[id].rely / norm;
			var jittery = sinewave * animations[id].relx / norm;
			// ---end of jitter calculation
			// linear path
			nod.style.left = animations[id].startx + t * animations[id].relx + jitterx + "px";
			nod.style.top  = animations[id].starty + t * animations[id].rely + jittery + "px";
			
			// when this animation is finished, remove it from the animation set
			// otherwise, make sure a new animation frame is requested
			if (done)
				delete animations[id];
			else
				need_another_frame = true;
		}
	}
	
	if (need_another_frame)
		requestAnimationFrame(on_move);
}

//move an HTML object with smooth animation
//id:       the HTML id of the object
//x, y:     final position
//duration: time of the animation in milliseconds
function move_to (id, x, y, duration)
{
	nod = document.getElementById(id);
	if (nod != null)
		move (id, x - nod.offsetLeft, y - nod.offsetTop, duration);
}
