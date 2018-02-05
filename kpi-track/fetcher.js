var MLDBID = 2;
var startedQuery = false;

function kpiTrackUpdate()
{
	startedQuery = false;
	generateCards();
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

function startQuerying(session)
{
	if (startedQuery) return;
	startedQuery = true;
	var queryings = {};

	var cards = $("#container-cards").find(".card-block");
	cards.each(function (id)
	{
		var card = cards[id];
		var query = $(card).find('.card-query')[0].innerHTML;
		var type = $(card).find('.card-type')[0].innerHTML;
		var func = $(card).find('.card-function')[0].innerHTML;
		//$(card).find('.none').remove();
		if (type == 'query' && query.length > 0) doQuery(queryings, session, card, query, func);
		else processCard(card, type, func, query);
	});
}

function doQuery(queryings, session, card, query, func)
{
	var http = new XMLHttpRequest();
	http.open('POST', 'https://bi.moneylover.me/api/dataset', true);
	http.setRequestHeader("Content-type", "application/json");
	http.setRequestHeader("X-Metabase-Session", session);
	http.onreadystatechange = function ()
	{
		if (http.readyState == 4 && http.status == 200) doneQuery(queryings, card, http.responseText, func);
	}
	var payload =
		{
			database: MLDBID,
			type: "native",
			native:
				{
					query: decodeURIComponent(query)
				}
		}
	http.send(JSON.stringify(payload));
	queryings[card.id] = true;
}
