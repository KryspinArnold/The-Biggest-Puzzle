<?php
$db = mysql_connect($dbhost, $dbuser, $dbpass)
or die ('Error connecting to MySQL');
mysql_select_db($dbname,$db);
?>