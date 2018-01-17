function kpiTrackUpdate()
{
	var http = new XMLHttpRequest();
	http.open('GET', 'kpi-track/kpi-track-data-processor.php', false);
	http.send();
	console.log(http.responseText);
}