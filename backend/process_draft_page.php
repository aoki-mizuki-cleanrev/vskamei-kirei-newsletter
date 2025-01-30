<?php  
$input_json = file_get_contents('php://input');
$post = json_decode( $input_json, true );
$file_name = $post['to'];
$file_name = $post['title'];
$from_file_name = $post['from'];

// echo $file_name;

$from_path = '../output/data.php';
$to_path = '../draft_pages/'.$file_name.'.php';


if (!copy($from_path, $to_path)) {
    echo 'failed to copy file '.$to_path;
}else {
    echo 'https://133.18.178.100/vskamei-kirei-newsletter/draft_pages/'.$file_name.'.php';
}

?>