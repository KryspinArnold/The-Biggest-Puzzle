document.write('<h3>Level: ' + level + '</h3>');
document.write('<svg id=board height="' + (squareSize * level) + '" width="' + (squareSize * level) + '" xmlns="http://www.w3.org/2000/svg">');

for (var y = 0; y < level; y++)
{
	for (var x = 0; x < level; x++)
	{
		document.write(square((x * squareSize), (y * squareSize), 'squareX' + x + 'Y' + y));
	}
}
document.write(piece(100, 100, "HelloWorld"));

document.write('</svg>');