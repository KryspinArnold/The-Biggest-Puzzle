document.write('<h3>Level: ' + level + '</h3>');
document.write('<svg id=board height="' + (squareSize * level) + '" width="' + ((squareSize * level) + leftMargin) + '" xmlns="http://www.w3.org/2000/svg">');

for (var y = 0; y < level; y++)
{
	for (var x = 0; x < level; x++)
	{
		document.write(square(((x * squareSize) + leftMargin), (y * squareSize), 'squareX' + x + 'Y' + y));
	}
}

document.write('<defs>');
for (var i = 0; i < colours.length; i++)
{
	document.write('<linearGradient id="colorGradient' + i + '" x1="0%" y1="0%" 2="0%" y2="100%" spreadMethod="pad">');
	document.write('<stop offset="0%" stop-color="' + colours[i].light + '" stop-opacity="1"/>');
	document.write('<stop offset="100%" stop-color="' + colours[i].dark + '" stop-opacity="1"/>');
	document.write('</linearGradient>');
}
document.write('</defs>');
	
for (var i = 0, li = pieces.length; i < li; i++)
{
	document.write('<g class=piece data-startX=0 data-startY=0 data-offsetX=0 data-offsetY=0 data-angle=0>');
	
	for (var j = 0, lj = pieces[i].length; j < lj; j++)
	{
		/* Base the position of each segment in the piece off the first segment */
		var posX = (squares[pieces[i][j]].x - squares[pieces[i][0]].x) * squareSize;
		var posY = (squares[pieces[i][j]].y - squares[pieces[i][0]].y) * squareSize;
		
		document.write(segment(posX, posY, i));
	}
	document.write('</g>');
}

document.write('</svg>');