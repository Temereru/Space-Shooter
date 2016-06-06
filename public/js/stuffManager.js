
const onLoad = function(){
  if(getToken()){
    setLoggedIn();
  }else{
    setLoggedOut();
  }
}

const register = function(){
  let user = {
    username: $('.register-form .username').val(),
    password: $('.register-form .password').val()
  };
  if(user.username === '' || user.password === ''){
    return;
  }

  $.ajax({
         method: "POST",
         url: '/user/register',
         dataType: "json",
         data: user,
         success: function(data) {
            _setJWT(data.token);
            setLoggedIn();
         },
         error: function(jqXHR, textStatus, errorThrown) {
            if(jqXHR.responseText === 'Username already in use.'){
              $('.register-form .error').text(jqXHR.responseText);
            };
         }
      });
}

const login = function(){
  let user = {
    username: $('.login-form .username').val(),
    password: $('.login-form .password').val()
  };

  if(user.username === '' || user.password === ''){
    return;
  }

  $.ajax({
         method: "POST",
         url: '/user/login',
         dataType: "json",
         data: user,
         success: function(data) {
            _setJWT(data.token);
            setLoggedIn();
         },
         error: function(jqXHR, textStatus, errorThrown) {
            if(jqXHR.responseText === 'Incorrect username.' || jqXHR.responseText === 'Incorrect password.'){
              $('.login-form .error').text(jqXHR.responseText);
            };
         }
      });
}

const logout = function(){
  _clearJWT();
  setLoggedOut();
  $('.logout-confirm').removeClass('show');
  $('.logout-success').addClass('show');
}

const _setJWT = function(token){
  localStorage['JWT'] = token;
};

const _clearJWT = function(){
  localStorage.removeItem('JWT');
};

const getToken = function(){ 
  return localStorage['JWT'];
};

const parseToken = function(){
  let token = getToken();
  if(token){
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }else{
    return;
  }
  
}

const setUsername = function(jwtObj){
  if(jwtObj){
    $('.logged-user').text(jwtObj.username);
  }else{
    $('.logged-user').text('');
  }
}

const setLoggedIn = function(){
  setUsername(parseToken());
  $('.register-form').removeClass('show');
  $('.login-form').removeClass('show');
  $('.menu .register').removeClass('show');
  $('.menu .login').removeClass('show');
  $('.menu .logout').addClass('show');
}

const setLoggedOut = function(){
  setUsername(parseToken());
  $('.menu .register').addClass('show');
  $('.menu .login').addClass('show');
  $('.menu .logout').removeClass('show');
}

$('.menu .register').on('click', function(e){
  $('.login-form').removeClass('show');
  $('.register-form').addClass('show');
});

$('.register-form').on('click', '.close', function(e){
  $('.register-form').removeClass('show');
});

$('.register-form').on('submit', function(e){
  e.preventDefault();
  register();
});

$('.menu .login').on('click', function(e){
  $('.register-form').removeClass('show');
  $('.login-form').addClass('show');
});

$('.login-form').on('click', '.close', function(e){
  $('.login-form').removeClass('show');
});

$('.login-form').on('submit', function(e){
  e.preventDefault();
  login();
});

$('.menu .logout').on('click', function(e){
  $('.logout-confirm').addClass('show');
});

$('.logout-confirm').on('click', '.close', function(e){
  $('.logout-confirm').removeClass('show');
});

$('.logout-confirm').on('click', 'button', function(e){
  logout();
});

$('.logout-success').on('click', '.close', function(e){
  $('.logout-success').removeClass('show');
});

onLoad();
