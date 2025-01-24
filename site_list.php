<?php
// エラーを出力する
ini_set('display_errors', "On");
?>

<?php 
// $path = "./public_pages";
$path = __DIR__.'/public_pages';
$files = glob($path.'/*.php');

function extraction_date_vol($str) {
    $_split = explode("_", $str);
    $_split_date = explode(".", $_split[2]);
    $yyyy = $_split_date[0];
    $mm = $_split_date[1];

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
$sort_by_vol = function($a, $b){
    return extraction_date_vol($b)[2]- extraction_date_vol($a)[2];
};
// ファイルをソート
usort($files, $sort_by_vol);

// print_r($files);
$json_array = json_encode($files);

print_r($json_array);

// echo '<ul class="burger_menu_list">';
// foreach ($files as $i) {
//     print_r('<li data-yyyy='.extraction_date_vol($i)[0].'><a href='.str_replace('/var/www/html', '', $i).'>');
//     print_r(generate_page_title($i));
//     echo '</a></li>';
// }
// echo '</ul>';

?>

