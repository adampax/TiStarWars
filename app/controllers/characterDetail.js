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

xhr.send({
    url: character.get('species')[0]
})
.then(function(res){
    $.detail2.text = 'Species: ' + res.name + ' ('+ res.classification + ')';
})
.then(function(){
    return xhr.send({
       url: character.get('homeworld')
    });
})
.then(function(res){
    $.detail3.text = 'Homeworld: ' + res.name;
});




function closeWindow() {
    $.win.close();
}

if (OS_ANDROID) {
    $.win.addEventListener('android:back', closeWindow);
}
