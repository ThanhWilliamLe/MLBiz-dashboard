<?php
function data($database, $countries, $countriesEx, $separator, $until)
{
	$countries = array_map('trim', explode(',', $countries));
	$countriesEx = array_map('trim', explode(',', $countriesEx));

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
		"preAo" => 0
	];
	foreach ($database as $row)
	{
		if ($row->d < $separator) return $row->d;
	}
	return 1;
}