<!DOCTYPE html>
<html lang="ja">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <link rel="stylesheet" href="./web/assets/css/style.css">
        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <!-- Quillのスタイルシート -->
        <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
        <link rel="stylesheet" href="./web/assets/css/quill_css.css">

    </head>
    <body>
        <?php include('./web/components/header.php') ?>
        <main>
            <div class="display_area">
                <!--  -->
                <div class="insert_area">
                    <?php include('./web/components/hero.php') ?>
                    <?php include('./web/components/quill_editer.php') ?>
                </div>
                </html>
                <!--  -->
                <textarea name="" id="page_html" style="display: none"></textarea>
            </div>
            <!-- <?php include('./web/components/sidenav.php') ?> -->
        </main>

        <!-- <script src="./web/assets/js/create_page.js"></script> -->

        <!-- Bootstrap JSと依存関係 -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        <!-- Quillライブラリ -->
        <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
        <script src="./web/assets/js/quill_module.js" type="module"></script>
    </body>
</html>
