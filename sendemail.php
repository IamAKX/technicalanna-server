<?php
$request = file_get_contents('php://input');
$arr = json_decode($request, true);
$email = $arr['email'];
$otp = $arr['otp'];
$subject = "OTP Verification for Technical Anna";
$msg = "Hi,\nOTP code for email verification is ".$otp;
$headers = "From: admin@technicalanna.com \r\n";
$val = mail($email,$subject,$msg,$headers);
if (!$val) {
    $errorMessage = error_get_last()['message'];
    $res = new \stdClass();
    $res->success = $errorMessage;
    $myJSON = json_encode($res);
    echo $myJSON;
    $log = date("M,d,Y h:i:s A")."\tFailed to send mail to ".$email." - Error : ".$errorMessage."\n";
    file_put_contents('./log_'.date("j.n.Y").'.log', $log, FILE_APPEND);
}
else{
$res = new \stdClass();
$res->success = $val;
$myJSON = json_encode($res);
echo $myJSON;
$log = date("M,d,Y h:i:s A")."\tMail sent to ".$email."\n";
file_put_contents('./log_'.date("j.n.Y").'.log', $log, FILE_APPEND);
}
?>