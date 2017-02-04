// 地圖
var map;

// 為了讓表格上的每筆資料連結到一個 marker
// 建立一個 {} 儲存 id -> marker 的對應關係
var mapInfo;

// 地圖上顯示的資訊
var infoWindow;

function initMap() {
  var $mapTab = $('ul.tabs li:nth-child(2)');

  // 先測試是否在地圖分頁，若不是則等使用者點擊進入分頁後，再進行初始化
  // 因為當 display:none 時無法對地圖進行初始化
  if (!$mapTab.hasClass('active')) {
    $mapTab.on('click', initMap);
    return;
  }

  // 下次再點擊進入分頁，無須再初始化
  $mapTab.off('click', initMap);

  // 讓地圖可以 RWD
  google.maps.event.addDomListener(window, 'resize', function () {
    var center = map.getCenter();
    google.maps.event.trigger(map, 'resize');
    map.setCenter(center);
  });

  // 初始化
  map = new google.maps.Map(document.querySelector('.map'), {
    zoom: 13,
    center: {
      lat: 22.627246,
      lng: 120.301458
    }
  });
  mapInfo = {};
  infoWindow = new google.maps.InfoWindow();

  // 塞資料
  setMapInfo();
}

function setMapInfo() {
  // 為所有資料建立 marker，和點擊後的動作
  parkData.forEach(function (d) {

    // marker 是地圖上的一個標誌
    var marker = new google.maps.Marker({
      position: { lat: d.N, lng: d.E },
      map: map,
      title: d.name
    });

    // 點擊 marker 會顯示詳細資訊
    marker.addListener('click', function () {
      infoWindow.setContent('<div class="mapInfo">' +
        '<h2>' + d.NAME + '</h2>' +
        '<table>' +
        '<tr><td>區域</td><td>' + d.AREA + '</td></tr>' +
        '<tr><td>位址</td><td>' + d.ADDR + '</td></tr>' +
        (d.PRICE.length ? ('<tr><td>價格</td><td>' + d.PRICE + '</td></tr>') : '') +
        '<tr><td>車位</td><td>' + d.CAR_NUM + ' 個</td></tr>' +
        '</table>' +
        '</div>');

      infoWindow.open(map, marker);
    });

    // 儲存對應關係
    mapInfo[d.PARKID] = marker;
  });
}

// 在資料分頁點擊「顯示」進行的動作
function showMapInfo(id) {
  // 顯示地圖分頁
  $('ul.tabs li:nth-child(2)').click();

  var marker = mapInfo[id];
  // 若存在該資料，則進行動作
  if (marker) {

    // 將地圖中心移動至該座標
    map.panTo(marker.position);

    // 打開 infoWindow
    google.maps.event.trigger(marker, 'click');
  }
}
