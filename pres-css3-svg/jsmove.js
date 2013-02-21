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
function move(id)
{
	swapBeginEndClass(id);
	//document.getElementById(id).className = "end";
}

// swaps classes "begin" and "end" in the node with the specified HTML id.
// adds class "end" if none are found
function swapBeginEndClass(id)
{
	var nod = document.getElementById(id);
	if (nod != null)
	{
		var new_class = "";
		var found = false;
		for (var i=0; i<nod.classList.length; i++)
		{
			var clas = nod.classList[i];
			if (clas == "end")
			{
				clas = "begin";
				found = true;
			}
			else if (clas == "begin")
			{
				clas = "end";
				found = true;
			}
			new_class += " " + clas;
		}
		if (!found)
			new_class += " " + "end";
		nod.setAttribute("class", new_class);
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
