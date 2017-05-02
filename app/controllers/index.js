var moment = require('alloy/moment');
var xhr = require('xhr');

xhr.send({
	url: 'https://swapi.co/api/films'
})
.then(function (res) {
	//we can quickly add the results to the films collection
	//and trigger a fetch on the tableview binding with reset()
	Alloy.Collections.films.reset(res.results);
})
.catch(function (res) {
	console.error(res);
});



function rowClick(e) {
	
	$.index.openSubwindow('filmDetail', { model: Alloy.Collections.films.at(e.index) });
}


$.index.open();
