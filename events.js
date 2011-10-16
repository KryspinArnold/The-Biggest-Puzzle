function initialize() {

	/* Stop the Right-click context menu from showing */
	$(document).bind("contextmenu", function(e){
		return false;
	});
	
	$("#level").html("Level: " + level);

	var main = $("#main");
	
	/* Have to append svg because jQuery can't handle .html with svg */
	var append = '<svg id="svg" xmlns="http://www.w3.org/2000/svg" x=0 y=0 height=' + ((squareSize * level) + 1)
		+ ' width="100%" >'; /*' + (((squareSize * level) + leftMargin) + 1) + '>';*/

	/* Creating linear gradients */
	append += '<defs>';
	for (var i = 0; i < pieceData.length; i++)
	{
		append += '<linearGradient id="colorGradient' + i + '" x1="0%" y1="0%" 2="0%" y2="100%" spreadMethod="pad">'
			+ '<stop offset="0%" stop-color="' + colours[i].light + '" stop-opacity="1"/>'
			+ '<stop offset="100%" stop-color="' + colours[i].dark + '" stop-opacity="1"/>'
			+ '</linearGradient>';
	}
	append += '</defs>';
	
	/* Creating the squares for the board */
	for (var y = 0; y < level; y++)
	{
		for (var x = 0; x < level; x++)
		{
			var posX = ((x * squareSize) + 0.5) + leftMargin;
			var posY = ((y * squareSize) + 0.5);
			append += '<rect class="square" x=' + posX + ' y=' + posY
				+ ' width="' + squareSize + '" height="' + squareSize + '"/>';
		}
	}
	
	/* Create all the pieces */
	for (var i = 0, li = pieceData.length; i < li; i++)
	{
		append += '<g class="piece">';
	
		for (var j = 0, lj = pieceData[i].length; j < lj; j++)
		{
			/* Base the position of each segment in the piece off the first segment */
			var posX = (squares[pieceData[i][j]].x - squares[pieceData[i][0]].x) * squareSize;
			var posY = (squares[pieceData[i][j]].y - squares[pieceData[i][0]].y) * squareSize;
		
			append += '<rect class="segment" fill="url(#colorGradient' + i + ')" x = ' + (posX + 0.5) + ' y = ' + (posY + 0.5) + ' width="' + squareSize + '" height="' + squareSize + '" rx = 10 ry = 10 />';
		}
		
		append += '</g>';
	}
	
	append += '</svg>';
	main.append(append);
	
	/* Add the Pieces to an Object */
	pieces = $(".piece");
	pieces.data('offsetX', 0);
	pieces.data('offsetY', 0);
	pieces.data('rotation', 0);
	pieces.data('corX', 0);
	pieces.data('corY', 0);
	pieces.data('segmentX', 0);
	pieces.data('segmentY', 0);
	
	/* Firefox puts some funny padding on the Rect when there is a border this means that the offset is not right */
	var firstSegment = pieces.first().children().first();
	var firefoxPadding = parseFloat(firstSegment.attr('x')) - firstSegment.offset().left;

	pieces.each(function(){
		/* Because of the way they are generated, some pieces are off the screen, so I have to shift them here */
		var leftOffset = $(this).offset().left;
		
		if (leftOffset < firefoxPadding)
		{
			var segments = $(this).children();
			segments.each(function(){
				$(this).attr('x', parseFloat($(this).attr('x')) - (leftOffset + firefoxPadding));
			});
		}

		/* Set the starting offset of each piece */
		$(this).data('startX', $(this).offset().left);
		$(this).data('startY', $(this).offset().top);
	});
};

$(document).ready(function() {

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
				
				piece.data('offsetX', (piece.data('segmentX') - piece.data('startX')) + piece.offset().left);
				piece.data('offsetY', (piece.data('segmentY') - piece.data('startY')) + piece.offset().top);
				
				$("#test1").html('Segment Offset ' + segment.offset().left + ', ' + segment.offset().top);
				$("#test2").html('Piece Offset ' + piece.offset().left + ', ' + piece.offset().top);
				$("#test3").html('Piece Data Offset ' + piece.data('offsetX') + ', ' + piece.data('offsetY'));
				$("#test4").html('Piece Data Segment ' + piece.data('segmentX') + ', ' + piece.data('segmentY'));

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
				
				$("#test1").html('Segment Offset ' + segment.offset().left + ', ' + segment.offset().top);
				$("#test2").html('Piece Offset ' + piece.offset().left + ', ' + piece.offset().top);
				$("#test3").html('Piece Data Offset ' + piece.data('offsetX') + ', ' + piece.data('offsetY'));
				$("#test4").html('Piece Data Segment ' + piece.data('segmentX') + ', ' + piece.data('segmentY'));
				$("#test5").html('Segment XY ' + parseFloat(segment.attr('x')) + ', ' + parseFloat(segment.attr('y')));
				
				transform(piece, piece.data('offsetX'), piece.data('offsetY'));
				
				piece.data('segmentX', ((segment.offset().left) - parseFloat(segment.attr('x')) - piece.offset().left));
				piece.data('segmentY', ((segment.offset().top) - parseFloat(segment.attr('y')) - piece.offset().top));
				
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