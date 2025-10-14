/*--------------------------
干支算法
--------------------------*/
const Gan = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
const Zhi = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const baseDate = new Date(1900,0,31);

function getGanZhiDay(date){
  const diffDays = Math.floor((date - baseDate)/(24*60*60*1000));
  const index = (diffDays + 40) % 60;
  const gan = Gan[index%10];
  const zhi = Zhi[index%12];
  return gan+zhi+"日";
}

/*--------------------------
五行映射
--------------------------*/
const zhiToWuXing = {
  "子":"水","丑":"土","寅":"木","卯":"木",
  "辰":"土","巳":"火","午":"火","未":"土",
  "申":"金","酉":"金","戌":"土","亥":"水"
};
const ganToWuXing = {
  "甲":"木","乙":"木","丙":"火","丁":"火",
  "戊":"土","己":"土","庚":"金","辛":"金",
  "壬":"水","癸":"水"
};

/*--------------------------
12时辰及时间段
--------------------------*/
const zhiList = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
const timeRange = [
  "23:00–01:00","01:00–03:00","03:00–05:00","05:00–07:00",
  "07:00–09:00","09:00–11:00","11:00–13:00","13:00–15:00",
  "15:00–17:00","17:00–19:00","19:00–21:00","21:00–23:00"
];

/*--------------------------
简化季节划分
--------------------------*/
function getSeason(date){
  const m = date.getMonth()+1;
  if(m>=3 && m<=5) return "春";
  if(m>=6 && m<=8) return "夏";
  if(m>=9 && m<=11) return "秋";
  return "冬";
}

/*--------------------------
五行强弱判定
--------------------------*/
function getWuXingStrength(dayWuXing, season){
  const map = {
    "春":{"木":"旺","火":"平","土":"平","金":"减","水":"弱"},
    "夏":{"木":"减","火":"旺","土":"平","金":"平","水":"弱"},
    "长夏":{"木":"平","火":"减","土":"旺","金":"平","水":"平"},
    "秋":{"木":"弱","火":"减","土":"平","金":"旺","水":"平"},
    "冬":{"木":"弱","火":"平","土":"平","金":"减","水":"旺"}
  };
  return map[season][dayWuXing] || "平";
}

/*--------------------------
文字强弱转百分比
--------------------------*/
function strengthToPercent(strength){
  switch(strength){
    case "旺": return 100;
    case "平": return 70;
    case "减": return 40;
    case "弱": return 10;
    default: return 50;
  }
}

/*--------------------------
日主五行 & 时辰五行 & 季节固定生成宜忌
--------------------------*/
const yiJiByWuXing = {
  "木":["开市","出行","修造","结婚"],
  "火":["祭祀","嫁娶","祈福","交易"],
  "土":["安床","修造","纳财","移徙"],
  "金":["交易","开业","祭祀","嫁娶"],
  "水":["祈福","交易","嫁娶","出行"]
};

const yiJiBySeason = {
  "春":["开业","种植","出行"],
  "夏":["祭祀","嫁娶","祈福"],
  "秋":["交易","开业","祭祀"],
  "冬":["安床","祈福","嫁娶"]
};

// 按日主五行 + 时辰五行 + 季节顺序组合，不随机
function getFixedYiJi(dayWuXing, hourWuXing, season){
  const combined = [
    ...yiJiByWuXing[dayWuXing] || [],
    ...yiJiByWuXing[hourWuXing] || [],
    ...yiJiBySeason[season] || []
  ];
  // 去重
  const set = Array.from(new Set(combined));
  return set.join("、");
}

/*--------------------------
生成时辰列表
--------------------------*/
function computeHourlyWuXing(date){
  const ganZhiDay = getGanZhiDay(date);
  const dayGan = ganZhiDay[0];
  const dayWuXing = ganToWuXing[dayGan];
  const season = getSeason(date);
  const mainStrength = getWuXingStrength(dayWuXing, season);
  const mainPercent = strengthToPercent(mainStrength);

  const list = zhiList.map((zhi,i)=>{
    const hourWuXing = zhiToWuXing[zhi];
    const yiJi = getFixedYiJi(dayWuXing, hourWuXing, season);
    return {
      时辰: `${zhi}时`,
      时间: timeRange[i],
      五行旺: hourWuXing,
      宜忌: yiJi
    };
  });

  return { ganZhiDay, mainWuXing: dayWuXing, mainStrength, mainPercent, list };
}

/*--------------------------
渲染表格
--------------------------*/
function showFortune(){
  const input = document.getElementById("dateInput");
  const date = input.value ? new Date(input.value) : new Date();

  const result = computeHourlyWuXing(date);
  const ganZhiDay = result.ganZhiDay;
  const mainWuXing = result.mainWuXing;
  const mainStrength = result.mainStrength;
  const mainPercent = result.mainPercent;
  const list = result.list;

  let html = `<h3>${date.toLocaleDateString()} (${ganZhiDay})</h3>`;
  html += `<p><strong>今日主要五行：</strong> 
           <span class="${mainWuXing.toLowerCase()}">${mainWuXing}</span> 
           （${mainStrength}, ${mainPercent}%）
           <span class="progress-container">
             <span class="progress-bar" style="width:${mainPercent}%;"></span>
           </span>
           </p>`;

  html += `<table><tr><th>时辰</th><th>时间</th><th>五行旺</th><th>宜忌</th></tr>`;
  list.forEach(item=>{
    const wxClass = {"木":"wood","火":"fire","土":"earth","金":"metal","水":"water"}[item.五行旺]||"";
    html += `<tr>
      <td>${item.时辰}</td>
      <td>${item.时间}</td>
      <td class="${wxClass}">${item.五行旺}</td>
      <td>${item.宜忌}</td>
    </tr>`;
  });
  html += "</table>";

  document.getElementById("result").innerHTML = html;
}