// ############################################
// ##   Edit display
// ############################################
const hero_bg_image_input = document.querySelector("#parts_hero__image_input");
const hero_bg_image = document.querySelector(".part_hero__background");

// Hero画像読込
hero_bg_image_input.addEventListener("change", (e) => {
    const file = e.target.files[0];

    const file_reader = new FileReader();

    // 画像読込
    file_reader.readAsDataURL(file);

    // 画像読込完了時の処理
    file_reader.addEventListener("load", (e) => {
        hero_bg_image.src = e.target.result;
    });
});

// ############################################
// ##   Page-control display
// ############################################
const public_area = document.querySelector("#public_area");
const draft_area = document.querySelector("#draft_area");

function generate_page_title(str) {
    const year = str.split("_")[1].split(".")[0];
    const month = str.split("_")[1].split(".")[1];
    return year + "年" + month + "月号";
}
// PUBLIC
function fetch_public() {
    fetch("./site_list.php")
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error("Network response was not ok!");
            }
        })
        .then((data) => {
            const sorted_keys = Object.keys(data).sort((a, b) => {
                // "yyyy" のような文字列を後ろにする
                const numA = isNaN(a) ? -Infinity : parseInt(a, 10);
                const numB = isNaN(b) ? -Infinity : parseInt(b, 10);
                return numB - numA; // 降順ソート
            });

            const sorted_data = new Map(sorted_keys.map((key) => [key, data[key]]));
            // console.log(sorted_data);

            let public_html = '<ul class="page_list draft">';
            [...sorted_data].map((item) => {
                console.log(item[1]);
                item[1].map((file_name) => {
                    public_html += `<li> ${generate_page_title(file_name)} <div class="btn_wrapper"><button type="button">非公開</button>\
                    <button type="button" onclick="location.href='./public_pages${file_name.replace(".", "")}'">見る</button></div> </li>`;
                });
            });
            public_html += "</ul>";
            public_area.innerHTML = public_html;
            console.log(public_html);
        })
        .catch((er) => console.error("error!", er));
}
fetch_public();
// ----------------------------------------------------------------------

// DRAFT
function fetch_draft() {
    fetch("./draft_list.php")
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error("Network response was not ok!");
            }
        })
        .then((data) => {
            const sorted_keys = Object.keys(data).sort((a, b) => {
                // "yyyy" のような文字列を後ろにする
                const numA = isNaN(a) ? -Infinity : parseInt(a, 10);
                const numB = isNaN(b) ? -Infinity : parseInt(b, 10);
                return numB - numA; // 降順ソート
            });

            const sorted_data = new Map(sorted_keys.map((key) => [key, data[key]]));
            // console.log(sorted_data);

            let draft_html = '<ul class="page_list draft">';
            [...sorted_data].map((item) => {
                console.log(item[1]);
                item[1].map((file_name) => {
                    draft_html += `<li> ${generate_page_title(file_name)} <div class="btn_wrapper"><button type="button">公開する</button>\
                    <button type="button" onclick="location.href='./draft_pages${file_name.replace(".", "")}'">見る</button></div> </li>`;
                });
            });
            draft_html += "</ul>";
            draft_area.innerHTML = draft_html;
            console.log(draft_html);
        })
        .catch((er) => console.error("error!", er));
}
fetch_draft();
// ------------------------------------------------------
