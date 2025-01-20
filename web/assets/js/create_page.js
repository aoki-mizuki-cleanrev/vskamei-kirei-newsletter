// ql-editor ql-blank
export function concat_html(hero_title, hero_bg, toc_content, editor_contents, footer_content) {
    const meta_html = `<!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8" />
        <title>${hero_title}</title>
        <!-- Bootstrap CSS -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
        <!-- Quillのスタイルシート -->
        
        <link href="../web/assets/css/style.css" rel="stylesheet" />
        <link href="../web/assets/css/quill_css.css" rel="stylesheet" />
    </head>
    `;

    const hero_content = `<div class="parts_hero">
    <img class="part_hero__background" src="${hero_bg}" alt="">
    <pre class="parts_hero__title" style="border: none;">${hero_title}</pre></div>`;

    let body_html = `<body> ${hero_content}<div style="padding: 50px 4%"> ${toc_content} <hr class="ql-hr" style="margin: 50px 0"> ${editor_contents}</div> ${footer_content}</body>`;

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
                return res.text();
            } else {
                throw new Error("Network response was not ok!");
            }
        })
        .then((data) => {
            console.log(data);
            if (confirm(`出力先URL：${data} \n ジャンプしますか？`)) {
                location.href = data;
            }
        })
        .catch((er) => {
            console.error("error!", er);
        });
}
