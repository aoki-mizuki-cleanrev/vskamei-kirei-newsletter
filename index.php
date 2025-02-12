<?php
// エラーを出力する
ini_set('display_errors', "On");
?>

<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>KIREI通信エディター</title>
        <link rel="stylesheet" href="./web/assets/css/style.css">
        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <!-- Quillのスタイルシート -->
        <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
        <link rel="stylesheet" href="./web/assets/css/quill_css.css">
        <link
              href='https://use.fontawesome.com/releases/v6.6.0/css/all.css'
              rel='stylesheet'
            />
    </head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-S99QLCYNP9"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-S99QLCYNP9');
    </script>

    <body>
        <?php include('./web/components/header.php') ?>
        <main>
            <div class="display_area">
                <!--  -->
                <div class="edit_area hidden edit_gr">
                    <?php include('./web/components/hero.php') ?>
                    <?php include('./web/components/quill_editor.php') ?>
                    <?php include('./web/components/footer.php') ?>
                </div>

                <div class="page_control_area control_gr">
                    <div class="page_list_container">
                        <p class="page_list_title"><i class="fa-solid fa-lock-open"></i> 公開中</p>
                        <div id="public_area">
                            <!-- insert here -->
                            <p style="color:#9b9797;padding:0 2%">公開ページはありません</p>
                        </div>
                        <hr style="margin: 1.5rem 0;">
                        <p class="page_list_title"><i class="fa-solid fa-lock"></i> 非公開</p>
                        <div id="private_area">
                            <!-- insert here -->
                            <p style="color:#9b9797;padding:0 2%">非公開ページはありません</p>
                        </div>
                        <hr style="margin: 1.5rem 0;">
                        <p class="page_list_title"><i class="fa-solid fa-pen-ruler"></i> 下書き</p>
                        <div id="draft_area">
                            <!-- insert here -->
                            <p style="color:#9b9797;padding:0 2%">下書きはありません</p>
                        </div>

                    </div>
                </div>

            </div>
        </main>
        <?php include('./web/components/preview.php') ?>


        <!-- Bootstrap JSと依存関係 -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        <!-- Quillライブラリ -->
        <script src="https://cdn.quilljs.com/latest/quill.js"></script>
        <script src="./web/assets/js/quill_module.js" type="module"></script>
        <script src="./web/assets/js/index.js"></script>
    </body>
</html>
