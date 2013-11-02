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

/*
 * This shader is largely based on XBPageCurl.
 * From: https://github.com/xissburg/XBPageCurl
 *
 * XBPageCurl's copyright notice and license is included below.
 */

/*
 *  Copyright (C) 2011 xissburg, http://xissburg.com
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 */

precision mediump float;

// Built-in attributes

attribute vec4 a_position;
attribute vec2 a_texCoord;

// Built-in uniforms

uniform mat4 u_projectionMatrix;

// Uniforms passed in from CSS

uniform mat4  transform;
uniform vec2  curlPosition;
uniform float curlDirection;
uniform float curlRadius;
uniform float phase;
uniform float flutterAmp;  // flutter amplitude as a fraction of the curlRadius

// Varyings

varying vec3  v_normal;
varying float v_gradient;
varying float v_curl; // 1.0 if vertex in the curl, 0.0 otherwise

// Constants

const float PI = 3.1415926;

// Helper functions

float rad(float deg)
{
    return deg * PI / 180.0;
}

// Main

void main()
{
    vec4 position = a_position;

    // Turn the curl direction into a vector.
    float radCurlDirection = rad(curlDirection);
    vec2 curlDirection = normalize(vec2(cos(radCurlDirection), sin(radCurlDirection)));

    // normal to the curl direction (n)
    vec2 n = vec2(curlDirection.y, -curlDirection.x);
    vec2 w = position.xy - curlPosition;
    // distance to the curl axis (d)
    float d = dot(w, n);

    // Projection of vertex on the curl axis (center)
    vec3 center = vec3(position.xy - n*d, curlRadius);

    // Vertex rolled onto the curl (v1)
    float dr = d/(PI*curlRadius);
    float s = sin(PI*dr);
    float c = cos(PI*dr);
    vec3 v1 = vec3(s*n.x, s*n.y, -c)*curlRadius + center;

    // Vertex beyond the curl (v2)
    vec3 v2;
    v2.xy = position.xy - n * (2.0*d - PI*curlRadius);
    v2.z  = 2.0*curlRadius;

    // the coordinates of the original div's ranges are [-0.5 .. 0.5][-0.5 .. 0.5]
    // modify position using circular sine wave
    float amp = mix(0.0, flutterAmp, clamp(d/PI/curlRadius -1.0, 0.0, 1.0));
    float frq1 = 20.0 / 2.0 / PI;
    float frq2 = 23.0 / 2.0 / PI;
    float frq3 = 17.5 / 2.0 / PI;
    float frq4 = 13.5 / 2.0 / PI;
    vec2 corner1 = vec2(-1, 1);
    vec2 corner2 = vec2(1, 1);
    vec2 corner3 = vec2(-0.5, -0.5);
    vec2 corner4 = vec2(0.5, -0.5);
    vec3 n2 = vec3(0.0, 0.0, -1.0);
    // approximated normal, since the amplitude depends from the position, the real derivation should be more complex
    v2.z += amp*curlRadius * sin (2.0*PI * (frq1 * length(position.xy - corner1) + phase));
    n2.x += amp*curlRadius * 2.0 * PI * frq1 * 2.0 * (position.x - corner1.x) / length(position.xy - corner1) * cos (2.0*PI * (frq1 * length(position.xy - corner1) + phase));
    n2.y += amp*curlRadius * 2.0 * PI * frq1 * 2.0 * (position.y - corner1.y) / length(position.xy - corner1) * cos (2.0*PI * (frq1 * length(position.xy - corner1) + phase));
    v2.z += amp*curlRadius * sin (2.0*PI * (frq2 * length(position.xy - corner2) + phase));
    n2.x += amp*curlRadius * 2.0 * PI * frq2 * 2.0 * (position.x - corner2.x) / length(position.xy - corner2) * cos (2.0*PI * (frq2 * length(position.xy - corner2) + phase));
    n2.y += amp*curlRadius * 2.0 * PI * frq2 * 2.0 * (position.y - corner2.y) / length(position.xy - corner2) * cos (2.0*PI * (frq2 * length(position.xy - corner2) + phase));
    v2.z += amp*curlRadius * sin (2.0*PI * (frq3 * length(position.xy - corner3) + phase));
    n2.x += amp*curlRadius * 2.0 * PI * frq3 * 2.0 * (position.x - corner3.x) / length(position.xy - corner3) * cos (2.0*PI * (frq3 * length(position.xy - corner3) + phase));
    n2.y += amp*curlRadius * 2.0 * PI * frq3 * 2.0 * (position.y - corner3.y) / length(position.xy - corner3) * cos (2.0*PI * (frq3 * length(position.xy - corner3) + phase));
    v2.z += amp*curlRadius * sin (2.0*PI * (frq4 * length(position.xy - corner4) + phase));
    n2.x += amp*curlRadius * 2.0 * PI * frq4 * 2.0 * (position.x - corner4.x) / length(position.xy - corner4) * cos (2.0*PI * (frq4 * length(position.xy - corner4) + phase));
    n2.y += amp*curlRadius * 2.0 * PI * frq4 * 2.0 * (position.y - corner4.y) / length(position.xy - corner4) * cos (2.0*PI * (frq4 * length(position.xy - corner4) + phase));
    n2 = normalize(n2);

    // 3 cases:
    // d < 0.0        => the vertex is not curled      br1=0 br2=0
    // 0.0 < d < PI*R => the vertex is on the curl     br1=1 br2=0
    // d > PI*R       => the vertex is past the curl   br1=1 br2=1
    float br1 = clamp(sign(d), 0.0, 1.0);
    float br2 = clamp(sign(d - PI*curlRadius), 0.0, 1.0);

    // select the correct one
    vec4 v = mix(position, vec4(v1, a_position.w), br1);
    v = mix(v, vec4(v2, a_position.w), br2);

    v_normal = mix(vec3(0.0, 0.0, 1.0), (center - v.xyz)/curlRadius, br1);
    v_normal = mix(v_normal, n2, br2);

    // Scale the z axis appropriately for perspective values around 1000.
    v.z *= 500.0;

    // Position the vertex.
    gl_Position = u_projectionMatrix * transform * v;

    // Pass the backface gradient intensity to the fragment shader.
    vec2 vw = v.xy - curlPosition;
    float vd = dot(vw, -n);
    v_gradient = -vd/curlRadius;
}
