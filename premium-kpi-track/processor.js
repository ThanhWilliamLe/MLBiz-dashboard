function pktGetValueOfCard(cardId)
{
	var value = $('#' + cardId).find('.card-value')[0];
	value = value.innerHTML;
	value = numeral(value)._value;
	return value;
}

function pktCardTitlePopup(cardId, popup)
{
	var title = $('#' + cardId).find('.card-title')[0];
	var inner = title.innerHTML + ' <span class="fa fa-question-circle" data-toggle="tooltip" data-placement="bottom" title="' + popup + '"></span>';
	title.innerHTML = inner;
}

function pktDoneQuery(queryings, card, result, func)
{
	$(card).find('.query-spinner').remove();

	var data = JSON.parse(result).data;
	$(card).append('<span class="none card-data">' + JSON.stringify(data) + '</span>');

	var child = pktProcessCard(card, "query", func, data, true);
	$(card).append(child);

	delete queryings[card.id];
	if (Object.keys(queryings).length == 0) pktFinishedQueries();
}

function pktRecalculate()
{
	$("#pktContainer .calculation").remove();
	var cards = $("#tab-premium-kpi #pktContainer").find(".card-block");
	cards.each(function (id)
	{
		var card = cards[id];
		$(card).find(".fa-question-circle").remove();
		var data = $(card).find('.card-data');
		if (data != null && data[0] != null)
		{
			data = JSON.parse(data[0].innerHTML);
			var type = $(card).find('.card-type')[0].innerHTML;
			var func = $(card).find('.card-function')[0].innerHTML;
			$(card).append(pktProcessCard(card, type, func, data, false));
		}
	});
	pktFinishedQueries();
}

function pktProcessCard(card, type, func, data, postQuery)
{
	var result = "";
	if (postQuery && data.cols.length == 1 && data.rows.length == 1) result = pktQueryDisplayAuto(data.rows[0], false);
	if (func != null && func.length > 0)
	{
		result = window["pktCardFunc_" + func](card, data, result);
	}
	return result;
}

