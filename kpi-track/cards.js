function generateCards()
{
	$("#container-cards").find('*').remove();
	var kpia = $("#tab-kpi #kpia").val();
	var kpib = $("#tab-kpi #kpib").val();
	var ct = $("#tab-kpi #countries").val();
	var ctex = $("#tab-kpi #countriesex").val();
	var sep = $("#tab-kpi #absep").val();
	var til = $("#tab-kpi #until").val();
	var sepFormat = sep.substr(8, 2) + "/" + sep.substr(5, 2);
	var tilFormat = til.substr(8, 2) + "/" + til.substr(5, 2);

	var card_aTitle = generateCard(null, 6, "A: Users before " + sepFormat + " and premium from " + sepFormat);
	var card_aUsers = generateCard("usersA", 2, "Total users", "query", "", "SELECT count(1) FROM users " + selector(ct, ctex, null, sep));
	var card_aToPre = generateCard("usersAtoPre", 2, kpia + "% to convert");
	var card_aPre = generateCard("usersApre", 2, "Current premium", "query", "", "SELECT count(1) FROM users " + selector(ct, ctex, null, sep) + " and premium_status=true and premium_date>='" + sep + "'::date");
	var card_aaUsers = generateCard("usersAA", 2, "Android users", "query", "", "SELECT count(1) FROM users " + selector(ct, ctex, null, sep) + " and android");
	var card_aaToPre = generateCard("usersAAtoPre", 2, kpia + "% to convert");
	var card_aaPre = generateCard("usersAApre", 2, "Current premium", "query", "", "SELECT count(1) FROM users " + selector(ct, ctex, null, sep) + " and android and premium_status=true and premium_date>='" + sep + "'::date");
	var card_aaSpeed = generateCard("usersAAspeed", 2, "Convert speed", "query", "estimateAvg", "SELECT count(1) FROM users " + selector(ct, ctex, null, sep) + " and premium_status=true and premium_date is not null and android GROUP BY premium_date::date ORDER BY premium_date::date asc");
	var card_aaSpeedNeed = generateCard("usersAAspeedNeed", 2, "Required speed");
	var card_aaFuturePre = generateCard("usersAAfuturePre", 2, "Future premium at this speed")
	var card_aiUsers = generateCard("usersAI", 2, "iOS users", "query", "", "SELECT count(1) FROM users " + selector(ct, ctex, null, sep) + " and ios");
	var card_aiToPre = generateCard("usersAItoPre", 2, kpia + "% to convert");
	var card_aiPre = generateCard("usersAIpre", 2, "Current premium", "query", "", "SELECT count(1) FROM users " + selector(ct, ctex, null, sep) + " and ios and premium_status=true and premium_date>='" + sep + "'::date");
	var card_aiSpeed = generateCard("usersAIspeed", 2, "Convert speed", "query", "estimateAvg", "SELECT count(1) FROM users " + selector(ct, ctex, null, sep) + " and premium_status=true and premium_date is not null and ios GROUP BY premium_date::date ORDER BY premium_date::date asc");
	var card_aiSpeedNeed = generateCard("usersAIspeedNeed", 2, "Required speed");
	var card_aiFuturePre = generateCard("usersAIfuturePre", 2, "Future premium at this speed");
	var card_aoUsers = generateCard("usersAO", 2, "Other users", "query", "", "SELECT count(1) FROM users " + selector(ct, ctex, null, sep) + " and not android and not ios");
	var card_aoToPre = generateCard("usersAOtoPre", 2, kpia + "% to convert");
	var card_aoPre = generateCard("usersAOpre", 2, "Current premium", "query", "", "SELECT count(1) FROM users " + selector(ct, ctex, null, sep) + " and not android and not ios and premium_status=true and premium_date>='" + sep + "'::date");
	var card_aoSpeed = generateCard("usersAOspeed", 2, "Convert speed", "query", "estimateAvg", "SELECT count(1) FROM users " + selector(ct, ctex, null, sep) + " and premium_status=true and premium_date is not null and not android and not ios GROUP BY premium_date::date ORDER BY premium_date::date asc");
	var card_aoSpeedNeed = generateCard("usersAOspeedNeed", 2, "Required speed");
	var card_aoFuturePre = generateCard("usersAOfuturePre", 2, "Future premium at this speed");

	var card_bTitle = generateCard(null, 6, "B: Users from " + sepFormat + " to " + tilFormat);
	var card_bUsers = generateCard("usersB", 2, "Est. total users", "query", "futureUsers", "SELECT DATE_PART('day', register_date - '2014-01-01') as dt, count(1) FROM users " + selector(ct, ctex, null, til) + " GROUP BY dt ORDER BY dt asc");
	var card_bToPre = generateCard("usersBtoPre", 2, 'Est. ' + kpib + "% to convert");
	var card_bPre = generateCard("usersBpre", 2, "Current premium", "query", "", "SELECT count(1) FROM users " + selector(ct, ctex, sep, til) + " and premium_status=true and premium_date>='" + sep + "'::date");
	var card_baUsers = generateCard("usersBA", 2, "Est. Android users", "query", "futureUsers", "SELECT DATE_PART('day', register_date - '2014-01-01') as dt, count(1) FROM users " + selector(ct, ctex, sep, til) + " and android GROUP BY dt ORDER BY dt asc");
	var card_baToPre = generateCard("usersBAtoPre", 2, kpia + "% to convert");
	var card_baPre = generateCard("usersBApre", 2, "Current premium", "query", "", "SELECT count(1) FROM users " + selector(ct, ctex, sep, til) + " and android and premium_status=true and premium_date>='" + sep + "'::date");
	var card_baSpeed = generateCard("usersBAspeed", 2, "Convert speed", "query", "estimateAvg", "SELECT count(1) FROM users " + selector(ct, ctex, sep, til) + " and premium_status=true and premium_date is not null and android GROUP BY premium_date::date ORDER BY premium_date::date asc");
	var card_baSpeedNeed = generateCard("usersBAspeedNeed", 2, "Required speed");
	var card_baFuturePre = generateCard("usersBAfuturePre", 2, "Future premium at this speed");
	var card_biUsers = generateCard("usersBI", 2, "Est. iOS users", "query", "futureUsers", "SELECT DATE_PART('day', register_date - '2014-01-01') as dt, count(1) FROM users " + selector(ct, ctex, sep, til) + " and ios GROUP BY dt ORDER BY dt asc");
	var card_biToPre = generateCard("usersBItoPre", 2, kpia + "% to convert");
	var card_biPre = generateCard("usersBIpre", 2, "Current premium", "query", "", "SELECT count(1) FROM users " + selector(ct, ctex, sep, til) + " and ios and premium_status=true and premium_date>='" + sep + "'::date");
	var card_biSpeed = generateCard("usersBIspeed", 2, "Convert speed", "query", "estimateAvg", "SELECT count(1) FROM users " + selector(ct, ctex, sep, til) + " and premium_status=true and premium_date is not null and ios GROUP BY premium_date::date ORDER BY premium_date::date asc");
	var card_biSpeedNeed = generateCard("usersBIspeedNeed", 2, "Required speed");
	var card_biFuturePre = generateCard("usersBIfuturePre", 2, "Future premium at this speed");
	var card_boUsers = generateCard("usersBO", 2, "Est. other users", "query", "futureUsers", "SELECT DATE_PART('day', register_date - '2014-01-01') as dt, count(1) FROM users " + selector(ct, ctex, sep, til) + " and not ios and not android GROUP BY dt ORDER BY dt asc");
	var card_boToPre = generateCard("usersBOtoPre", 2, kpia + "% to convert");
	var card_boPre = generateCard("usersBOpre", 2, "Current premium", "query", "", "SELECT count(1) FROM users " + selector(ct, ctex, sep, til) + " and not ios and not android and premium_status=true and premium_date>='" + sep + "'::date");
	var card_boSpeed = generateCard("usersBOspeed", 2, "Convert speed", "query", "estimateAvg", "SELECT count(1) FROM users " + selector(ct, ctex, sep, til) + " and premium_status=true and premium_date is not null and not ios and not android GROUP BY premium_date::date ORDER BY premium_date::date asc");
	var card_boSpeedNeed = generateCard("usersBOspeedNeed", 2, "Required speed");
	var card_boFuturePre = generateCard("usersBOfuturePre", 2, "Future premium at this speed");

	var rows = [];
	rows.push([card_aTitle, card_bTitle]);
	rows.push([card_aUsers, card_aToPre, card_aPre, card_bUsers, card_bToPre, card_bPre]);
	rows.push([generateSeparator()]);
	rows.push([card_aaUsers, card_aaToPre, card_aaPre, card_baUsers, card_baToPre, card_baPre]);
	rows.push([card_aaSpeed, card_aaSpeedNeed, card_aaFuturePre, card_baSpeed, card_baSpeedNeed, card_baFuturePre]);
	rows.push([generateSeparator()]);
	rows.push([card_aiUsers, card_aiToPre, card_aiPre, card_biUsers, card_biToPre, card_biPre]);
	rows.push([card_aiSpeed, card_aiSpeedNeed, card_aiFuturePre, card_biSpeed, card_biSpeedNeed, card_biFuturePre]);
	rows.push([generateSeparator()]);
	rows.push([card_aoUsers, card_aoToPre, card_aoPre, card_boUsers, card_boToPre, card_boPre]);
	rows.push([card_aoSpeed, card_aoSpeedNeed, card_aoFuturePre, card_boSpeed, card_boSpeedNeed, card_boFuturePre]);
	generateElements(rows);
}

