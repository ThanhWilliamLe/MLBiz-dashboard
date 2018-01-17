<?php

initDataFile();

function initDataFile()
{
	$fileName = "kpi-track-data-raw-pre2018.json";
	$rawFile = fread(fopen($fileName, "r"), filesize($fileName));
	$rawData = json_decode($rawFile);
	$processedData = processData($rawData);

	$dataFile = fopen("kpi-track-data.json", "w");
	$dataJson = json_encode(array('latest' => '', 'data' => $processedData));
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
		if ($currentJsonRow['d'] == null || $jsonRow->d != $currentJsonRow['d'])
		{
			if ($currentJsonRow['d'] != null)
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