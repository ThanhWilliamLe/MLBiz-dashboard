<?php
function data($database, $countries, $countriesEx, $separator, $until)
{
	if (strlen(trim($countries)) == 0) $countries = [];
	else $countries = array_map('trim', explode(',', strtolower($countries)));
	if (strlen(trim($countriesEx)) == 0) $countriesEx = [];
	else $countriesEx = array_map('trim', explode(',', strtolower($countriesEx)));

	$result = [
		"regA" => 0,
		"regAa" => 0,
		"regAi" => 0,
		"regAo" => 0,
		"regB" => 0,
		"regBa" => 0,
		"regBi" => 0,
		"regBo" => 0,
		"preA" => 0,
		"preAa" => 0,
		"preAi" => 0,
		"preAo" => 0,
		"preB" => 0,
		"preBa" => 0,
		"preBi" => 0,
		"preBo" => 0
	];
	$database2 = sumDataByCountry($database);
	foreach ($database2 as $row)
	{
		$type = $row['d'] < $separator ? 'A' : 'B';
		$result['reg' . $type . ''] = $result['reg' . $type . ''] + $row['r'];
		$result['reg' . $type . 'a'] = $result['reg' . $type . 'a'] + $row['ra'];
		$result['reg' . $type . 'i'] = $result['reg' . $type . 'i'] + $row['ri'];
		$result['reg' . $type . 'o'] = $result['reg' . $type . 'o'] + $row['ro'];
		$result['pre' . $type . ''] = $result['pre' . $type . ''] + $row['p'];
		$result['pre' . $type . 'a'] = $result['pre' . $type . 'a'] + $row['pa'];
		$result['pre' . $type . 'i'] = $result['pre' . $type . 'i'] + $row['pi'];
		$result['pre' . $type . 'o'] = $result['pre' . $type . 'o'] + $row['po'];
	}
	return json_encode($result);
}

function sumDataByCountry($database)
{
	$database2 = [];
	foreach ($database as $row)
	{
		$row2 = [
			"d" => $row->d,
			"r" => 0,
			"ra" => 0,
			"ri" => 0,
			"ro" => 0,
			"p" => 0,
			"pa" => 0,
			"pi" => 0,
			"po" => 0,
		];
		for ($i = 0; $i < sizeof($row->c); $i++)
		{
			$country = strtolower($row->c[$i]);
			if (empty($countries) && empty($countriesEx)) $select = true;
			else if (empty($countries) && !in_array($country, $countriesEx)) $select = true;
			else if (empty($countriesEx) && in_array($country, $countries)) $select = true;
			else $select = false;

			if ($select)
			{
				$row2['r'] = $row2['r'] + $row->r[$i];
				$row2['ra'] = $row2['ra'] + $row->ra[$i];
				$row2['ri'] = $row2['ri'] + $row->ri[$i];
				$row2['ro'] = $row2['ro'] + $row->ro[$i];
				$row2['p'] = $row2['p'] + $row->p[$i];
				$row2['pa'] = $row2['pa'] + $row->pa[$i];
				$row2['pi'] = $row2['pi'] + $row->pi[$i];
				$row2['po'] = $row2['po'] + $row->po[$i];
			}
		}
		array_push($database2, $row2);
	}
	return $database2;
}