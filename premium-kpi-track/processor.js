function getValueOfCard(cardId)
{
	var value = $('#' + cardId).find('.card-value')[0];
	value = value.innerHTML;
	value = numeral(value)._value;
	return value;
}

function cardTitlePopup(cardId, popup)
{
	var title = $('#' + cardId).find('.card-title')[0];
	var inner = title.innerHTML + ' <span class="fa fa-question-circle" data-toggle="tooltip" data-placement="bottom" title="' + popup + '"></span>';
	title.innerHTML = inner;
}

function doneQuery(queryings, card, result, func)
{
	$(card).find('.query-spinner').remove();

	var data = JSON.parse(result).data;
	$(card).append('<span class="none card-data">' + JSON.stringify(data) + '</span>');

	var child = processCard(card, "query", func, data, true);
	$(card).append(child);

	delete queryings[card.id];
	if (Object.keys(queryings).length == 0) finishedQueries();
}

function recalculate()
{
	$("#tab-premium-kpi .calculation").remove();
	var cards = $("#tab-premium-kpi #container").find(".card-block");
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
			$(card).append(processCard(card, type, func, data, false));
		}
	});
	finishedQueries();
}

function processCard(card, type, func, data, postQuery)
{
	var result = "";
	if (postQuery && data.cols.length == 1 && data.rows.length == 1) result = queryDisplayAuto(data.rows[0], false);
	if (func != null && func.length > 0)
	{
		result = window["cardFunc_" + func](card, data, result);
	}
	return result;
}

