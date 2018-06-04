/**************/
/* PROFILE PAGE */
/**************/


$profileForm = $('#profile-panel').find('form');
var profileFormValidationSettings = {
    errorClass: "error"
};

$profileForm.validate(profileFormValidationSettings);
$profileForm.submit(function (e) {
    e.preventDefault();
    resetFormErrors();

    $form = $(this);
    if ($form.valid()) {
        var data = $(this).serialize();

        $.signedAjax({
            method: 'POST',
            data: data,
            url: host + urlMap.profile,
            success: function (response) {
                if (response.status === 'ERROR') {
                    showFormErrors(response.error);
                } else {
                    showFormSuccess();
                }
            },
            error: function (result) {
                checkAndLogout(result);
            }
        });
    }
});

if ($profileForm.length) {
    $.signedAjax({
        url: host + urlMap.profile,
        success: function (response) {
            if (response.status === 'OK') {
                $submitBtn = $profileForm.find('input[type=submit]');

                $('input[name=username]').val(response.data.email);
                for (var i in response.data.fields) {
                    var name = lodash.snakeCase(i);

                    $submitBtn.before(tplInput({
                        name: name,
                        label: i,
                        value: response.data.fields[i]
                    }));
                }

                if (response.data.consumer_data) {
                    for (var i in response.data.consumer_data) {
                        if (i != 'credentials') {
                            $submitBtn.before(tplInput({
                                name: i,
                                label: 'Consumer ' + i.substr(0, 1).toUpperCase() + i.substr(1),
                                value: response.data.consumer_data[i]
                            }));
                        }
                    }
                    for (var i in response.data.consumer_data) {
                        if (i == 'credentials') {
                            $submitBtn.before(tplTextarea({
                                name: i,
                                label: 'Consumer ' + i.substr(0, 1).toUpperCase() + i.substr(1),
                            }));
                            $('#c'+i).val(JSON.stringify(JSON.parse(response.data.consumer_data[i]), null, '\t'))
                        }
                    }
                }
            }
        },
        error: function (result) {
            checkAndLogout(result);
        }
    });
}
