<?php 
// ###################################################
// #   ページを削除するときにコールされるファイル
// ###################################################
?>

<?php 
$input_json = file_get_contents('php://input');
$post = json_decode( $input_json, true );
$file_path = $post['path'];

unlink('.'.$file_path);  //削除

?>