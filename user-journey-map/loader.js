function userJourneyMapInit()
{
	fetchSessionAndStart(ujmGetStuffs);
}

function ujmGetStuffs(session)
{
	var from = moment($("#tab-user-journey #ujmFrom").val());
	var before = moment($("#tab-user-journey #ujmBefore").val());
	var fromFormatted = from.format('YYYY-MM-DD hh:mm:ss');
	var beforeFormatted = before.format('YYYY-MM-DD HH:mm:ss');

	ujmDoQuery(session, ujmDoneCount, {session: session},
		"SELECT count(*) FROM user_event_firebase " +
		"WHERE user_id!='0' and " +
		"timestamp between (extract('epoch' from '" + fromFormatted + "'::timestamp)*1000)::bigint " +
		"and (extract('epoch' from '" + beforeFormatted + "'::timestamp)*1000)::bigint ");
}

function ujmDoQuery(session, func, extra, query)
{
	var http = new XMLHttpRequest();
	http.open('POST', 'https://bi.moneylover.me/api/dataset', true);
	http.setRequestHeader("Content-type", "application/json");
	http.setRequestHeader("X-Metabase-Session", session);
	http.onreadystatechange = function ()
	{
		if (http.readyState == 4 && http.status == 200) func(query, http.responseText, extra);
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

function ujmDoneCount(query, responseText, extra)
{
	var from = moment($("#tab-user-journey #ujmFrom").val());
	var before = moment($("#tab-user-journey #ujmBefore").val());
	var fromFormatted = from.format('YYYY-MM-DD hh:mm:ss');
	var beforeFormatted = before.format('YYYY-MM-DD HH:mm:ss');
	var aStep = 10000;
	var total = JSON.parse(responseText).data.rows[0][0];

	var divFinding = $("#ujmMap #ujmFinding")[0];
	var divFound = $("#ujmMap #ujmFoundCount")[0];
	divFinding.classList.add("none");
	divFound.classList.remove("none");
	divFound.innerHTML = divFound.innerHTML.replace("...", total);
	$("#ujmMap #ujmFoundCount #ujmProcessing").html("0/" + total);
	$("#ujmMap #ujmFoundCount .progress-bar").css('width', '0%');

	var extra = {
		aStep: aStep,
		total: total,
		step: 0,
		from: fromFormatted,
		to: beforeFormatted,
		done: 0
	};

	ujmDoQuery(extra.session, ujmQueryContinue, extra,
		"SELECT * FROM user_event_firebase " +
		"WHERE user_id!='0' and " +
		"timestamp between (extract('epoch' from '" + fromFormatted + "'::timestamp)*1000)::bigint " +
		"and (extract('epoch' from '" + beforeFormatted + "'::timestamp)*1000)::bigint " +
		"LIMIT " + aStep);
}

function ujmQueryContinue(query, responseText, extra)
{
	ujmReceiveData(query, responseText, extra);
	$("#ujmMap #ujmFoundCount #ujmProcessing").html(extra.done + "/" + extra.total);
	$("#ujmMap #ujmFoundCount .progress-bar").css('width', extra.done / extra.total * 100 + '%');
	if ((extra.step + 1) * extra.aStep < extra.total)
	{
		var newExtra = JSON.parse(JSON.stringify(extra));
		newExtra.step++;
		ujmDoQuery(newExtra.session, ujmQueryContinue, newExtra,
			"SELECT * FROM user_event_firebase " +
			"WHERE user_id!='0' and " +
			"timestamp between (extract('epoch' from '" + newExtra.from + "'::timestamp)*1000)::bigint " +
			"and (extract('epoch' from '" + newExtra.to + "'::timestamp)*1000)::bigint " +
			"LIMIT " + newExtra.aStep + " OFFSET " + newExtra.step * newExtra.aStep);
	}
	else
	{
		$("#ujmMap #ujmWaitingPlease")[0].classList.add("none");
		$("#ujmMap #ujmTheMap")[0].classList.remove("none");
	}
}

function ujmReceiveData(query, responseText, extra)
{
	var data = JSON.parse(responseText).data;
	extra.done += data.rows.length;

}