function pktFinishedQueries()
{
	$('#pktContainer .query-spinner').remove();

	var kpia = $("#tab-premium-kpi #pktKPIA").val();
	var kpib = $("#tab-premium-kpi #pktKPIB").val();
	var daysLeft = moment.duration(moment($("#tab-premium-kpi #pktUntil").val()).diff(moment($("#tab-premium-kpi #pktABsep").val()))).asDays();

	var usersA = pktGetValueOfCard('usersAZ');
	var usersApre = pktGetValueOfCard('usersAZpre');
	var usersAtoPre = Math.ceil(usersA * kpia / 100);
	var usersAA = pktGetValueOfCard('usersAA');
	var usersAApre = pktGetValueOfCard('usersAApre');
	var usersAAtoPre = Math.ceil(usersAA * kpia / 100);
	var usersAAspeed = pktGetValueOfCard('usersAAspeed');
	var usersAAspeedNeed = Math.max(0,Math.round((usersAAtoPre - usersAApre) / daysLeft));
	var usersAAfuturePre = usersAApre + usersAAspeed * daysLeft;
	var usersAI = pktGetValueOfCard('usersAI');
	var usersAIpre = pktGetValueOfCard('usersAIpre');
	var usersAItoPre = Math.ceil(usersAI * kpia / 100);
	var usersAIspeed = pktGetValueOfCard('usersAIspeed');
	var usersAIspeedNeed = Math.max(0,Math.round((usersAItoPre - usersAIpre) / daysLeft));
	var usersAIfuturePre = usersAIpre + usersAIspeed * daysLeft;
	var usersAO = pktGetValueOfCard('usersAO');
	var usersAOpre = pktGetValueOfCard('usersAOpre');
	var usersAOtoPre = Math.ceil(usersAO * kpia / 100);
	var usersAOspeed = pktGetValueOfCard('usersAOspeed');
	var usersAOspeedNeed = Math.max(0,Math.round((usersAOtoPre - usersAOpre) / daysLeft));
	var usersAOfuturePre = usersAOpre + usersAOspeed * daysLeft;

	var usersB = pktGetValueOfCard('usersBZ');
	var usersBpre = pktGetValueOfCard('usersBZpre');
	var usersBtoPre = Math.ceil(usersB * kpib / 100);
	var usersBA = pktGetValueOfCard('usersBA');
	var usersBApre = pktGetValueOfCard('usersBApre');
	var usersBAtoPre = Math.ceil(usersBA * kpib / 100);
	var usersBAspeed = pktGetValueOfCard('usersBAspeed');
	var usersBAspeedNeed = Math.max(0,Math.round((usersBAtoPre - usersBApre) / daysLeft));
	var usersBAfuturePre = usersBApre + usersBAspeed * daysLeft;
	var usersBI = pktGetValueOfCard('usersBI');
	var usersBIpre = pktGetValueOfCard('usersBIpre');
	var usersBItoPre = Math.ceil(usersBI * kpib / 100);
	var usersBIspeed = pktGetValueOfCard('usersBIspeed');
	var usersBIspeedNeed = Math.max(0,Math.round((usersBItoPre - usersBIpre) / daysLeft));
	var usersBIfuturePre = usersBIpre + usersBIspeed * daysLeft;
	var usersBO = pktGetValueOfCard('usersBO');
	var usersBOpre = pktGetValueOfCard('usersBOpre');
	var usersBOtoPre = Math.ceil(usersBO * kpib / 100);
	var usersBOspeed = pktGetValueOfCard('usersBOspeed');
	var usersBOspeedNeed = Math.max(0,Math.round((usersBOtoPre - usersBOpre) / daysLeft));
	var usersBOfuturePre = usersBOpre + usersBOspeed * daysLeft;

	$("#usersAZtoPre").append(pktQueryDisplayAuto(usersAtoPre));
	$("#usersAZpre").append(pktQueryDisplayAuto([usersApre, usersAtoPre]));
	$("#usersAAtoPre").append(pktQueryDisplayAuto(usersAAtoPre));
	$("#usersAApre").append(pktQueryDisplayAuto([usersAApre, usersAAtoPre]));
	//$("#usersAAspeed").append(pktQueryDisplayAuto([usersAAspeed, usersAAspeedNeed]));
	$("#usersAAspeedNeed").append(pktQueryDisplayAuto(usersAAspeedNeed));
	pktCardTitlePopup("usersAAfuturePre", "Speed " + usersAAspeed + "/" + usersAAspeedNeed + " Required");
	$("#usersAAfuturePre").append(pktQueryDisplayAuto(usersAAfuturePre));
	$("#usersAAfuturePre").append(pktQueryDisplayAuto([usersAAfuturePre, usersAAtoPre]));
	$("#usersAItoPre").append(pktQueryDisplayAuto(usersAItoPre));
	$("#usersAIpre").append(pktQueryDisplayAuto([usersAIpre, usersAItoPre]));
	//$("#usersAIspeed").append(pktQueryDisplayAuto([usersAIspeed, usersAIspeedNeed]));
	$("#usersAIspeedNeed").append(pktQueryDisplayAuto(usersAIspeedNeed));
	pktCardTitlePopup("usersAIfuturePre", "Speed " + usersAIspeed + "/" + usersAIspeedNeed + " Required");
	$("#usersAIfuturePre").append(pktQueryDisplayAuto(usersAIfuturePre));
	$("#usersAIfuturePre").append(pktQueryDisplayAuto([usersAIfuturePre, usersAItoPre]));
	$("#usersAOtoPre").append(pktQueryDisplayAuto(usersAOtoPre));
	$("#usersAOpre").append(pktQueryDisplayAuto([usersAOpre, usersAOtoPre]));
	//$("#usersAOspeed").append(pktQueryDisplayAuto([usersAOspeed, usersAOspeedNeed]));
	$("#usersAOspeedNeed").append(pktQueryDisplayAuto(usersAOspeedNeed));
	pktCardTitlePopup("usersAOfuturePre", "Speed " + usersAOspeed + "/" + usersAOspeedNeed + " Required");
	$("#usersAOfuturePre").append(pktQueryDisplayAuto(usersAOfuturePre));
	$("#usersAOfuturePre").append(pktQueryDisplayAuto([usersAOfuturePre, usersAOtoPre]));

	$("#usersBZtoPre").append(pktQueryDisplayAuto(usersBtoPre));
	$("#usersBZpre").append(pktQueryDisplayAuto([usersBpre, usersBtoPre]));
	$("#usersBAtoPre").append(pktQueryDisplayAuto(usersBAtoPre));
	$("#usersBApre").append(pktQueryDisplayAuto([usersBApre, usersBAtoPre]));
	//$("#usersBAspeed").append(pktQueryDisplayAuto([usersBAspeed, usersBAspeedNeed]));
	$("#usersBAspeedNeed").append(pktQueryDisplayAuto(usersBAspeedNeed));
	pktCardTitlePopup("usersBAfuturePre", "Speed " + usersBAspeed + "/" + usersBAspeedNeed + " Required");
	$("#usersBAfuturePre").append(pktQueryDisplayAuto(usersBAfuturePre));
	$("#usersBAfuturePre").append(pktQueryDisplayAuto([usersBAfuturePre, usersBAtoPre]));
	$("#usersBItoPre").append(pktQueryDisplayAuto(usersBItoPre));
	$("#usersBIpre").append(pktQueryDisplayAuto([usersBIpre, usersBItoPre]));
	//$("#usersBIspeed").append(pktQueryDisplayAuto([usersBIspeed, usersBIspeedNeed]));
	$("#usersBIspeedNeed").append(pktQueryDisplayAuto(usersBIspeedNeed));
	pktCardTitlePopup("usersBIfuturePre", "Speed " + usersBIspeed + "/" + usersBIspeedNeed + " Required");
	$("#usersBIfuturePre").append(pktQueryDisplayAuto(usersBIfuturePre));
	$("#usersBIfuturePre").append(pktQueryDisplayAuto([usersBIfuturePre, usersBItoPre]));
	$("#usersBOtoPre").append(pktQueryDisplayAuto(usersBOtoPre));
	$("#usersBOpre").append(pktQueryDisplayAuto([usersBOpre, usersBOtoPre]));
	//$("#usersBOspeed").append(pktQueryDisplayAuto([usersBOspeed, usersBOspeedNeed]));
	$("#usersBOspeedNeed").append(pktQueryDisplayAuto(usersBOspeedNeed));
	pktCardTitlePopup("usersBOfuturePre", "Speed " + usersBOspeed + "/" + usersBOspeedNeed + " Required");
	$("#usersBOfuturePre").append(pktQueryDisplayAuto(usersBOfuturePre));
	$("#usersBOfuturePre").append(pktQueryDisplayAuto([usersBOfuturePre, usersBOtoPre]));

	$('#tab-premium-kpi [data-toggle="tooltip"]').tooltip();
}

