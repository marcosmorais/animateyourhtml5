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

//document.addEventListener('DOMContentLoaded', handleDomLoaded, false);

window.setTimeout(windBuffet, 1000);

function mix (a0, a1, p)
{
    return (p*a0 + (1-p)*a1);
}

function skewrand(center, spread)
{
    var a = spread * (Math.random() - 0.5) + center;
    return a;
}

function windBuffet()
{
    dir = 1;
    force = 0.8;
    // dir = 0: the wind blows from the bottom left
    // dir = 1: the wind blows from the bottom right
    // force: wind strength between 0 and 1, also influences buffeting speed
    var center = mix (0.2, 0.7, force);
    var spread = 0.25;
    var x0 = 1.0;
    var y0 = 1.0;
    var a0;
    if (dir < 0.5)
        a0 = mix (90, 180, 2*dir);
    else
        a0 = mix (180, 270, 2*(dir-0.5));

    var x1 = mix (0.2, 0.0, dir);
    var y1 = mix (0.3, -0.2, dir);
    var a1 = mix (240, 120, dir);

    var p = skewrand(center, spread);
    var ex = 0.3 * (x0 - x1) * (2.0 * skewrand(center, spread) -1);
    var ey = 0.3 * (y0 - y1) * (2.0 * skewrand(center, spread) -1);
    var ea = 0.3 * (a0 - a1) * (2.0 * skewrand(center, spread) -1);
    var t = skewrand(mix(0.2, 0.4, force), 0.2);
    var x = mix(x0, x1, p) + ex;
    var y = mix(y0, y1, p) + ey;
    var a = mix(a0, a1, p) + ea;
    var elem = document.getElementById('vibrant');
    elem.style['webkitFilter'] = "custom(url(curl.vs) mix(url(curl.fs) normal source-atop), 50 50 border-box, transform perspective(1000) scale(1) rotateX(0deg) rotateY(0deg) rotateZ(0deg), curlRadius 0.1, bleedThrough 0.5, curlPosition "+ x + " " + y + ", curlDirection " + a + ")";
    elem.style['webkitTransition'] = t + "s ease-out";
    window.setTimeout(windBuffet, t*900);
}