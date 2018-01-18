<?php
header("Content-type: application/json; encoding: UTF-8");
go();

function go()
{
	$data = checkDataFile();
	giveData($data);
}

function giveData($database)
{
	require_once "data-processor.php";
	$received = json_decode(file_get_contents('php://input'), true);
	$countries = $received['ct'];
	$countriesEx = $received['ctx'];
	$separator = $received['sep'];
	$until = $received['til'];
	echo data($database, $countries, $countriesEx, $separator, $until);
}

function checkDataFile()
{
	$fileName = "data.json";
	if (!file_exists($fileName) || filesize($fileName) < 1000000) initDataFile();

	$dataFile = fread(fopen($fileName, "r"), filesize($fileName));
	$data = json_decode($dataFile);
	$daysFromLatestData = date_diff(date_create($data->latest), date_create(date("Y-m-d")))->days;
	if ($daysFromLatestData >= 2)
	{
		updateData($data);
		$dataJson = json_encode(["latest" => $data->latest, "data" => $data->data]);
		$dataFile = fopen($fileName, "w");
		fwrite($dataFile, $dataJson);
	}

	return $data->data;
}

function updateData($data)
{
	$oldData = $data->data;
	$newDataString = file_get_contents("https://bi.moneylover.me/public/question/a3b9e761-3aba-4659-9b15-531f643ed2cd.json");
	$newData = processData(json_decode($newDataString));
	foreach ($newData as $newRow)
	{
		$newRow = json_decode($newRow);
		$daysFromToday = date_diff(date_create($newRow->d), date_create(date("Y-m-d")))->days;
		if ($daysFromToday < 1) continue;

		$replaced = false;
		for ($i = sizeof($oldData) - 1; $i >= 0; $i--)
		{
			$oldRow = $oldData[$i];
			if ($oldRow->d < $newRow->d) break;
			else if ($oldRow->d = $newRow->d)
			{
				$oldData[$i] = $newRow;
				$replaced = true;
			}
		}
		if (!$replaced)
		{
			array_push($oldData, $newRow);
			$data->data = $oldData;
			$data->latest = getLatestDate($oldData);
		}
	}
}

/** this should never be called unless needs to reset data or data is null**/
function initDataFile()
{
	$fileName = "data-raw-pre2018.json";
	$rawFile = fread(fopen($fileName, "r"), filesize($fileName));
	$rawData = json_decode($rawFile);
	$processedData = processData($rawData);
	$latestDate = getLatestDate($processedData);

	$dataFile = fopen("data.json", "w");
	$dataJson = json_encode(["latest" => $latestDate, "data" => jsonDecodeArray($processedData)]);
	fwrite($dataFile, $dataJson);
}

/**
 * raw data: [{day, 1 country, regs, pre}, ...]
 * each json a day of a country
 *
 * processed data: [{day, countries[], regs[] respective of countries, pre[]}, ...]
 * each json a day
 */
function processData($jsonArray)
{
	$newJsonArray = [];
	$currentJsonRow = [];
	foreach ($jsonArray as $jsonRow)
	{
		if (!array_key_exists('d', $currentJsonRow) || $jsonRow->d != $currentJsonRow['d'])
		{
			if (array_key_exists('d', $currentJsonRow))
			{
				array_push($newJsonArray, json_encode($currentJsonRow));
				$currentJsonRow = [];
			}
			$currentJsonRow['d'] = $jsonRow->d;
			$currentJsonRow['c'] = [];
			$currentJsonRow['r'] = [];
			$currentJsonRow['ra'] = [];
			$currentJsonRow['ri'] = [];
			$currentJsonRow['ro'] = [];
			$currentJsonRow['p'] = [];
			$currentJsonRow['pa'] = [];
			$currentJsonRow['pi'] = [];
			$currentJsonRow['po'] = [];
		} else
		{
			array_push($currentJsonRow['c'], $jsonRow->c);
			array_push($currentJsonRow['r'], $jsonRow->r);
			array_push($currentJsonRow['ra'], $jsonRow->ra);
			array_push($currentJsonRow['ri'], $jsonRow->ri);
			array_push($currentJsonRow['ro'], $jsonRow->ro);
			array_push($currentJsonRow['p'], $jsonRow->p);
			array_push($currentJsonRow['pa'], $jsonRow->pa);
			array_push($currentJsonRow['pi'], $jsonRow->pi);
			array_push($currentJsonRow['po'], $jsonRow->po);
		}
	};
	//push the last new row
	array_push($newJsonArray, json_encode($currentJsonRow));

	return $newJsonArray;
}

function getLatestDate($jsonArray)
{
	$lastRow = $jsonArray[sizeof($jsonArray) - 1];
	if (gettype($lastRow) != "string")
	{
		$lastRow = json_encode($lastRow);
	}
	return json_decode($lastRow)->d;
}

function arrayToString($array)
{
	return "[" . implode(',', $array) . "]";
}

function jsonDecodeArray($array)
{
	return json_decode(arrayToString($array));
}