function pktQueryDisplayAuto(value, calc)
{
	if (calc == null) calc = true;
	if (value.constructor === Array && value.length == 2)
	{
		value = pktQueryDisplayProgress(value[0], value[1], calc);
	}
	else if (pktIsNumber(value))
	{
		value = numeral(value).format('0,0');
		value = pktQueryDisplayBigText(value, calc);
	}
	return value;
}

function pktQueryDisplayBigText(value, calc)
{
	return '<h2 class="card-value card-title ' + (calc ? 'calculation' : '') + '">' + value + '</h2>';
}

function pktQueryDisplayProgress(progress, over, calc)
{
	var value = Math.round(progress * 100 / over);
	var color = "bg-success";
	if (value < 40) color = "bg-danger";
	else if (value < 80) color = "bg-warning";
	return '<div class="progress ' + (calc ? 'calculation' : '') + '" data-toggle="tooltip" data-placement="bottom" title="' + progress + ' / ' + over + '">' +
		'<div class="progress-bar ' + color + ' progress-bar-striped progress-bar-animated" role="progressbar" ' +
		'style="width: ' + Math.min(100, value) + '%">' + value + '%' +
		'</div></div>';
}

function pktIsNumber(value)
{
	return !isNaN(value);
}

function pktCardFunc_futureUsers(card, data, preprocessed)
{
	var from = moment($("#tab-premium-kpi #pktABsep").val());
	var to = moment($("#tab-premium-kpi #pktUntil").val());
	var daysTilUntil = Infinity;
	var value = -1;
	var cummulativeUsers = 0;
	data.rows.forEach(function (row)
	{
		row[0] = moment('2014-01-01', 'YYYY-MM-DD').add(row[0], 'days');
		if (row[0].isSameOrBefore(to) && row[0].isSameOrAfter(from)) cummulativeUsers += row[1];
		if (value == -1 && row[0].isSameOrAfter(to))
		{
			value = cummulativeUsers;
		}
		else daysTilUntil = Math.min(daysTilUntil, moment.duration(to.diff(row[0])).asDays());
	});
	if (value == -1)
	{
		var daysToTakeAvg = $("#tab-premium-kpi #pktAvgPeriod").val();
		var speed = pktCalculateAvgSpeed(data.rows, daysToTakeAvg, function (row)
		{
			return row[1]
		});
		value = cummulativeUsers + speed * daysTilUntil;
	}

	return pktQueryDisplayAuto(value);
}

function pktCardFunc_estimateAvg(card, data, preprocessed)
{
	var daysToTakeAvg = $("#tab-premium-kpi #pktAvgPeriod").val();
	var speed = pktCalculateAvgSpeed(data.rows, daysToTakeAvg, null);
	return pktQueryDisplayAuto(speed);
}

function pktCalculateAvgSpeed(history, daysToTakeAvg, func)
{
	return pktCalculateRecentSum(history, daysToTakeAvg, func) / daysToTakeAvg;
}

function pktCalculateRecentSum(history, daysToTakeAvg, func)
{
	if (func == null) func = function (row)
	{
		return row[0];
	};
	var futureSumTotal = 0;
	for (var i = Math.max(0, history.length - daysToTakeAvg - 1); i < history.length - 1; i++)
	{
		futureSumTotal += func(history[i]);
	}
	return futureSumTotal;
}