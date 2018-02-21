function pktGenerateCards()
{
	$("#pktContainer-cards-A").find('*').remove();
	$("#pktContainer-cards-B").find('*').remove();
	var kpia = $("#tab-premium-kpi #pktKPIA").val();
	var kpib = $("#tab-premium-kpi #pktKPIB").val();
	var ct = $("#tab-premium-kpi #pktCountries").val();
	var ctex = $("#tab-premium-kpi #pktCountriesEx").val();
	var sep = $("#tab-premium-kpi #pktABsep").val();
	var til = $("#tab-premium-kpi #pktUntil").val();
	var sepFormat = sep.substr(8, 2) + "/" + sep.substr(5, 2);
	var tilFormat = til.substr(8, 2) + "/" + til.substr(5, 2);
	var selectorA = pktSelector(ct, ctex, null, sep);
	var selectorB = pktSelector(ct, ctex, sep, til);
	var cardSize = 4;

	var card_aTitle = pktGenerateCard(0, 2, "titleA", 12, "A: Users before " + sepFormat + " and premium from " + sepFormat);
	var card_aUsers = pktGenerateCard(0, 1, "usersAZ", cardSize, "Total users", "query", "", "SELECT count(1) FROM users " + selectorA);
	var card_aToPre = pktGenerateCard(0, 0, "usersAZtoPre", cardSize, kpia + "% to convert");
	var card_aPre = pktGenerateCard(0, 1, "usersAZpre", cardSize, "Current premium", "query", "", "SELECT count(1) FROM users " + selectorA + " and premium_status=true and premium_date>='" + sep + "'::date");
	var card_aaUsers = pktGenerateCard(0, 0, "usersAA", cardSize, "Android users", "query", "", "SELECT count(1) FROM users " + selectorA + " and android");
	var card_aaToPre = pktGenerateCard(0, 0, "usersAAtoPre", cardSize, kpia + "% to convert");
	var card_aaPre = pktGenerateCard(0, 1, "usersAApre", cardSize, "Current Android premium", "query", "", "SELECT count(1) FROM users " + selectorA + " and android and premium_status=true and premium_date>='" + sep + "'::date");
	var card_aaSpeed = pktGenerateCard(0, 0, "usersAAspeed", cardSize, "Current avg. convert speed", "query", "estimateAvg", "SELECT count(1) FROM users " + selectorA + " and premium_status=true and premium_date is not null and android GROUP BY premium_date::date ORDER BY premium_date::date asc");
	var card_aaSpeedNeed = pktGenerateCard(0, 0, "usersAAspeedNeed", cardSize, "Required speed");
	var card_aaFuturePre = pktGenerateCard(0, 1, "usersAAfuturePre", cardSize, "Future premium at current speed")
	var card_aiUsers = pktGenerateCard(0, 0, "usersAI", cardSize, "iOS users", "query", "", "SELECT count(1) FROM users " + selectorA + " and ios");
	var card_aiToPre = pktGenerateCard(0, 0, "usersAItoPre", cardSize, kpia + "% to convert");
	var card_aiPre = pktGenerateCard(0, 1, "usersAIpre", cardSize, "Current iOS premium", "query", "", "SELECT count(1) FROM users " + selectorA + " and ios and premium_status=true and premium_date>='" + sep + "'::date");
	var card_aiSpeed = pktGenerateCard(0, 0, "usersAIspeed", cardSize, "Current avg. convert speed", "query", "estimateAvg", "SELECT count(1) FROM users " + selectorA + " and premium_status=true and premium_date is not null and ios GROUP BY premium_date::date ORDER BY premium_date::date asc");
	var card_aiSpeedNeed = pktGenerateCard(0, 0, "usersAIspeedNeed", cardSize, "Required speed");
	var card_aiFuturePre = pktGenerateCard(0, 1, "usersAIfuturePre", cardSize, "Future premium at current speed");
	var card_aoUsers = pktGenerateCard(0, 0, "usersAO", cardSize, "Other users", "query", "", "SELECT count(1) FROM users " + selectorA + " and not android and not ios");
	var card_aoToPre = pktGenerateCard(0, 0, "usersAOtoPre", cardSize, kpia + "% to convert");
	var card_aoPre = pktGenerateCard(0, 1, "usersAOpre", cardSize, "Current other premium", "query", "", "SELECT count(1) FROM users " + selectorA + " and not android and not ios and premium_status=true and premium_date>='" + sep + "'::date");
	var card_aoSpeed = pktGenerateCard(0, 0, "usersAOspeed", cardSize, "Current avg. convert speed", "query", "estimateAvg", "SELECT count(1) FROM users " + selectorA + " and premium_status=true and premium_date is not null and not android and not ios GROUP BY premium_date::date ORDER BY premium_date::date asc");
	var card_aoSpeedNeed = pktGenerateCard(0, 0, "usersAOspeedNeed", cardSize, "Required speed");
	var card_aoFuturePre = pktGenerateCard(0, 1, "usersAOfuturePre", cardSize, "Future premium at current speed");

	var card_bTitle = pktGenerateCard(1, 2, "titleB", 12, "B: Users from " + sepFormat + " to " + tilFormat);
	var card_bUsers = pktGenerateCard(1, 1, "usersBZ", cardSize, "Est. total users", "query", "futureUsers", "SELECT DATE_PART('day', register_date - '2014-01-01') as dt, count(1) FROM users " + pktSelector(ct, ctex, null, til) + " GROUP BY dt ORDER BY dt asc");
	var card_bToPre = pktGenerateCard(1, 0, "usersBZtoPre", cardSize, 'Est. ' + kpib + "% to convert");
	var card_bPre = pktGenerateCard(1, 1, "usersBZpre", cardSize, "Current premium", "query", "", "SELECT count(1) FROM users " + selectorB + " and premium_status=true and premium_date>='" + sep + "'::date");
	var card_baUsers = pktGenerateCard(1, 0, "usersBA", cardSize, "Est. Android users", "query", "futureUsers", "SELECT DATE_PART('day', register_date - '2014-01-01') as dt, count(1) FROM users " + selectorB + " and android GROUP BY dt ORDER BY dt asc");
	var card_baToPre = pktGenerateCard(1, 0, "usersBAtoPre", cardSize, kpia + "% to convert");
	var card_baPre = pktGenerateCard(1, 1, "usersBApre", cardSize, "Current Android premium", "query", "", "SELECT count(1) FROM users " + selectorB + " and android and premium_status=true and premium_date>='" + sep + "'::date");
	var card_baSpeed = pktGenerateCard(1, 0, "usersBAspeed", cardSize, "Current avg. convert speed", "query", "estimateAvg", "SELECT count(1) FROM users " + selectorB + " and premium_status=true and premium_date is not null and android GROUP BY premium_date::date ORDER BY premium_date::date asc");
	var card_baSpeedNeed = pktGenerateCard(1, 0, "usersBAspeedNeed", cardSize, "Required speed");
	var card_baFuturePre = pktGenerateCard(1, 1, "usersBAfuturePre", cardSize, "Future premium at current speed");
	var card_biUsers = pktGenerateCard(1, 0, "usersBI", cardSize, "Est. iOS users", "query", "futureUsers", "SELECT DATE_PART('day', register_date - '2014-01-01') as dt, count(1) FROM users " + selectorB + " and ios GROUP BY dt ORDER BY dt asc");
	var card_biToPre = pktGenerateCard(1, 0, "usersBItoPre", cardSize, kpia + "% to convert");
	var card_biPre = pktGenerateCard(1, 1, "usersBIpre", cardSize, "Current iOS premium", "query", "", "SELECT count(1) FROM users " + selectorB + " and ios and premium_status=true and premium_date>='" + sep + "'::date");
	var card_biSpeed = pktGenerateCard(1, 0, "usersBIspeed", cardSize, "Current avg. convert speed", "query", "estimateAvg", "SELECT count(1) FROM users " + selectorB + " and premium_status=true and premium_date is not null and ios GROUP BY premium_date::date ORDER BY premium_date::date asc");
	var card_biSpeedNeed = pktGenerateCard(1, 0, "usersBIspeedNeed", cardSize, "Required speed");
	var card_biFuturePre = pktGenerateCard(1, 1, "usersBIfuturePre", cardSize, "Future premium at current speed");
	var card_boUsers = pktGenerateCard(1, 0, "usersBO", cardSize, "Est. other users", "query", "futureUsers", "SELECT DATE_PART('day', register_date - '2014-01-01') as dt, count(1) FROM users " + selectorB + " and not ios and not android GROUP BY dt ORDER BY dt asc");
	var card_boToPre = pktGenerateCard(1, 0, "usersBOtoPre", cardSize, kpia + "% to convert");
	var card_boPre = pktGenerateCard(1, 1, "usersBOpre", cardSize, "Current other premium", "query", "", "SELECT count(1) FROM users " + selectorB + " and not ios and not android and premium_status=true and premium_date>='" + sep + "'::date");
	var card_boSpeed = pktGenerateCard(1, 0, "usersBOspeed", cardSize, "Current avg. convert speed", "query", "estimateAvg", "SELECT count(1) FROM users " + selectorB + " and premium_status=true and premium_date is not null and not ios and not android GROUP BY premium_date::date ORDER BY premium_date::date asc");
	var card_boSpeedNeed = pktGenerateCard(1, 0, "usersBOspeedNeed", cardSize, "Required speed");
	var card_boFuturePre = pktGenerateCard(1, 1, "usersBOfuturePre", cardSize, "Future premium at current speed");

	var rowsA = [];
	rowsA.push([card_aTitle]);
	rowsA.push([card_aUsers, card_aToPre, card_aPre]);
	rowsA.push([pktGenerateSeparator()]);
	rowsA.push([card_aaUsers, card_aaToPre, card_aaPre, card_aaSpeed, card_aaSpeedNeed, card_aaFuturePre]);
	rowsA.push([pktGenerateSeparator()]);
	rowsA.push([card_aiUsers, card_aiToPre, card_aiPre, card_aiSpeed, card_aiSpeedNeed, card_aiFuturePre]);
	rowsA.push([pktGenerateSeparator()]);
	rowsA.push([card_aoUsers, card_aoToPre, card_aoPre, card_aoSpeed, card_aoSpeedNeed, card_aoFuturePre]);
	pktGenerateElements(rowsA, "pktContainer-cards-A");
	var rowsB = [];
	rowsB.push([card_bTitle]);
	rowsB.push([card_bUsers, card_bToPre, card_bPre]);
	rowsB.push([pktGenerateSeparator()]);
	rowsB.push([card_baUsers, card_baToPre, card_baPre, card_baSpeed, card_baSpeedNeed, card_baFuturePre]);
	rowsB.push([pktGenerateSeparator()]);
	rowsB.push([card_biUsers, card_biToPre, card_biPre, card_biSpeed, card_biSpeedNeed, card_biFuturePre]);
	rowsB.push([pktGenerateSeparator()]);
	rowsB.push([card_boUsers, card_boToPre, card_boPre, card_boSpeed, card_boSpeedNeed, card_boFuturePre]);
	pktGenerateElements(rowsB, "pktContainer-cards-B");
}

