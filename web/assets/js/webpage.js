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
            console.log(json_data);
            return json_data;
        })
        .catch((er) => {
            console.error("error!", er);
        });
}
burger_menu_fetch().then((list) => {
    // YEAR取り出し
    let year_arr = [];
    list.map((item, index, array) => {
        route_split = item.split("/");
        filename = route_split[route_split.length - 1];
        yyyy = filename.split("_")[1].split(".")[0];
        year_arr.push(item);
        // console.log(typeof year_arr[yyyy]);
        // year_arr[yyyy].push(item);
        console.log(index);
    });

    // ユニークYEAR
    console.log(year_arr);
    // year_arr_uniq = [...new Set(year_arr)];

    //     let html = "<ul>";
    //     year_arr_uniq.map((y) => {
    //         html += `<li>sssss ${y} </li>`;
    //     });

    //     list.map((key) => {});
});

// TODO: 2025-01-23 17:55:15 こんな構造でアコーディオンボタンを作る↓
{
    /* <ul>
    <li>
        <dl>
            <dt>2024</dt>
            <dd>
                <a href=""></a>
                <a href=""></a>
                <a href=""></a>
                <a href=""></a>
            </dd>
        </dl>
    </li>
    <li>
        <dl>
            <dt>2024</dt>
            <dd>
                <a href=""></a>
                <a href=""></a>
                <a href=""></a>
                <a href=""></a>
            </dd>
        </dl>
    </li>
    <li>
        <dl>
            <dt>2024</dt>
            <dd>
                <a href=""></a>
                <a href=""></a>
                <a href=""></a>
                <a href=""></a>
            </dd>
        </dl>
    </li>

    <li>2025</li>
    <li>2026</li>
</ul> */
}
