<?php 
// ###################################################
// #   ページを下書きするときにコールされるファイル
// ###################################################
?>

<?php  
$input_json = file_get_contents('php://input');
$post = json_decode( $input_json, true );
$file_name = $post['title']; //保存時
// echo $file_name;

$from_path = '../output/data.php';
$to_path = '../draft_pages/'.$file_name.'.php';

if (!copy($from_path, $to_path)) {
    echo 'fail';
}else {
    unlink($from_path);  //削除
    echo 'success';
    // echo 'https://133.18.178.100/vskamei-kirei-newsletter'.str_replace('..','', $to_path) ;
}

?>