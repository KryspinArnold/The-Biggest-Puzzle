<?php

date_default_timezone_set("Australia/Melbourne");

include ('functions.php');

$results = execute_sql("SELECT level, piecelength, name FROM Score ORDER BY level DESC LIMIT 0, 15;");

printf('<table>');
printf('<tr><th>Level</th><th>Piece Length</th><th>Name</th></tr>');

// Create an table of the results
while ($row = mysql_fetch_row($results))
{
	printf('<tr>');
	printf('<td>'.$row[0].'</td>');
	printf('<td>'.$row[1].'</td>');
	printf('<td>'.$row[2].'</td>');
	printf('</tr>');
}

printf('</table>');

?>