var MLDBID = 2;
var startedQuery = false;

function premiumKpiTrackInit()
{
	if (Cookies.get('premium-kpi-track') == null) pktSaveSettingCookies();
	pktLoadSettingCookies();
	pktUpdate();
	//$(".display-toggle").click();
}

function pktUpdate()
{
	var justRecalculate = pktCheckJustNeedRecalculate();
	pktSetNewSettingValues();
	pktSaveSettingCookies();
	if (!justRecalculate)
	{
		startedQuery = false;
		pktGenerateCards();
		fetchSessionAndStart(pktStartQuerying);
	}
	else
	{
		pktRecalculate();
	}
}

function pktCheckJustNeedRecalculate()
{
	var ctold = $("#tab-premium-kpi #pktCountries").next(".prev-value").html();
	var ct = $("#tab-premium-kpi #pktCountries").val();
	var ctexold = $("#tab-premium-kpi #pktCountriesEx").next(".prev-value").html();
	var ctex = $("#tab-premium-kpi #pktCountriesEx").val();
	var sepold = $("#tab-premium-kpi #pktABsep").next(".prev-value").html();
	var sep = $("#tab-premium-kpi #pktABsep").val();
	var tilold = $("#tab-premium-kpi #pktUntil").next(".prev-value").html();
	var til = $("#tab-premium-kpi #pktUntil").val();
	if (ct != ctold || ctex != ctexold || sep != sepold || til != tilold) return false;
	return true;
}

function pktSetNewSettingValues()
{
	var kpiaprev = $("#tab-premium-kpi #pktKPIA").next(".prev-value");
	var kpia = $("#tab-premium-kpi #pktKPIA");
	kpiaprev.html(kpia.val());

	var kpibprev = $("#tab-premium-kpi #pktKPIB").next(".prev-value");
	var kpib = $("#tab-premium-kpi #pktKPIB");
	kpibprev.html(kpib.val());

	var ctprev = $("#tab-premium-kpi #pktCountries").next(".prev-value");
	var ct = $("#tab-premium-kpi #pktCountries");
	ctprev.html(ct.val());

	var ctexprev = $("#tab-premium-kpi #pktCountriesEx").next(".prev-value");
	var ctex = $("#tab-premium-kpi #pktCountriesEx");
	ctexprev.html(ctex.val());

	var sepprev = $("#tab-premium-kpi #pktABsep").next(".prev-value");
	var sep = $("#tab-premium-kpi #pktABsep");
	sepprev.html(sep.val());

	var tilprev = $("#tab-premium-kpi #pktUntil").next(".prev-value");
	var til = $("#tab-premium-kpi #pktUntil");
	tilprev.html(til.val());

	var avgprev = $("#tab-premium-kpi #pktAvgPeriod").next(".prev-value");
	var avg = $("#tab-premium-kpi #pktAvgPeriod");
	avgprev.html(avg.val());
}

function pktLoadSettingCookies()
{
	var cookies = JSON.parse(Cookies.get('premium-kpi-track'));
	$("#tab-premium-kpi #pktKPIA").val(cookies.kpia);
	$("#tab-premium-kpi #pktKPIB").val(cookies.kpib);
	$("#tab-premium-kpi #pktCountries").val(cookies.ct);
	$("#tab-premium-kpi #pktCountriesEx").val(cookies.ctex);
	$("#tab-premium-kpi #pktABsep").val(cookies.sep);
	$("#tab-premium-kpi #pktUntil").val(cookies.til);
	$("#tab-premium-kpi #pktAvgPeriod").val(cookies.his);
}

function pktSaveSettingCookies()
{
	Cookies.set('premium-kpi-track', JSON.stringify({
		kpia: $("#tab-premium-kpi #pktKPIA").val(),
		kpib: $("#tab-premium-kpi #pktKPIB").val(),
		ct: $("#tab-premium-kpi #pktCountries").val(),
		ctex: $("#tab-premium-kpi #pktCountriesEx").val(),
		sep: $("#tab-premium-kpi #pktABsep").val(),
		til: $("#tab-premium-kpi #pktUntil").val(),
		his: $("#tab-premium-kpi #pktAvgPeriod").val()
	}));
}

function pktStartQuerying(session)
{
	if (startedQuery) return;
	startedQuery = true;
	var queryings = {};

	var cards = $("#tab-premium-kpi #pktContainer").find(".card-block");
	cards.each(function (id)
	{
		var card = cards[id];
		var query = $(card).find('.card-query')[0].innerHTML;
		var type = $(card).find('.card-type')[0].innerHTML;
		var func = $(card).find('.card-function')[0].innerHTML;
		//$(card).find('.none').remove();
		if (type == 'query' && query.length > 0) pktDoQuery(queryings, session, card, query, func);
		else pktProcessCard(card, type, func, query);
	});
}

function pktDoQuery(queryings, session, card, query, func)
{
	var http = new XMLHttpRequest();
	http.open('POST', 'https://bi.moneylover.me/api/dataset', true);
	http.setRequestHeader("Content-type", "application/json");
	http.setRequestHeader("X-Metabase-Session", session);
	http.onreadystatechange = function ()
	{
		if (http.readyState == 4 && http.status == 200) pktDoneQuery(queryings, card, http.responseText, func);
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
