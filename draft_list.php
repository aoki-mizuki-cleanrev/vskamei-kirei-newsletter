<?php
// エラーを出力する
ini_set('display_errors', "On");
?>

<?php 
// $path = "./public_pages";
$path = __DIR__.'/draft_pages';
$files = glob($path.'/*.php');

// ファイル作成時刻順でソートするためのコールバック関数
$sort_by_last_modify = function($a, $b){
    return filemtime($b) - filemtime($a);
};

// ファイルをソート by yyyy
usort($files, $sort_by_last_modify);

$json_array = json_encode($files);

print_r($json_array);

