
// init canvas and resize it to full extent of containing canvas element
function initCanvas(id)
{
	var canvasElement = document.getElementById(id);
	if (canvasElement == null)
		return null;
	canvasElement.width = canvasElement.clientWidth;
	canvasElement.height = canvasElement.clientHeight;
	var context = canvasElement.getContext("2d");
	return context;
}