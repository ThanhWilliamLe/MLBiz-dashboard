var ujmConfig = {};

function userJourneyMapInit()
{
	fetchSessionAndStart(ujmGetEvents);
}

function ujmGetEvents(session)
{
	var http = new XMLHttpRequest();
	http.open('GET', './user-journey-map/events.txt', true);
	http.onreadystatechange = function ()
	{
		if (http.readyState == 4 && http.status == 200)
		{
			ujmConfig.events = http.responseText.split(/\r?\n/);
			ujmInitEventSelector();
			ujmStartMapping();
		}
	}
	http.send();
}

function ujmInitEventSelector()
{
	ujmConfig.events.forEach(function (event)
	{
		var option = document.createElement("option");
		option.innerHTML = event;
		option.onclick = function(e)
		{
			console.log(event);
		}
		$("#ujmEventSelectorList")[0].append(option);
	});
	$("#ujmEventSelectorList").scrollbar();
	$("#ujmEventSelectorInput").focus();
	$("#ujmEventSelectorInput").on('input', function (e)
	{
		var search = $("#ujmEventSelectorInput").val().trim().toLowerCase();
		if (search == "" || search.length == 0) $("#ujmEventSelectorList option").show();
		else
		{
			$("#ujmEventSelectorList option").each(function (id, ele)
			{
				var eleText = ele.innerHTML;
				eleText = eleText.trim().toLowerCase().replaceAll("_", "");
				if (eleText.includes(search)) $(ele).show();
				else $(ele).hide();
			});
		}
	});
}

function ujmStartMapping()
{
	var theMap = $("#ujmTheMap")[0];
	theMap.classList.remove("none");
	ujmConfig.grid =
		{
			cellsX: 10,
			cellsY: 5
		};

	for (var y = 0; y < ujmConfig.grid.cellsY; y++)
	{
		var gridRow = document.createElement("div");
		gridRow.id = "ujmMapRow-" + y;
		gridRow.classList.add("ujmMapRow");
		gridRow.style.height = 100 / ujmConfig.grid.cellsY + "%";
		gridRow.style.width = "100%";
		for (var x = 0; x < ujmConfig.grid.cellsX; x++)
		{
			var cellID = x + y * ujmConfig.grid.cellsX;
			var gridCell = document.createElement("div");
			gridCell.id = "ujmMapCell-" + cellID;
			gridCell.classList.add("ujmMapCell");
			gridCell.style.width = 100 / ujmConfig.grid.cellsX + "%";
			gridCell.style.height = "100%";

			var cellNode = document.createElement("div");
			cellNode.id = "ujmMapNode-" + cellID;
			cellNode.classList.add("ujmMapNode");
			cellNode['data-toggle'] = "tooltip";
			cellNode['title'] = "Add an event node";
			$(cellNode).tooltip();
			cellNode.onclick = ujmNodeClick

			gridCell.append(cellNode);
			gridRow.append(gridCell);
		}
		theMap.append(gridRow);
	}
}

function ujmNodeClick(event)
{
	console.log(ujmNodeId(event.path[0]));
}

function ujmNodeId(node)
{
	return node.id.substr(node.id.indexOf('-')+1);
}

function ujmGetStuffs(session)
{
	var from = moment($("#tab-user-journey #ujmFrom").val());
	var before = moment($("#tab-user-journey #ujmBefore").val());
	var fromFormatted = from.format('YYYY-MM-DD hh:mm:ss');
	var beforeFormatted = before.format('YYYY-MM-DD HH:mm:ss');

	ujmDoQuery(session, ujmDoneCount, {session: session},
		"SELECT count(*) FROM user_event_firebase " +
		"WHERE user_id!='0' and " + ujmEventsSelector + " and " +
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

	/*
		var divFinding = $("#ujmMap #ujmFinding")[0];
		var divFound = $("#ujmMap #ujmFoundCount")[0];
		divFinding.classList.add("none");
		divFound.classList.remove("none");
		divFound.innerHTML = divFound.innerHTML.replace("...", total);
		$("#ujmMap #ujmFoundCount #ujmProcessing").html("0/" + total);
		$("#ujmMap #ujmFoundCount .progress-bar").css('width', '0%');
	*/

	var extra = {
		aStep: aStep,
		total: total,
		step: 0,
		from: fromFormatted,
		to: beforeFormatted,
		done: 0
	};

	ujmDoQuery(extra.session, ujmQueryContinue, extra,
		"SELECT timestamp, user_id, event_name, platform FROM user_event_firebase " +
		"WHERE user_id!='0' and " + ujmEventsSelector + " and " +
		"timestamp between (extract('epoch' from '" + fromFormatted + "'::timestamp)*1000)::bigint " +
		"and (extract('epoch' from '" + beforeFormatted + "'::timestamp)*1000)::bigint " +
		"LIMIT " + aStep);
}

function ujmQueryContinue(query, responseText, extra)
{
	ujmReceiveData(query, responseText, extra);
	/*
	$("#ujmMap #ujmFoundCount #ujmProcessing").html(extra.done + "/" + extra.total);
	$("#ujmMap #ujmFoundCount .progress-bar").css('width', extra.done / extra.total * 100 + '%');
	*/
	if ((extra.step + 1) * extra.aStep < extra.total)
	{
		var newExtra = JSON.parse(JSON.stringify(extra));
		newExtra.step++;
		ujmDoQuery(newExtra.session, ujmQueryContinue, newExtra,
			"SELECT timestamp, user_id, event_name, platform FROM user_event_firebase " +
			"WHERE user_id!='0' and " + ujmEventsSelector + " and " +
			"timestamp between (extract('epoch' from '" + newExtra.from + "'::timestamp)*1000)::bigint " +
			"and (extract('epoch' from '" + newExtra.to + "'::timestamp)*1000)::bigint " +
			"LIMIT " + newExtra.aStep + " OFFSET " + newExtra.step * newExtra.aStep);
	}
	else
	{
		/*
		$("#ujmMap #ujmWaitingPlease")[0].classList.add("none");
		$("#ujmMap #ujmTheMap")[0].classList.remove("none");
		*/
	}
}

function ujmReceiveData(query, responseText, extra)
{
	var data = JSON.parse(responseText).data;
	extra.done += data.rows.length;
	console.log(data);
}