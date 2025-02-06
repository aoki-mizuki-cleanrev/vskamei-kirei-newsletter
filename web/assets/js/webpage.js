// ############################################
// ##   発行されたWEBPAGE用のJSファイル
// ############################################
const burger_box = document.querySelector(".burger_box");
const burger_menu = document.querySelector(".burger_menu");

// burgerメニュー：開閉
burger_box.addEventListener("click", () => {
    if (burger_box.matches(".clicked")) {
        burger_box.classList.remove("clicked");
        burger_menu.classList.remove("clicked");
        document.querySelector(".menu_year_list.clicked").classList.remove("clicked");
    } else {
        burger_box.classList.add("clicked");
        burger_menu.classList.add("clicked");
    }
});

// burgerメニュー：違うとこ押して閉じるように
document.addEventListener("click", (e) => {
    if (
        !e.target.matches(".burger_box") &&
        !e.target.matches(".burger_img") &&
        !e.target.matches(".menu_year_title") &&
        !e.target.matches(".menu_year_item") &&
        document.querySelector(".burger_menu.clicked")
    ) {
        burger_box.classList.remove("clicked");
        burger_menu.classList.remove("clicked");
        // アコーディオン閉じ
        document.querySelector(".menu_year_list.clicked").classList.remove("clicked");
    }
});

function burger_menu_fetch() {
    return fetch("../site_list.php")
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error("Network response was not ok");
            }
        })
        .then((json_data) => {
            const sorted_keys = Object.keys(json_data).sort((a, b) => {
                // "yyyy" のような文字列を後ろにする
                const numA = isNaN(a) ? -Infinity : parseInt(a, 10);
                const numB = isNaN(b) ? -Infinity : parseInt(b, 10);
                return numB - numA; // 降順ソート
            });
            // 順序性確保のため、Mapを使用
            const sorted_data = new Map(sorted_keys.map((key) => [key, json_data[key]]));
            return sorted_data;
        })
        .catch((er) => {
            console.error("error!", er);
        });
}
function generate_page_title(str) {
    const year = str.split("_")[1].split(".")[0];
    const month = str.split("_")[1].split(".")[1];
    return year + "年" + month + "月号";
}
menu_html = "<ul class='menu_list'>";
burger_menu_fetch().then((list) => {
    // YEAR取り出し
    [...list].map((key, index, arr) => {
        menu_html += `<li><dl><dt class='menu_year_title'>${key[0]}年</dt><dd class='menu_year_list'>`;
        key[1].map((value) => {
            menu_html += `<a href="${value.replace("./", "../public_pages/")}" class='menu_year_item'>${generate_page_title(value)}</a>`;
        });
        menu_html += "</dd></dl></li>";
    });
    if ([...list].length === 0) {
        menu_html = "<li style='padding:10px 4%'>公開しているページはありません</li>";
    }
    burger_menu.innerHTML = menu_html;

    // アコーディオンメニュー開閉ロジック
    document.addEventListener("click", (e) => {
        if (e.target.matches(".menu_year_title")) {
            _temp = e.target.nextElementSibling;
            if (e.target.closest(".menu_list").querySelectorAll(".clicked")[0]) {
                e.target
                    .closest(".menu_list")
                    .querySelectorAll(".clicked")
                    .forEach((item) => {
                        item.classList.remove("clicked");
                    });
            }
            e.target.nextElementSibling.classList.toggle("clicked");
        }
    });
});