function finishedQueries()
{
	$('.query-spinner').remove();

	var kpia = $("#tab-premium-kpi #kpia").val();
	var kpib = $("#tab-premium-kpi #kpib").val();
	var daysLeft = moment.duration(moment($("#tab-premium-kpi #until").val()).diff(moment($("#tab-premium-kpi #absep").val()))).asDays();

	var usersA = getValueOfCard('usersAZ');
	var usersApre = getValueOfCard('usersAZpre');
	var usersAtoPre = Math.ceil(usersA * kpia / 100);
	var usersAA = getValueOfCard('usersAA');
	var usersAApre = getValueOfCard('usersAApre');
	var usersAAtoPre = Math.ceil(usersAA * kpia / 100);
	var usersAAspeed = getValueOfCard('usersAAspeed');
	var usersAAspeedNeed = Math.max(0,Math.round((usersAAtoPre - usersAApre) / daysLeft));
	var usersAAfuturePre = usersAApre + usersAAspeed * daysLeft;
	var usersAI = getValueOfCard('usersAI');
	var usersAIpre = getValueOfCard('usersAIpre');
	var usersAItoPre = Math.ceil(usersAI * kpia / 100);
	var usersAIspeed = getValueOfCard('usersAIspeed');
	var usersAIspeedNeed = Math.max(0,Math.round((usersAItoPre - usersAIpre) / daysLeft));
	var usersAIfuturePre = usersAIpre + usersAIspeed * daysLeft;
	var usersAO = getValueOfCard('usersAO');
	var usersAOpre = getValueOfCard('usersAOpre');
	var usersAOtoPre = Math.ceil(usersAO * kpia / 100);
	var usersAOspeed = getValueOfCard('usersAOspeed');
	var usersAOspeedNeed = Math.max(0,Math.round((usersAOtoPre - usersAOpre) / daysLeft));
	var usersAOfuturePre = usersAOpre + usersAOspeed * daysLeft;

	var usersB = getValueOfCard('usersBZ');
	var usersBpre = getValueOfCard('usersBZpre');
	var usersBtoPre = Math.ceil(usersB * kpib / 100);
	var usersBA = getValueOfCard('usersBA');
	var usersBApre = getValueOfCard('usersBApre');
	var usersBAtoPre = Math.ceil(usersBA * kpib / 100);
	var usersBAspeed = getValueOfCard('usersBAspeed');
	var usersBAspeedNeed = Math.max(0,Math.round((usersBAtoPre - usersBApre) / daysLeft));
	var usersBAfuturePre = usersBApre + usersBAspeed * daysLeft;
	var usersBI = getValueOfCard('usersBI');
	var usersBIpre = getValueOfCard('usersBIpre');
	var usersBItoPre = Math.ceil(usersBI * kpib / 100);
	var usersBIspeed = getValueOfCard('usersBIspeed');
	var usersBIspeedNeed = Math.max(0,Math.round((usersBItoPre - usersBIpre) / daysLeft));
	var usersBIfuturePre = usersBIpre + usersBIspeed * daysLeft;
	var usersBO = getValueOfCard('usersBO');
	var usersBOpre = getValueOfCard('usersBOpre');
	var usersBOtoPre = Math.ceil(usersBO * kpib / 100);
	var usersBOspeed = getValueOfCard('usersBOspeed');
	var usersBOspeedNeed = Math.max(0,Math.round((usersBOtoPre - usersBOpre) / daysLeft));
	var usersBOfuturePre = usersBOpre + usersBOspeed * daysLeft;

	$("#usersAZtoPre").append(queryDisplayAuto(usersAtoPre));
	$("#usersAZpre").append(queryDisplayAuto([usersApre, usersAtoPre]));
	$("#usersAAtoPre").append(queryDisplayAuto(usersAAtoPre));
	$("#usersAApre").append(queryDisplayAuto([usersAApre, usersAAtoPre]));
	//$("#usersAAspeed").append(queryDisplayAuto([usersAAspeed, usersAAspeedNeed]));
	$("#usersAAspeedNeed").append(queryDisplayAuto(usersAAspeedNeed));
	cardTitlePopup("usersAAfuturePre", "Speed " + usersAAspeed + "/" + usersAAspeedNeed + " Required");
	$("#usersAAfuturePre").append(queryDisplayAuto(usersAAfuturePre));
	$("#usersAAfuturePre").append(queryDisplayAuto([usersAAfuturePre, usersAAtoPre]));
	$("#usersAItoPre").append(queryDisplayAuto(usersAItoPre));
	$("#usersAIpre").append(queryDisplayAuto([usersAIpre, usersAItoPre]));
	//$("#usersAIspeed").append(queryDisplayAuto([usersAIspeed, usersAIspeedNeed]));
	$("#usersAIspeedNeed").append(queryDisplayAuto(usersAIspeedNeed));
	cardTitlePopup("usersAIfuturePre", "Speed " + usersAIspeed + "/" + usersAIspeedNeed + " Required");
	$("#usersAIfuturePre").append(queryDisplayAuto(usersAIfuturePre));
	$("#usersAIfuturePre").append(queryDisplayAuto([usersAIfuturePre, usersAItoPre]));
	$("#usersAOtoPre").append(queryDisplayAuto(usersAOtoPre));
	$("#usersAOpre").append(queryDisplayAuto([usersAOpre, usersAOtoPre]));
	//$("#usersAOspeed").append(queryDisplayAuto([usersAOspeed, usersAOspeedNeed]));
	$("#usersAOspeedNeed").append(queryDisplayAuto(usersAOspeedNeed));
	cardTitlePopup("usersAOfuturePre", "Speed " + usersAOspeed + "/" + usersAOspeedNeed + " Required");
	$("#usersAOfuturePre").append(queryDisplayAuto(usersAOfuturePre));
	$("#usersAOfuturePre").append(queryDisplayAuto([usersAOfuturePre, usersAOtoPre]));

	$("#usersBZtoPre").append(queryDisplayAuto(usersBtoPre));
	$("#usersBZpre").append(queryDisplayAuto([usersBpre, usersBtoPre]));
	$("#usersBAtoPre").append(queryDisplayAuto(usersBAtoPre));
	$("#usersBApre").append(queryDisplayAuto([usersBApre, usersBAtoPre]));
	//$("#usersBAspeed").append(queryDisplayAuto([usersBAspeed, usersBAspeedNeed]));
	$("#usersBAspeedNeed").append(queryDisplayAuto(usersBAspeedNeed));
	cardTitlePopup("usersBAfuturePre", "Speed " + usersBAspeed + "/" + usersBAspeedNeed + " Required");
	$("#usersBAfuturePre").append(queryDisplayAuto(usersBAfuturePre));
	$("#usersBAfuturePre").append(queryDisplayAuto([usersBAfuturePre, usersBAtoPre]));
	$("#usersBItoPre").append(queryDisplayAuto(usersBItoPre));
	$("#usersBIpre").append(queryDisplayAuto([usersBIpre, usersBItoPre]));
	//$("#usersBIspeed").append(queryDisplayAuto([usersBIspeed, usersBIspeedNeed]));
	$("#usersBIspeedNeed").append(queryDisplayAuto(usersBIspeedNeed));
	cardTitlePopup("usersBIfuturePre", "Speed " + usersBIspeed + "/" + usersBIspeedNeed + " Required");
	$("#usersBIfuturePre").append(queryDisplayAuto(usersBIfuturePre));
	$("#usersBIfuturePre").append(queryDisplayAuto([usersBIfuturePre, usersBItoPre]));
	$("#usersBOtoPre").append(queryDisplayAuto(usersBOtoPre));
	$("#usersBOpre").append(queryDisplayAuto([usersBOpre, usersBOtoPre]));
	//$("#usersBOspeed").append(queryDisplayAuto([usersBOspeed, usersBOspeedNeed]));
	$("#usersBOspeedNeed").append(queryDisplayAuto(usersBOspeedNeed));
	cardTitlePopup("usersBOfuturePre", "Speed " + usersBOspeed + "/" + usersBOspeedNeed + " Required");
	$("#usersBOfuturePre").append(queryDisplayAuto(usersBOfuturePre));
	$("#usersBOfuturePre").append(queryDisplayAuto([usersBOfuturePre, usersBOtoPre]));

	$('#tab-premium-kpi [data-toggle="tooltip"]').tooltip();
}

