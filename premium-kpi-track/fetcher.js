var MLDBID = 2;
var startedQuery = false;

function premiumKpiTrackInit()
{
	if (Cookies.get('premium-kpi-track') == null) saveSettingCookies();
	loadSettingCookies();
	kpiTrackUpdate();
	//$(".display-toggle").click();
}

function kpiTrackUpdate()
{
	var justRecalculate = checkJustNeedRecalculate();
	setNewSettingValues();
	saveSettingCookies();
	if (!justRecalculate)
	{
		startedQuery = false;
		generateCards();
		fetchSessionAndStartQuery();
	}
	else
	{
		recalculate();
	}
}

function checkJustNeedRecalculate()
{
	var ctold = $("#tab-premium-kpi #countries").next(".prev-value").html();
	var ct = $("#tab-premium-kpi #countries").val();
	var ctexold = $("#tab-premium-kpi #countriesex").next(".prev-value").html();
	var ctex = $("#tab-premium-kpi #countriesex").val();
	var sepold = $("#tab-premium-kpi #absep").next(".prev-value").html();
	var sep = $("#tab-premium-kpi #absep").val();
	var tilold = $("#tab-premium-kpi #until").next(".prev-value").html();
	var til = $("#tab-premium-kpi #until").val();
	if (ct != ctold || ctex != ctexold || sep != sepold || til != tilold) return false;
	return true;
}

function setNewSettingValues()
{
	var kpiaprev = $("#tab-premium-kpi #kpia").next(".prev-value");
	var kpia = $("#tab-premium-kpi #kpia");
	kpiaprev.html(kpia.val());

	var kpibprev = $("#tab-premium-kpi #kpib").next(".prev-value");
	var kpib = $("#tab-premium-kpi #kpib");
	kpibprev.html(kpib.val());

	var ctprev = $("#tab-premium-kpi #countries").next(".prev-value");
	var ct = $("#tab-premium-kpi #countries");
	ctprev.html(ct.val());

	var ctexprev = $("#tab-premium-kpi #countriesex").next(".prev-value");
	var ctex = $("#tab-premium-kpi #countriesex");
	ctexprev.html(ctex.val());

	var sepprev = $("#tab-premium-kpi #absep").next(".prev-value");
	var sep = $("#tab-premium-kpi #absep");
	sepprev.html(sep.val());

	var tilprev = $("#tab-premium-kpi #until").next(".prev-value");
	var til = $("#tab-premium-kpi #until");
	tilprev.html(til.val());

	var avgprev = $("#tab-premium-kpi #avgperiod").next(".prev-value");
	var avg = $("#tab-premium-kpi #avgperiod");
	avgprev.html(avg.val());
}

function loadSettingCookies()
{
	var cookies = JSON.parse(Cookies.get('premium-kpi-track'));
	$("#tab-premium-kpi #kpia").val(cookies.kpia);
	$("#tab-premium-kpi #kpib").val(cookies.kpib);
	$("#tab-premium-kpi #countries").val(cookies.ct);
	$("#tab-premium-kpi #countriesex").val(cookies.ctex);
	$("#tab-premium-kpi #absep").val(cookies.sep);
	$("#tab-premium-kpi #until").val(cookies.til);
	$("#tab-premium-kpi #avgperiod").val(cookies.his);
}

function saveSettingCookies()
{
	Cookies.set('premium-kpi-track', JSON.stringify({
		kpia: $("#tab-premium-kpi #kpia").val(),
		kpib: $("#tab-premium-kpi #kpib").val(),
		ct: $("#tab-premium-kpi #countries").val(),
		ctex: $("#tab-premium-kpi #countriesex").val(),
		sep: $("#tab-premium-kpi #absep").val(),
		til: $("#tab-premium-kpi #until").val(),
		his: $("#tab-premium-kpi #avgperiod").val()
	}));
}

function fetchSessionAndStartQuery()
{
	var xhrOldSession = new XMLHttpRequest();
	xhrOldSession.open('GET', './premium-kpi-track/saved-session.txt', true);
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
								xhrOldSession.open('POST', './premium-kpi-track/session.php', true);
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

	var cards = $("#tab-premium-kpi #container").find(".card-block");
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
