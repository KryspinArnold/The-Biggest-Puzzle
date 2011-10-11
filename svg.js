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
document.write('<linearGradient id="myLinearGradient1" x1="0%" y1="0%" 2="0%" y2="100%" spreadMethod="pad">');
document.write('<stop offset="0%"   stop-color="#00cc00" stop-opacity="1"/>');
document.write('<stop offset="100%" stop-color="#006600" stop-opacity="1"/>');
document.write('</linearGradient>');
document.write('</defs>');

document.write('<g id="piece0" data-startX = 0 data-startY = 0 data-offsetX = 0 data-offsetY = 0 data-angle=0>');
document.write(segment(0, 0, "HelloWorld"));
document.write(segment(0, 50, "HelloWorld"));
document.write('</g>');

document.write('</svg>');