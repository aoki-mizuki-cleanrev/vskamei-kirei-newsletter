<?php 
$path = "./public_pages";
$files = glob($path.'/*.php');
// print_r($files);

// ファイル作成時刻順でソートするためのコールバック関数
$sort_by_last_modify = function($a, $b){
    return filemtime($b) - filemtime($a);
};
// ファイル作成時刻順でソート
usort($files, $sort_by_last_modify);

echo '<ul>';
foreach ($files as $i) {
    print_r('<li><a href='.$i.'>');
    print_r(str_replace($path.'/', '', str_replace('.php', '', $i)));
    echo '</a></li>';
}
echo '</ul>';

?>

