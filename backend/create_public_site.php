<?php  
$input_json = file_get_contents('php://input');
$post = json_decode( $input_json, true );
$site_name = $post['title'];

echo $site_name;

$from_path = '../output/data.php';
$to_path = '../public_pages/'.$site_name.'.php';

if (!copy($from_path, $to_path)) {
    echo 'failed to copy file '.$to_path;
}else {
    echo 'OK';
}

?>