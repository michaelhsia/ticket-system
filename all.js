import c3 from "c3";

// 表單 DOM
const formEl = document.querySelector(".formWrap");
const ticketName = document.querySelector("#ticketName");
const imgUrl = document.querySelector("#imgUrl");
const cityName = document.querySelector("#cityName");
const ticketPrice = document.querySelector("#ticketPrice");
const ticketNum = document.querySelector("#ticketNum");
const ticketGrade = document.querySelector("#ticketGrade");
const ticketDescription = document.querySelector("#ticketDescription");
const submitBtn = document.querySelector(".submitBtn");

// 篩選效果 DOM
const filter = document.querySelector("#filter");
const filterTotalText = document.querySelector(".filterTotalText");

// 最終呈現 DOM
const travelListDisplay = document.querySelector(".travelListDisplay");

// 宣告一個陣列來存取 res 中的資料
let cleanData;

// 發 get request 取得外部資料
axios
  .get(
    "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json"
  )
  .then(function (res) {
    // console.log(res);
    // response 物件底下的 data 是物件，我們要拿的是該物件底下的 data 陣列，所以用 res.data.data 取得
    cleanData = res.data.data;
    console.log(cleanData);
    renderCard(cleanData);
    renderC3(cleanData);
  })
  .catch(function (error) {
    console.log(error);
  });

// 渲染畫面
function renderCard(renderData) {
  let str = ``;

  renderData.forEach(function (item) {
    str += `
    <div class="col">
    <div class="card h-100">
      <div class="imgWrap position-relative z-1">
        <a href="#">
          <img
            src="${item.imgUrl}"
            class="card-img-top mb-5"
            alt="${item.name}"
          />
        </a>
        <div class="cityTag fs-5 position-absolute z-2 px-5 py-2">
          ${item.area}
        </div>
        <div
          class="gradingTag position-absolute z-2 bg-highlight px-2 py-1"
        >
          ${item.rate}
        </div>
      </div>
      <div class="card-body">
        <h4
          class="card-title fw-medium text-highlight border-bottom border-3 border-highlight pb-1 mb-4"
        >
          ${item.name}
        </h4>
        <p class="card-text mb-8">
          ${item.description}
        </p>
      </div>
      <div class="card-footer bg-white">
        <ul
          class="list-unstyled d-flex justify-content-between align-items-start text-highlight"
        >
          <li>
            <i class="fa-solid fa-circle-exclamation me-1"></i>剩下最後
            ${item.group} 組
          </li>
          <li class="d-flex align-items-basline">
            TWD<span class="fs-2 fw-medium ms-1">${item.price}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>`;
  });

  travelListDisplay.innerHTML = str;

  filterTotalText.textContent = `本次搜尋共 ${renderData.length} 筆資料`;
}

// 新增套票功能
submitBtn.addEventListener("click", function (e) {
  if (
    ticketName.value == "" ||
    imgUrl.value == "" ||
    cityName.value == "" ||
    ticketDescription.value == "" ||
    ticketNum.value == "" ||
    ticketPrice.value == "" ||
    ticketGrade.value == ""
  ) {
    alert("請填寫完整資訊！！");
    return;
  }

  let obj = {};
  obj.id = cleanData.length;
  obj.name = ticketName.value;
  obj.imgUrl = imgUrl.value;
  obj.area = cityName.value;
  obj.description = ticketDescription.value;
  obj.group = Number(ticketNum.value);
  obj.price = Number(ticketPrice.value);
  obj.rate = Number(ticketGrade.value);

  // 把新的資料加進 data 資料庫
  cleanData.push(obj);

  // 清空表單內容
  formEl.reset();
  // 上方 reset() 等於下面這段
  // ticketName.value = "";
  // imgUrl.value = "";
  // cityName.value = "請填寫景點地區";
  // ticketDescription.value = "";
  // ticketNum.value = "";
  // ticketPrice.value = "";
  // ticketGrade.value = "";

  // 加完資料後再次渲染 travelListDisplay 及圖表
  renderCard(cleanData);
  renderC3(cleanData);
  // 加完資料後，把篩選回到預設值「地區搜尋」
  filter.value = "地區搜尋";
});

// 篩選功能
filter.addEventListener("change", function (e) {
  if (e.target.value === undefined) {
    return;
  }

  if (e.target.value === "全部地區") {
    renderCard(cleanData);
    renderC3(cleanData);
  } else {
    // tempData 用來暫時存取篩選到的地區物件
    let tempData = [];
    cleanData.forEach(function (item) {
      if (e.target.value === item.area) {
        tempData.push(item);
      }
    });

    renderCard(tempData);
    renderC3(tempData);
  }
});

function renderC3(renderData) {
  console.log(renderData);

  // 先計算每個城市的數量
  let totalObj = {};
  renderData.forEach(function (item) {
    if (totalObj[item.area] === undefined) {
      totalObj[item.area] = 1;
    } else {
      totalObj[item.area] += 1;
    }
  });
  // console.log(totalObj);

  // 把回傳的陣列包物件，轉成 C3 要的陣列包陣列
  let newArr = [];
  let city = Object.keys(totalObj);
  city.forEach(function (item) {
    let arr = [];
    arr.push(item);
    arr.push(totalObj[item]);
    newArr.push(arr);
  });
  // console.log(newArr);

  const chart = c3.generate({
    // 自訂大小
    size: {
      height: 240,
      width: 300,
    },
    data: {
      columns: newArr,
      // 圖表類型
      type: "donut",
      // 自訂顏色
      colors: {
        台北: "#26BFC7",
        台中: "#5151D3",
        高雄: "#E68618",
      },
    },
    // 圖表標題
    donut: {
      title: "套票地區比重",
      width: 12, // 調整 donut 粗細
      label: {
        show: false, // 隱藏百分比文字
      },
    },

    // 數據懸浮顯示
    tooltip: {
      show: true,
    },
  });
}
