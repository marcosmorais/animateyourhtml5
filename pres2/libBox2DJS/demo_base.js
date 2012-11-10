function createWorldWithGravity() {
	var worldAABB = new b2AABB();
	worldAABB.minVertex.Set(-1000, -1000);
	worldAABB.maxVertex.Set(1000, 1000);
	var gravity = new b2Vec2(0, 100);
	var doSleep = true;
	var world = new b2World(worldAABB, gravity, doSleep);
	return world;
}

function createBall(world, r, x, y, fixed) {
	if (typeof(fixed) == 'undefined') fixed = false;
	var ballSd = new b2CircleDef();
	if (!fixed) ballSd.density = 1.0;
	ballSd.radius = r;
	ballSd.restitution = 0.5;
	ballSd.friction = 0.3;
	var ballBd = new b2BodyDef();
	ballBd.AddShape(ballSd);
	ballBd.position.Set(x,y);
	return world.CreateBody(ballBd);
}

function createBox(world, x, y, width, height, fixed) {
	if (typeof(fixed) == 'undefined') fixed = false;
	var boxSd = new b2BoxDef();
	if (!fixed) boxSd.density = 1.0;
	boxSd.restitution = 0.5;
	boxSd.friction = 0.3;
	boxSd.extents.Set(width/2, height/2);
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position.Set(x,y);
	return world.CreateBody(boxBd);
}

function SleepWorld(world)
{
	for (var b = world.GetBodyList(); b; b = b.GetNext())
	{
		b.m_flags |= b2Body.e_sleepFlag;
	}
}

function WakeWorld(world)
{
	for (var b = world.GetBodyList(); b; b = b.GetNext())
	{
		b.WakeUp();
	}
}

function IsWorldAsleep(world) 
{
	var asleep = true;
	for (var b = world.GetBodyList(); b; b = b.GetNext())
	{
		asleep = asleep && (b.IsSleeping() || b.IsStatic());
	}
	return asleep;
}
