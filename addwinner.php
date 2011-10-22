<?php

include ('functions.php');

date_default_timezone_set("Australia/Melbourne"); 

// Create that all the POST values exist
if (array_key_exists('name', $_POST)
	&& array_key_exists('level', $_POST)
	&& array_key_exists('piecelength', $_POST))
{
	// Make sure all the POST keys are safe i.e. no SQL injection etc.
	$safeName = make_safe($_POST['name'], 50, false);
	$safeLevel = make_safe($_POST['level'], 50, true);
	$safePieceLength = make_safe($_POST['piecelength'], 50, true);

	execute_sql("INSERT INTO Score (name, level, piecelength) VALUES ('".$safeName."', ".$safeLevel.", ".$safePieceLength.");");
}	


?>