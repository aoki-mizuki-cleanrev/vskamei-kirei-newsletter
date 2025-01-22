export function display_control(elem_class) {
    document.querySelector(elem_class).classList.toggle("hidden");

    console.log("call display_control()");
    if (document.querySelector(elem_class).matches(".hidden")) {
        document.body.style.height = "auto";
        document.body.style.overflow = "auto";
        console.log("hidden");
    } else {
        document.body.style.height = "100vh";
        document.body.style.overflow = "hidden";
        console.log("visible");
    }
}