function pktSelector(countries, countriesEx, regFrom, regBefore)
{
	var addedWhere = false;
	var selector = "";
	if (countries != null && countries.length > 0)
	{
		if (!addedWhere)
		{
			addedWhere = true;
			selector += "WHERE ";
		}
		selector += "country=any(string_to_array('" + countries + "',',')) ~";
	}
	if (countriesEx != null && countriesEx.length > 0)
	{
		if (!addedWhere)
		{
			addedWhere = true;
			selector += "WHERE ";
		}
		selector = selector.replace('~', 'and ');
		selector += "country!=all(string_to_array('" + countriesEx + "',',')) ~";
	}
	if (regBefore != null && regBefore.length > 0)
	{
		if (!addedWhere)
		{
			addedWhere = true;
			selector += "WHERE ";
		}
		selector = selector.replace('~', 'and ');
		selector += "register_date<'" + regBefore + "'::date ~";
	}
	if (regFrom != null && regFrom.length > 0)
	{
		if (!addedWhere)
		{
			addedWhere = true;
			selector += "WHERE ";
		}
		selector = selector.replace('~', 'and ');
		selector += "register_date>='" + regFrom + "'::date ~";
	}
	selector = selector.replace('~', '').trim();
	//pktSelector = " WHERE 1=1";
	return selector;
}

