function kpiTrackUpdate()
{
	var kpia = $("#tab-kpi #kpia").val();
	var kpib = $("#tab-kpi #kpib").val();
	var countries = $("#tab-kpi #countries").val();
	var countriesEx = $("#tab-kpi #countriesex").val();
	var separator = $("#tab-kpi #absep").val();
	var until = $("#tab-kpi #until").val();

	var http = new XMLHttpRequest();
	http.open('POST', 'kpi-track/data-manager.php', true);
	http.setRequestHeader("Content-type", "application/json");
	http.send(JSON.stringify({
		ct: countries,
		ctx: countriesEx,
		sep: separator,
		til: until
	}));
	http.onreadystatechange = function ()
	{
		if (http.readyState == 4 && http.status == 200)
		{
			if (http.responseText)
			{
				console.log(JSON.parse(http.responseText));
			}
		}
	};
}