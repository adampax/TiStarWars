// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var film = args.model;

var moment = require('alloy/moment');
var xhr = require('xhr');

//fix for our custom SW font
var title = film.get('title');
if(OS_IOS){
    title = title.toLowerCase();
}
$.win.title = title;

//set the details
$.releaseDate.text = 'Release Date: ' + moment(film.get('release_date')).format('MMMM Do, YYYY');
$.director.text = 'Director: ' + film.get('director');
$.producer.text = 'Producer: ' + film.get('producer');


/**
 * Using Promise.all
 * 
 * In each film object (or model in our case), we have an array containing the
 * url for each character in the movie
 * Ex: http://swapi.co/api/people/1/ (Luke Skywalker)
 * 
 * We will iterate through the characters array and create an xhr request
 * and we'll put all the xhr promises in an array to be tracked by Promise.all()
 * This will let us know when ALL xhr requests are complete.
 */

var characterUrls = film.get('characters');

//let's require Promise lib so we can make use of Promise.all()
var Promise = require('bluebird.core.min');

var characterPromises = Promise.all(characterUrls.map(function (i) {
    return xhr.send({
        url: i
    });
}));

//when all the xhr requests for each character complete, we will be
//notifiyed and can then use all the data as needed
characterPromises.then(function(res) {

    //res in this case is an array of each response added via Promise.all
    Alloy.Collections.characters.reset(res);
})
.catch(function (res) {
    console.error(res);
});



function transformModel(model) {
    transform = model.toJSON();
    transform.title = transform.name;

    return transform;
}

function rowClick(e) {
    args.parent.openSubwindow('characterDetail', { model: Alloy.Collections.characters.at(e.index) });
}

function closeWindow(){
    $.win.close();
}

if(OS_ANDROID){
    $.win.addEventListener('android:back', closeWindow);
}
