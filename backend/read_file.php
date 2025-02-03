<?php
// エラーを出力する
ini_set('display_errors', "On");
?>
<?php 
// ###################################################
// #   ページを編集するときにコールされるファイル
// ###################################################
?>

<?php  
$input_json = file_get_contents('php://input');
$post = json_decode( $input_json, true );
$file_path = str_replace('/backend', '/', str_replace('./', __DIR__, $post['path']));

header('Content-Type: application/octet-stream');
header('Content-Length: ' . filesize($file_path));
header('Content-Disposition: attachment; filename=test.html');

readfile($file_path);

?>