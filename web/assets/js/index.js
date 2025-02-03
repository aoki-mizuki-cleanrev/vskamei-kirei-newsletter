// ############################################
// ##   Switch
// ############################################
// 未保存で離脱防止アラート -------
function onBeforeUnloadEvent(event) {
    event.preventDefault();
    event.returnValue = "";
}
const submit_btn = document.querySelector("#save_btn");
submit_btn.addEventListener("click", () => {
    window.removeEventListener("beforeunload", onBeforeUnloadEvent);
});
//  -----

function editer_mode() {
    document.querySelectorAll(".control_gr").forEach((item) => {
        item.classList.add("hidden");
        window.removeEventListener("beforeunload", onBeforeUnloadEvent);
    });
    document.querySelectorAll(".edit_gr").forEach((item) => {
        item.classList.remove("hidden");
        window.addEventListener("beforeunload", onBeforeUnloadEvent);
    });
}

function control_mode() {
    document.querySelectorAll(".control_gr").forEach((item) => {
        item.classList.remove("hidden");
        window.addEventListener("beforeunload", onBeforeUnloadEvent);
    });
    document.querySelectorAll(".edit_gr").forEach((item) => {
        item.classList.add("hidden");
        window.removeEventListener("beforeunload", onBeforeUnloadEvent);
    });
}

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

//MODAL Tab Switch
function tabClick() {
    let tab = document.getElementsByName("tab");
    const bar = document.querySelector(".underbar");
    tab.forEach((item) => {
        if (item.checked) {
            bar.classList.toggle("to_html");
            the_class = "." + item.id.split("_")[0] + "_area";
            document.querySelector(the_class).style.display = "block";
        } else {
            the_class = "." + item.id.split("_")[0] + "_area";
            document.querySelector(the_class).style.display = "none";
        }
    });
}

// ############################################
// ##   Page-control display
// ############################################
const public_area = document.querySelector("#public_area");
const draft_area = document.querySelector("#draft_area");

function generate_page_title(str) {
    const year = str.split("_")[1].split(".")[0];
    const month = str.split("_")[1].split(".")[1];
    const vol = str.split("_")[2].split(".")[1];
    return year + "年" + month + "月号 vol " + vol;
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
                    public_html += `<li data-link="./public_pages${file_name.replace(
                        ".",
                        ""
                    )}"> <div class="page_name">${generate_page_title(file_name)}</div> <div class="btn_wrapper">\
                    <button type="button" class="switch_btn be_private" data-link="./public_pages${file_name.replace(
                        ".",
                        ""
                    )}" title="非公開にする">非公開</button>\
                    <button type="button" class="watch_btn" onclick="window.open('./public_pages${file_name.replace(
                        ".",
                        ""
                    )}','_blank')" ><i class="fa-solid fa-eye"></i></button>\
                    </div> </li>`;
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
    console.log("2DRAFT");
    fetch("./draft_list.php")
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error("Network response was not ok!");
            }
        })
        .then((data) => {
            console.log(data);
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
                    draft_html += `<li data-link="./draft_pages${file_name.replace(".", "")}"> <div class="page_name">${generate_page_title(
                        file_name
                    )} </div><div class="btn_wrapper">\
                    <button type="button" class="delete_btn" title="削除" onclick="delete_draft('./draft_pages${file_name.replace(
                        ".",
                        ""
                    )}')"><i class="fas fa-trash-can"></i></button>\
                    <button type="button" class="switch_btn be_public" data-link="./draft_pages${file_name.replace(
                        ".",
                        ""
                    )}" title="公開する">公開</button>\
                    <button type="button" class="watch_btn" onclick="window.open('./draft_pages${file_name.replace(
                        ".",
                        ""
                    )}','_blank')"><i class="fa-solid fa-eye"></i></button>\
                    </div> </li>`;
                });
            });
            draft_html += "</ul>";
            draft_area.innerHTML = draft_html;
            console.log(draft_html);
        })
        .catch((er) => {
            console.error("error!", er);
        });
}
fetch_draft();
// ------------------------------------------------------
function switch_public(file_path) {
    const post_data = {
        from_path: "." + file_path,
    };

    fetch("./backend/process_public_page.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(post_data),
    })
        .then((res) => {
            if (res.ok) {
                return res.text();
            } else {
                throw new Error("Network response was not ok");
            }
        })
        .then((data) => {
            fetch_public();
            fetch_draft();
        })
        .catch((er) => console.error("Error!!", er));
}

function switch_private(file_path) {
    const post_data = {
        from_path: "." + file_path,
    };

    fetch("./backend/process_draft_page.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(post_data),
    })
        .then((res) => {
            if (res.ok) {
                return res.text();
            } else {
                throw new Error("Network response was not ok");
            }
        })
        .then((data) => {
            fetch_public();
            fetch_draft();
        })
        .catch((er) => console.error("Error!!", er));
}

document.addEventListener("click", (e) => {
    if (e.target.matches(".be_private")) {
        console.log(e.target.dataset.link);
        switch_private(e.target.dataset.link);
    }
});
document.addEventListener("click", (e) => {
    if (e.target.matches(".be_public")) {
        console.log(e.target.dataset.link);
        switch_public(e.target.dataset.link);
    }
});

function extract_elems(elm) {
    // 受け取ったデータから抽出
    const parser = new DOMParser();
    const doc = parser.parseFromString(elm, "text/html");

    const page_title = doc.title;
    const hero__background = doc.querySelector(".part_hero__background").src;
    const hero__title = doc.querySelector(".parts_hero__title").textContent;
    const top = doc.querySelector("#toc-list").innerHTML;
    const contents = doc.querySelector(".contents_area").innerHTML;
    console.log(hero__title, top, contents);

    // エディターに挿入
    document.querySelector("#page_title").value = page_title.replace(" | KIREI通信", "");
    document.querySelector(".part_hero__background").src = hero__background;
    document.querySelector(".parts_hero__title").textContent = hero__title;
    document.querySelector("#toc-list").innerHTML = top;
    document.querySelector(".ql-editor").classList.remove("ql-blank");
    document.querySelector(".ql-editor").innerHTML = contents;
}

function edit_page(url) {
    const post_data = {
        path: url,
    };
    fetch("./backend/read_file.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(post_data),
    })
        .then((res) => {
            if (res.ok) {
                return res.text();
            } else {
                throw new Error("Network response was not ok");
            }
        })
        .then((data) => {
            console.log(data);
            // エディタ表示
            editer_mode();

            extract_elems(data);
        })
        .catch((er) => {
            console.error("Error", er);
        });
}

document.addEventListener("click", (e) => {
    // 編集画面を出すとき
    if (e.target.matches("li")) {
        const url = e.target.dataset.link;
        edit_page(url);
    }
});

function delete_draft(url) {
    const post_data = {
        path: url,
    };
    if (confirm("本当に削除しますか？この操作はとりけせません")) {
        fetch("./backend/delete_file.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(post_data),
        })
            .then((res) => {
                if (res.ok) {
                    return res.text();
                } else {
                    throw new Error("Network response was not ok");
                }
            })
            .then((data) => {
                fetch_draft();
                // console.log(data);
            })
            .catch((er) => console.error("Error!", er));
    }
}
