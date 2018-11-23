/*****************/
/* REGISTER FROM EMAIL PAGE */
/*****************/

$registerFromEmailForm = $('#registration-process-panel').find('form');
var signupFormValidationSettings = {
  errorClass: "error",
  rules: {
    password_confirm: {
      equalTo: "#password"
    }
  }
};

var registerHash;

if ($registerFromEmailForm.length) {
  var pocket = location.search.substr(1).split('&');
  var resetPasswordHash = '';
  for (var i in pocket) {
    var innerPocket = pocket[i].split('=');
    if (innerPocket[0] === 'hash') {
      registerHash = innerPocket[1];
    }
  }
}

$registerFromEmailForm.validate(signupFormValidationSettings);
$registerFromEmailForm.submit(function (e) {
  e.preventDefault();
  resetFormErrors();

  $form = $(this);
  if ($form.valid()) {
    var data = $(this).serialize();
    data += encodeURI("&hash=" + registerHash);
    $.ajax({
      method: 'POST',
      data: data,
      url: host + urlMap.registerFromEmail,
      success: function (response) {
        if (response.status === 'ERROR') {
          showFormErrors(response.error);
        } else {
          localStorage.token = response.data.token;
          localStorage.isSuperagent = response.data.is_superagent;
          location.href = '/';
        }
      }
    });
  }
});
