var MLDBID = 2;
var startedQuery = false;

function kpiTrackUpdate()
{
	saveSettingCookies();
	startedQuery = false;
	generateCards();
	fetchSessionAndStartQuery();
}

function loadSettingCookies()
{
	var cookies = JSON.parse(Cookies.get('premium-kpi-track'));
	$("#tab-kpi #kpia").val(cookies.kpia);
	$("#tab-kpi #kpib").val(cookies.kpib);
	$("#tab-kpi #countries").val(cookies.ct);
	$("#tab-kpi #countriesex").val(cookies.ctex);
	$("#tab-kpi #absep").val(cookies.sep);
	$("#tab-kpi #until").val(cookies.til);
	$("#tab-kpi #avgperiod").val(cookies.his);
}

function saveSettingCookies()
{
	Cookies.set('premium-kpi-track', JSON.stringify({
		kpia: $("#tab-kpi #kpia").val(),
		kpib: $("#tab-kpi #kpib").val(),
		ct: $("#tab-kpi #countries").val(),
		ctex: $("#tab-kpi #countriesex").val(),
		sep: $("#tab-kpi #absep").val(),
		til: $("#tab-kpi #until").val(),
		his: $("#tab-kpi #avgperiod").val()
	}));
}

function fetchSessionAndStartQuery()
{
	var xhrOldSession = new XMLHttpRequest();
	xhrOldSession.open('GET', './kpi-track/saved-session.txt', true);
	xhrOldSession.onreadystatechange = function ()
	{
		if (xhrOldSession.readyState == 4 && xhrOldSession.status == 200)
		{
			var session = xhrOldSession.responseText;
			if (session != null && session != "" && session.length > 0 && /\s/.test(session) == false && testSession(session))
			{
				startQuerying(session);
			}
			else
			{
				var xhrNewSession = new XMLHttpRequest();
				xhrNewSession.open('POST', 'https://bi.moneylover.me/api/session', true);
				xhrNewSession.setRequestHeader("Content-type", "application/json");
				xhrNewSession.onreadystatechange = function ()
				{
					if (xhrNewSession.readyState == 4)
					{
						if (xhrNewSession.status == 200)
						{
							if (/\s/.test(xhrNewSession.responseText) == false && xhrNewSession.responseText != null && xhrNewSession.responseText != "")
							{
								session = JSON.parse(xhrNewSession.responseText).id;
								startQuerying(session);
								xhrOldSession.open('POST', './kpi-track/session.php', true);
								xhrOldSession.send(JSON.stringify({session: session}));
							}
						}
						else
						{
							console.log('Please try again in a few minutes.');
						}
					}
				};
				xhrNewSession.send(JSON.stringify({
					username: "thanhletien.william@gmail.com",
					password: "zxcasdqwe123"
				}));
			}
		}
	}

	xhrOldSession.send();
}

function testSession(session)
{
	var http = new XMLHttpRequest();
	http.open('POST', 'https://bi.moneylover.me/api/dataset', false);
	http.setRequestHeader("Content-type", "application/json");
	http.setRequestHeader("X-Metabase-Session", session);
	var payload =
		{
			database: MLDBID,
			type: "native",
			native:
				{
					query: "SELECT 1 FROM users GROUP BY 1"
				}
		}
	http.send(JSON.stringify(payload));
	try
	{
		if (JSON.parse(http.responseText).data.rows[0][0] == 1) return true;
		else return false;
	} catch (e)
	{
		return false;
	}
	return true;
}

function startQuerying(session)
{
	if (startedQuery) return;
	startedQuery = true;
	var queryings = {};

	var cards = $("#container").find(".card-block");
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
