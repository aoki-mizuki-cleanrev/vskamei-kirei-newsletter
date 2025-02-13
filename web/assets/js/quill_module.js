import { concat_html, create_page } from "./create_page.js";

document.addEventListener("DOMContentLoaded", () => {
    // ====================================================
    // Quill初期設定とカスタムBlotの定義
    // ====================================================
    const Quill = window.Quill;
    const Embed = Quill.import("blots/embed");
    const BlockEmbed = Quill.import("blots/block/embed");

    // --- VideoBlot: <video>タグ用 ---
    // ※既存の Quill の video ブロットを上書きします
    class VideoBlot extends Quill.import("blots/block/embed") {
        static blotName = "video";
        static tagName = "video";

        static create(value) {
            let node = document.createElement("video"); // 直接 <video> 要素を生成
            node.setAttribute("src", value);
            node.setAttribute("controls", "true");
            node.setAttribute("width", "100%");
            return node;
        }

        static value(node) {
            return node.getAttribute("src");
        }
    }

    Quill.register(VideoBlot);

    // --- IframeBlot: <iframe>タグ用 ---
    class IframeBlot extends Embed {
        static blotName = "iframe";
        static tagName = "iframe";
        static className = "quill-iframe";

        static create(value) {
            let node = super.create();
            node.setAttribute("src", value.src);
            node.setAttribute("frameborder", "0");
            node.setAttribute("allowfullscreen", "");
            node.setAttribute("width", value.width || "600");
            node.setAttribute("height", value.height || "500");
            if (value.classList) {
                node.classList.add(value.classList);
            }
            return node;
        }
        static value(node) {
            return {
                src: node.getAttribute("src"),
                width: node.getAttribute("width"),
                height: node.getAttribute("height"),
                classlist: node.getAttribute("class"),
            };
        }
    }
    Quill.register(IframeBlot);

    // --- HorizontalRule: <hr>用 ---
    class HorizontalRule extends BlockEmbed {
        static blotName = "hr";
        static tagName = "hr";

        static create() {
            let node = super.create();
            node.setAttribute("class", "ql-hr");
            return node;
        }
        static value() {
            return {};
        }
    }
    Quill.register(HorizontalRule);

    // --- フォントサイズのカスタム設定 ---
    const Size = Quill.import("formats/size");
    Size.whitelist = ["12px", "14px", "16px", "18px", "20px", "24px", "32px", "36px", "40px", "48px", "64px", "72px", "96px"];
    Quill.register(Size, true);

    // ====================================================
    // Quillエディタの初期化
    // ====================================================
    const quill = new Quill("#editor-container", {
        theme: "snow",
        modules: {
            toolbar: {
                container: "#toolbar",
                handlers: {
                    // hr挿入
                    hr: function () {
                        const range = quill.getSelection(true);
                        quill.insertEmbed(range.index, "hr", true, Quill.sources.USER);
                        quill.setSelection(range.index + 1, Quill.sources.SILENT);
                    },
                },
            },
        },
        formats: [
            "header",
            "bold",
            "italic",
            "underline",
            "strike",
            "color",
            "size",
            "align",
            "list",
            "bullet",
            "ordered",
            "image",
            "video",
            "link",
            "iframe",
            "hr",
        ],
    });

    // ----------------------------------------------------
    // 共通処理
    // ----------------------------------------------------
    let savedRange = null;
    quill.on("selection-change", (range) => {
        if (range && range.index !== null) {
            savedRange = range;
        }
    });

    // ----------------------------------------------------
    // Bootstrap Modal/フォーム関連
    // ----------------------------------------------------
    const insertModal = new bootstrap.Modal(document.getElementById("insertModal"));
    const insertForm = document.getElementById("insert-form");
    const insertTypeInput = document.getElementById("insert-type");
    const insertIframeButton = document.getElementById("insert-iframe");
    const generateTOCButton = document.getElementById("generate-toc");
    const insertHrButton = document.getElementById("insert-hr");

    // Iframe挿入用ボタン
    insertIframeButton.addEventListener("click", (e) => {
        document.getElementById("insertModalLabel").innerText = "Iframeを挿入";
        insertTypeInput.value = "iframe";
        insertModal.show();
    });

    // hr挿入ボタン
    insertHrButton.addEventListener("click", () => {
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "hr", true, Quill.sources.USER);
        quill.setSelection(range.index + 1, Quill.sources.SILENT);
    });

    // ----------------------------------------------------
    // 目次生成処理
    // ----------------------------------------------------
    function generateTOC() {
        const tocList = document.getElementById("toc-list");
        tocList.innerHTML = ""; // クリア

        const headings = quill.root.querySelectorAll("h1, h2, h3, h4, h5, h6");
        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.substring(1));
            const text = heading.innerText;
            const id = `heading-${index}`;
            heading.setAttribute("id", id);

            const li = document.createElement("li");
            li.style.marginLeft = `${(level - 1) * 20}px`;

            const a = document.createElement("a");
            a.href = `#${id}`;
            a.innerText = text;
            a.addEventListener("click", (e) => {
                e.preventDefault();
                document.getElementById(id).scrollIntoView({ behavior: "smooth" });
            });

            li.appendChild(a);
            tocList.appendChild(li);
        });

        document.getElementById("toc-container").style.display = headings.length > 0 ? "block" : "none";
    }
    generateTOCButton.addEventListener("click", generateTOC);

    // ----------------------------------------------------
    // Iframe挿入用補助関数
    // ----------------------------------------------------
    function getSrc(tag) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(tag, "text/html");
        const iframe = doc.querySelector("iframe");
        return iframe ? iframe.getAttribute("src") : "";
    }

    function googleDriveFilter(url) {
        if (url.indexOf("/drive/folders") >= 0) {
            const _temp = url.split("/");
            const ID = _temp[_temp.length - 1].indexOf("?") > 0 ? _temp[_temp.length - 1].split("?")[0] : _temp[_temp.length - 1];
            console.log("folder判定");
            return `<iframe src="https://drive.google.com/embeddedfolderview?id=${ID}#grid" style="width:100%; height:600px; border:0;"></iframe>`;
        } else if (url.indexOf("drive.google.com/file/") >= 0) {
            const src = url.indexOf("/view?usp=sharing") ? url.replace("/view?usp=sharing", "/preview?authuser=0") : url;
            console.log("file判定");
            return `<iframe src=${src}></iframe>`;
        } else {
            return url;
        }
    }

    // ----------------------------------------------------
    // 挿入フォーム送信処理（Iframe用）
    // ----------------------------------------------------
    insertForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const type = insertTypeInput.value;
        if (type === "iframe") {
            const iframeTag = document.getElementById("iframe-tag").value.trim();
            const iframeURL = document.getElementById("iframe-url").value.trim();
            if (iframeTag === "" && iframeURL === "") return;

            const src = iframeTag !== "" ? iframeTag : iframeURL;
            const iframeSrc = getSrc(googleDriveFilter(src));
            let extraClass = src.indexOf("youtube") >= 0 ? "quill-iframe-yt" : ""; // 例としてYouTube用のクラスをセット

            const iframeUrlPattern = /^(https?:\/\/)/i;
            if (!iframeUrlPattern.test(iframeSrc)) {
                alert("有効なURLを入力してください。");
                return;
            }

            let index = savedRange && savedRange.index !== null ? savedRange.index : quill.getLength();
            quill.insertEmbed(index, "iframe", { src: iframeSrc, classList: extraClass }, Quill.sources.USER);
            quill.insertText(index + 1, "\n", Quill.sources.USER);
            quill.setSelection(index + 2, Quill.sources.SILENT);
        }

        document.getElementById("iframe-url").value = "";
        document.getElementById("iframe-tag").value = "";

        // const editorContainer = document.getElementById('ql-editor');
        const editorContainer = document.querySelector(".ql-editor");
        const currentScroll = window.screenTop || document.documentElement.scrollTop;
        setTimeout(() => {
            window.scrollTo(0, document.documentElement.scrollTop);
        }, 0);
        // コンテナ内の末尾にスクロール
        editorContainer.scrollTo({
            top: editorContainer.scrollHeight,
            behavior: "auto",
        });
        document.body.style.overflow = "hidden";

        insertModal.hide();
        document.body.style.overflow = "auto";
    });

    // ----------------------------------------------------
    // Toolbarハンドラー
    // ----------------------------------------------------
    const toolbar = quill.getModule("toolbar");

    // リンク挿入
    toolbar.addHandler("link", () => {
        const range = quill.getSelection();
        if (range) {
            const value = prompt("リンク先のURLを入力してください:");
            if (value) quill.format("link", value);
        }
    });

    // 画像挿入
    toolbar.addHandler("image", () => {
        selectLocalImage();
    });

    // ローカル画像挿入
    function selectLocalImage() {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = () => {
            const file = input.files[0];
            if (/^image\//.test(file.type)) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const range = quill.getSelection();
                    if (range) {
                        quill.insertEmbed(range.index, "image", e.target.result);
                        quill.setSelection(range.index + 1, Quill.sources.SILENT);
                    }
                };
                reader.readAsDataURL(file);
            } else {
                alert("画像ファイルを選択してください。");
            }
        };
    }

    // ローカルビデオ挿入
    toolbar.addHandler("video", () => {
        selectLocalVideo();
    });

    function selectLocalVideo() {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "video/*");
        input.click();

        input.onchange = () => {
            const file = input.files[0];
            if (/^video\//.test(file.type)) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const range = quill.getSelection();
                    if (range) {
                        quill.insertEmbed(range.index, "video", e.target.result);
                        quill.setSelection(range.index + 1, Quill.sources.SILENT);
                    }
                };
                reader.readAsDataURL(file);
            } else {
                alert("ビデオファイルを選択してください。");
            }
        };
    }

    // ----------------------------------------------------
    // プレビュー＆保存処理
    // ----------------------------------------------------
    function outputFileHandler(isPreview) {
        const page_title = document.querySelector("#page_title").value;

        const HERO_KIREI = document.querySelector("#hero_kirei").value;
        const HERO_YYYY = document.querySelector("#hero_yyyy").value;
        const HERO_M = document.querySelector("#hero_m").value;
        const HERO_VOL = document.querySelector("#hero_vol").value;
        const hero_title = `${HERO_KIREI}\n${HERO_YYYY}.${HERO_M}\n vol.${HERO_VOL}`;
        // const hero_title = document.querySelector("#parts_hero__title").value;

        const hero_bg = document.querySelector(".part_hero__background").src;
        const hero_color = document.querySelector("#hero_color_picker").value;
        const top = document.querySelector("#toc-container").innerHTML;
        const content = quill.root.innerHTML;
        const footer = document.querySelector("footer").outerHTML;

        const concat = concat_html(page_title, hero_title, hero_bg, hero_color, top, content, footer);
        if (isPreview) {
            create_page(concat).then((preview_html) => {
                document.querySelector(".cover").outerHTML = preview_html;
                display_control(".cover");
            });
        } else {
            return concat;
        }
    }

    document.querySelector("#preview_btn").addEventListener("click", () => outputFileHandler(true));

    document.querySelector("#save_btn").addEventListener("click", () => {
        const page_title = document.querySelector("#page_title").value;
        // const _title = document.querySelector("#parts_hero__title").value.replaceAll("_", "");
        const HERO_KIREI = document.querySelector("#hero_kirei").value;
        const HERO_YYYY = document.querySelector("#hero_yyyy").value;
        const HERO_M = document.querySelector("#hero_m").value;
        const HERO_VOL = document.querySelector("#hero_vol").value;
        // TODO: 2025-02-06 15:52:25

        if (HERO_KIREI == "" || HERO_YYYY == "" || HERO_M == "" || HERO_VOL == "" || page_title == "") {
            alert("タイトルなど、空白にしないでください！");
            return;
        } else if (
            HERO_KIREI.indexOf(".") > 0 ||
            HERO_YYYY.indexOf(".") > 0 ||
            HERO_M.indexOf(".") > 0 ||
            HERO_VOL.indexOf(".") > 0 ||
            page_title.indexOf(".") > 0 ||
            HERO_KIREI.indexOf("_") > 0 ||
            HERO_YYYY.indexOf("_") > 0 ||
            HERO_M.indexOf("_") > 0 ||
            HERO_VOL.indexOf("_") > 0 ||
            page_title.indexOf("_") > 0
        ) {
            alert('ヒーローやタイトルに".","_"を入れないでください');
            return;
        }

        const _title = `${HERO_KIREI}\n${HERO_YYYY}.${HERO_M}\nvol.${HERO_VOL}`;

        const titleParts = _title.split("\n");
        const title = `KNL_${titleParts[1]}_${titleParts[2]}`;
        const post_data = { title };

        const concat = outputFileHandler();
        create_page(concat)
            .then(() => {
                return fetch("./backend/process_private_page.php", {
                    method: "POST",
                    headers: { "Content-Type": "Application/json" },
                    body: JSON.stringify(post_data),
                });
            })
            .then((res) => {
                if (res.ok) {
                    return res.text();
                } else {
                    throw new Error("Network response was not ok!");
                }
            })
            .then((data) => {
                window.location.href = location.href;
            })
            .catch((er) => {
                alert("保存に失敗しました＞＜");
                console.error("error!!", er);
                throw er;
            });
    });

    // ----------------------------------------------------
    // カスタムサイズ・カスタム色の設定
    // ----------------------------------------------------
    const sizeSelect = document.querySelector(".ql-size");
    sizeSelect.addEventListener("change", function () {
        const selectedValue = this.value;
        if (selectedValue === "custom") {
            const customSize = prompt("カスタムフォントサイズをpxで入力してください:", "16px");
            if (customSize) {
                const sizePattern = /^\d+px$/;
                if (sizePattern.test(customSize)) {
                    if (!quill.constructor.imports["formats/size"].whitelist.includes(customSize)) {
                        quill.constructor.imports["formats/size"].whitelist.push(customSize);
                        quill.format("size", customSize);
                        addCustomSizeCSS(customSize);
                    } else {
                        quill.format("size", customSize);
                    }
                } else {
                    alert("有効なpx形式のサイズを入力してください。例: 18px");
                }
            }
            this.value = "16px";
        }
    });

    function addCustomSizeCSS(size) {
        const style = document.createElement("style");
        style.innerHTML = `.ql-size-${size} { font-size: ${size}; }`;
        document.head.appendChild(style);
    }

    const colorSelect = document.querySelector(".ql-color");
    colorSelect.addEventListener("change", function () {
        const selectedValue = this.value;
        if (selectedValue === "custom") {
            const customColor = prompt("カスタムカラーを16進数で入力してください（例: #ff0000）:", "#000000");
            if (customColor) {
                const colorPattern = /^#([0-9A-Fa-f]{3}){1,2}$/;
                if (colorPattern.test(customColor)) {
                    quill.format("color", customColor);
                } else {
                    alert("有効な16進数形式のカラーコードを入力してください。例: #ff0000");
                }
            }
            this.value = "black";
        } else {
            quill.format("color", selectedValue);
        }
    });
});
