
"use strict";
let lastSavedKey = null;   // ✅ nhớ key vừa lưu để highlight

// ページ本体が読み込まれたタイミングで実行するコード
window.addEventListener("DOMContentLoaded", function () {
  // localStorageが使えるか確認
  if (typeof localStorage === "undefined") {
    window.alert("このブラウザはLocal Storage機能が実装されていません");
    return;
  } else {
     // --- chỉ thêm 4 dòng dưới đây ---
     const keyEl  = document.getElementById("textKey");
     const memoEl = document.getElementById("textMemo");
     keyEl.value = "";  memoEl.value = "";                 // xoá nội dung cứng trong textarea
     keyEl.placeholder = "Type your key";                  // gợi ý mờ
     memoEl.placeholder = "件名を入力してください。";       // gợi ý mờ
     // --- hết phần thêm ---
    viewStorage();
    saveLocalStorage(); // localStorageへの保存
    selectTable();
    delLocalStorage();
    allClearLocalStorage();
    randomBackgroundAuto();

  }
});

// localStorageへの保存
// localStorageへの保存
// localStorage 保存
function saveLocalStorage() {
  const save = document.getElementById("save");

  save.addEventListener("click", function (e) {
    e.preventDefault();

    const key   = document.getElementById("textKey").value.trim();
    const value = document.getElementById("textMemo").value.trim();

    if (key === "" || value === "") {
      Swal.fire({
        title: "Memo app",
        html: "Key、Memoはいずれも必須（ひっす）です。",
        icon: "error",
        confirmButtonText: "OK",
        allowOutsideClick: false
      });
      return;
    }

    Swal.fire({
      title: "Memo app",
      html: `LocalStorageに「${key} ： ${value}」を保存（save）しますか？`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {

        localStorage.setItem(key, value);
        lastSavedKey = key;   // ✅ đánh dấu dòng mới

        viewStorage();

        Swal.fire({
          title: "Memo app",
          html: `LocalStorageに「${key} ： ${value}」を保存（ほぞん）しました。`,
          icon: "success",
          confirmButtonText: "OK",
          allowOutsideClick: false
        });

        document.getElementById("textKey").value = "";
        document.getElementById("textMemo").value = "";
      }
    });
  });
}


function viewStorage() {
  const list = document.getElementById("list"); // tbody

  // tbody => clear
  list.textContent = "";

  // localStorage → render rows
  for (let i = 0; i < localStorage.length; i++) {
    let w_key = localStorage.key(i);

    let tr  = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td"); // 🗑

    td1.innerHTML = "<input name='chkbox1' type='checkbox'>";
    td2.textContent = w_key;
    td3.textContent = localStorage.getItem(w_key);
    td4.innerHTML = '<img src="img/trash_icon.png" class="trash" alt="delete">';

    // ✅ highlight dòng vừa save
    if (w_key === lastSavedKey) {
      tr.classList.add("row-new");
    }

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    list.appendChild(tr);
  }

  // ✅ tự trở về màu cũ sau 2 giây
  if (lastSavedKey) {
    setTimeout(() => {
      const row = document.querySelector("#list tr.row-new");
      if (row) row.classList.remove("row-new");
      lastSavedKey = null;
    }, 2000);
  }

  // tablesorter
  $("#table1").tablesorter({ sortList: [[1, 0]] });
  $("#table1").trigger("update");
}

//select
// 5.7 選択（せんたく）
function selectTable() {
  const select = document.getElementById("select");  // 定数の宣言：select
  select.addEventListener("click", function (e) {    // イベントリスナー設定
    e.preventDefault();                              // 送信をキャンセル

    const w_cnt = selectCheckBox("select");          // ★ version-up3 chg 引数を"select"

   

  }, false);
}


