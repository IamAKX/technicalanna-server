<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
$request = file_get_contents('php://input');
$arr = json_decode($request, true);
$email = $arr['email'];
$otp = $arr['otp'];
// if(isset($_POST['email'])) {
// $email = $_POST["email"];
// }
// if(isset($_POST['otp'])) {
// $otp = $_POST["otp"];
// }
$subject = "OTP Verification for Technical Anna";
$msg = "Hi,\nOTP code for email verification is ".$otp;

echo $email;
echo $subject;
echo $msg;

// $mail = new PHPMailer(true);
// $mail->isSMTP(); 
// $mail->SMTPAuth = true;
// $mail->SMTPSecure = 'ssl';
// $mail->Host = 'smtp.gmail.com';
// $mail->Port = '465';
// $mail->isHTML();
// $mail->Username = 'ncpminds@gmail.com';
// $mail->Password = 'ncp@8600068568';
// $mail->SetFrom('no-reply@technicalanna.com');
// $mail->Subject = $subject;
// $mail->Body = $msg;
// $mail->AddAddress($email);
// if(!$mail->send()) {
//     echo 'Message could not be sent.';
//     echo 'Mailer Error: ' . $mail->ErrorInfo;
// } else {
//     echo 'Message has been sent';
// }

?>