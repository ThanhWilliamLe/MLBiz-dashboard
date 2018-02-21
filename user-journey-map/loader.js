function userJourneyMapInit()
{
	gapi.load('client', startApi);
}

function startApi()
{
	gapi.client.init({
		'apiKey': 'AIzaSyCp1GDvhEd8cIY5cT0T1v_Z07507bwKEjY',
		'clientId': '558891751052-cui3l00hdb2cs1d9k9fru3q3f2knbh7m.apps.googleusercontent.com',
		'scope': 'profile',
	}).then(function ()
	{
		// 3. Initialize and make the API request.
		return gapi.client.request({
			'path': 'https://www.googleapis.com/',
		})
	}).then(function (response)
	{
		console.log(response.result);
	}, function (reason)
	{
		console.log(reason);
	});
};