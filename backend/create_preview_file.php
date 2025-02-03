<?php 
// ###########################################################
// #   プレビューページを生成するときにコールされるファイル
// ###########################################################
?>

<?php
$json = file_get_contents("php://input");
$html_contents = json_decode($json, true);
$res = $html_contents;

// ファイルを保存するディレクトリのパス
$path = '../output';

// echo $html_contents ?? 'no';

// ディレクトリに書き込み可能か確認
if( is_writable($path) ) {

// ファイルを書き込みモードで開く
$file_handle = fopen( $path."/data.php", "w");

$html = $html_contents['data'];
// ファイルへデータを書き込み
fwrite( $file_handle, $html);

// ファイルを閉じるhtml
fclose($file_handle);

}else{
    echo 'permission error';
    return ;

}

echo 'https://133.18.178.100/vskamei-kirei-newsletter/output/data.html';
return ;