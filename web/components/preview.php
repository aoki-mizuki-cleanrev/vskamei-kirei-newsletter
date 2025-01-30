<div class="cover hidden">
    <div class="preview_area">
        <iframe src="./output/data.php" frameborder="0"></iframe>
    </div>
    <button type="button" id="cover_close_btn" onclick="display_control('.cover')"><i class="fas fa-xmark" style="font-size: 26px"></i></button>
</div>

<script>
    function display_control(elem_class) {
        document.querySelector(elem_class).classList.toggle("hidden");

        if (document.querySelector(elem_class).matches(".hidden")) {
            document.body.style.height = "auto";
            document.body.style.overflow = "auto";
        } else {
            document.body.style.height = "100vh";
            document.body.style.overflow = "hidden";
        }
    }
</script>