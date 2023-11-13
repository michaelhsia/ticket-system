// js 程式碼
let data = [
  {
    id: 0,
    name: "綠島自由行套裝行程",
    imgUrl:
      "https://github.com/hexschool/2022-web-layout-training/blob/main/js_week5/travel_1.png?raw=true",
    area: "台北",
    description:
      "嚴選超高CP值綠島自由行套裝行程，多種綠島套裝組合，提供台東綠島來回船票、綠島環島機車、綠島民宿住宿，行程加贈『綠島浮潛體驗』以及『綠島生態導覽』，讓你用輕鬆的綠島套裝自由行，也能深度認識綠島在地文化。",
    group: 8,
    price: 1280,
    rate: 8.6,
  },
  {
    id: 1,
    name: "清境高空觀景步道二日遊",
    imgUrl:
      "https://github.com/hexschool/2022-web-layout-training/blob/main/js_week5/travel_4.png?raw=true",
    area: "台北",
    description:
      "清境農場青青草原數十公頃碧草，餵食著數以百計的綿羊和牛群，中央山脈最高的北三段群峰形成一堵如帶的高牆，攔住清晨的薄霧山嵐，成就了從花蓮翻山而來的雲瀑在濁水溪谷積成雲海，這些景觀豐沛了清境觀景步道的風格，也涵養它無可取代的特色。",
    group: 12,
    price: 2580,
    rate: 8.2,
  },
  {
    id: 2,
    name: "南庄度假村露營車二日遊",
    imgUrl:
      "https://github.com/hexschool/2022-web-layout-training/blob/main/js_week5/travel_6.png?raw=true",
    area: "台中",
    description:
      "南庄雲水豪華露營車，快來擁有最愜意的露營體驗吧！一泊一食，輕鬆享受露營車樂趣。 獨立衛浴與私人戶外露臺。入住豪華露營車還能使用戶外SPA大眾湯，感受美人湯魅力。",
    group: 2,
    price: 2480,
    rate: 9.2,
  },
];

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

renderCard(data);

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
  obj.id = data.length;
  obj.name = ticketName.value;
  obj.imgUrl = imgUrl.value;
  obj.area = cityName.value;
  obj.description = ticketDescription.value;
  obj.group = Number(ticketNum.value);
  obj.price = Number(ticketPrice.value);
  obj.rate = Number(ticketGrade.value);

  // 把新的資料加進 data 資料庫
  data.push(obj);

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

  // 加完資料後再次渲染 travelListDisplay
  init();

  // 加完資料後，把篩選回到預設值「地區搜尋」
  filter.value = "地區搜尋";
});

filter.addEventListener("change", function (e) {
  if (e.target.value === undefined) {
    return;
  }

  if (e.target.value === "全部地區") {
    renderCard(data);
  } else {
    let tempData = [];
    data.forEach(function (item) {
      if (e.target.value === item.area) {
        tempData.push(item);
      }
    });

    renderCard(tempData);
  }
});
