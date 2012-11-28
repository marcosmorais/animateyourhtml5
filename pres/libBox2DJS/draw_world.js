function drawWorldWireframe(world, context, scale) {
	for (var j = world.m_jointList; j; j = j.m_next) {
		drawJoint(j, context, scale);
	}
	for (var b = world.m_bodyList; b; b = b.m_next) {
		for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
			drawShape(s, context, scale);
		}
	}
}
function drawJoint(joint, context, scale) {
	var b1 = joint.m_body1;
	var b2 = joint.m_body2;
	var x1 = b1.m_position;
	var x2 = b2.m_position;
	var p1 = joint.GetAnchor1();
	var p2 = joint.GetAnchor2();
	context.strokeStyle = '#00eeee';
	context.beginPath();
	switch (joint.m_type) {
	case b2Joint.e_distanceJoint:
		context.moveTo(p1.x*scale, p1.y*scale);
		context.lineTo(p2.x*scale, p2.y*scale);
		break;

	case b2Joint.e_pulleyJoint:
		// TODO
		break;

	default:
		if (b1 == world.m_groundBody) {
			context.moveTo(p1.x*scale, p1.y*scale);
			context.lineTo(x2.x*scale, x2.y*scale);
		}
		else if (b2 == world.m_groundBody) {
			context.moveTo(p1.x*scale, p1.y*scale);
			context.lineTo(x1.x*scale, x1.y*scale);
		}
		else {
			context.moveTo(x1.x*scale, x1.y*scale);
			context.lineTo(p1.x*scale, p1.y*scale);
			context.lineTo(x2.x*scale, x2.y*scale);
			context.lineTo(p2.x*scale, p2.y*scale);
		}
		break;
	}
	context.stroke();
}
function drawShape(shape, context) {
	context.strokeStyle = '#000000';
	context.beginPath();
	switch (shape.m_type) {
	case b2Shape.e_circleShape:
		{
			var circle = shape;
			var pos = circle.m_position;
			var r = circle.m_radius;
			var segments = 16.0;
			var theta = 0.0;
			var dtheta = 2.0 * Math.PI / segments;
			// draw circle
			context.moveTo((pos.x + r)*scale, pos.y*scale);
			for (var i = 0; i < segments; i++) {
				var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
				var v = b2Math.AddVV(pos, d);
				context.lineTo(v.x*scale, v.y*scale);
				theta += dtheta;
			}
			context.lineTo((pos.x + r)*scale, pos.y*scale);
	
			// draw radius
			context.moveTo(pos.x*scale, pos.y*scale);
			var ax = circle.m_R.col1;
			var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
			context.lineTo(pos2.x*scale, pos2.y*scale);
		}
		break;
	case b2Shape.e_polyShape:
		{
			var poly = shape;
			var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
			context.moveTo(tV.x*scale, tV.y*scale);
			for (var i = 0; i < poly.m_vertexCount; i++) {
				var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
				context.lineTo(v.x*scale, v.y*scale);
			}
			context.lineTo(tV.x*scale, tV.y*scale);
		}
		break;
	}
	context.stroke();
}

