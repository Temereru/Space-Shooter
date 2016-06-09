//creates a link to the web socket
let socket = io.connect();

//initilize the score lists to an empty array
let userScores = [];
let highestScores = [];

//called on page load, checks if the user is already logged in, and sets the display based on the result
function onLoad(){
  if(getToken()){
    setLoggedIn();
  }else{
    setLoggedOut();
  }
  let enableScoreSubmit = false;
  //shows the global highest score table as a default
  $('.highest-scores .score-list').toggleClass('show-table');
}

//called when the user submit a registration form, send the AJAX request to the server
function register(){
  //takes the input data from the form
  let user = {
    username: $('.register-form .username').val(),
    password: $('.register-form .password').val()
  };

  //makes sure both username and password fields are filled
  if(user.username === '' || user.password === ''){
    return;
  }

  //the actual AJAX request
  $.ajax({
     method: "POST",
     url: '/user/register',
     dataType: "json",
     data: user,
     success: function(data) {
        //sets the JWT token to the local storage
        _setJWT(data.token);
        setLoggedIn();
     },
     error: function(jqXHR, textStatus, errorThrown) {
        //shows the error to the user
        if(jqXHR.responseText === 'Username already in use.'){
          $('.register-form .error').text(jqXHR.responseText);
        };
     }
  });
}

//called when the user submit a login form, send the AJAX request to the server
function login(){
  //takes the input data from the form
  let user = {
    username: $('.login-form .username').val(),
    password: $('.login-form .password').val()
  };

  //makes sure both username and password fields are filled
  if(user.username === '' || user.password === ''){
    return;
  }

  //the actual AJAX request
  $.ajax({
     method: "POST",
     url: '/user/login',
     dataType: "json",
     data: user,
     success: function(data) {
        //sets the JWT token to the local storage
        _setJWT(data.token);
        setLoggedIn();
     },
     error: function(jqXHR, textStatus, errorThrown) {
        //shows the error to the user
        if(jqXHR.responseText === 'Incorrect username.' || jqXHR.responseText === 'Incorrect password.'){
          $('.login-form .error').text(jqXHR.responseText);
        };
     }
  });
}

//called when the user pressed the logout button, all client side, no server request
function logout(){
  //clear the JWT token
  _clearJWT();
  setLoggedOut();
  //show the user that the logout was successfull
  $('.logout-confirm').removeClass('show');
  $('.logout-success').addClass('show');
}

//called when the user press the send score button, sends the AJAX request to the server
function sendScore(){
  //sets the authentication headers
  let token = getToken();
  let header = 'Bearer ' + token;
  let headers = {Authorization: header}

  //gets the current user ID
  let userId = getUserId();

  //sets the score data to be sent
  let scoreObj = {score: score};

  //the actual AJAX request
  $.ajax({
     method: "POST",
     url: '/user/score/' + userId,
     dataType: "json",
     data: scoreObj,
     headers: headers,
     success: function(data) {
        //sets the updated data to the user score table
        userScores = data;
        displayUserScores();
        enableScoreSubmit = false;
        $('.submit-score .message').text('Successfully submited score');
     },
     error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
     }
  });
}

//called when the user loggs in, sends a request to the server to get the current user scores
function getUserScores(){
  //sets the authentication headers
  let token = getToken();
  let header = 'Bearer ' + token;
  let headers = {Authorization: header}

  //gets the current user ID
  let userId = getUserId();

  //the actual AJAX request
  $.ajax({
     method: "GET",
     url: '/user/score/' + userId,
     dataType: "json",
     headers: headers,
     success: function(data) {
        //sets the data to the user score table
        userScores = data;
        displayUserScores();
     },
     error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
     }
  });
}

//update the display of the user score table
function displayUserScores(){
  for(let i = 2; i <= 11; i++){
    $('.user-scores .score-list tr:nth-child('+i+') td:nth-child(2)').html(userScores[i-2] || 0);
  }
}

//update the display of the global highest score table
function displayHighestScores(){
  for(let i = 2; i <= 11; i++){
    $('.highest-scores .score-list tr:nth-child('+i+') td:nth-child(2)').html(highestScores[i-2].user || '');
    $('.highest-scores .score-list tr:nth-child('+i+') td:nth-child(3)').html(highestScores[i-2].score || 0);
  }
}

