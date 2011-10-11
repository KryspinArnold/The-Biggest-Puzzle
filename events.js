var level = 5;
var squareSize = 50;
var snapAmount = 10;
var downPageX = 0;
var downPageY = 0;
var downOffsetX = 0;
var downOffsetY = 0;
var leftMargin = 200;
var mouseDown = false;

/* Squares on the board */
function square(x, y, id)
{
	return '<rect class="square" id="' + id + '" x=' + (x + 0.5) + ' y=' + (y + 0.5) + ' width="' + squareSize + '" height="' + squareSize + '"/>';
}

/* One segment of the puzzle piece */
function segment(x, y, id)
{
	return '<rect class="segment" fill="url(#myLinearGradient1)" id="' + id + '" x = ' + (x + 0.5) + ' y = ' + (y + 0.5) + ' width="' + squareSize + '" height="' + squareSize + '" rx = 10 ry = 10 />';
}

function transform(piece, mouseMoveX, mouseMoveY)
{
	/* Works out how far to translate the piece */
	var translateX = ((downOffsetX + parseFloat(piece.attr('data-offsetX'))) - piece.attr('data-startX')) + mouseMoveX;
	var translateY = ((downOffsetY + parseFloat(piece.attr('data-offsetY'))) - piece.attr('data-startY')) + mouseMoveY;
	
	/* Works out how much to rotate the piece */
	var rotate = piece.attr('data-angle');
	
	/*$("#test1").html(downOffsetX + ', ' + downOffsetY);*/
	/*$("#test2").html(piece.attr('data-startX') + ', ' + piece.attr('data-startY'));*/
	$("#test3").html(mouseMoveX + ', ' + mouseMoveY);
	$("#test4").html(downPageX + ', ' + downPageY);
	$("#test5").html(translateX + ', ' + translateY);
	
	/* Snapping - Sometimes jQuery is REALLY cool */
	var snappingSquare = $(".square")
		.filter(function () {
			return Math.abs($(this).attr('x') - translateX) < snapAmount
			&& Math.abs($(this).attr('y') - translateY) < snapAmount;
		}).first();
	
	if (snappingSquare.length > 0)
	{
		translateX = snappingSquare.attr('x');
		translateY = snappingSquare.attr('y')
	}
	
	/* Set bounds for the piece */
	if (translateX < 0)
	{
		translateX = 0;
	}
	
	if (translateY < 0)
	{
		translateY = 0;
	}
	
	piece.attr('transform', 'translate(' + translateX + ', ' + translateY + ') rotate(' + rotate + ', ' + (squareSize / 2) + ', ' + (squareSize / 2) + ')');
}

$(document).ready(function() {

	/* Initialize the piece */
	var pieceInit = $("#piece0");
	pieceInit.attr('data-startX', pieceInit.offset().left);
	pieceInit.attr('data-startY', pieceInit.offset().top);
	pieceInit.attr('data-offsetX', 0);
	pieceInit.attr('data-offsetY', 0);
	
	/* Stop the Right-click context menu from showing */
	$(document).bind("contextmenu",function(e){
		return false;
	}); 
	
	/* Mouse down - Handles all the mouse clicks */
	$("#piece0").mousedown(function(e) {
		
		var piece = $("#piece0");
		
		/* Work out which mouse button was clicked */
		switch (e.which) {
			/* Left click for moving the piece */
			case 1:
				mouseDown = true;
			
				downPageX = e.pageX;
				downPageY = e.pageY;
				
				downOffsetX = piece.offset().left;
				downOffsetY = piece.offset().top;
				break;
			case 2:
				alert('Middle mouse button pressed');
				break;
			/* Right click for rotating the piece */
			case 3:
				downOffsetX = piece.offset().left;
				downOffsetY = piece.offset().top;
				
				piece.attr('data-angle', (parseInt(piece.attr('data-angle')) + 45));
				transform(piece, 0, 0);
				
				/* We need to store the amount that the offset changed, so we can rotate around the correct point */
				var oldOffsetX = parseFloat(piece.attr('data-offsetX'));
				var oldOffsetY = parseFloat(piece.attr('data-offsetY'));
				
				piece.attr('data-offsetX', oldOffsetX + (downOffsetX - piece.offset().left));
				piece.attr('data-offsetY', oldOffsetY + (downOffsetY - piece.offset().top));
				
				break;
			default:
				alert('You have a strange mouse');
		}
		
		
		/* Have to return false, else firefox treats it like draging an image */
		return false;
	});
	
	/* Mouse Up - Stops dragging the piece around */
	$(document).mouseup(function(e){
		mouseDown = false;
		
		/* Have to return false, else firefox treats it like dragging an image */
		return false;
	})

	/* Mouse Move - Drags the piece around */
	$(document).mousemove(function(e){
	
		if (mouseDown == false) return;
		
		transform($("#piece0"), (e.pageX - downPageX), (e.pageY - downPageY));
		
		/* Have to return false, else firefox treats it like draging an image */
		return false;
	});
});
