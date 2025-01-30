<?php
// auth.php

// 認証情報の設定
$VALID_USERNAME = 'admin';
$VALID_PASSWORD = 'admin';

// 認証ヘッダーが送信されているか確認
if (!isset($_SERVER['PHP_AUTH_USER'])) {
    // 認証ヘッダーがない場合、認証を要求
    header('WWW-Authenticate: Basic realm="Protected Area"');
    header('HTTP/1.0 401 Unauthorized');
    echo '認証が必要です。';
    exit;
} else {
    // 認証情報を検証
    if ($_SERVER['PHP_AUTH_USER'] !== $VALID_USERNAME || $_SERVER['PHP_AUTH_PW'] !== $VALID_PASSWORD) {
        // 認証失敗
        header('WWW-Authenticate: Basic realm="Protected Area"');
        header('HTTP/1.0 401 Unauthorized');
        echo '認証に失敗しました。';
        exit;
    }
    // 認証成功: 続行
}
?>
