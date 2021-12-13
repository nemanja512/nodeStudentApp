// Userlist data array for filling in info box
var userListData = [];
//var path = "/users";
var path = "/usersJson";

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    $('#btnAddUser').on('click',addUser);


    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

});

// Functions =============================================================

// TO DO: Fill table with data
function populateTable() {
    $.get(`/usersJson/userlist`,function(res)
    {
        var studenti=res;
        $('#userList table tbody').html('');
        for(var student of studenti)
        {
            insertUserIntoTable(student._id,student.username,student.email);
        }
    });

};

// TO DO: Show User Info
function showUserInfo(event) {
    event.preventDefault();
    $.get(`/usersJson/getuser/${event.target.dataset.id}`,function(res)
    {
        if(res.msg=='')//znaci da nije doslo do greske
        {
            $("#userInfoName").text(res.student.fullname);
            $("#userInfoAge").text(res.student.age);
            $("#userInfoGender").text(res.student.gender);
            $("#userInfoLocation").text(res.student.location);
        }
        else
        {
            console.log(res.msg);
            alert(res.msg);
        }
    });
};

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        // TO DO: create user object
        var newUser = {
          username:$('#inputUserName').val(),
          email:$('#inputUserEmail').val(),
          fullname:$('#inputUserFullname').val(),
          age:$('#inputUserAge').val(),
          location:$('#inputUserLocation').val(),
          gender:$('#inputUserGender').val(),
        };
        // To DO: Use AJAX to post the object to our adduser service
        // If blank message is returned clear inputs and update table
        // else alert response message and log the response.
        $.post('/usersJson/addUser',newUser,function(response)
        {
           if(response.msg=='')
           {
            $('#inputUserName').val(''); 
            $('#inputUserEmail').val(''),
            $('#inputUserFullname').val(''),
            $('#inputUserAge').val(''),
            $('#inputUserLocation').val(''),
            $('#inputUserGender').val(''),
            $('#inputUserName').val('')
            insertUserIntoTable(response.id,newUser.username,newUser.email);
           }
           else
           {
               console.log(response.msg);
               alert(response.msg);
           }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};
function insertUserIntoTable(id,username,email)
{
    $('#userList table tbody').
    append(`
    <tr>
        <td><a href data-id=${id} class="usernameLink">${username}</a></td>
        <td>${email}</td>
        <td><button class="deleteUser" data-id=${id} rel=${username}>Obriši</button></td>
    </tr>`);
    /*
    Posto selektujemo element po klasi mi selektujemo sve elemente koji sadrze tu klasu
    Zbog toga cemo prilikom dodavanja eventa dodati event svim tim elementima
    Moze dodji do problema da nekom vec postojecem elementu opet dodamo isti event
    Time ce ce metoda showUserInfo biti pozvana vise puta,a to nije potrebno
    Zbog toga brisemo sve evente i onda ih opet dodajemo
     */
    $('.usernameLink').off('click',showUserInfo);
    $('.usernameLink').on('click',showUserInfo);
    $('.deleteUser').off('click',deleteUser);
    $('.deleteUser').on('click',deleteUser);
}
// Delete User
function deleteUser(event) {
console.log('delete');
    event.preventDefault();
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user '  +
        $(this).attr('rel') + '?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: path + '/deleteuser/' + $(this).data('id')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};