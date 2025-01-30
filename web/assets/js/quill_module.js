import { concat_html, create_page } from "./create_page.js";

// // hero ------------------------
// document.querySelector("#page_title").addEventListener("change", (e) => {
//     const hero_title = document.querySelector(".parts_hero__title");
//     hero_title.textContent = e.target.value;
// });

// ---------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const Quill = window.Quill;
    const Embed = Quill.import("blots/embed");
    const BlockEmbed = Quill.import("blots/block/embed");

    /**
     * IframeBlotの定義
     */
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
            node.classList.add(value.classList);
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

    /**
     * セグメント線（hr）のカスタムBlotの定義
     */
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

    /**
     * フォントサイズのカスタム定義（px単位）
     */
    const Size = Quill.import("formats/size");
    Size.whitelist = ["12px", "14px", "16px", "18px", "20px", "24px", "32px"];
    Quill.register(Size, true);

    /**
     * Quillエディタの初期化
     */
    const quill = new Quill("#editor-container", {
        theme: "snow",
        modules: {
            toolbar: {
                container: "#toolbar",
                handlers: {
                    // セグメント線（hr）の挿入ハンドラー
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

    /**
     * カーソル位置を保存する変数
     */
    let savedRange = null;

    /**
     * selection-change イベントでカーソル位置を保存
     */
    quill.on("selection-change", function (range, oldRange, source) {
        if (range && range.index !== null) {
            savedRange = range;
        }
    });

    /**
     * Bootstrapのモーダルを初期化
     */
    const insertModal = new bootstrap.Modal(document.getElementById("insertModal"));
    const insertForm = document.getElementById("insert-form");
    const modalBodyContent = document.getElementById("modal-body-content");
    const insertTypeInput = document.getElementById("insert-type");

    const aspectRatioCheckbox = document.getElementById("iframe-aspect");

    /**
     * Iframe挿入ボタンのクリックイベントハンドラー
     */
    const insertIframeButton = document.getElementById("insert-iframe");
    const generateTOCButton = document.getElementById("generate-toc");
    const insertHrButton = document.getElementById("insert-hr"); // セグメント線挿入ボタン

    insertIframeButton.addEventListener("click", function () {
        // モーダルのタイトルを更新（必要に応じて）
        document.getElementById("insertModalLabel").innerText = "Iframeを挿入";
        // 挿入タイプを設定
        insertTypeInput.value = "iframe";
        // モーダルを表示
        insertModal.show();
    });

    insertHrButton.addEventListener("click", function () {
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "hr", true, Quill.sources.USER);
        quill.setSelection(range.index + 1, Quill.sources.SILENT);
    });

    /**
     * 目次生成用のハンドラー
     */
    function generateTOC() {
        const tocList = document.getElementById("toc-list");
        tocList.innerHTML = ""; // 既存の目次をクリア

        // エディター内の全ての見出しを取得
        const editor = quill.root;
        const headings = editor.querySelectorAll("h1, h2, h3, h4, h5, h6");

        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.substring(1)); // h1=1, h2=2, etc.
            const text = heading.innerText;

            // 見出しにIDを付与（TOCのリンク先として使用）
            const id = `heading-${index}`;
            heading.setAttribute("id", id);

            // 目次項目を作成
            const li = document.createElement("li");
            li.style.marginLeft = `${(level - 1) * 20}px`; // 見出しレベルに応じてインデント

            const a = document.createElement("a");
            a.href = `#${id}`;
            a.innerText = text;
            a.addEventListener("click", function (e) {
                e.preventDefault();
                document.getElementById(id).scrollIntoView({ behavior: "smooth" });
            });

            li.appendChild(a);
            tocList.appendChild(li);
        });

        // 目次コンテナを表示
        const tocContainer = document.getElementById("toc-container");
        tocContainer.style.display = headings.length > 0 ? "block" : "none";
    }

    generateTOCButton.addEventListener("click", function () {
        generateTOC();
    });

    // src属性の値を取得
    function getSrc(tag) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(tag, "text/html");
        const iframe = doc.querySelector("iframe");

        return iframe.getAttribute("src");
    }

    // アスペクト比チェックイベントハンドラー
    aspectRatioCheckbox.addEventListener("change", () => {
        if (aspectRatioCheckbox.checked) {
            document.querySelector("#iframe-height").disabled = true;
        } else {
            document.querySelector("#iframe-height").disabled = false;
        }
    });

    /**
     * 挿入フォームの送信イベントハンドラー
     */
    insertForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const type = insertTypeInput.value;

        if (type === "iframe") {
            const iframeTag = document.getElementById("iframe-url").value.trim();
            const iframeWidth = document.getElementById("iframe-width").value.trim();
            let iframeHeight = document.getElementById("iframe-height").value.trim();
            const hasCheckedAspectRatio = document.getElementById("iframe-aspect").checked;
            let extraClass;

            if (hasCheckedAspectRatio) {
                extraClass = "quill-iframe-yt";
                iframeHeight = "auto";
            }
            // const iframeHeight = "auto";

            // src属性取り出し
            const iframeUrl = getSrc(iframeTag);

            // URLの簡単なバリデーション
            const iframeUrlPattern = /^(https?:\/\/)/i;
            if (!iframeUrlPattern.test(iframeUrl)) {
                alert("有効なURLを入力してください。");
                return;
            }

            // 保存された選択範囲を使用
            let index = quill.getLength(); // デフォルトは末尾

            if (savedRange && savedRange.index !== null) {
                index = savedRange.index;
            }

            quill.insertEmbed(
                index,
                "iframe",
                {
                    src: iframeUrl,
                    width: iframeWidth,
                    height: iframeHeight,
                    classList: extraClass,
                },
                Quill.sources.USER
            );

            // カーソルをIframeの後ろに移動
            quill.setSelection(index + 1, Quill.sources.SILENT);
        }

        // モーダルを閉じる
        insertModal.hide();
    });

    /**
     * Quillのリンク挿入ハンドラーをオーバーライドしてデフォルト機能を維持
     */
    const toolbar = quill.getModule("toolbar");
    toolbar.addHandler("link", () => {
        const range = quill.getSelection();
        if (range) {
            let value = prompt("リンク先のURLを入力してください:");
            if (value) {
                quill.format("link", value);
            }
        }
    });

    /**
     * Quillの画像挿入ハンドラーをオーバーライドしてデフォルト機能を維持
     */
    toolbar.addHandler("image", () => {
        selectLocalImage();
    });

    /**
     * 画像挿入用のローカル画像選択機能
     */
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
                    quill.insertEmbed(range.index, "image", e.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert("画像ファイルを選択してください。");
            }
        };
    }

    /**
     * Quillのビデオ挿入ハンドラーをオーバーライドしてデフォルト機能を維持
     */
    toolbar.addHandler("video", () => {
        selectLocalVideo();
    });

    /**
     * ビデオ挿入用のローカルビデオ選択機能
     */
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
                    quill.insertEmbed(range.index, "video", e.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert("ビデオファイルを選択してください。");
            }
        };
    }
    // ---
    // function display_control(elem_class) {
    //     document.querySelector(elem_class).classList.toggle("hidden");

    //     if (document.querySelector(elem_class).matches(".hidden")) {
    //         document.body.style.height = "";
    //         document.body.style.overflow = "";
    //     } else {
    //         document.body.style.height = "100vh";
    //         document.body.style.overflow = "hidden";
    //     }
    // }

    /**
     * プレビューボタンのイベントリスナー
     */
    function outputFileHandler(isPreview) {
        const page_title = document.querySelector("#page_title").value;
        const hero_title = document.querySelector("#parts_hero__title").value;
        const hero_bg = document.querySelector(".part_hero__background").src;
        const top = document.querySelector("#toc-container").innerHTML;
        const content = quill.root.innerHTML;
        const footer = document.querySelector("footer").outerHTML;

        const concat = concat_html(page_title, hero_title, hero_bg, top, content, footer);
        if (isPreview == true) {
            const data = create_page(concat).then((preview_html) => {
                document.querySelector(".cover").outerHTML = preview_html;
                display_control(".cover");
                // return preview_html;
            });
        } else {
            return concat;
        }
    }

    // const saveButton = document.getElementById("save_btn");

    // プレビュー表示のトリガー
    document.querySelector("#preview_btn").addEventListener("click", () => outputFileHandler(true));

    /**
     * 保存ボタンのイベントリスナー
     */
    document.querySelector("#save_btn").addEventListener("click", () => {
        // const title = document
        //     .querySelector("#parts_hero__title")
        //     .value.replace(/\r?\n/g, "")
        //     .replace(/\./g, "_")
        //     .replace("KIREI通信", "KNL_");

        const _title = document.querySelector("#parts_hero__title").value;
        _title.split("\n");
        const title = "KNL_" + _title.split("\n")[1] + "_" + _title.split("\n")[2];

        console.log("保存！");
        const post_data = {
            title: title,
        };
        const concat = outputFileHandler();

        create_page(concat)
            .then((data) => {
                fetch("./backend/process_draft_page.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "Application/json",
                    },
                    body: JSON.stringify(post_data),
                })
                    .then((res) => {
                        if (res.ok) {
                            return res.text();
                        } else {
                            throw new Error("Network response was not ok!");
                        }
                    })
                    .then((data) => {
                        if (confirm(`新しいページが作成されました：\n${data}\n開きますか？`)) {
                            window.open(data, "_blank");
                        }
                    });
            })
            .catch((er) => {
                console.error("error!!", er);
                throw er;
            });
    });

    /**
     * カスタムサイズ選択時の処理
     */
    const sizeSelect = document.querySelector(".ql-size");

    sizeSelect.addEventListener("change", function () {
        const selectedValue = this.value;
        if (selectedValue === "custom") {
            const customSize = prompt("カスタムフォントサイズをpxで入力してください:", "16px");
            if (customSize) {
                const sizePattern = /^\d+px$/;
                if (sizePattern.test(customSize)) {
                    // カスタムサイズをサイズのホワイトリストに追加
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
            // サイズセレクトをリセット
            this.value = "16px";
        }
    });

    /**
     * カスタムサイズ用のCSSクラスを動的に追加
     */
    function addCustomSizeCSS(size) {
        const style = document.createElement("style");
        style.innerHTML = `.ql-size-${size} { font-size: ${size}; }`;
        document.head.appendChild(style);
    }

    /**
     * カスタム色選択時の処理
     */
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
            // カラーセレクトをリセット
            this.value = "black";
        } else {
            quill.format("color", selectedValue);
        }
    });
});
