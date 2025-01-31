// ql-editor ql-blank
import { display_control } from "./common.js";

export function concat_html(page_title, hero_title, hero_bg, toc_content, editor_contents, footer_content) {
    const meta_html = `<!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${page_title} | KIREI通信</title>
        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link href="../web/assets/css/webpage.css" rel="stylesheet" />
    </head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-S99QLCYNP9"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-S99QLCYNP9');
    </script>
    <script src="../web/assets/js/webpage.js" defer></script>
    `;

    const hero_content = `<div class="parts_hero">
    <img class="part_hero__background" src="${hero_bg}" alt="">
    <pre class="parts_hero__title" style="border: none;">${hero_title}</pre></div>`;

    let body_html = `<body>
    <header>
    <div class="header_container">
        <div class="burger_box"><img src="../web/assets/img/cr_logo_motif_r.png" class="burger_img" alt=""></div>
    </div>
    </header>
    <nav class="burger_menu">
    <?php include('../site_list.php') ?>
    </nav>

    ${hero_content}
    <div class="wrapper">
        <div class="top_area">
        ${toc_content}
        </div>
        <hr class="ql-hr" style="margin: 50px 0">
        <div class="contents_area">
        ${editor_contents}
        </div>
    </div>
    ${footer_content}
    </body></html>`;

    return meta_html + body_html;
}

export function create_page(html_data) {
    return fetch("./backend/create_preview_file.php", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            data: html_data,
        }),
    })
        .then((res) => {
            if (res.ok) {
                return res.text();
            } else {
                throw new Error("Network response was not ok!");
            }
        })
        .then((data) => {
            // console.log(data);
            // if (confirm(`新しいページが作成されました：\n${data}\n開きますか？`)) {
            //     window.open(data, "_blank");
            // }
            return fetch("./web/components/preview.php").then((res) => {
                if (res.ok) {
                    return res.text();
                } else {
                    throw new Error("Network response was not ok");
                }
            });
        })
        .catch((er) => {
            console.error("error!", er);
            throw er;
        });
}