function pktGenerateSeparator()
{
	return '<div class="col-12" style="margin: 0; border: none"><hr style="margin:0; padding:0;border-top: dashed 2px #ccc"></div>';
}

function pktGenerateCard(kpi, important, id, width, title, type, func, query)
{
	if (kpi == 0) kpi = 'A';
	else if (kpi == 1) kpi = 'B';
	if (important == 0) important = 'notimportant ';
	else if (important == 1) important = 'important ';
	else important = '';
	if (func == undefined) func = "";
	if (query == undefined) query = "";
	var str = '';
	str += '<div class="' + important + 'col-' + width + '">';
	str += '<div class="card card-kpi-' + kpi + ' text-center" onmouseenter="pktDisplayHover(this,true)" onmouseleave="pktDisplayHover(this,false)">';
	str += '<div  ' + (id != null && id.length > 0 ? 'id="' + id + '" ' : "") + 'class="card-block">'
	str += '<h6 class="card-title title">' + title +
		' <span class="fa fa-spinner fa-pulse query-spinner"></span>' +
		'</h6>';
	str += '<span class="none card-query">' + encodeURIComponent(query) + '</span>'
	str += '<span class="none card-type">' + type + '</span>'
	str += '<span class="none card-function">' + func + '</span>'
	str += '</div></div></div>';
	return str;
}

