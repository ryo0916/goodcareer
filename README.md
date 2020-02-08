## GoodCareer 就活の会社情報共有アプリ
就活生用の会社情報アプリを作成する。

必須機能: ユーザー認証機能（サインアップ、ログイン、ログアウト）、会社情報の登録・詳細表示・一覧表示機能、会社情報に対するコメント機能  

### 進め方
---
#### 1. 企画とゴール設定
  - ペルソナの設定とユーザーにどうなってもらいたいか
  - 要件定義 - 必須機能以外のオプション機能を決める

#### 2. UIと画面遷移を設計
  - 就活サイトや似たようなサイトのデザインを集める
  - 要件定義に基づいて機能を実現するための画面を仮作成する
  - 集めたサイトのデザインと仮作成したサイトを比べて最終的なデザインを決める 

  → 手書きで簡易ページ割を作成、適宜修正します

#### 3. 開発環境を準備 ← Now!
  - React + Rails + Firebaseを使用予定だが、実現可能か詳細を調査する
  
  → Rails不要の見込み

#### 4. DB設計と出力テスト
  - Cloud Firestoreを使用予定、DBの構成を決める

  →　SDKを導入。.envに必要な情報を保存。
   　[チュートリアル](https://youtu.be/m_u6P5k0vP0)を参考にGET,POSTメソッドをテスト。
  - 仮画面にDBの出力が可能かテスト

#### 5. 会社情報一覧画面と詳細画面を作成
  - 会社情報一覧画面と詳細画面を作成し、遷移できるようにする
  - ナビゲーション機能を作成する

#### 6. ログイン機能を作成
  - Firebase AuthenticationでGoogleアカウントを用いてサインアップ、ログイン、ログアウト機能を実装する
  → チュートリアルを見ながら実装。
  
    - 会社情報の一覧・詳細画面はログイン状態のみ閲覧可にする

#### 7. 会社情報登録機能を作成
  - 会社情報登録画面を作成
  - 登録画面より、Firestoreに保存できるかチェック
  - 登録したデータを一覧画面や詳細画面で確認する

#### 8. 会社情報のコメント機能を作成
  - コメント機能を実装
    - コメントしたユーザーと時間も記載する

#### 9. オプション機能を作成する
  - 要件定義で決めたオプション機能を実装する
    - ファイル添付機能など

---

### データの流れ - ストックとフローを意識すること


引用・参考文献等
- [TechTrain](https://techbowl.co.jp/techtrain) Mission powered by サイボウズ株式会社
- [Webディレクションの新標準ルール](https://www.amazon.co.jp/dp/B06WRWPF1P/) - MdN出版
- [Webデザイナーのキャリアを未経験からスタートするためのオールインワン講座](https://www.udemy.com/course/web-designer/) - 作成者 Shunsuke Sawada