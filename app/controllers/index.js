var xhr = require('xhr');

/**
 * For our first request, we are going to fetch the entire films collection
 * from the Star Wars API (swapi.co) and add it to a collection that is bound
 * to a table. 
 */

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
