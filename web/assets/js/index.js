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

// document.querySelector("#save_btn").addEventListener("click", () => {
//     const title = document
//         .querySelector("#parts_hero__title")
//         .value.replace(/\r?\n/g, "")
//         .replace(/\./g, "_")
//         .replace("KIREI通信", "KIREI-NewsLetter_");

//     console.log("保存！");
//     const post_data = {
//         title: title,
//     };

//     fetch("./backend/create_public_site.php", {
//         method: "POST",
//         headers: {
//             "Content-Type": "Application/json",
//         },
//         body: JSON.stringify(post_data),
//     })
//         .then((res) => {
//             if (res.ok) {
//                 return res.text();
//             } else {
//                 throw new Error("Network response was not ok!");
//             }
//         })
//         .then((data) => {
//             console.log(data);
//         })
//         .catch((er) => console.error("Error!", er));
// });
