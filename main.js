/* Global Variables */
var level = 5;
var maxPieceLength = 4;
var squareSize;
var pieces;
var board;
var segmentXY; /* The XY coordinates of the segments of a piece relative to its offset */
var squareXY;
var pieceData;
var squareData;
var freeSpaces;
var colours;
var baseLightColour = "AA"; /*"CC";*/
var baseDarkColour = "66";
var snapAmount = 10;
var downPageX = 0;
var downPageY = 0;
var downOffsetX = 0;
var downOffsetY = 0;
var topMargin = 40;
var movingPiece = null;
var svgHeight;
var initializing = true;

document.write('<script type="text/javascript" src="classes.js"></script>');
document.write('<script type="text/javascript" src="functions.js"></script>');
document.write('<script type="text/javascript" src="initialize.js"></script>');

$(document).ready(function() {

	if (!supports_inline_svg()) {
	
		$("#nav").hide();
		$("#sub_header").hide();
		
		var noSvgHtml = '<div id="no_svg"><p>This game uses inline SVG which is unfortunately not supported by your browser. You will need to update you browser to play this game. Updating only takes a few minutes and can make your web browsing a faster and more pleasurable experience!</p>'
			+ '<p>Here are some links to help you get started:</p>'
			+ '<ul><li>Mozilla Firefox: <a href="http://www.mozilla.org/en-US/firefox/new/" target="_blank">http://www.mozilla.org/en-US/firefox/new/</a></li>'
			+ '<li>Google Chrome: <a href="http://www.google.com/chrome" target="_blank">http://www.google.com/chrome</a></li>'
			+ '<li>Apple Safari: <a href="http://www.apple.com/safari/" target="_blank">http://www.apple.com/safari/</a></li>'
			+ '<li>Internet Explorer: <a href="http://windows.microsoft.com/en-US/internet-explorer/downloads/ie" target="_blank">http://windows.microsoft.com/en-US/internet-explorer/downloads/ie</a></li></ul>';
		
		$("#main").html(noSvgHtml);
	
	} else {

		restart_game();
		
		$(document).keypress(function(e){
			if (e.keyCode==27){
				$("#background").fadeOut("slow");
				$(".popup").fadeOut("slow");
			}
		});

		/* Restart Button */
		$("#button_restart").click(function(){
			restart_game();
		});

		/* Winner Button */
		$("#button_winner").click(function(){
			$("#background").fadeOut("slow");
			$("#popup_winner").fadeOut("slow");
			
			$.post("addwinner.php", { name: $("#input_winner").val(), level: level, piecelength: maxPieceLength } );
			
			restart_game();
		});
		
		/* Show Scoreboard Button */
		$("#button_scoreboard").click(function(){
		
			$.post("scoreboard.php", function(data) {
				$("#scoreboard").html(data);
				$("#popup_scoreboard").center().fadeIn("slow");
			});
			$("#background").css({"opacity" : "0.7"}).fadeIn("slow");
		});
		
		$("#button_board").click(function(){
			
			var boardTable = "<table>";
			for (var y = 0; y < level; y++) {
			
				boardTable += "<tr>";
			
				for (var x = 0; x < level; x++) {
			
					boardTable += "<td>" + board[(y * level) + x] + "</td>";

				}
				
				boardTable += "</tr>";
			}
			
			$("#test1").html(boardTable);
		});
		
		/* Scoreboard OK Button */
		$("#button_ok").click(function(){
			$("#background").fadeOut("slow");
			$("#popup_scoreboard").fadeOut("slow");
		});	

		/* Mouse Up - Stops dragging the piece around */
		$(document).mouseup(function(e){
		
			if (movingPiece == null) return;
			movingPiece = null;
			
			/* Check if the puzzle is solved */
			if (puzzle_solved()){
				$("#background").css({"opacity" : "0.7"}).fadeIn("slow");
				$("#popup_winner").center().fadeIn("slow");
			}
		
			/* Have to return false, else firefox treats it like dragging an image */
			return false;
		})

		/* Mouse Move - Drags the piece around */
		$(document).mousemove(function(e){
		
			if (movingPiece == null) return;
				
			var translateXY = new XY((e.pageX - downPageX) + movingPiece.data('offsetX'), (e.pageY - downPageY) + movingPiece.data('offsetY'));

			transform(movingPiece, translateXY);
						
			/* Have to return false, else firefox treats it like draging an image */
			return false;
		});
	}
});

function add_mouse_events()
{
	/* Mouse down - Handles all the mouse clicks */
	$(".segment").mousedown(function(e) {
		
		var $segment = $(this);
		var piece = $(this).parent(".piece");
		
		create_segmentXY(piece);
		
		/* Bring the piece to the foreground */
		$(this).parent().parent().append(piece);
		
		/* Work out which mouse button was clicked */
		switch (e.which) {
			/* Left click for moving the piece */
			case 1:
				downPageX = e.pageX;
				downPageY = e.pageY;
				
				downOffsetX = piece.offset().left;
				downOffsetY = piece.offset().top;
				
				piece.data('offsetX', (piece.data('segOffsetX') - piece.data('startX')) + piece.offset().left);
				piece.data('offsetY', (piece.data('segOffsetY') - piece.data('startY')) + piece.offset().top);
				
				movingPiece = piece;
				
				break;
			case 2:
				/*alert('Middle mouse button pressed');*/
				break;
			/* Right click for rotating the piece */
			case 3:
				var corX = parseFloat($segment.attr('x')) + Math.floor(squareSize / 2);
				var corY = parseFloat($segment.attr('y')) + Math.floor(squareSize / 2);
				
				piece.data('corX', corX);
				piece.data('corY', corY);
							
				piece.data('rotation', piece.data('rotation') + 90);

				/* This is a bit complicated... I am getting the coordinates of the segment that you click on,
				subtracting the start cordinates so we get the cordinates in the svg, then subtracting the 
				coordinates of the segment inside the piece so we can get the coordinates that the piece needs to be translated! */
				
				piece.data('offsetX', ($segment.offset().left - piece.data('startX')) - parseFloat($segment.attr('x')));
				piece.data('offsetY', ($segment.offset().top - piece.data('startY')) - parseFloat($segment.attr('y')));

				transform(piece, new XY(piece.data('offsetX'), piece.data('offsetY')));
				
				piece.data('segOffsetX', (($segment.offset().left) - parseFloat($segment.attr('x')) - piece.offset().left));
				piece.data('segOffsetY', (($segment.offset().top) - parseFloat($segment.attr('y')) - piece.offset().top));
				
				break;
		}

		/* Have to return false, else firefox treats it like draging an image */
		return false;
	});
}