function pktGenerateElements(rows, container)
{
	rows.forEach(function (row, id)
	{
		var str = '<div class="row row-' + id + ' no-gutters">';
		row.forEach(function (card)
		{
			str += card;
		});
		str += '</div>';
		$("#" + container).append(str);
	})
}

function pktDisplayToggle()
{
	var toHide = $('.notimportant');
	toHide.each(function (id)
	{
		var ele = toHide[id];
		ele.classList.toggle('none');
		ele.classList.toggle('col-4');
	});
	var toExpand = $('.important');
	toExpand.each(function (id)
	{
		var ele = toExpand[id];
		ele.classList.toggle('col-4');
		ele.classList.toggle('col-6');
	});
}

function pktDisplayHover(card, isIn)
{
	var cardsToLight = [];
	var cardsToDim = [];

	if (!isIn)
	{
		cardsToDim = [];
		cardsToLight = $('#pktContainer .card').toArray();
	}
	else
	{
		if (pktCardTitle(card) == 'titleA') cardsToDim.push($('.card-kpi-B').toArray());
		else if (pktCardTitle(card) == 'titleB') cardsToDim.push($('.card-kpi-A').toArray());
		else
		{
			var title = pktCardTitle(card);
			var regex1 = new RegExp(title.substr(0, 7).replaceAt(5, '.') + ".*", "u");
			var regex2 = new RegExp(title.substr(0, 5) + ".*" + title.substr(7, title.length - 6) + '$', "u");

			var allCards = $('#pktContainer .card').toArray();

			allCards.forEach(function (card)
			{
				if (regex1.test(pktCardTitle(card)) | regex2.test(pktCardTitle(card))) cardsToLight.push(card);
				else cardsToDim.push(card);
			});
		}
	}

	cardsToLight.forEach(function (ele)
	{
		$(ele).fadeTo(0, 1);
	});
	cardsToDim.forEach(function (ele)
	{
		$(ele).fadeTo(0, 0.3);
	});
}

function pktCardTitle(card)
{
	return $(card).find(".card-block")[0].id;
}