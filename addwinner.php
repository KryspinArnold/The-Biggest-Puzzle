<?php

date_default_timezone_set("Australia/Melbourne"); 

// SQL to create the database & table:
// CREATE DATABASE TheBiggestPuzzle
// CREATE TABLE Score (scoreID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50), level INT NOT NULL, piecelength INT NOT NULL);

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

function execute_sql($sqlquery)
{
	// For obvious reasons I am not including happydb.php, but it contains:
	// $dbhost = IP Address:Port
	// $dbuser = SQL Username
	// $dbpass = SQL Password
	// $dbname = DB Name i.e. "TheBiggestPuzzle"

	include ('happydb.php');
	include ('opendb.php');

	$sqlresult = mysql_query($sqlquery, $db);

	if (!$sqlresult)
	{
		printf("An error has occurred.");
		die();
	}

	include ('closedb.php');
	return $sqlresult;
}

function make_safe($variable, $length, $isDigit)
{
	include ('happydb.php');
	include ('opendb.php');

	if(get_magic_quotes_gpc())
	{
		$variable = stripslashes($variable);
	}
	
	$variable = substr($variable, 0, $length);
	$variable = mysql_real_escape_string(trim($variable));
	
	if ($isDigit && !is_numeric($variable))
	{
		$variable = 0;
	}
	return $variable;
		
	include ('closedb.php');
}
?>