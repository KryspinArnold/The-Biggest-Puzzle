function initialize() {

	/* Stop the Right-click context menu from showing */
	$(document).bind("contextmenu", function(e){
		return false;
	});
	
	var main = $("#main");
	
	/* Have to append svg because jQuery can't handle .html with svg */
	var append = '<svg id="svg" xmlns="http://www.w3.org/2000/svg" x=0 y=0 height=' + ((squareSize * level) + 80)
		+ ' width="100%" >';

	/* Creating dropshadow */
	/*append += '<filter id="dropshadow2" height="130%"></filter>';*/
		/*+ '<feGaussianBlur in="SourceAlpha" stdDeviation="3" />'
		+ '<feOffset dx="0" dy="0" result="offsetblur" id="feOffset"/>'
		+ '<feMerge>'
		+ '<feMergeNode /> '
		+ '<feMergeNode in="SourceGraphic"></feMergeNode>'
		+ '</feMerge>
		+'</filter>';*/
		
	/* Creating colour gradients */
	append += '<defs>';
	for (var i = 0; i < pieceData.length; i++)
	{
		append += '<linearGradient id="colorGradient' + i + '" x1="0%" y1="0%" 2="0%" y2="100%" spreadMethod="pad">'
			+ '<stop offset="0%" stop-color="' + colours[i].light + '" stop-opacity="1" />'
			+ '<stop offset="100%" stop-color="' + colours[i].dark + '" stop-opacity="1" />'
			+ '</linearGradient>';
	}
	append += '</defs>';
	
	/* Creating the squares for the board */
	for (var y = 0; y < level; y++)
	{
		for (var x = 0; x < level; x++)
		{
			var posX = ((x * squareSize) + 0.5) + leftMargin;
			var posY = ((y * squareSize) + 0.5) + topMargin;
			append += '<rect class="square" x=' + posX + ' y=' + posY
				+ ' width="' + squareSize + '" height="' + squareSize + '" />';
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
		
			append += '<rect class="segment" filter="url(#dropshadow)" fill="url(#colorGradient' + i + ')" x=' + (posX + 0.5) + ' y=' + (posY + 0.5) + ' width="' + squareSize + '" height="' + squareSize + '" rx=10 ry=10 />';
		}
		
		append += '</g>';
	}
	
	append += '</svg>';
	main.append(append);
	
	/*$('#dropshadow').innerHTML('<feOffset dx="0" dy="0" result="offsetblur"/>');
	$('#dropshadow').append('<feGaussianBlur in="SourceAlpha" stdDeviation="3" />');
	$('#dropshadow').append('<feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>');*/
	
	/*$('<feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>').insertAfter('#feOffset');	*/
	
	/* Add the Pieces to an Object */
	pieces = $(".piece");
	pieces.data('offsetX', 0);
	pieces.data('offsetY', 0);
	pieces.data('segOffsetX', 0);
	pieces.data('segOffsetY', 0);
	pieces.data('rotation', 0);
	pieces.data('corX', 0);
	pieces.data('corY', 0);
	
	/* Firefox puts some funny padding on the Rect when there is a border this means that the offset is not right */
	var firstSegment = pieces.first().children().first();
	var firefoxPadding = parseFloat(firstSegment.attr('x')) - firstSegment.offset().left;

	pieces.each(function(){
		/* Because of the way they are generated, some pieces are off the screen, so I have to shift them here */
		var leftOffset = $(this).offset().left;
		var segments = $(this).children();

		var segmentX = 0;
		var segmentY = 0;
		
		segments.each(function(){
			if (leftOffset < firefoxPadding)
			{
				$(this).attr('x', parseFloat($(this).attr('x')) - (leftOffset + firefoxPadding));
			}
			
			/* Get the highest x and y, so we can work out the height & width */
			if ($(this).attr('x') > segmentX)
			{
				segmentX = parseInt($(this).attr('x'));
			}
			if ($(this).attr('y') > segmentY)
			{
				segmentY = parseInt($(this).attr('y'));
			}
		});

		$(this).data('width', segmentX + squareSize);
		$(this).data('height', segmentY + squareSize);
		
		/* Set the starting offset of each piece */
		$(this).data('startX', $(this).offset().left);
		$(this).data('startY', $(this).offset().top);
	});
	
	var startingX = new Array(0, 0);
	var startingY = new Array(0, 0);
	var biggestHeight = new Array(0, 0);
	
	var leftOrRight = 0;
	var piecePadding = Math.floor(squareSize / 2);
	
	
	$("#test4").append(windowWidth);
	
	pieces.each(function(i, el){
	
		/* Add the padding for the next piece */
		startingX[leftOrRight] += piecePadding;
		
		var leftEdge = leftOrRight == 0 ? 0 : $(this).data('width');
		var rightEdge = leftOrRight == 1 ? 0 : $(this).data('width');

		$("#test5").append(" - [" + leftOrRight + ", " + i + "]:" + ((windowWidth - (squareSize * level)) / 2) + " " + (startingX[leftOrRight] + leftEdge));
		
		/* Check if the piece goes over the edge of the screen, then we start a new row */		
		if ((startingX[leftOrRight] + $(this).data('width')) > ((windowWidth - (squareSize * level)) / 2))
		{
			$("#test2").append(i);
			startingY[leftOrRight] += biggestHeight[leftOrRight] + piecePadding;
			biggestHeight[leftOrRight] = 0;
			startingX[leftOrRight] = piecePadding;		
		}
		
		/* Storing the biggest height of each row */
		if ($(this).data('height') > biggestHeight[leftOrRight])
		{
			biggestHeight[leftOrRight] = $(this).data('height');
		}
		
		var negative = leftOrRight == 0 ? -1 : 1;
		transform($(this), Math.floor((windowWidth + (negative * squareSize * level))/ 2) + (negative * (startingX[leftOrRight] + rightEdge))
		, topMargin + startingY[leftOrRight]);
		
		/* Add the width and padding on */
		startingX[leftOrRight] += $(this).data('width');

		$("#test4").append(" - [" + leftOrRight + ", " + i + "]:" + startingX[leftOrRight] + " " + startingY[leftOrRight] + " " + biggestHeight[leftOrRight]);
		
		/* If they are equal heights then the next piece goes on the shortest side */
		if (startingY[0] == startingY[1])
		{
			leftOrRight = (startingX[0] > startingX[1]) ? 1 : 0;
		}
		else
		/* Else put the next piece on the highest side */
		{
			leftOrRight = (startingY[0] > startingY[1]) ? 1 : 0;
		}
	});
	
	/* Either the height of the pieces on left/right or height of the board */
	var svgHeight = Math.max(startingY[0] + biggestHeight[0], startingY[1] + biggestHeight[1], (squareSize * level));
	
	$("#svg").attr('height', svgHeight + (topMargin * 2));
	
	$("#level").html("Level: " + level + " Pieces: " + pieces.length + " Max Piece Length: " + maxPieceLength);
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