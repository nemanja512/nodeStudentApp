/**
 * Created by Milos on 02-Apr-17.
 */
var express = require('express');

var fs = require('fs');

// returns array of student objects
var readData = function() {
    try{
        var json = fs.readFileSync('data.txt');
        aStudenti = JSON.parse(json);

        // give each entry _id so that delete button will work
        for (var i = 0, len = aStudenti.length; i < len; i++) {
            aStudenti[i]._id = i;
        }
        return aStudenti;
    }catch(err)
    {
        console.log("ERROR read:" + err.toString());
        throw err;
    }
};


var saveData = function(json){
    fs.writeFile('data.txt', json, function(err){
        if (err) throw err;
        console.log("File Saved:" + json);
    });
};


module.exports.getUserList = function(req, res) {
    var aStudenti = readData();
    res.json(aStudenti);
};

module.exports.addUser = function(req, res) {
    try {
        var aStudenti = readData();
        console.log("add user check:" + aStudenti);
        var s = req.body;
        aStudenti.push(req.body);

        json = JSON.stringify(aStudenti);
        saveData(json);
        res.send( { msg: '' });
    }
    catch(err) {
        throw err;
        console.log("ERROR adduser:" + err.toString() + err.stack);
        res.send( { msg: err });
    }
};

// TODO: Read data from the file. Find the id of the user that we want to delete.
// Go throug array and delete the user. Save data to file by calling the appropriate function
// if no error, send property msg with empty value back, else send error msg
module.exports.deleteUser = function(req, res) {

};

