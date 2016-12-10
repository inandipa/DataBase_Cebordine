/**
 * Created by vedav on 12/9/2016.
 */
function checkPasswordMatch() {
    var password = $("#password1").val();
    var confirmPassword = $("#password2").val();

    if (password != confirmPassword)
        $("#divCheckPasswordMatch").html("Passwords do not match!");
    else
        $("#divCheckPasswordMatch").html("Passwords match.");
}
