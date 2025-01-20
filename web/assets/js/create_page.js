// ql-editor ql-blank
export function concat_html(hero_content, toc_content, editor_contents) {
    const meta_html = `<!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8" />
        <title>カスタムQuillリッチテキストエディタ</title>
        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <!-- Quillのスタイルシート -->
        <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                list-style: none;
                text-decoration: none;
                font-family: "Noto Sans JP", system-ui;
                font-optical-sizing: auto;
                font-weight: 600;
                font-style: normal;
                font-weight: 700;
            }

            /* エディターのスタイル */
            #editor-container {
                height: 500px;
                font-size: 16px; /* デフォルトフォントサイズを16pxに設定 */
            }

            /* Iframeのスタイル */
            .quill-iframe {
                border: none;
                max-width: 100%;
            }

            /* ツールバーボタンのスタイル調整（オプション） */
            #toolbar button,
            #toolbar .ql-picker {
                margin-right: 5px;
            }

            /* 目次のスタイル */
            #toc-container {
                border: 1px solid #ccc;
                padding: 10px;
                margin: 10px 0;
                max-height: 200px;
                overflow-y: auto;
                background-color: #f9f9f9;
            }

            #toc-container h3 {
                margin-top: 0;
            }

            #toc-container ul {
                list-style: none;
                padding-left: 0;
            }

            #toc-container ul li {
                margin: 5px 0;
            }

            #toc-container ul li a {
                text-decoration: none;
                color: #007bff;
                cursor: pointer;
            }

            #toc-container ul li a:hover {
                text-decoration: underline;
            }

            /* フォントサイズクラスの定義 */
            .ql-size-12px {
                font-size: 12px;
            }
            .ql-size-14px {
                font-size: 14px;
            }
            .ql-size-16px {
                font-size: 16px;
            }
            .ql-size-18px {
                font-size: 18px;
            }
            .ql-size-20px {
                font-size: 20px;
            }
            .ql-size-24px {
                font-size: 24px;
            }
            .ql-size-32px {
                font-size: 32px;
            }

            /* セグメント線（hr）のスタイル */
            .ql-hr {
                border: none;
                border-top: 2px solid #666;
                margin: 10px 0;
            }
            .ql-snow .ql-editor h1,
            .ql-snow .ql-editor h2,
            .ql-snow .ql-editor h3 {
                margin: 6px 0;
            }
            /* 
            h1::before {
                content: "●";
            } */

           /* --- hero --- */
           .parts_hero {
                width: 100%;
                height: 573px;
                background:rgb(14, 10, 235);
                display: block;
                position: relative;
            }

            /* backgroundのfilter */
            .parts_hero::after {
                content: "";
                background: #000;
                opacity: 0.5;
                width: 100%;
                height: 100%;
                position: absolute;
                inset: 0;
                z-index: 1;
            }

            img.part_hero__background {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;

                /* filter: grayscale(90%); */
            }

            .parts_hero__title {
                position: absolute;
                inset: 0;
                font-size: 64px;
                color: #fff;
                z-index: 2;
                text-align: center;
                align-content: center;
            }
        </style>
    </head>
    `;

    let body_html = `<body> ${hero_content}<div style="padding: 10px 4%"> ${toc_content} <hr class="ql-hr" style="margin: 50px 0"> ${editor_contents} </style></body>`;

    console.log(body_html);
    return meta_html + body_html;
}

export function create_page(html_data) {
    fetch("./backend/create_file.php", {
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
                return res.JSON;
            } else {
                throw new Error("Network response was not ok!");
            }
        })
        .then((data) => {
            console.log(data);
        })
        .catch((er) => {
            console.error("error!", er);
        });
}
