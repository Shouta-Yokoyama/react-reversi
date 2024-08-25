# react-reversi
## 使用技術
![Static Badge](https://img.shields.io/badge/react-000000?style=for-the-badge&logo=react&logoColor=blue)
![Static Badge](https://img.shields.io/badge/typescript-000000?style=for-the-badge&logo=typescript&logoColor=blue)
![Static Badge](https://img.shields.io/badge/nodejs-000000?style=for-the-badge&logo=node.js&logoColor=green)
## 概要
リバーシが遊べる(予定の)ウェブアプリです。個人的なwebアプリ製作の勉強として作成されています。
## 更新履歴
- 2024/8/25 initial commit
## 起動方法
1. 任意のディレクトリにクローンする。
2. ./clientで、`npm install --no-audit`を実行する。
   > --no-auditとするのはreact-scriptsの依存関係でトラブルが起きるからのようです。  
   > 参考：https://zenn.dev/appare45/articles/7f667031aab94b

4. ./serverで、`npm install`を実行する。
5. ./serverで、`node index.js`を実行しサーバを起動する。
6. ./clientで、`npm start`を実行しクライアントを起動する。
## 機能一覧
### 実装されている機能
- ルーム機能
- チャット機能
- 対戦準備完了ボタン
- 対戦画面(仮置き、10秒経つと戻される)
### 実装予定の機能
- リバーシ本体
- 入室画面で部屋一覧を見れるように(クリックで入れるように)
## 既知の問題
- 準備完了ボタンが、対戦画面に移行した後、「canselReady」の表記から戻らない
- socket.ioの実装で、joinroom機能で多重登録になっている(?)
