/* Square class */
function Square(x, y, pieceID)
{
	this.x = x;
	this.y = y;
	this.pieceID = pieceID;
}

/* Colour class */
/* We are given the light and dark hex values and the order to add everything together */
function Colour(ldHex, order)
{
	var ldStatic = new Array(baseLightColour, baseDarkColour);
	var ldColour = new Array("#", "#");
	
	for (var i = 0; i < 2; i++)
	{
		/* TODO: Work out the combinations automatically */
		switch(order)
		{
			case 0:
			ldColour[i] += ldStatic[i] + ldHex[i] + "00";
			break;
			case 1:
			ldColour[i] += ldStatic[i] + "00" + ldHex[i];
			break;
			case 2:
			ldColour[i] += ldHex[i] + ldStatic[i] + "00";
			break;
			case 3:
			ldColour[i] += ldHex[i] + "00" + ldStatic[i];
			break;
			case 4:
			ldColour[i] += "00" + ldStatic[i] + ldHex[i];
			break;
			case 5:
			ldColour[i] += "00" + ldHex[i] + ldStatic[i];
			break;
		}
	}

	this.light = ldColour[0];
	this.dark = ldColour[1];
}