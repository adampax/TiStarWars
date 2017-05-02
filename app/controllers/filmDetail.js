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


//in each film object (or model in our case), we have an array containing the
//url for each character in the movie
//Ex: http://swapi.co/api/people/1/ (Luke Skywalker)
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
    //console.log(model.toJSON());
    transform = model.toJSON();
    //transform.time = moment(transform.time).format('MM/DD/YY');
    transform.title = transform.name;

    return transform;
}

function rowClick(e) {
    console.log(e);

    console.log(Alloy.Collections.films.at(e.index).toJSON());

    Alloy.createController('detail', Alloy.Collections.films.at(e.index)).getView().open();

    //var v = Alloy.createController('detail', e).getView();
    //Alloy.Globals.tabgroup.activeTab.open(v);
}

function closeWindow(){
    $.win.close();
}

if(OS_ANDROID){
    $.win.addEventListener('android:back', closeWindow);
}
