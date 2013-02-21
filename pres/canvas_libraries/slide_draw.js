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

var slide_draw_ready

// drawing for slide canvas: drawing pictures
function slide_canvas_images1_draw()
{
	var context = initCanvas("canvas-pictures1");
	// delay of canvas is not ready
	if (context === null || context.canvas === null || context.canvas.height == 0 || context.canvas.width == 0) { window.setTimeout(slide_canvas_images1_draw, 200); return; }
	
	var img = new Image();
	img.onload = function() { context.drawImage(img, 100, 100); };
	img.src = "../images/tile_user.png";
}

//drawing for slide canvas: drawing pictures
function slide_canvas_images2_draw()
{
	var context = initCanvas("canvas-pictures2");
	// delay of canvas is not ready
	if (context === null || context.canvas === null || context.canvas.height == 0 || context.canvas.width == 0) { window.setTimeout(slide_canvas_images2_draw, 200); return; }
	
	
	var data = "<svg    xmlns:dc='http://purl.org/dc/elements/1.1/'    xmlns:cc='http://creativecommons.org/ns#'    xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#'    xmlns:svg='http://www.w3.org/2000/svg'    xmlns='http://www.w3.org/2000/svg'    xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd'    xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape'    version='1.1'    width='606'    height='606'    id='svg2'    inkscape:version='0.48.2 r9819'    sodipodi:docname='littleguy static.svg'>   <sodipodi:namedview      pagecolor='#ffffff'      bordercolor='#666666'      borderopacity='1'      objecttolerance='10'      gridtolerance='10'      guidetolerance='10'      inkscape:pageopacity='0'      inkscape:pageshadow='2'      inkscape:window-width='678'      inkscape:window-height='723'      id='namedview30'      showgrid='false'      inkscape:zoom='0.52468612'      inkscape:cx='303.00806'      inkscape:cy='224.89636'      inkscape:window-x='0'      inkscape:window-y='0'      inkscape:window-maximized='0'      inkscape:current-layer='svg2' />   <metadata      id='metadata46'>     <rdf:RDF>       <cc:Work          rdf:about=''>         <dc:format>image/svg+xml</dc:format>         <dc:type            rdf:resource='http://purl.org/dc/dcmitype/StillImage' />         <dc:title />       </cc:Work>     </rdf:RDF>   </metadata>   <defs      id='defs4'>     <filter        color-interpolation-filters='sRGB'        id='gauss5'>       <feGaussianBlur          id='feGaussianBlur7'          stdDeviation='4' />     </filter>   </defs>   <g      transform='matrix(0.17364818,0.98480775,-0.98480775,0.17364818,682.16645,74.22209)'      id='surfboard'      style='stroke:#00ff00;stroke-width:0;stroke-opacity:0'>     <g        transform='translate(-120.27774,1.2040048)'        id='g3045'>       <path          d='m 397.28581,718.29757 c 45.67245,0 42.88765,-92.66815 52.05032,-142.35426 13.77844,-74.71583 12.5248,-152.49869 3.23323,-227.90404 -8.62587,-70.00299 -27.66555,-204.51851 -54.2734,-204.51851 -26.60785,0 -43.90641,135.96298 -52.50902,206.44647 -9.05589,74.19742 -11.2965,150.57492 1.38231,224.2398 8.62562,50.11558 4.44411,144.09054 50.11656,144.09054 z'          transform='translate(2,2)'          id='path11'          style='fill:#666666;filter:url(#gauss5)'          inkscape:connector-curvature='0' />       <path          d='m 397.28581,718.29757 c 45.67245,0 42.88765,-92.66815 52.05032,-142.35426 13.77844,-74.71583 12.5248,-152.49869 3.23323,-227.90404 -8.62587,-70.00299 -27.66555,-204.51851 -54.2734,-204.51851 -26.60785,0 -43.90641,135.96298 -52.50902,206.44647 -9.05589,74.19742 -11.2965,150.57492 1.38231,224.2398 8.62562,50.11558 4.44411,144.09054 50.11656,144.09054 z'          id='path13'          style='fill:#1cbaed'          inkscape:connector-curvature='0' />       <g          transform='translate(0.83645736,104.20421)'          id='redcircle'>         <path            d='m 426.28437,187.16653 a 28.789347,28.789347 0 1 1 -57.57869,0 28.789347,28.789347 0 1 1 57.57869,0 z'            transform='translate(1.0101525,-2.020305)'            id='path16'            style='fill:#ffffff'            inkscape:connector-curvature='0' />         <path            d='m 416.18286,189.18683 a 20.70813,20.70813 0 1 1 -41.41626,0 20.70813,20.70813 0 1 1 41.41626,0 z'            transform='translate(3.0304576,-4.0406102)'            id='path18'            style='fill:#e21e23'            inkscape:connector-curvature='0' />         <path            d='m 409.11178,186.15637 a 11.616755,11.616755 0 1 1 -23.23351,0 11.616755,11.616755 0 1 1 23.23351,0 z'            transform='translate(2.0203049,-1.0101525)'            id='path20'            style='fill:#000000'            inkscape:connector-curvature='0' />       </g>       <g          transform='translate(0.36375702,-11.141968)'          id='blackcircle'>         <path            d='m 428.30468,679.61591 a 29.294425,29.294425 0 1 1 -58.58885,0 29.294425,29.294425 0 1 1 58.58885,0 z'            transform='translate(-1.0101525,-3.0304576)'            id='path23'            style='fill:#000000'            inkscape:connector-curvature='0' />         <path            d='m 408.10163,663.95856 a 10.606605,10.606605 0 1 1 -21.21321,0 10.606605,10.606605 0 1 1 21.21321,0 z'            id='path25'            style='fill:#ffffff'            inkscape:connector-curvature='0' />       </g>     </g>   </g>   <g      transform='translate(-122.07296,-136.27013)'      id='littleguy'      style='stroke:#00ff00;stroke-width:0;stroke-opacity:0'>     <path        d='m 249.50768,527.08286 -1.01015,-196.97975 c -0.21241,-41.42075 35.35345,-102.18078 116.16754,-102.0254 78.79785,0.1515 112.47733,66.4553 130.30968,151.52288 l -55.55839,-1e-5 0,100.00511 c 0,24.24366 -25.25708,49.93465 -54.54824,49.49747 z'        transform='translate(2,2)'        id='path28'        style='fill:#666666;filter:url(#gauss5)'        inkscape:connector-curvature='0' />     <path        d='m 249.50768,527.08286 -1.01015,-196.97975 c -0.21241,-41.42075 35.35345,-102.18078 116.16754,-102.0254 78.79785,0.1515 112.47733,66.4553 130.30968,151.52288 l -55.55839,-1e-5 0,100.00511 c 0,24.24366 -25.25708,49.93465 -54.54824,49.49747 z'        id='path30'        style='fill:#e21e23'        inkscape:connector-curvature='0' />     <g        id='eye1'>       <path          d='m 414.16256,324.54727 a 54.54824,56.063468 0 1 1 -109.09648,0 54.54824,56.063468 0 1 1 109.09648,0 z'          transform='matrix(0.72222222,0,0,0.72222222,197.87766,85.690512)'          id='path4044'          style='fill:#ffd400'          inkscape:connector-curvature='0' />       <path          d='m 479.28572,320.04074 a 21.071428,21.071428 0 1 1 -42.14285,0 21.071428,21.071428 0 1 1 42.14285,0 z'          id='path4046'          style='fill:#000000'          inkscape:connector-curvature='0' />       <path          d='m 380.8275,320.00159 a 9.59645,9.0913735 0 1 1 -19.1929,0 9.59645,9.0913735 0 1 1 19.1929,0 z'          transform='matrix(0.72222222,0,0,0.72222222,197.87766,88.60873)'          id='path4048'          style='fill:#ffffff'          inkscape:connector-curvature='0' />     </g>     <path        d='m 332.25368,408.30527 90.42426,-1.43056 c -6.80007,21.45848 -36.56264,64.37548 -68.88753,64.37548 -32.32489,0 -29.39467,-40.9423 -21.53673,-62.94492 z'        id='mouth'        style='fill:#fdfdfd;stroke-width:0'        inkscape:connector-curvature='0' />     <g        id='eye2'>       <path          d='m 416.18284,325.05234 a 55.558392,55.558392 0 1 1 -111.11678,0 55.558392,55.558392 0 1 1 111.11678,0 z'          transform='translate(-2.0203076,-5.0507618)'          id='path38'          style='fill:#ffd400'          inkscape:connector-curvature='0' />       <path          d='m 387.89858,321.01175 a 29.294425,29.294425 0 1 1 -58.58885,0 29.294425,29.294425 0 1 1 58.58885,0 z'          transform='translate(1.0101524,-2.0203018)'          id='path40'          style='fill:#000000'          inkscape:connector-curvature='0' />       <path          d='m 381.83766,323.03204 a 11.11168,11.11168 0 1 1 -22.22336,0 11.11168,11.11168 0 1 1 22.22336,0 z'          transform='matrix(0.86363637,0,0,0.86363637,50.048465,39.504133)'          id='path42'          style='fill:#ffffff'          inkscape:connector-curvature='0' />     </g>   </g> </svg> ";
	var svg = new Blob([data], {type: "image/svg+xml;charset=utf-8"});
	var DOMURL = self.URL || self.webkitURL;
	var url = DOMURL.createObjectURL(svg);
	
	var img2 = new Image();
	var img3 = new Image();
	
	img2.onload = function() { if (img2.complete && img3.complete) syncDraw2(img2, img3, context); DOMURL.revokeObjectURL(url); };
	img3.onload = function() { if (img2.complete && img3.complete) syncDraw2(img2, img3, context); };
	img2.src = url;
	img3.src = "images/mag.png";
}

function syncDraw2(img1, img2, context)
{
	context.save();
	context.drawImage(img1, 440, 5, 300, 300);
	context.beginPath();
	context.arc(680, 310, 100, 0, 2*Math.PI);
	context.clip();
	context.drawImage(img1, -460, -720, 1500, 1500);
	context.restore();
	context.drawImage(img2, 570, 150, 300, 277);
}