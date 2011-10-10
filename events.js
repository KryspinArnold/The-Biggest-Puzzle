var level = 5;
var squareSize = 50;
var mouseOffsetX = 0;
var mouseOffsetY = 0;
var mouseDown = false;

function square(x, y, id)
{
	return '<rect class="square" id="' + id + '" x = ' + (x + 0.5) + ' y = ' + (y + 0.5) + ' width="' + squareSize + '" height="' + squareSize + '"/>';
}

function piece(x, y, id)
{
	return '<rect class="piece" id="' + id + '" x = ' + (x + 0.5) + ' y = ' + (y + 0.5) + ' width="' + squareSize + '" height="' + squareSize + '" rx = 10 ry = 10 />';
}

$(document).ready(function() {
	/* Set the size of the board */
	$("#main").width((squareSize * level) + 'px'); 

	/* Create a function to capture mouse down */
	$("#HelloWorld").mousedown(function(e) {
		mouseDown = true;
		
		mouseOffsetX = e.pageX;
		mouseOffsetY = e.pageY;
		
		$('#test').html((e.pageX) + ', ' + (e.pageY));
		
		/* Have to return false, else firefox treats it like draging an image */
		return false;
	});
	
	/* */
	$(document).mouseup(function(e){
		mouseDown = false;
		
		/* Have to return false, else firefox treats it like dragging an image */
		return false;
	})

	$(document).mousemove(function(e){
	
		$('#test2').html(e.pageX + ' ' + e.pageY + ' ' + mouseOffsetX);
	
		if (mouseDown == false) return;

		var oldX = parseFloat($("#HelloWorld").attr('x'));
		var oldY = parseFloat($("#HelloWorld").attr('y'));
		
		/*$("#test").html((oldX + (mouseOffsetX - e.pageX)) + ' ' + (oldY + (mouseOffsetY - e.pageY)));*/
		
		$("#HelloWorld").attr('x', (oldX + (e.pageX - mouseOffsetX)));
		$("#HelloWorld").attr('y', (oldY + (e.pageY - mouseOffsetY)));
		
		mouseOffsetX = e.pageX;
		mouseOffsetY = e.pageY;
		
		/* Have to return false, else firefox treats it like draging an image */
		return false;
	});
});
