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

function move(id)
{
	swapBeginEndClass(id);
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