function selector(countries, countriesEx, regFrom, regBefore)
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
		selector += "country=any(string_to_array(" + countries + ",',')) ~";
	}
	if (countriesEx != null && countriesEx.length > 0)
	{
		if (!addedWhere)
		{
			addedWhere = true;
			selector += "WHERE ";
		}
		selector = selector.replace('~', 'and ');
		selector += "country!=all(string_to_array(" + countriesEx + ",',')) ~";
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
	//selector = " WHERE 1=1";
	return selector;
}

function generateSeparator()
{
	return '<div class="col-12" style="margin: 0.5em; border: none"><hr style="margin:0; padding:0;border-top: dashed 2px #ccc"></div>';
}

function generateCard(id, width, title, type, func, query)
{
	if (func == undefined) func = "";
	if (query == undefined) query = "";
	var str = '';
	str += '<div class="col-' + width + '">';
	str += '<div class="card text-center">';
	str += '<div  ' + (id != null && id.length > 0 ? 'id="' + id + '" ' : "") + 'class="card-block">'
	str += '<h5 class="card-title title">' + title + ' <span class="fa fa-spinner fa-pulse query-spinner"></span></h5>';
	str += '<span class="none card-query">' + encodeURIComponent(query) + '</span>'
	str += '<span class="none card-type">' + type + '</span>'
	str += '<span class="none card-function">' + func + '</span>'
	str += '</div></div></div>';
	return str;
}

function generateElements(rows)
{
	rows.forEach(function (row)
	{
		var str = '<div class="row no-gutters">';
		row.forEach(function (card)
		{
			str += card;
		});
		str += '</div>';
		$("#container-cards").append(str);
	})
}