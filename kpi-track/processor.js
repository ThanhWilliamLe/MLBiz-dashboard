function getValueOfCard(cardId)
{
	var value = $('#' + cardId).find('.card-value')[0];
	value = value.innerHTML;
	value = numeral(value)._value;
	return value;
}

function doneQuery(queryings, card, result, func)
{
	var data = JSON.parse(result).data;
	var child = processCard(card, "query", func, data, true);
	$(card).append(child);
	delete queryings[card.id];
	if (Object.keys(queryings).length == 0) finishedQueries();
}

function processCard(card, type, func, data, postQuery)
{
	var result = "";
	if (postQuery && data.cols.length == 1 && data.rows.length == 1) result = queryDisplayAuto(data.rows[0]);
	if (func != null && func.length > 0)
	{
		result = window["cardFunc_" + func](card, data, result);
	}
	return result;
}

function finishedQueries()
{
	$('.query-spinner').remove();
	var kpia = $("#tab-kpi #kpia").val();
	var kpib = $("#tab-kpi #kpib").val();
	var daysLeft = moment.duration(moment($("#tab-kpi #until").val()).diff(moment($("#tab-kpi #absep").val()))).asDays();

	var usersA = getValueOfCard('usersA');
	var usersApre = getValueOfCard('usersApre');
	var usersAtoPre = Math.ceil(usersA * kpia / 100);
	var usersAA = getValueOfCard('usersAA');
	var usersAApre = getValueOfCard('usersAApre');
	var usersAAtoPre = Math.ceil(usersAA * kpia / 100);
	var usersAAspeed = getValueOfCard('usersAAspeed');
	var usersAAspeedNeed = Math.round((usersAAtoPre - usersAApre) / daysLeft);
	var usersAAfuturePre = usersAApre + usersAAspeed * daysLeft;
	var usersAI = getValueOfCard('usersAI');
	var usersAIpre = getValueOfCard('usersAIpre');
	var usersAItoPre = Math.ceil(usersAI * kpia / 100);
	var usersAIspeed = getValueOfCard('usersAIspeed');
	var usersAIspeedNeed = Math.round((usersAItoPre - usersAIpre) / daysLeft);
	var usersAIfuturePre = usersAIpre + usersAIspeed * daysLeft;
	var usersAO = getValueOfCard('usersAO');
	var usersAOpre = getValueOfCard('usersAOpre');
	var usersAOtoPre = Math.ceil(usersAO * kpia / 100);
	var usersAOspeed = getValueOfCard('usersAOspeed');
	var usersAOspeedNeed = Math.round((usersAOtoPre - usersAOpre) / daysLeft);
	var usersAOfuturePre = usersAOpre + usersAOspeed * daysLeft;

	var usersB = getValueOfCard('usersB');
	var usersBpre = getValueOfCard('usersBpre');
	var usersBtoPre = Math.ceil(usersB * kpib / 100);
	var usersBA = getValueOfCard('usersBA');
	var usersBApre = getValueOfCard('usersBApre');
	var usersBAtoPre = Math.ceil(usersBA * kpib / 100);
	var usersBAspeed = getValueOfCard('usersBAspeed');
	var usersBAspeedNeed = Math.round((usersBAtoPre - usersBApre) / daysLeft);
	var usersBAfuturePre = usersBApre + usersBAspeed * daysLeft;
	var usersBI = getValueOfCard('usersBI');
	var usersBIpre = getValueOfCard('usersBIpre');
	var usersBItoPre = Math.ceil(usersBI * kpib / 100);
	var usersBIspeed = getValueOfCard('usersBIspeed');
	var usersBIspeedNeed = Math.round((usersBItoPre - usersBIpre) / daysLeft);
	var usersBIfuturePre = usersBIpre + usersBIspeed * daysLeft;
	var usersBO = getValueOfCard('usersBO');
	var usersBOpre = getValueOfCard('usersBOpre');
	var usersBOtoPre = Math.ceil(usersBO * kpib / 100);
	var usersBOspeed = getValueOfCard('usersBOspeed');
	var usersBOspeedNeed = Math.round((usersBOtoPre - usersBOpre) / daysLeft);
	var usersBOfuturePre = usersBOpre + usersBOspeed * daysLeft;

	$("#usersAtoPre").append(queryDisplayAuto(usersAtoPre));
	$("#usersApre").append(queryDisplayAuto([usersApre, usersAtoPre]));
	$("#usersAAtoPre").append(queryDisplayAuto(usersAAtoPre));
	$("#usersAApre").append(queryDisplayAuto([usersAApre, usersAAtoPre]));
	//$("#usersAAspeed").append(queryDisplayAuto([usersAAspeed, usersAAspeedNeed]));
	$("#usersAAspeedNeed").append(queryDisplayAuto(usersAAspeedNeed));
	$("#usersAAfuturePre").append(queryDisplayAuto(usersAAfuturePre));
	$("#usersAAfuturePre").append(queryDisplayAuto([usersAAfuturePre, usersAAtoPre]));
	$("#usersAItoPre").append(queryDisplayAuto(usersAItoPre));
	$("#usersAIpre").append(queryDisplayAuto([usersAIpre, usersAItoPre]));
	//$("#usersAIspeed").append(queryDisplayAuto([usersAIspeed, usersAIspeedNeed]));
	$("#usersAIspeedNeed").append(queryDisplayAuto(usersAIspeedNeed));
	$("#usersAIfuturePre").append(queryDisplayAuto(usersAIfuturePre));
	$("#usersAIfuturePre").append(queryDisplayAuto([usersAIfuturePre, usersAItoPre]));
	$("#usersAOtoPre").append(queryDisplayAuto(usersAOtoPre));
	$("#usersAOpre").append(queryDisplayAuto([usersAOpre, usersAOtoPre]));
	//$("#usersAOspeed").append(queryDisplayAuto([usersAOspeed, usersAOspeedNeed]));
	$("#usersAOspeedNeed").append(queryDisplayAuto(usersAOspeedNeed));
	$("#usersAOfuturePre").append(queryDisplayAuto(usersAOfuturePre));
	$("#usersAOfuturePre").append(queryDisplayAuto([usersAOfuturePre, usersAOtoPre]));

	$("#usersBtoPre").append(queryDisplayAuto(usersBtoPre));
	$("#usersBpre").append(queryDisplayAuto([usersBpre, usersBtoPre]));
	$("#usersBAtoPre").append(queryDisplayAuto(usersBAtoPre));
	$("#usersBApre").append(queryDisplayAuto([usersBApre, usersBAtoPre]));
	//$("#usersBAspeed").append(queryDisplayAuto([usersBAspeed, usersBAspeedNeed]));
	$("#usersBAspeedNeed").append(queryDisplayAuto(usersBAspeedNeed));
	$("#usersBAfuturePre").append(queryDisplayAuto(usersBAfuturePre));
	$("#usersBAfuturePre").append(queryDisplayAuto([usersBAfuturePre, usersBAtoPre]));
	$("#usersBItoPre").append(queryDisplayAuto(usersBItoPre));
	$("#usersBIpre").append(queryDisplayAuto([usersBIpre, usersBItoPre]));
	//$("#usersBIspeed").append(queryDisplayAuto([usersBIspeed, usersBIspeedNeed]));
	$("#usersBIspeedNeed").append(queryDisplayAuto(usersBIspeedNeed));
	$("#usersBIfuturePre").append(queryDisplayAuto(usersBIfuturePre));
	$("#usersBIfuturePre").append(queryDisplayAuto([usersBIfuturePre, usersBItoPre]));
	$("#usersBOtoPre").append(queryDisplayAuto(usersBOtoPre));
	$("#usersBOpre").append(queryDisplayAuto([usersBOpre, usersBOtoPre]));
	//$("#usersBOspeed").append(queryDisplayAuto([usersBOspeed, usersBOspeedNeed]));
	$("#usersBOspeedNeed").append(queryDisplayAuto(usersBOspeedNeed));
	$("#usersBOfuturePre").append(queryDisplayAuto(usersBOfuturePre));
	$("#usersBOfuturePre").append(queryDisplayAuto([usersBOfuturePre, usersBOtoPre]));

	$('[data-toggle="tooltip"]').tooltip();
}

function queryDisplayAuto(value)
{
	if (value.constructor === Array && value.length == 2)
	{
		return queryDisplayProgress(value[0], value[1]);
	}
	if (isNumber(value))
	{
		value = numeral(value).format('0,0');
		return queryDisplayBigText(value);
	}
	return value;
}

function queryDisplayBigText(value)
{
	return '<h2 class="card-value card-title">' + value + '</h2>';
}

function queryDisplayProgress(progress, over)
{
	var value = Math.round(progress * 100 / over);
	var color = "bg-success";
	if (value < 40) color = "bg-danger";
	else if (value < 80) color = "bg-warning";
	return '<div class="progress" data-toggle="tooltip" data-placement="bottom" title="' + progress + ' / ' + over + '">' +
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
	var from = moment($("#tab-kpi #absep").val());
	var to = moment($("#tab-kpi #until").val());
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
		var daysToTakeAvg = $("#tab-kpi #avgperiod").val();
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
	var daysToTakeAvg = $("#tab-kpi #avgperiod").val();
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
	for (var i = history.length - daysToTakeAvg - 1; i < history.length - 1; i++)
	{
		futureSumTotal += func(history[i]);
	}
	return futureSumTotal;
}