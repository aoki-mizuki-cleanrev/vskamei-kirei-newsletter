<?php

$json = file_get_contents("php://input");
$html_contents = json_decode($json, true);
$res = $html_contents;
// ファイルに書き込むテキスト
// $content = "改行を含む
// テキストを書き込む\n\n";
// $content2 = "テストテキスト";

// ファイルを保存するディレクトリのパス
$path = '../output';

// echo $html_contents ?? 'no';

// ディレクトリに書き込み可能か確認
if( is_writable($path) ) {

// ファイルを書き込みモードで開く
$file_handle = fopen( $path."/data.html", "w");

$html = $html_contents['data'];
// ファイルへデータを書き込み
fwrite( $file_handle, $html);

// ファイルを閉じるhtml
fclose($file_handle);

}else{
    echo 'permission error';
    return ;

}

return json_encode($res);