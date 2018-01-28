var http = new XMLHttpRequest();
var MLDBID = 1;

function kpiTrackUpdate()
{
    var kpia = $("#tab-kpi #kpia").val();
    var kpib = $("#tab-kpi #kpib").val();
    var countries = $("#tab-kpi #countries").val();
    var countriesEx = $("#tab-kpi #countriesex").val();
    var separator = $("#tab-kpi #absep").val();
    var until = $("#tab-kpi #until").val();

    fetchSession();
}

function fetchSession()
{
    http.open('POST', 'https://bi.moneylover.me/api/session', true);
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify({
        username:"thanhletien.william@gmail.com",
        password:"zxcasdqwe123"
    }));
    http.onreadystatechange = function ()
    {
        if (http.readyState == 4 && http.status == 200)
        {
            var session = JSON.parse(http.responseText).id;
            startQuery(session);
        }
    };
}

function startQuery(session)
{
    console.log(query(session,""));
}

function query(session, query)
{
    http.open('POST', 'https://bi.moneylover.me/api/dataset/:json', false);
    http.setRequestHeader("Content-type", "application/json");
    http.setRequestHeader("X-Metabase-Session", session);
    http.send(JSON.stringify({
        database:MLDBID,
        query:query
    }));
}