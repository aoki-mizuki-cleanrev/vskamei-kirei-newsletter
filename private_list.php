<?php
// エラーを出力する
ini_set('display_errors', "On");
?>

<?php 
// $path = "./public_pages";
$path = __DIR__.'/private_pages';
$files = glob($path.'/*.php');

function extraction_date_vol($str) {
    $_split = explode("_", $str);
    $_split_date = explode(".", $_split[2]);
    $yyyy = intval($_split_date[0]);
    $mm = intval($_split_date[1]);

    $vol = explode(".", $_split[3])[1];

    return [$yyyy, $mm, $vol];
}
// print_r($files);

function generate_page_title($str) {
    $yyyy = extraction_date_vol($str)[0];
    $mm = extraction_date_vol($str)[1];

    return $yyyy.'年'.$mm.'月号';
}

// ファイル作成時刻順でソートするためのコールバック関数
$sort_by_last_modify = function($a, $b){
    return filemtime($b) - filemtime($a);
};
// volでソートするためのコールバック関数
$sort_by_yyyy = function($a, $b){
    return extraction_date_vol($b)[0] - extraction_date_vol($a)[0];
};
// volでソートするためのコールバック関数
$sort_by_vol = function($a, $b){
    return extraction_date_vol($b)[2] - extraction_date_vol($a)[2];
};
// ファイルをソート by yyyy
usort($files, $sort_by_yyyy);
// ファイルをソート by vol
usort($files, $sort_by_vol);

$yyyy = array();
foreach ($files as $index => $value) {
    $filepath = str_replace('/var/www/html/vskamei-kirei-newsletter/private_pages/', './',$value);
    $route = explode("/", $filepath);
    $_temp = [];
    // ファイル名から年を取得
    $y = explode(".", explode("_", $route[count($route) - 1])[1])[0];
    // array_push($yyyy, $y);
    if (!isset($yyyy[$y])) {
        $yyyy[$y] = [];
    }
        array_push($yyyy[$y], $filepath);
}


$json_array = json_encode($yyyy);

print_r($json_array);
?>

