<?php  
$input_json = file_get_contents('php://input');
$post = json_decode( $input_json, true );
$file_name = $post['title']; //保存時
$from_path = $post['from_path']; //公開から非公開に変える時
// echo $file_name;

$from_path = isset($from_path) ?  $from_path :'../output/data.php';
$to_path = isset($file_name) ? '../draft_pages/'.$file_name.'.php' : str_replace('public_pages', 'draft_pages', $from_path);


if (!copy($from_path, $to_path)) {
    echo 'failed to copy file '.$to_path;
}else {
    // unlink($from_path);  //削除
    echo 'https://133.18.178.100/vskamei-kirei-newsletter'.str_replace('..','', $to_path) ;
}

?>