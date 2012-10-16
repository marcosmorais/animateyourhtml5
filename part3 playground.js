// the set of ongoing animations
var animations = new Object;

//move an HTML object with smooth animation
//id:       the HTML id of the object
//x, y:     final position
//duration: time of the animation in milliseconds
function move_to (id, x, y, duration)
{
	/*  TODO: register the parameters of the animation somewhere
	 * hint: you can use the "animations" object defined above
	 * and key each animation by its id using:
	 * animations[id] = new Object;
	 * animations[id].my_parameter = my_value
	 * for example; to save the starting time of the animation
	 * use:
	 * animations[id].starttime = new Date().getTime();*/
	
	webkitRequestAnimationFrame(on_move);
}

function on_move(time)
{
	var need_another_frame = false;
	
	/*TODO: iterate on all ongoing animations
	 * and move tiles around using (nod is an HTMLNodeElement):
	 * nod.style.left = <new position x> + "px";
	 * nod.style.top  = <new position y> + "px";
	 * 
	 * the current position of a tile can be read using:
	 * nod.offsetLeft
	 * nod.offsetTop
	 * */
	
	/* hint: you can iterate on all objects created in "animations"
	 * using:
	 * for (var id in animations) {}
	 * When an animation is finished, you can remove it from the set
	 * using:
	 * delete animations[id] */
	
	if (need_another_frame)
		webkitRequestAnimationFrame(on_move);
}


