# react-reversi
## 使用技術
![Static Badge](https://img.shields.io/badge/react-000000?style=for-the-badge&logo=react&logoColor=blue)
![Static Badge](https://img.shields.io/badge/typescript-000000?style=for-the-badge&logo=typescript&logoColor=blue)
![Static Badge](https://img.shields.io/badge/nodejs-000000?style=for-the-badge&logo=node.js&logoColor=green)
![Static Badge](https://img.shields.io/badge/tailwind-css?style=for-the-badge&logo=tailwind-css&color=black)
## 概要
リバーシが遊べるwebアプリです。個人的なwebアプリ製作の勉強として作成されています。
## 更新履歴
- 2024/11/11 見た目の変更  
  試合中、どちらのターンかわかりやすくなるような表示に変更
- 2024/10/11 tailwind cssを導入
- 2024/09/14 試合終了時に枚数を通知する機能を追加
- 2024/09/02 リバーシ機能を実装  
  準備完了ボタンが、対戦画面に移行した後、「canselReady」の表記から戻らないバグを修正
- 2024/08/25 initial commit
## 遊び方
### 起動方法
1. 任意のディレクトリにクローンする。
2. ./clientで、`npm install --no-audit`を実行する。
   > --no-auditとするのはreact-scriptsの依存関係でトラブルが起きるからのようです。  
   > 参考：https://zenn.dev/appare45/articles/7f667031aab94b
4. ./serverで、`npm install`を実行する。
5. 依存関係でエラーが発生するので、./serverで `npm audit -fix`を実行する。
6. ./serverで、`node index.js`を実行しサーバを起動する。
7. ./clientで、`npm start`を実行しクライアントを起動する。
### プレイ方法
1. room nameとyour nameを入力しJoin Roomをクリックします。
2. Enter your chatとあるテキストボックスの右にあるReadyとあるボタンをクリックします。
3. roomに参加したプレイヤーが全員Readyを押すとゲーム開始されます。一般的なリバーシのルールで遊べます。
## 機能一覧
### 実装されている機能
- ルーム機能
- チャット機能
- リバーシ機能
### 実装予定の機能
- 入室画面で部屋一覧を見れるように(クリックで入れるように)
- 勝利時の画面
- リザルトの表示
- リバーシ中にdisconnectしたときの処理
- 降参ボタン
## 既知の問題
- socket.ioの実装で、joinroom機能で多重登録になっている(?)
- ルームに3人以上入れる
- ルームに同じ名前で入室すると、ゲーム開始時にサーバサイドがエラーを起こす
- ~~ルームで1人の時にreadyを押すと、サーバサイドがエラーを起こす~~ 2024/9/2に修正していました……