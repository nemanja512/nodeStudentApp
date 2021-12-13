/**
 * Created by Milos on 02-Apr-17.
 */
var express = require('express');

var fs = require('fs');

// returns array of student objects
var readData = function() {
    if (!fs.existsSync('data.txt')) {
        createEmptyDataFile();
      }
    try{
        var json = fs.readFileSync('data.txt');
        aStudenti = JSON.parse(json);

        return aStudenti;
    }catch(err)
    {
        console.log("ERROR read:" + err.toString());
        throw err;
    }
};


var saveData = function(json){
    if (!fs.existsSync('data.txt')) {
        createEmptyDataFile();
      }
    fs.writeFile('data.txt', json, function(err){
        if (err) throw err;
        console.log("File Saved:" + json);
    });
};
var createEmptyDataFile=function()
{
    fs.writeFileSync("data.txt", '[]')//kreiramo prazan niz
}

module.exports.getUserList = function(req, res) {
    var aStudenti = readData();
    res.json(aStudenti);
};
module.exports.getUserByID = function(req, res) {//napravio sam novu metodu kako ne bih morao celu listu da saljem front endu
    var aStudenti = readData();
    var id=req.params.id;
    var student=null;
    for(var st of aStudenti)
    {
        if(st._id==id)//svaki student treba imati unikatni ID(kako bi smo mogli nedvosmisleno da pronadjemo studenta prilikom brisanja) zbog toga iz liste vec dodatih studenata trazimo studenta sa najvecim IDijem
        {//posle sam video da se prilikom readData dodeljuju IDijevi,mada mislim da je ovako bolje,zato sto u onom slucaju ako izbrisemo nekog studenta odmah svi studenti posle njega dobijaju drugi ID i onda ako front end nije sinhronizovan moze doci do brisanja pogresnog studenta,mada i ovo nijenajsrecnije resenje,ako dva korisnika u bas istom trenutku vrse promene moze da dodje do dodeljivanja istog IDija 2x tj. da dok se vrti for petlja drugi korisnik zavrsi sa dodavanjem studenta
            student=st;
            break;
        }
    }
    if(student==null)
    {
        res.send( { msg: 'Student nije pronadjen'});
    }
    else
    {
        res.send({msg:'',student:student });
    }
    
};
module.exports.addUser = function(req, res) {
    try {
        var aStudenti = readData();
        console.log("add user check:" + aStudenti);
        var maxId=0;
        for(var st of aStudenti)
        {
            if(st._id>maxId)//svaki student treba imati unikatni ID(kako bi smo mogli nedvosmisleno da pronadjemo studenta prilikom brisanja) zbog toga iz liste vec dodatih studenata trazimo studenta sa najvecim IDijem
            {//posle sam video da se prilikom readData dodeljuju IDijevi,mada mislim da je ovako bolje,zato sto u onom slucaju ako izbrisemo nekog studenta odmah svi studenti posle njega dobijaju drugi ID i onda ako front end nije sinhronizovan moze doci do brisanja pogresnog studenta,mada i ovo nijenajsrecnije resenje,ako dva korisnika u bas istom trenutku vrse promene moze da dodje do dodeljivanja istog IDija 2x tj. da dok se vrti for petlja drugi korisnik zavrsi sa dodavanjem studenta
                maxId=st._id;
            }
        }
        var s = req.body;
        s._id=maxId+1;
        console.log(maxId,s);
        aStudenti.push(s);

        json = JSON.stringify(aStudenti);
        saveData(json);
        res.send( { msg: '' ,id:s._id });//front endu prosledjujemo i ID koji smo dodelili novokreiranom korisniku kako bi na front endu mogle da se kreiraju rute za brisanje i prikaz informacija o korisniku
    }
    catch(err) {
        console.log("ERROR adduser:" + err.toString() + err.stack);
        res.send( { msg: err });
        throw err;
    }
};

// TODO: Read data from the file. Find the id of the user that we want to delete.
// Go throug array and delete the user. Save data to file by calling the appropriate function
// if no error, send property msg with empty value back, else send error msg
module.exports.deleteUser = function(req, res) {

    var studenti=readData();
    var id=req.params.id;
    var k=-1;
    console.log(id);
    for(var i in studenti)
    {
        if(studenti[i]._id==id)
        {
            k=i;
            break;
        }
    }
    if(k==-1)
    {
        res.send({msg:"Student ne postoji"});
        return;
    }
    else
    {
        studenti.splice(k,1);
        saveData(JSON.stringify(studenti));
        res.send({msg:''});
    }
};

