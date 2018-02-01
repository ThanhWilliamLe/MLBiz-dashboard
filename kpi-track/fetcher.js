var MLDBID = 2;
var startedQuery = false;

function kpiTrackUpdate()
{
	var kpia = $("#tab-kpi #kpia").val();
	var kpib = $("#tab-kpi #kpib").val();
	var countries = $("#tab-kpi #countries").val();
	var countriesEx = $("#tab-kpi #countriesex").val();
	var separator = $("#tab-kpi #absep").val();
	var until = $("#tab-kpi #until").val();

	fetchSessionAndStartQuery();
}

function fetchSessionAndStartQuery()
{
	var http = new XMLHttpRequest();
	http.open('POST', 'https://bi.moneylover.me/api/session', true);
	http.setRequestHeader("Content-type", "application/json");
	http.onreadystatechange = function ()
	{
		if (http.readyState == 4)
		{
			var http2 = new XMLHttpRequest();
			if (http.status == 200)
			{
				var session = JSON.parse(http.responseText).id;
				startQuerying(session);
				http2.open('POST', './kpi-track/session.php', true);
				http2.send(JSON.stringify({session: session}));
			} else
			{
				http2.open('GET', './kpi-track/session.php', true);
				http2.onreadystatechange = function ()
				{
					var session = http2.responseText;
					startQuerying(session);
				}
				http2.send();
			}
		}
	};
	http.send(JSON.stringify({
		username: "thanhletien.william@gmail.com",
		password: "zxcasdqwe123"
	}));
}

function doQuery(session, card, type, query)
{
	var http = new XMLHttpRequest();
	http.open('POST', 'https://bi.moneylover.me/api/dataset', true);
	http.setRequestHeader("Content-type", "application/json");
	http.setRequestHeader("X-Metabase-Session", session);
	http.onreadystatechange = function ()
	{
		if (http.readyState == 4 && http.status == 200) finishedQuery(card, http.responseText, type);
	}
	var payload =
		{
			database: MLDBID,
			type: "native",
			native:
				{
					query: query
				}
		}
	http.send(JSON.stringify(payload));
}

function startQuerying(session)
{
	if (startedQuery) return;
	startedQuery = true;

	var cards = $("#container-cards").find(".card-block");
	cards.each(function (id)
	{
		var card = cards[id];
		var query = $(card).find('.card-query')[0].innerHTML;
		var type = $(card).find('.card-display')[0].innerHTML;
		$(card).find('.none').remove();
		doQuery(session, card, type, query);
	});
}

function finishedQuery(card, result, type)
{
	$(card).find('.fa-spinner').remove();
	var data = JSON.parse(result).data;
	
}