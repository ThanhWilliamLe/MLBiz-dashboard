var ujmConfig =
	{
		events: [],
		grid: {},
		connections:
			{
				from: {},
				to: {}
			},
		nodes: {}
	};
var ujmData = {};

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
			//ujmGetStuffs(session);
		}
	}
	http.send();
}

function ujmUpdateSettings()
{

}

function ujmInitEventSelector()
{
	ujmConfig.events.forEach(function (event)
	{
		var option = document.createElement("option");
		option.innerHTML = event;
		option.onclick = function (e)
		{
			ujmSetNodeEvent(event, $("#ujmEventSelector")[0].dataset.nodeid);
			$("#ujmEventSelector").css('display', 'none')
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
	$("#ujmEventSelectorClear").click(function ()
	{
		ujmClearNodeLinks($("#ujmEventSelector")[0].dataset.nodeid);
		$("#ujmEventSelector").css('display', 'none')
	})
	$("#ujmEventSelectorRemove").click(function ()
	{
		ujmSetNodeEvent("", $("#ujmEventSelector")[0].dataset.nodeid);
		$("#ujmEventSelector").css('display', 'none')
	})
	$("#ujmEventSelectorClose").click(function ()
	{
		$("#ujmEventSelector").css('display', 'none');
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
	ujmInitCanvas();
	new ResizeSensor($("#ujmTheMap"), function ()
	{
		ujmInitCanvas();
		ujmDisplayData();
	});
	for (var y = 0; y < ujmConfig.grid.cellsY; y++)
	{
		var gridRow = document.createElement("div");
		gridRow.id = "ujmMapRow-" + y;
		gridRow.classList.add("ujmMapRow");
		gridRow.style.height = 100 / ujmConfig.grid.cellsY + "%";
		gridRow.style.width = "100%";
		for (var x = 0; x < ujmConfig.grid.cellsX; x++)
		{
			var cellID = x + y * ujmConfig.grid.cellsX + 1;
			var gridCell = document.createElement("div");
			gridCell.id = "ujmMapCell-" + cellID;
			gridCell.classList.add("ujmMapCell");
			gridCell.style.width = 100 / ujmConfig.grid.cellsX + "%";
			gridCell.style.height = "100%";

			var cellNode = document.createElement("div");
			cellNode.id = "ujmMapNode-" + cellID;
			ujmNodeEmpty(cellNode);
			cellNode.onclick = ujmNodeClick;

			gridCell.append(cellNode);
			gridRow.append(gridCell);
		}
		theMap.append(gridRow);
	}
}

function ujmInitCanvas()
{
	var ctx = $("#ujmMapCanvasTemp")[0].getContext('2d');
	var ctx1 = $("#ujmMapCanvasLinks")[0].getContext('2d');
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	ctx1.canvas.width = window.innerWidth;
	ctx1.canvas.height = window.innerHeight;
	ujmUpdateLinkCanvas();
}

function ujmClearMap()
{
	ujmConfig.nodes = {};
	ujmConfig.connections =
		{
			from: {},
			to: {}
		};
	$(".ujmMapNode").each(function (id, node)
	{
		ujmNodeEmpty(node);
	});
	ujmUpdateLinkCanvas();
	ujmDisplayData();
}

function ujmNodeClick(event)
{
	var node = ujmGetNodeOfMouseEvent(event);
	if (node == null) return;
	var id = ujmNodeId(node);
	$("#ujmEventSelector").css('display', 'flex');
	$("#ujmEventSelector")[0].dataset.nodeid = id;
	$("#ujmEventSelectorInput")[0].focus();
	$("#ujmEventSelectorTitle").html("Set an event for node " + id);
	if (ujmNodeEvent(node) != null) $("#ujmEventSelectorInput")[0].value = ujmNodeEvent(node);
	else $("#ujmEventSelectorInput")[0].value = "";
}

function ujmGetNodeOfMouseEvent(event)
{
	for (var i = 0; i < event.path.length; i++)
	{
		if (event.path[i].classList.contains('ujmMapNode'))
		{
			return event.path[i];
		}
	}
	return null;
}

function ujmNodeEmpty(node)
{
	clearClasses(node);
	node.classList.add("ujmMapNode");
	node.classList.add("ujmMapNode-none");
	$(node).tooltip('dispose');
	node['data-toggle'] = "tooltip";
	node['title'] = "Add an event here";
	$(node).tooltip();
	node.innerHTML = ujmNodeId(node);
	node.draggable = false;
	node.ondrag = null;
	node.ondragstart = null;
	node.ondragover = null;
	node.ondrop = null;
}

function ujmSetNodeEvent(event, nodeID)
{
	if (ujmConfig.nodes == null) ujmConfig.nodes = {};
	var node = $("#ujmMapNode-" + nodeID);
	node[0].dataset.ujmEvent = event;
	if (event == null || event == "")
	{
		ujmNodeEmpty(node[0]);
		ujmClearNodeLinks(nodeID);
		delete ujmConfig.nodes[nodeID];
	}
	else
	{
		ujmConfig.nodes[nodeID] = event;
		node.attr('data-original-title', 'Starting node');
		node.html('<h6 class="ujmNodeEvent">' + event + '</h6>');
		node[0].classList.remove("ujmMapNode-none");
		node[0].classList.add("ujmMapNode-start");
		node[0].draggable = true;
		node[0].ondragstart = function (ev)
		{
			ev.dataTransfer.setDragImage(document.createElement("none"), 0, 0);
			ev.dataTransfer.dropEffect = "move";
			ev.dataTransfer.setData("fromNode", nodeID);
		}
		var ctx = $("#ujmMapCanvasTemp")[0].getContext('2d');
		node[0].ondrag = function (ev)
		{
			requestAnimationFrame(function ()
			{
				var nodeBound = node[0].getBoundingClientRect();
				ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
				ctx.beginPath();
				ctx.setLineDash([5, 3]);
				ctx.moveTo((nodeBound.left + nodeBound.right) / 2, (nodeBound.bottom + nodeBound.top) / 2);
				ctx.lineTo(ev.x, ev.y);
				ctx.lineWidth = 3;
				ctx.strokeStyle = 'white';
				ctx.stroke();
			});
		};
		node[0].ondragend = function (ev)
		{
			requestAnimationFrame(function ()
			{
				ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
			});
		};
		node[0].ondragover = function (ev)
		{
			ev.preventDefault();
		};
		node[0].ondrop = function (ev)
		{
			ujmConnect(ev.dataTransfer.getData("fromNode"), nodeID);
		}
	}
}

function ujmConnect(from, to)
{
	if (from == to) return;
	if (ujmConfig.connections == null) ujmConfig.connections = {from: {}, to: {}};
	if (ujmConfig.connections.from[from] == null) ujmConfig.connections.from[from] = [to];
	else if (!ujmConfig.connections.from[from].includes(to)) ujmConfig.connections.from[from].push(to);
	if (ujmConfig.connections.to[to] == null) ujmConfig.connections.to[to] = [from];
	else if (!ujmConfig.connections.to[to].includes(from)) ujmConfig.connections.to[to].push(from);
	ujmUpdateNodeClass(from);
	ujmUpdateNodeClass(to);
	ujmUpdateLinkCanvas();
}

function ujmUpdateNodeClass(nodeID)
{
	if (nodeID == null) return;
	var node = ujmGetNode(nodeID);
	var links = ujmGetNodeLinks(nodeID);
	node.classList.remove("ujmMapNode-none");
	node.classList.remove("ujmMapNode-start");
	node.classList.remove("ujmMapNode-mid");
	node.classList.remove("ujmMapNode-end");
	if (links.from != null && links.from.length != 0 && links.to != null && links.to.length != 0)
	{
		$(node).attr('data-original-title', 'Between node');
		node.classList.add("ujmMapNode-mid");
	}
	else if (links.to != null && links.to.length != 0)
	{
		$(node).attr('data-original-title', 'Ending node');
		node.classList.add("ujmMapNode-end");
	}
	else
	{
		$(node).attr('data-original-title', 'Starting node');
		node.classList.add("ujmMapNode-start");
	}
}

function ujmClearNodeLinks(nodeID)
{
	Object.keys(ujmConfig.connections.from).forEach(function (from)
	{
		var connections = ujmConfig.connections.from[from];
		console.log(from + "  " + connections);
		for (var id in connections)
		{
			if (nodeID == connections[id])
			{
				delete connections[id];
				ujmUpdateNodeClass(from);
			}
		}
	});
	Object.keys(ujmConfig.connections.to).forEach(function (to)
	{
		var connections = ujmConfig.connections.to[to];
		for (var id in connections)
		{
			if (nodeID == connections[id])
			{
				delete connections[id];
				ujmUpdateNodeClass(to);
			}
		}
	});
	delete ujmConfig.connections.from[nodeID];
	delete ujmConfig.connections.to[nodeID];
	if (ujmNodeEvent(ujmGetNode(nodeID)) != null) ujmUpdateNodeClass(nodeID);
	else ujmNodeEmpty(ujmGetNode(nodeID));
	ujmUpdateLinkCanvas();
}

function ujmUpdateLinkCanvas()
{
	var ctx = $("#ujmMapCanvasLinks")[0].getContext('2d');
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	if (ujmConfig.connections == null) ujmConfig.connections = {from: {}, to: {}};
	Object.keys(ujmConfig.connections.from).forEach(function (from)
	{
		var connections = ujmConfig.connections.from[from];
		var fromNode = ujmGetNode(from);
		var fromBounds = fromNode.getBoundingClientRect();
		var fromX = (fromBounds.left + fromBounds.right) / 2;
		var fromY = (fromBounds.bottom + fromBounds.top) / 2;
		for (var to in connections)
		{
			var toNode = ujmGetNode(connections[to]);
			var toBounds = toNode.getBoundingClientRect();
			var toX = (toBounds.left + toBounds.right) / 2;
			var toY = (toBounds.bottom + toBounds.top) / 2;
			ctx.beginPath();
			//ctx.setLineDash([3, 3]);
			ctx.moveTo(fromX, fromY);
			ctx.lineTo(toX, toY);
			ctx.lineWidth = parseInt($(fromNode).css('paddingLeft'));
			ctx.strokeStyle = '#607DD1';
			ctx.stroke();
		}
	});
}

function ujmGetNodeLinks(nodeID)
{
	var fromLinks = ujmConfig.connections.from[nodeID];
	var toLinks = ujmConfig.connections.to[nodeID];
	if (fromLinks != null) fromLinks = fromLinks.filter(Boolean);
	if (toLinks != null) toLinks = toLinks.filter(Boolean);
	return {
		node: nodeID,
		from: fromLinks,
		to: toLinks
	}
}

function ujmGetNode(id)
{
	return $("#ujmMapNode-" + id)[0];
}

function ujmGetNodePos(id)
{
	var bounds = ujmGetNode(id).getBoundingClientRect();
	var toX = (bounds.left + bounds.right) / 2;
	var toY = (bounds.bottom + bounds.top) / 2;
	return [toX, toY];
}

function ujmNodeId(node)
{
	return node.id.substr(node.id.indexOf('-') + 1);
}

function ujmNodeEvent(node)
{
	return node.dataset.ujmEvent;
}

function ujmEventQuerySelector()
{
	if (Object.keys(ujmConfig.nodes).length == 0) return "";
	var first = true;
	var string = "event_name=any(array[";
	Object.keys(ujmConfig.nodes).forEach(function (node)
	{
		var nodeEvent = ujmConfig.nodes[node];
		if (!first) string += ",";
		string += "'" + nodeEvent + "'";
		first = false;
	});
	string += "])"
	return string;
}

function ujmGetStuffs()
{
	if (Object.keys(ujmConfig.nodes).length = 0) return;
	ujmInitDataStructure();

	var from = moment($("#tab-user-journey #ujmFrom").val());
	var before = moment($("#tab-user-journey #ujmBefore").val());
	var fromFormatted = from.format('YYYY-MM-DD hh:mm:ss');
	var beforeFormatted = before.format('YYYY-MM-DD HH:mm:ss');

	ujmDoQuery(session, ujmDoneCount, {session: session},
		"SELECT count(*) FROM user_event_firebase " +
		"WHERE user_id!='0' and " + ujmEventQuerySelector() + " and " +
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

function ujmDoneCount(query, responseText, ext)
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
		"WHERE user_id!='0' and " + ujmEventQuerySelector() + " and " +
		"timestamp between (extract('epoch' from '" + fromFormatted + "'::timestamp)*1000)::bigint " +
		"and (extract('epoch' from '" + beforeFormatted + "'::timestamp)*1000)::bigint " +
		"ORDER BY user_id, timestamp asc, event_name " +
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
			"WHERE user_id!='0' and " + ujmEventQuerySelector() + " and " +
			"timestamp between (extract('epoch' from '" + newExtra.from + "'::timestamp)*1000)::bigint " +
			"and (extract('epoch' from '" + newExtra.to + "'::timestamp)*1000)::bigint " +
			"ORDER BY user_id, timestamp asc, event_name " +
			"LIMIT " + newExtra.aStep + " OFFSET " + newExtra.step * newExtra.aStep);
	}
	else
	{
		ujmProcessData();
		ujmDisplayData();
		/*
		$("#ujmMap #ujmWaitingPlease")[0].classList.add("none");
		$("#ujmMap #ujmTheMap")[0].classList.remove("none");
		*/
	}
}

function ujmReceiveData(query, responseText, extra)
{
	var data = JSON.parse(responseText).data;
	data.rows.forEach(function (row)
	{
		ujmData.raw.push(row);
	});
	extra.done += data.rows.length;
}

function ujmInitDataStructure()
{
	ujmData =
		{
			nodes: ujmConfig.nodes,
			events: {},
			raw: [],
			steps: {},
			interval: $("#ujmJourneyTime").val()
		};
	Object.keys(ujmData.nodes).forEach(function (nodeID)
	{
		var event = ujmData.nodes[nodeID];
		ujmData.events[event] = {node: nodeID, count: 0};
		ujmData.steps[nodeID] = {};
	});
	Object.keys(ujmConfig.connections.from).forEach(function (nodeID)
	{
		var connections = ujmConfig.connections.from[nodeID];
		connections.forEach(function (toID)
		{
			var str = nodeID + "-" + toID;
			ujmData.steps[nodeID][toID] = 0;
		});
	});
}

function ujmProcessData()
{
	var interval = ujmData.interval * 1000;
	ujmData.raw.forEach(function (row, index)
	{
		var timestamp = row[0];
		var userId = row[1];
		var eventName = row[2];
		var eventNodeID = ujmData.events[eventName].node;
		var platform = row[3];
		ujmData.events[eventName].count++;
		while (index < ujmData.raw.length - 1)
		{
			index++;
			var nextRow = ujmData.raw[index];
			var nextTimestamp = nextRow[0];
			var nextUserId = nextRow[1];
			var nextEventName = nextRow[2];
			var nextEventNodeID = ujmData.events[nextEventName].node;
			var nextPlatform = nextRow[3];

			if (nextUserId != userId || nextPlatform != platform || nextTimestamp - timestamp > interval || eventName == nextEventName) break;

			var currentStep = ujmData.steps[eventNodeID][nextEventNodeID];
			if (currentStep != null && currentStep != undefined)
			{
				currentStep++
				ujmData.steps[eventNodeID][nextEventNodeID] = currentStep;
				break;
			}
		}
	});
}

function ujmDisplayData()
{
	var viz = $("#ujmDataVis");
	while (viz[0].firstChild)
	{
		viz[0].removeChild(viz[0].firstChild);
	}

	if (ujmData == null || ujmData.steps == null) return;

	Object.keys(ujmData.steps).forEach(function (fromID)
	{
		Object.keys(ujmData.steps[fromID]).forEach(function (toID)
		{
			var stepCount = ujmData.steps[fromID][toID];
			var fromCount = ujmData.events[ujmData.nodes[fromID]].count;
			var toCount = ujmData.events[ujmData.nodes[toID]].count;
			var percentage = stepCount / fromCount * 100;
			if (fromCount == 0) percentage = 0;
			if (percentage >= 1) percentage = Math.round(percentage);
			else percentage = Math.round(percentage * 100) / 100;

			var fromPos = ujmGetNodePos(fromID);
			var toPos = ujmGetNodePos(toID);
			var midX = (fromPos[0] + toPos[0]) / 2;
			var midY = (fromPos[1] + toPos[1]) / 2;

			var valueEle = document.createElement("h6");
			valueEle.innerHTML = percentage + "%";
			var displayEle = document.createElement("div");
			displayEle.classList.add("ujmDataPercentage");
			displayEle.append(valueEle);

			viz.append(displayEle);
			var angle = Math.atan2(toPos[1] - fromPos[1], toPos[0] - fromPos[0]) * 180 / Math.PI;
			if (angle > 90 || angle <= -90) angle += 180;
			$(valueEle).rotate(angle);

			displayEle.style.left = midX - $(displayEle).outerWidth() / 2 + "px";
			displayEle.style.top = midY - $(displayEle).outerHeight() / 2 + "px";
		});
	})
}