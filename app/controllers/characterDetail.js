// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var character = args.model;

var moment = require('alloy/moment');
var xhr = require('xhr');

//fix for our custom SW font
var title = character.get('name');
if (OS_IOS) {
    title = title.toLowerCase();
}
$.win.title = title;

//set the details
$.detail1.text = 'Birth Year: ' + character.get('birth_year');



/**
 * We could do this with Promsie.all, but we are going to
 * do some example of making a promise chain to fetch these details
 */

//not all characters have a species for some reason, so do a check
//to see if the array is empty or not
var speciesArray = character.get('species');
var speciesUrl = (speciesArray && speciesArray.length > 0) ? speciesArray[0] : '';

if(speciesUrl){
    xhr.send({
        url: speciesUrl
    })
    .then(function (res) {
        $.detail2.text = 'Species: ' + res.name + ' (' + res.classification + ')';
    });
} else {
    $.detail2.text = 'Species: unknown';
}

xhr.send({
    url: character.get('homeworld')
})
.then(function(res){
    $.detail3.text = 'Homeworld: ' + res.name;
});


function dataFilter(collection){
    //since we already have the films loaded in our collection
    //lets avoid a round trip to fetch them just for this character
    //and filter them instead
    var films = character.get('films');

    return collection.filter(function(film){
        return films.indexOf(film.get('url')) === -1 ? false : true;
    });
}


function closeWindow() {
    $.win.close();
}

if (OS_ANDROID) {
    $.win.addEventListener('android:back', closeWindow);
}

Alloy.Collections.films.trigger('change');

$.win.addEventListener('close', function () {
    $.destroy();
});