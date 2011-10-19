function initialize() {

	/* Stop the Right-click context menu from showing */
	$(document).bind("contextmenu", function(e){
		return false;
	});
	
	var main = $("#main");
	
	/* Have to append the whole svg to a div because jQuery can't handle html/append with svg elements */
	var append = '<svg id="svg" xmlns="http://www.w3.org/2000/svg" x=0 y=0 height="100%" width="100%" >';

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
			$("#test3").append("(" + posX + ", " + posY + ") ");
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
		
			append += '<rect class="segment" fill="url(#colorGradient' + i + ')" x=' + (posX + 0.5) + ' y=' + (posY + 0.5) + ' width="' + squareSize + '" height="' + squareSize + '" rx=10 ry=10 />';
		}
		
		append += '</g>';
	}
	
	append += '</svg>';
	main.append(append);
	
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

	pieces.each(function(i, el){
	
		/* Add the padding for the next piece */
		startingX[leftOrRight] += piecePadding;
		
		var leftEdge = leftOrRight == 0 ? 0 : $(this).data('width');
		var rightEdge = leftOrRight == 1 ? 0 : $(this).data('width');

		/* Check if the piece goes over the edge of the screen, then we start a new row */		
		if ((startingX[leftOrRight] + $(this).data('width')) > ((windowWidth - (squareSize * level)) / 2))
		{
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
	
	$("#level").html("<b>Level:</b> " + level);
	$("#piece_amount").html("<b>Pieces:</b> " + pieces.length);
	$("#piece_length").html("<b>Max Piece Length:</b> " + maxPieceLength);
	
};