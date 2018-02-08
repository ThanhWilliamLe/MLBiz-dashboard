<?php
header('Content-Type: application/json');

$content = file_get_contents('php://input');
$json = json_decode($content, true);
if ($json != null && count($json) > 0)
{
	$session = implode(',', $json);
	echo strlen($session) . " , ";
	if (strlen($session) > 0)
	{
		$sessionTxt = fopen("saved-session.txt", "w");
		fwrite($sessionTxt, $session);
		fclose($sessionTxt);
		echo $session;
	}
}