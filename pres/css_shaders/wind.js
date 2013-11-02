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

var windBuffetStop = new Object;
var rotHand = false;
var rotHandState = 1;
var windDir = new Object;
var windForce = new Object;
var windPhase = 0;

function windStop(id)
{
    windBuffetStop[id] = true;
    windBuffet(id);
}

function windStart(id, dir, force)
{
    windBuffetStop[id] = false;
    windBuffet(id, dir, force);
}

function mix (a0, a1, p)
{
    return (p*a0 + (1-p)*a1);
}

function skewrand(center, spread)
{
    var a = spread * (Math.random() - 0.5) + center;
    return a;
}
function setWind(id, dir, force)
{
    windDir[id] = dir;
    windForce[id] = force;
}
function increaseWindForce(id)
{
    windForce[id] += 0.01;
    if (windForce[id] > 1)
        windForce[id] = 1;
}
function decreaseWindForce(id)
{
    windForce[id] -= 0.01;
    if (windForce[id] < 0)
        windForce[id] = 0;
}
function windBuffet(id)
{
    // good default values:
    // windDir = 1;
    // windForce = 0.8;

    // windDir = 0: the wind blows from the bottom left
    // windDir = 1: the wind blows from the bottom right
    // windForce: wind strength between 0 and 1, also influences buffeting speed
    var center = mix (0.2, 0.7, windForce[id]);
    var spread = 0.2;
    var x0 = 1.0;
    var y0 = 1.0;
    var a0;
    if (windDir[id] < 0.5)
        a0 = mix (90, 180, 2*windDir[id]);
    else
        a0 = mix (180, 270, 2*(windDir[id]-0.5));

    var x1 = mix (0.2, 0.0, windDir[id]);
    var y1 = mix (0.3, -0.2, windDir[id]);
    var a1 = mix (240, 120, windDir[id]);

    var p = skewrand(center, spread);
    var ex = 0.3 * (x0 - x1) * (2.0 * skewrand(center, spread) -1);
    var ey = 0.3 * (y0 - y1) * (2.0 * skewrand(center, spread) -1);
    var ea = 0.3 * (a0 - a1) * (2.0 * skewrand(center, spread) -1);
    var t = skewrand(mix(0.3, 0.6, windForce[id]), 0.1);
    var x = mix(x0, x1, p) + ex;
    var y = mix(y0, y1, p) + ey;
    var a = mix(a0, a1, p) + ea;
    var elem = document.getElementById(id);
    if (windBuffetStop[id])
    {
        x = 1.0;
        y = 1.0;
        a = 180;
        t = 1;
    }
    windPhase += 1;
    elem.style['webkitFilter'] = "custom(url(../pres/css_shaders/curl.vs) mix(url(../pres/css_shaders/curl.fs) normal source-atop), 150 150 border-box, transform perspective(1000) scale(1) translateZ(-280px) rotateX(0deg) rotateY(0deg) rotateZ(0deg), curlRadius 0.1, bleedThrough 0.3, curlPosition "+ x + " " + y + ", curlDirection " + a + ",phase "+windPhase+" ,lightEffectsIntensity 1, flutterAmp 0.15)";
    elem.style['transition'] = t + "s ease-out";
    if (!windBuffetStop[id])
        window.setTimeout(function(){windBuffet(id)}, t*1000);
}

function startFan(id)
{
    var elem = document.getElementById(id);
    elem.style.background = "url('images/fan.gif')";
    elem.style.opacity = 1;
    fanPosition(elem, 0);
    fanMouseOn(elem);
}

function stopFan(id)
{
    var elem = document.getElementById(id);
    elem.style.background = "url('images/fanstatic.png')";
    elem.style.opacity = 0;
    fanMouseOff(elem);
}
function fanMouseOn(elem)
{
    elem.parentNode.onmousemove = function(e)
    {
        // acceptable range: 0 - 1000
        // fan movement range: -100 - 900
        var x = e.offsetX;
        fanPosition(elem, x);
    }
    elem.parentNode.onmousewheel = function(e)
    {
         var x = e.deltaY;
         if (x<0)
            increaseWindForce('leaf');
         else
            decreaseWindForce('leaf');
    }
}
function fanPosition(elem, x)
{
    // x in [0..1000]
    if (x<0)
        x = 0;
    if (x>1000)
        x = 1000;
    elem.style.left = x-100 + "px";
    if (x < 333)
    {
        elem.classList.remove('fanright');
        elem.classList.remove('fancenter');
        elem.classList.add('fanleft');
    }
    else if (x<666)
    {
        elem.classList.remove('fanright');
        elem.classList.add('fancenter');
        elem.classList.remove('fanleft');
    }
    else
    {
        elem.classList.add('fanright');
        elem.classList.remove('fancenter');
        elem.classList.remove('fanleft');
    }
    setWind('leaf', (1000-x)/1000, windForce['leaf']);
}
function fanMouseOff(elem)
{
    elem.parentNode.onmousemove = null;
    elem.parentNode.onmousewheel = null;
}