//set the JWT token to the local storage 
function _setJWT(token){
  localStorage['JWT'] = token;
};

//delete the JWT token from the local storage
function _clearJWT(){
  localStorage.removeItem('JWT');
};

//get the JWT token from the local storage
function getToken(){ 
  return localStorage['JWT'];
};

//parse the user object from the JWT token
function parseToken(){
  let token = getToken();
  if(token){
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }else{
    return;
  }
  
}

//get the user ID
function getUserId (){
  let user = parseToken();
  return user._id;
}

//display the current user username, if the user is logged out, show nothing
function setUsername(jwtObj){
  if(jwtObj){
    $('.logged-user').text(jwtObj.username);
  }else{
    $('.logged-user').text('');
  }
}

//set all display related stuff for the logged in user, and send the request to get the user scores
function setLoggedIn(){
  setUsername(parseToken());
  //make sure the forms are not displayed
  $('.register-form').removeClass('show');
  $('.login-form').removeClass('show');
  //make sure the register and login buttons are hidden, and the logout button is showed
  $('.menu .register').removeClass('show');
  $('.menu .login').removeClass('show');
  $('.menu .logout').addClass('show');
  //make sure the login warnings are hidden
  $('.restart-login-warning').removeClass('show');
  $('.start-login-warning').removeClass('show');
  getUserScores();
}

//set all display related stuff for no user, and update the user scores display
function setLoggedOut(){
  setUsername(parseToken());
  $('.menu .register').addClass('show');
  $('.menu .login').addClass('show');
  $('.menu .logout').removeClass('show');
  userScores = [];
  displayUserScores();
}

//event listener for a click on the register button
$('.menu .register').on('click', function(e){
  $('.login-form').removeClass('show');
  $('.logout-success').removeClass('show');
  $('.register-form').addClass('show');
});

//event listener for a click on the register close button
$('.register-form').on('click', '.close', function(e){
  $('.register-form').removeClass('show');
});

//event listener for a click on the register form submit button or enter pressed while form is in focus
$('.register-form').on('submit', function(e){
  e.preventDefault();
  register();
});

//event listener for a click on the login button
$('.menu .login').on('click', function(e){
  $('.register-form').removeClass('show');
  $('.logout-success').removeClass('show');
  $('.login-form').addClass('show');
});

//event listener for a click on the login close button
$('.login-form').on('click', '.close', function(e){
  $('.login-form').removeClass('show');
});

//event listener for a click on the login submit button button or enter pressed while form is in focus
$('.login-form').on('submit', function(e){
  e.preventDefault();
  login();
});

//event listener for a click on the logout button
$('.menu .logout').on('click', function(e){
  $('.logout-confirm').addClass('show');
});

//event listener for a click on the logout confirm close button
$('.logout-confirm').on('click', '.close', function(e){
  $('.logout-confirm').removeClass('show');
});

//event listener for a click on the logout confirm button
$('.logout-confirm').on('click', 'button', function(e){
  logout();
});

//event listener for a click on the logout success close button
$('.logout-success').on('click', '.close', function(e){
  $('.logout-success').removeClass('show');
});

//event listener for a click on the score submit close button
$('.submit-score').on('click', '.close', function(e){
  $('.submit-score').removeClass('show');
  $('.submit-score .message').text('');
});

//event listener for a click on the score submit button
$('.submit-score').on('click', 'button', function(e){
  e.preventDefault();
  if(enableScoreSubmit){
    sendScore();
  }
});

//event listener for a click on the global highest score header
$('.highest-scores').on('click', 'h3', function(e){
  $('.highest-scores .score-list').toggleClass('show-table');
  $('.user-scores .score-list').removeClass('show-table')
});

//event listener for a click on the user score header
$('.user-scores').on('click', 'h3', function(e){
  $('.user-scores .score-list').toggleClass('show-table');
  $('.highest-scores .score-list').removeClass('show-table')
});

//listens for the socket getting a scores event, and upadtes the global highest score table with the new data
socket.on('scores', function (data) {
  highestScores = data;
  displayHighestScores();
}); 

//runs the onload function when the page loads
onLoad();
