function generateCards()
{
	var rows = [];
	var row1 = [generateCard(6, "Current Users", "text", "SELECT count(1) FROM users"),
		generateCard(6, "Current Users 2", "text", "SELECT count(1) FROM users")];


	rows.push(row1);
	generateElements(rows);
}

function generateCard(width, title, display, query)
{
	var str = '<div class="card col-' + width + '">';
	str += '<div class="card-block">'
	str += '<h4 class="card-title">' + title + ' <span class="fa fa-spinner fa-pulse"></span></h4>';
	str += '<span class="none card-query">' + query + '</span>'
	str += '<br>'
	str += '<span class="none card-display">' + display + '</span>'
	str += '</div></div>';
	return str;
}

function generateElements(rows)
{
	rows.forEach(function (row)
	{
		var str = '<div class="row">';
		row.forEach(function (card)
		{
			str += card;
		});
		str += '</div>';
		$("#container-cards").append(str);
	})
}