// データ選択用関数
function selectRadioBtn() {
  let w_sel = "0";                                   // 選択チェック用の変数
  const radio1 = document.getElementsByName("radio1"); // name属性"radio1"の取得
  const table1 = document.getElementById("list");      // 表(table)の取得

//them 2 dong
const isTable = table1.tagName === "TABLE";
const baseRow = isTable ? 1 : 0;

for (let i = 0; i < radio1.length; i++) {
  if (radio1[i].checked) {
    document.getElementById("textKey").value =
      table1.rows[i + baseRow].cells[1].textContent;
    document.getElementById("textMemo").value =
      table1.rows[i + baseRow].cells[2].textContent;
    w_sel = "1";
    break;
  }
  }
  return w_sel;                                      // 結果を返す
}
//checkbox
// テーブルからデータ選択（せんたく）
function selectCheckBox(mode) {
  let w_cnt = 0;
  const chkbox = document.getElementsByName("chkbox1");
  const table1 = document.getElementById("table1");
  let w_textKey = "";
  let w_textMemo = "";

  for (let i = 0; i < chkbox.length; i++) {
    if (chkbox[i].checked) {
      if (w_cnt === 0) {
        w_textKey  = table1.rows[i+1].cells[1].textContent;
        w_textMemo = table1.rows[i+1].cells[2].textContent;
      }
      w_cnt++;
    }
  }

  document.getElementById("textKey").value  = w_textKey;
  document.getElementById("textMemo").value = w_textMemo;

  // mode = SELECT
  if (mode === "select") {
    if (w_cnt === 1) {
      return w_cnt;
    } else {
      Swal.fire({
        title: "Memo app",
        html: "1つ選択（select）してください。",
        icon: "error",
        confirmButtonText: "OK",
        allowOutsideClick: false
      });
      return 0;
    }
  }

  // mode = DEL
  if (mode === "del") {
    if (w_cnt >= 1) {
      return w_cnt;
    } else {
      Swal.fire({
        title: "Memo app",
        html: "1つ以上選択（select）してください。",
        icon: "error",
        confirmButtonText: "OK",
        allowOutsideClick: false
      });
      return 0;
    }
  }

  return 0;
}

// version-up5：ごみ箱アイコンをクリックしたら行削除（Event Delegation）
function delLocalStorage() {
  const table1 = document.getElementById("table1");

  table1.addEventListener("click", function (e) {
    // ✅ chỉ xử lý khi click đúng icon thùng rác
    if (!e.target.classList.contains("trash")) return;

    e.preventDefault();

    // ✅ lấy dòng đang click
    const tr = e.target.closest("tr");
    if (!tr) return;

    // ✅ cấu trúc cột: 0=選択, 1=キー, 2=メモ, 3=削除(icon)
    const key = tr.cells[1].textContent;
    const value = tr.cells[2].textContent;

    // ✅ confirm
    Swal.fire({
      title: "Memo app",
      html:
        "このページの内容<br>" +
        "LocalStorageから<br>" +
        `${key} ： ${value}<br>` +
        "のデータを削除（delete）しますか？",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        // ✅ delete
        localStorage.removeItem(key);
        viewStorage();

        // ✅ message
        Swal.fire({
          title: "Memo app",
          html:
            `LocalStorageからキー「${key}」のデータを削除（delete）しました。`,
          icon: "success",
          confirmButtonText: "OK",
          allowOutsideClick: false,
        });

        // ✅ clear input
        document.getElementById("textKey").value = "";
        document.getElementById("textMemo").value = "";
      }
    });
  }, false);
}



// 4.localStorageからすべて削除（ふくとく）
function allClearLocalStorage() {
  const allclear = document.getElementById("delall");

  allclear.addEventListener("click", function (e) {
    e.preventDefault();

    Swal.fire({
      title: "Memo app",
      html: "LocalStorageのデータをすべて削除（all clear）します。<br>よろしいですか？",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
      allowOutsideClick: false
    })
    .then((result) => {
      if (result.isConfirmed) {

        localStorage.clear();
        viewStorage();

        Swal.fire({
          title: "Memo app",
          html: "LocalStorageのデータをすべて削除（all clear）しました。",
          icon: "success",
          confirmButtonText: "OK",
          allowOutsideClick: false
        });

        document.getElementById("textKey").value  = "";
        document.getElementById("textMemo").value = "";
      }
    });

  });
}

// jQueryplugin tablesorterを使ってソートできるコード
function randomBackgroundAuto() {
  const colors = [
    "#f8d7f0",
    "#e6f7ff",
    "#e8f5e9",
    "#fff3e0",
    "#ede7f6"
  ];

  setInterval(() => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = color;
  }, 2500);
}
