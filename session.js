var session;

function fetchSessionAndStart(func)
{
	var xhrOldSession = new XMLHttpRequest();
	xhrOldSession.open('GET', './saved-session.txt', true);
	xhrOldSession.onreadystatechange = function ()
	{
		if (xhrOldSession.readyState == 4 && xhrOldSession.status == 200)
		{
			session = xhrOldSession.responseText;
			if (session != null && session != "" && session.length > 0 && /\s/.test(session) == false && testSession(session))
			{
				func(session);
			}
			else
			{
				var xhrNewSession = new XMLHttpRequest();
				xhrNewSession.open('POST', 'https://bi.moneylover.me/api/session', true);
				xhrNewSession.setRequestHeader("Content-type", "application/json");
				xhrNewSession.onreadystatechange = function ()
				{
					if (xhrNewSession.readyState == 4)
					{
						if (xhrNewSession.status == 200)
						{
							if (/\s/.test(xhrNewSession.responseText) == false && xhrNewSession.responseText != null && xhrNewSession.responseText != "")
							{
								session = JSON.parse(xhrNewSession.responseText).id;
								func(session);
								xhrOldSession.open('POST', './session.php', true);
								xhrOldSession.send(JSON.stringify({session: session}));
							}
						}
						else
						{
							console.log('Please try again in a few minutes.');
						}
					}
				};
				xhrNewSession.send(JSON.stringify({
					username: "thanhlt@moneylover.me",
					password: "12369874"
				}));
			}
		}
	}

	xhrOldSession.send();
}

function testSession(session)
{
	var http = new XMLHttpRequest();
	http.open('POST', 'https://bi.moneylover.me/api/dataset', false);
	http.setRequestHeader("Content-type", "application/json");
	http.setRequestHeader("X-Metabase-Session", session);
	var payload =
		{
			database: MLDBID,
			type: "native",
			native:
				{
					query: "SELECT 1 FROM users GROUP BY 1"
				}
		}
	http.send(JSON.stringify(payload));
	try
	{
		if (JSON.parse(http.responseText).data.rows[0][0] == 1) return true;
		else return false;
	} catch (e)
	{
		return false;
	}
	return true;
}
