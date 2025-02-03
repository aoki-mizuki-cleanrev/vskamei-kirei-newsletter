<!-- ツールバー -->
<div id="toolbar">
            <!-- 基本的な書式 -->
            <button class="ql-bold" title="太字"></button>
            <button class="ql-italic" title="斜体"></button>
            <button class="ql-underline" title="下線"></button>

            <!-- テキスト色変更 -->
            <select class="ql-color" title="テキストの色">
                <option value="black"></option>
                <option value="red"></option>
                <option value="green"></option>
                <option value="blue"></option>
                <option value="orange"></option>
                <option value="violet"></option>
                <option value="cyan"></option>
                <option value="magenta"></option>
                <option value="yellow"></option>
                <option value="gray"></option>
                <option value="custom">カスタム</option>
                <!-- カスタム色選択肢 -->
            </select>

            <!-- 文字サイズ変更（px単位） -->
            <select class="ql-size" title="文字サイズ">
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px" selected>16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
                <option value="32px">32px</option>
                <option value="custom">カスタム</option>
                <!-- カスタムサイズ選択肢 -->
            </select>

            <!-- 文字寄せ -->
            <select class="ql-align" title="文字寄せ">
                <option selected>左寄せ</option>
                <option value="center">中央寄せ</option>
                <option value="right">右寄せ</option>
                <option value="justify">両端揃え</option>
            </select>

            <!-- 箇条書き、番号リスト -->
            <button class="ql-list" value="ordered" title="番号リスト"></button>
            <button class="ql-list" value="bullet" title="箇条書き"></button>

            <!-- 見出し -->
            <select class="ql-header" title="見出し">
                <option value="1">見出し 1</option>
                <option value="2">見出し 2</option>
                <option value="3">見出し 3</option>
                <option value="4">見出し 4</option>
                <option value="5">見出し 5</option>
                <option value="6">見出し 6</option>
                <option selected>通常</option>
            </select>

            <!-- 画像の挿入 -->
            <button class="ql-image" title="画像を挿入"></button>

            <!-- ビデオの埋め込み -->
            <button class="ql-video" title="ビデオを埋め込む"></button>

            <!-- リンクの挿入 -->
            <button class="ql-link" title="リンクを挿入"></button>

            <!-- セグメント線（hr）の挿入 -->
            <button id="insert-hr" title="分割線を挿入">&mdash;</button>

            <!-- Iframe挿入 -->
            <button id="insert-iframe" title="Iframeを挿入"><img src="./web/assets/icon/ico_html.svg" style="width:100%; height: 100%;" alt="icon"></button>

            <!-- 目次生成 -->
            <button id="generate-toc" title="目次を生成"><img src="./web/assets/icon/ico_toc.svg" style="width:100%; height: 100%;" alt="icon"></button>
</div>