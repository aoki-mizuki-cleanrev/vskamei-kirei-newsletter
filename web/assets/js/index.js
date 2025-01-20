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