function queryDisplayAuto(value, calc)
{
	if (calc == null) calc = true;
	if (value.constructor === Array && value.length == 2)
	{
		value = queryDisplayProgress(value[0], value[1], calc);
	}
	else if (isNumber(value))
	{
		value = numeral(value).format('0,0');
		value = queryDisplayBigText(value, calc);
	}
	return value;
}

function queryDisplayBigText(value, calc)
{
	return '<h2 class="card-value card-title ' + (calc ? 'calculation' : '') + '">' + value + '</h2>';
}

function queryDisplayProgress(progress, over, calc)
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

function isNumber(value)
{
	return !isNaN(value);
}

function cardFunc_futureUsers(card, data, preprocessed)
{
	var from = moment($("#tab-premium-kpi #absep").val());
	var to = moment($("#tab-premium-kpi #until").val());
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
		var daysToTakeAvg = $("#tab-premium-kpi #avgperiod").val();
		var speed = calculateAvgSpeed(data.rows, daysToTakeAvg, function (row)
		{
			return row[1]
		});
		value = cummulativeUsers + speed * daysTilUntil;
	}

	return queryDisplayAuto(value);
}

function cardFunc_estimateAvg(card, data, preprocessed)
{
	var daysToTakeAvg = $("#tab-premium-kpi #avgperiod").val();
	var speed = calculateAvgSpeed(data.rows, daysToTakeAvg, null);
	return queryDisplayAuto(speed);
}

function calculateAvgSpeed(history, daysToTakeAvg, func)
{
	return calculateRecentSum(history, daysToTakeAvg, func) / daysToTakeAvg;
}

function calculateRecentSum(history, daysToTakeAvg, func)
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