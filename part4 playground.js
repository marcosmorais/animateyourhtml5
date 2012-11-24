// the physical world
var physicalWorld = null;
// where to draw the world
var drawingCanvas = null;

var scale = 50;

function startup()
{
	drawingCanvas = document.getElementById('canvas').getContext('2d');
	
	test_draw(drawingCanvas);
	
	// physicalWorld = setupWorld();
	// drawWorldIn(physicalWorld, drawingCanvas);
}

function test_draw(canvas)
{
	// experiment with drawing instructions

	canvas.save();
	canvas.lineWidth = 3;
	canvas.strokeStyle = '#FF0000'; // red
	canvas.beginPath();
	canvas.moveTo(100, 100);
	canvas.lineTo(200, 200);
	canvas.lineTo(100, 200);
	canvas.lineTo(100, 100);
	canvas.stroke();
	var tile = new Image();
	tile.src = 'images/tile_bberry.png';
	canvas.translate(400, 200);
	canvas.rotate(0.5);
	canvas.drawImage(tile, -270/2, -270/2);
	canvas.restore();
}

function drawWorldIn(world, canvas)
{	
	// erase canvas
	canvas.clearRect(0,0,drawingCanvas.canvas.clientWidth, drawingCanvas.canvas.clientHeight);
	
	// draw our tiles: those that have the 'image' property set
	for (var b = world.GetBodyList(); b; b = b.GetNext())
	{
		if (typeof(b.image) != 'undefined')
		{
			canvas.save();
			var tile = new Image();
			tile.src = b.image;
			var posV = b.GetCenterPosition();
			canvas.translate(posV.x*scale, posV.y*scale);
			canvas.rotate(b.GetRotation());
			canvas.drawImage(tile, -tile.width/2, - tile.height/2);
			canvas.restore();
		}
	}
	
	// wireframes for debugging
	drawWorldWireframe(world, canvas, scale);
}

function setupWorld()
{
	var world = createWorldWithGravity();
	
	// add a tile body
	var tile;
	var size = 270;
	tile = createBox(world, 200/scale, 200/scale, size/scale, size/scale); // center_x, center_y, width, height
	// tile.SetCenterPosition(tile.GetCenterPosition(), -0.3); // rotate it  in box2D
	tile.image = "images/tile_bberry.png"; // adding custom property to the object: its image
	
	SleepWorld(world); // initially, do not run the physics
	return world;
}

function run()
{
	WakeWorld(physicalWorld);
	runWorld();
	runAnimation();
}

function runWorld()
{
	// starts a loop that moves the physical simulation of the world forward
	// does nothing if no objects are moving so as to preserve the battery
	// the world is updated 60 times per second.
	if (!IsWorldAsleep(physicalWorld))
	{
		physicalWorld.Step(1.0/50, 1);
		setTimeout(runWorld, 1000/50);
	}
}

function runAnimation()
{
	// starts a loop that displays the state of the world
	// does nothing if no objects are moving so as to preserve the battery
	// the display is updated as often as the browser sees fit thanks to requestAnimationFrame
	if (!IsWorldAsleep(physicalWorld))
	{
		drawWorldIn(physicalWorld, drawingCanvas);
		webkitRequestAnimationFrame(runAnimation);
	}
}

