/* Global Variables */
var level = 5;
var maxPieceLength = 4;
var squareSize = 50;
var pieces;
var squares = new Array();
var pieceData = new Array();
var freeSpaces = new Array();
var colours = new Array();
var baseLightColour = "CC";
var baseDarkColour = "66";
var snapAmount = 10;
var downPageX = 0;
var downPageY = 0;
var downOffsetX = 0;
var downOffsetY = 0;
var windowWidth = $(window).width();
var leftMargin = Math.floor((windowWidth - (squareSize * level))/ 2);
var topMargin = 40;
var movingPiece = null;

document.write('<script type="text/javascript" src="classes.js"></script>');
document.write('<script type="text/javascript" src="functions.js"></script>');
document.write('<script type="text/javascript" src="initialize.js"></script>');

$(document).ready(function() {

	create_squares();
	create_pieces();
	create_colours();
	initialize();
	
	/* Create a 2D array for all the squares on the board */
	/*for (var i = 0; i < level; i++)
	{
		squares[i] = new Array(level);
	}*/

	var test = "";
	
	for (var i = 0, li = pieceData.length; i < li; i++)
	{
		test += "(";
		
		for (var j = 0, lj = pieceData[i].length; j < lj; j++)
		{
			test += pieceData[i][j] + ", ";
		}
		
		test += ") ";
	}
	
	$("#test1").html(test);
	
	/* Mouse down - Handles all the mouse clicks */
	$(".segment").mousedown(function(e) {
		
		var segment = $(this);
		var piece = $(this).parent(".piece");

		/* Work out which mouse button was clicked */
		switch (e.which) {
			/* Left click for moving the piece */
			case 1:
				movingPiece = piece;
			
				downPageX = e.pageX;
				downPageY = e.pageY;
				
				downOffsetX = piece.offset().left;
				downOffsetY = piece.offset().top;
				
				piece.data('offsetX', (piece.data('segOffsetX') - piece.data('startX')) + piece.offset().left);
				piece.data('offsetY', (piece.data('segOffsetY') - piece.data('startY')) + piece.offset().top);
				
				/*$("#test1").html('Segment Offset ' + segment.offset().left + ', ' + segment.offset().top);
				$("#test2").html('Piece Offset ' + piece.offset().left + ', ' + piece.offset().top);
				$("#test3").html('Piece Data Offset ' + piece.data('offsetX') + ', ' + piece.data('offsetY'));
				$("#test4").html('Piece Data Segment ' + piece.data('segmentX') + ', ' + piece.data('segmentY'));*/

				break;
			case 2:
				alert('Middle mouse button pressed');
				break;
			/* Right click for rotating the piece */
			case 3:
				var corX = parseFloat(segment.attr('x')) + Math.floor(squareSize / 2);
				var corY = parseFloat(segment.attr('y')) + Math.floor(squareSize / 2);
				
				piece.data('corX', corX);
				piece.data('corY', corY);
							
				piece.data('rotation', piece.data('rotation') + 90);

				/* This is a bit complicated... I am getting the coordinates of the segment that you click on,
				subtracting the start cordinates so we get the cordinates in the svg, then subtracting the 
				coordinates of the segment inside the piece so we can get the coordinates that the piece needs to be translated */
				
				piece.data('offsetX', (segment.offset().left - piece.data('startX')) - parseFloat(segment.attr('x')));
				piece.data('offsetY', (segment.offset().top - piece.data('startY')) - parseFloat(segment.attr('y')));
				
				/*$("#test1").html('Segment Offset ' + segment.offset().left + ', ' + segment.offset().top);
				$("#test2").html('Piece Offset ' + piece.offset().left + ', ' + piece.offset().top);
				$("#test3").html('Piece Data Offset ' + piece.data('offsetX') + ', ' + piece.data('offsetY'));
				$("#test4").html('Piece Data Segment ' + piece.data('segmentX') + ', ' + piece.data('segmentY'));
				$("#test5").html('Segment XY ' + parseFloat(segment.attr('x')) + ', ' + parseFloat(segment.attr('y')));*/
				
				transform(piece, piece.data('offsetX'), piece.data('offsetY'));
				
				piece.data('segOffsetX', ((segment.offset().left) - parseFloat(segment.attr('x')) - piece.offset().left));
				piece.data('segOffsetY', ((segment.offset().top) - parseFloat(segment.attr('y')) - piece.offset().top));
				
				break;
		}
		
		
		/* Have to return false, else firefox treats it like draging an image */
		return false;
	});
	
	/* Mouse Up - Stops dragging the piece around */
	$(document).mouseup(function(e){
		movingPiece = null;
		
		/* Have to return false, else firefox treats it like dragging an image */
		return false;
	})

	/* Mouse Move - Drags the piece around */
	$(document).mousemove(function(e){
	
		if (movingPiece == null) return;
		
		var translateX = (e.pageX - downPageX) + movingPiece.data('offsetX');
		var translateY = (e.pageY - downPageY) + movingPiece.data('offsetY');

		transform(movingPiece, translateX, translateY);
				
		/* Have to return false, else firefox treats it like draging an image */
		return false;
	});
});