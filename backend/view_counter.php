<?php
// エラーを出力する
ini_set('display_errors', "On");
?>

<?php

// カウント数が記録されているファイルのパス
$file_path = __DIR__.'/count.dat';

// クッキーの名前
$cookie_name = 'page_viewed';
// クッキーの有効期限（秒）
$cookie_duration = 3600; // = 1時間

// カウントを保存するファイルが存在しない場合は作成
if (!file_exists($file_path)) {
    file_put_contents($file_path, '0');
}

// ファイルを排他ロックで開く
$fp = fopen($file_path, 'r+b');

// ファイルのロックに成功した場合のみ処理を続行
if ($fp !== false) {
    // ロックを取得
    if (flock($fp, LOCK_EX)) {
        // ファイルからカウント数を取得
        $count = (int)fgets($fp);

        // クッキーが設定されていない場合のみカウントを増やす
        if (!isset($_COOKIE[$cookie_name])) {
            // カウントをインクリメント
            $count++;
            // ファイルのポインタを先頭に戻してカウント数を書き込む
            rewind($fp);
            fwrite($fp, (string)$count);
            // クッキーを設定
            setcookie($cookie_name, '1', time() + $cookie_duration);
        }
        // ロックを解放
        flock($fp, LOCK_UN);
    }
    // ファイルを閉じる
    fclose($fp);
}

echo $count;

?>