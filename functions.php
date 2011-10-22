<?php

// SQL to create the database & table:
// CREATE DATABASE TheBiggestPuzzle
// CREATE TABLE Score (scoreID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50), level INT NOT NULL, piecelength INT NOT NULL);

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