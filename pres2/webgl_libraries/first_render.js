function firstRender(id)
{	
	// dimensions
	var canvascontainer = document.getElementById(id);
	// relaunch if not ready
	if (canvascontainer == null || canvascontainer.clientWidth == 0 || canvascontainer.clientHeight == 0 || canvascontainer.animation === -1) { window.setTimeout(function() {firstRender(id);}, 200); return; }
	
	// do nothing if already running
	if (canvascontainer.animation)
		return;
	else
		canvascontainer.animation = true;
	
	var width  = canvascontainer.clientWidth;
	var height = canvascontainer.clientHeight-2; // unfathomable bug: why do I get a scroll bar with the full height ???
	
	// renderer
	var renderer = new THREE.WebGLRenderer ({antialias: true});
	renderer.setSize(width, height);
	
	// glue to HTML element
	canvascontainer.appendChild(renderer.domElement);
	renderer.setClearColorHex(0x000000, 0);
	renderer.clear();
	
	// camera
	var camera = new THREE.PerspectiveCamera(35, width / height, 1, 3000);
	camera.position.z = 300;
	
	// scene
	var scene = new THREE.Scene();
	
	// lights
	var light1 = new THREE.DirectionalLight(0xffffff, 1);
	light1.position.set(1, 1, 0.3);
	scene.add(light1);
	
	var light2 = new THREE.DirectionalLight(0xffffff, 1);
	light2.position.set(-1, 1, -0.3);
	scene.add(light2);
	
	var light3 = new THREE.DirectionalLight(0xffffff, 0.7);
	light3.position.set(0.5, -0.5, 1);
	scene.add(light3);
	
	// textured cube
	switch (id)
	{
	
	case "three-model-render-container":
		firstLoadAndroid(scene);
		break;
	case "three-free-render-container":
		firstLoadAndroidTextured(scene);
		break;
	default:
		firstLoadCube(scene);
	}
	
	var t0 = new Date().getTime();
	
	var anim = function(t)
	{
		// when the canvas dies, abort animation loop
		if (canvascontainer.animation)
		{
			scene.traverse(function(object)
			{
				// models: slow rotation
				if (object instanceof THREE.Object3D && object.name.indexOf("mymodel") >= 0)
				{
					object.rotation.y = (t-t0)/1000 - Math.PI/2;
				};
			} );
		
			renderer.render(scene, camera);
			requestAnimationFrame(anim);
		}
	};
	requestAnimationFrame(anim);
}

//----------------------------------------------------------------------------------

function firstLoadAndroid(scene)
{	
	var loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis= true;
	loader.options.upAxis = 'Y';
	
	loader.load("androidmodels/Android.dae",
			function(collada)
			{
				var scale = new THREE.Vector3(3,3,3);
				var model = collada.scene;
				model.position.z = 0;
				model.position.y = -80;
				model.scale.copy(scale);
				//model.rotation.copy(rotation);
				model.name = "mymodel-android";
				scene.add(model);
			} );
}

//----------------------------------------------------------------------------------

function firstLoadAndroidTextured(scene)
{
	// this does not work yet ...
	// only the wireframe display kind of works
	
	var loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis= true;
	loader.options.upAxis = 'Y';
	var texture = THREE.ImageUtils.loadTexture('images/vibrant.jpg');
	
	//var material = new THREE.MeshLambertMaterial({map: texture});
	var material = new THREE.MeshBasicMaterial( { wireframe: true, color: "#FF0000" } );
	
	loader.load("androidmodels/Android.dae",
			function(collada)
			{
				var scale = new THREE.Vector3(3,3,3);
				var model = collada.scene;
				model.position.z = 0;
				model.position.y = -80;
				model.scale.copy(scale);
				model.name = "mymodel-android";
				scene.add(model);
				
				collada.scene.traverse(function(child)
				{
					// replace all materials by texture
					if (child.material)
					{
						//child.geometry.computeTangents();
						child.material = material;
					};
				} );
			} );
}

//----------------------------------------------------------------------------------

function firstLoadCube(scene)
{
	var texture = THREE.ImageUtils.loadTexture('images/vibrant.jpg');
	
	// textured cube
	var cube = new THREE.Mesh(
	        new THREE.CubeGeometry(95, 95, 95),
	        new THREE.MeshLambertMaterial({map: texture}) );
		cube.position.y = -7;
		cube.rotation.x = 0.5;
		cube.rotation.z = 0.5;
		cube.name = "mymodel-cube";
	scene.add(cube);
}

//----------------------------------------------------------------------------------

function killFirstRender(id)
{
	var canvascontainer = document.getElementById(id);
	canvascontainer.animation = -1; // dying (set this wether the animation is running or not)
	window.setTimeout(function()
	{
		// signal death of this animation
		delete canvascontainer.animation;
		if (canvascontainer.firstChild !== null)
			canvascontainer.removeChild(canvascontainer.firstChild);
	}, 300);
}

