# INIAD PORT

学祭の謎解きで使用する静的サイトです。HTML・CSS・JavaScriptと画像のみで動作し、PHP・データベース・ビルド処理は使用しません。

## 現行ファイル

```text
dist/                         GitHub Pagesの公開対象
  index.html                  サイト本体・謎・パスワード獲得ダイアログ
  ticket-guide.html           パスワード入力後の使い方ページ
  styles.css                  サイト全体のスタイル
  script.js                   メニュー・時刻表・ヒント・鍵・入力判定
  assets/                     現行で参照している画像のみ
  preview/word-chest/index.html  過去の案4 URLから正式ページへの転送
.github/workflows/pages.yml   mainへのpush時にdistを公開
preview-server.cjs            ローカル確認用サーバー
package.json                 プレビュー起動コマンド
tools/generate-qr.py          QRコード生成用の任意ツール
qr-code/                     配布用QR画像（公開ページには含めない）
design-versions/             過去案・整理前バックアップ・未使用素材
```

## ローカル確認

Node.jsを用意し、プロジェクトのルートで実行します。通常のプレビューにnpm installは不要です。

```sh
npm run preview
```

ブラウザーで `http://127.0.0.1:4173/` を開きます。
使い方ページはトップページのパスワードフォーム経由で確認してください。

`npm run check` でJavaScriptの構文と画像・リンクの参照切れ、公開フォルダー内の未使用画像を確認できます。

## 編集時の注意

- 実際に編集・公開するファイルは `dist/` 内です。`design-versions/` は参照用です。
- 使い方画像は `ticket-guide-steps-1-3.png`、`ticket-guide-steps-4-5.png` の順に縦に表示します。
- パスワード判定はブラウザー上のJavaScriptです。謎解き用の仕掛けであり、秘密情報のアクセス制限には使用できません。
- HTMLのCSS/JS参照にはキャッシュ更新用のクエリがあります。公開時には必要に応じて更新します。
- 別のGitHubアカウントへ移行するときはPagesの設定と公開URLを確認し、QRコードも作り直してください。
- `.local-tools/` は一時的な整理・QR生成ツール、`.codex-remote-attachments/` は添付データです。サイトの実行には不要で、Git管理から除外しています。

## 保存してある旧ファイル

`design-versions/unused-assets-20261026/` に、旧使い方画像・旧船画像・未使用SVGを移しました。
`design-versions/cleanup-before-20261025/` はCSS整理前のソースです。古いCSSと現行CSSを混ぜて使わないでください。
