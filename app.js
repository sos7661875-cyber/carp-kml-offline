"use strict";

const YD_TO_M = 0.9144;
const NM_TO_M = 1852;
const EARTH_RADIUS_M = 6371008.8;
const YD_PER_NM = 2025.3718;

const BALLISTIC = {
  cds: {
    load: [600,700,800,900,1000,1100,1200,1300,1400,1500,1600,1700,1800,1900,2000,2100,2200,2300,2400,2500,2600,2700],
    vd: [355,357,359,360,362,364,365,367,368,370,372,373,374,376,377,378,380,382,384,386,388,390],
    rf: [16.2,17,17.7,18.3,18.9,19.4,20,20.6,21.2,21.9,22.6,23.2,23.8,24.4,25,25.7,26.3,26.9,27.6,28.3,28.9,29.5],
    tfc: [6.3,6.2,6.1,6,6,5.9,5.8,5.7,5.6,5.5,5.4,5.3,5.2,5.2,5.1,5,4.9,4.8,4.7,4.6,4.5,4.4],
    dq: [2.5,2.5,2.6,2.6,2.6,2.7,2.7,2.7,2.8,2.8,2.8,2.8,2.9,2.9,2.9,3,3,3,3.1,3.1,3.1,3.2],
    stations: [730,705,680,655,620,595,570,545,520,495,470,445,420],
    exits: [4.1,4.3,4.5,4.7,4.9,5.1,5.2,5.4,5.5,5.6,5.7,5.8,5.9]
  },
  personnel: {
    load: [150,175,200,225,250,275,300,325,350,375,400,425,450,475,500],
    I: [14.5,15.5,16.4,17.4,18.3,19.2,20,20.9,21.7,22.4,23.1,23.8,24.4,25,25.6],
    II: [14.3,15.2,16,16.8,17.6,18.4,19.2,20,20.7,21.5,22.3,23,23.8,24.6,25.4],
    III: [13,13.8,14.6,15.4,16.3,17.1,18,18.8,19.7,20.5,21.4,22.2,23.1,23.9,24.7]
  },
  heavy: {
    recovery: {
      1: {load:[2000,2500,3000,3500,4000,4500],rf:[16.3,18.9,20.7,22.9,24.5,25.9]},
      2: {load:[4000,4500,5000,5500,6000,6500,7000,7500,8000,8500],rf:[18.3,19.5,20.6,21.5,22.5,23.7,24.5,25.2,26,26.6]},
      3: {load:[8000,8500,9000,9500,10000,12500,15000],rf:[21.2,21.8,22.5,23,23.8,26,29.2]},
      4: {load:[12500,15000,17500],rf:[23.1,26,27.7]},
      5: {load:[15000,17500,20000,22500],rf:[23.9,25.3,27.2,28.5]},
      6: {load:[20000,22500,25000,27500],rf:[25.1,26.5,28,29.1]},
      7: {load:[22500,25000,27500,30000],rf:[25,26.2,27.3,28.5]},
      8: {load:[27500,30000,35000,40000],rf:[26,27,29.1,31.1]}
    },
    fixed: {
      1:{vd:700,tfc:11.5,dq:2.1},2:{vd:785,tfc:13,dq:2.3},3:{vd:885,tfc:14.6,dq:2.5},4:{vd:885,tfc:15.3,dq:2.7},
      5:{vd:885,tfc:15.8,dq:2.9},6:{vd:900,tfc:16.2,dq:3.1},7:{vd:1000,tfc:16.7,dq:3.6},8:{vd:1100,tfc:17,dq:4.1}
    },
    extraction: {
      "15'RS": {load:[2000,2500,3000,3500,4000,5000,6000,7000,8000,8500], bands:{a:[4.4,4.5,4.6,4.7,4.8,5,5.1,5.2,5.4,5.5],b:[4.2,4.3,4.4,4.5,4.6,4.7,4.9,5,5.1,5.1],c:[4.1,4.2,4.2,4.3,4.4,4.5,4.6,4.6,4.7,4.7],d:[3.8,3.9,4,4.1,4.2,4.2,4.2,4.3,4.4,4.4]}},
      "22'RS": {load:[7000,8000,9000,10000,11000,12000,13000,14000,15000,16000,17000,18000], bands:{a:[4.7,4.8,4.9,5,5,5.1,5.2,5.2,5.3,5.3,5.4,5.4],b:[4.5,4.6,4.7,4.8,4.8,4.9,4.9,5,5,5.1,5.1,5.2],c:[4.4,4.4,4.5,4.5,4.6,4.6,4.6,4.7,4.7,4.7,4.8,4.8],d:[4.1,4.2,4.2,4.2,4.3,4.3,4.3,4.4,4.4,4.4,4.5,4.5]}},
      "28'RS": {load:[14000,16000,18000,20000,22000,24000,28000,32000], bands:{a:[4.3,4.4,4.5,4.5,4.6,4.7,4.8,4.9],b:[4.2,4.2,4.3,4.3,4.4,4.4,4.4,4.5],c:[4,4,4.1,4.1,4.2,4.2,4.2,4.3],d:[3.7,3.8,3.8,3.9,3.9,3.9,4,4]}},
      "G-14": {load:[25000,27000,29000,31000,33000,35000,37000,39000,42000], bands:{a:[4.5,4.5,4.6,4.6,4.7,4.7,4.8,4.8,4.9],b:[4.3,4.3,4.4,4.4,4.4,4.5,4.5,4.5,4.6],c:[4,4.1,4.1,4.1,4.2,4.2,4.2,4.3,4.3],d:[3.8,3.8,3.8,3.9,3.9,3.9,4,4,4]}}
    }
  }
};

const MODE_DEFAULTS = {
  cds: {weight:7915,station:659,dropAltitude:600,ias:130,temperature:28,qnh:29.92,terrainElevation:484,impactElevation:433,containerCount:6,loadName:"大米"},
  per: {weight:250,station:"",dropAltitude:1250,ias:130,temperature:30,qnh:29.92,terrainElevation:99,impactElevation:99,rfColumn:"II",exitMethod:"DOOR"},
  he: {weight:15000,station:659,dropAltitude:1100,ias:140,temperature:28,qnh:29.92,terrainElevation:484,impactElevation:433,recoveryCount:"3",extractionChute:"22'RS"}
};

const MODE_FIELDS = ["weight","station","dropAltitude","ias","temperature","qnh","terrainElevation","impactElevation","containerCount","loadName","rfColumn","exitMethod","recoveryCount","extractionChute"];
const modeState = structuredClone(MODE_DEFAULTS);
let lastResult = null;

const $ = id => document.getElementById(id);
const degToRad = value => value * Math.PI / 180;
const radToDeg = value => value * 180 / Math.PI;
const normalize360 = value => ((value % 360) + 360) % 360;

function forecastLinear(x, knownY, knownX) {
  const meanX = knownX.reduce((a,b)=>a+b,0) / knownX.length;
  const meanY = knownY.reduce((a,b)=>a+b,0) / knownY.length;
  let numerator = 0;
  let denominator = 0;
  for (let i=0; i<knownX.length; i++) {
    numerator += (knownX[i]-meanX) * (knownY[i]-meanY);
    denominator += (knownX[i]-meanX) ** 2;
  }
  return meanY + (denominator ? numerator / denominator : 0) * (x - meanX);
}

function numeric(id, required=true) {
  const raw = $(id).value.trim();
  if (!raw && !required) return null;
  const value = Number(raw);
  if (!Number.isFinite(value)) throw new Error(`${$(id).closest("label")?.querySelector("span")?.textContent?.trim() || id}格式錯誤`);
  return value;
}

function parseDmm(raw, type) {
  const text = String(raw).trim().toUpperCase().replace(/[°′'\s]/g, "");
  const allowed = type === "lat" ? ["N","S"] : ["E","W"];
  if (!allowed.includes(text[0])) throw new Error(`${type === "lat" ? "PI緯度" : "PI經度"}必須以${allowed.join("或")}開頭`);
  const body = text.slice(1);
  const degreeDigits = type === "lat" ? 2 : 3;
  if (!/^\d+(\.\d+)?$/.test(body)) throw new Error(`${type === "lat" ? "PI緯度" : "PI經度"}不是有效的度分分格式`);

  let degrees;
  let minutes;
  if (body.includes(".")) {
    const dot = body.indexOf(".");
    const integerPart = body.slice(0, dot);
    if (integerPart.length !== degreeDigits + 2) throw new Error(`${type === "lat" ? "緯度" : "經度"}請使用度分分格式`);
    degrees = Number(integerPart.slice(0, degreeDigits));
    minutes = Number(integerPart.slice(degreeDigits) + body.slice(dot));
  } else {
    if (body.length !== degreeDigits + 4) throw new Error(`${type === "lat" ? "緯度" : "經度"}無小數點時須輸入${degreeDigits + 4}位數字`);
    degrees = Number(body.slice(0, degreeDigits));
    minutes = Number(body.slice(degreeDigits)) / 100;
  }

  const limit = type === "lat" ? 90 : 180;
  if (degrees > limit || minutes >= 60 || (degrees === limit && minutes > 0)) throw new Error(`${type === "lat" ? "緯度" : "經度"}超出有效範圍`);
  const sign = ["S","W"].includes(text[0]) ? -1 : 1;
  return sign * (degrees + minutes / 60);
}

function destination(lat, lon, bearingDeg, distanceM) {
  const angular = distanceM / EARTH_RADIUS_M;
  const bearing = degToRad(normalize360(bearingDeg));
  const lat1 = degToRad(lat);
  const lon1 = degToRad(lon);
  const lat2 = Math.asin(Math.sin(lat1)*Math.cos(angular) + Math.cos(lat1)*Math.sin(angular)*Math.cos(bearing));
  const lon2 = lon1 + Math.atan2(Math.sin(bearing)*Math.sin(angular)*Math.cos(lat1), Math.cos(angular)-Math.sin(lat1)*Math.sin(lat2));
  return {lat:radToDeg(lat2), lon:((radToDeg(lon2)+540)%360)-180};
}

function offsetPoint(lat, lon, course, alongYd, rightYd) {
  const c = degToRad(normalize360(course));
  const northYd = alongYd * Math.cos(c) - rightYd * Math.sin(c);
  const eastYd = alongYd * Math.sin(c) + rightYd * Math.cos(c);
  const distanceYd = Math.hypot(northYd, eastYd);
  const bearing = normalize360(radToDeg(Math.atan2(eastYd, northYd)));
  return destination(lat, lon, bearing, distanceYd * YD_TO_M);
}

function formatDmm(value, type) {
  const direction = type === "lat" ? (value >= 0 ? "N" : "S") : (value >= 0 ? "E" : "W");
  const degreeDigits = type === "lat" ? 2 : 3;
  const absolute = Math.abs(value);
  let degrees = Math.floor(absolute);
  let minutes = Math.round((absolute - degrees) * 6000) / 100;
  if (minutes >= 60) { degrees += 1; minutes = 0; }
  return `${direction}${String(degrees).padStart(degreeDigits,"0")}${minutes.toFixed(2).padStart(5,"0")}`;
}

function formatDms(value, type) {
  const direction = type === "lat" ? (value >= 0 ? "N" : "S") : (value >= 0 ? "E" : "W");
  const degreeDigits = type === "lat" ? 2 : 3;
  const absolute = Math.abs(value);
  let degrees = Math.floor(absolute);
  const totalSeconds = (absolute - degrees) * 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.round((totalSeconds - minutes * 60) * 10) / 10;
  if (seconds >= 60) { seconds = 0; minutes += 1; }
  if (minutes >= 60) { minutes = 0; degrees += 1; }
  return `${direction}${String(degrees).padStart(degreeDigits,"0")}°${String(minutes).padStart(2,"0")}′${seconds.toFixed(1).padStart(4,"0")}″`;
}

function kmlCoord(point) { return `${point.lon.toFixed(6)},${point.lat.toFixed(6)},0`; }

function rangeWarning(value, values, label, warnings) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (value < min || value > max) warnings.push(`${label} ${value} 超出彈道表範圍 ${min}–${max}，結果依Excel公式外推。`);
}

function ballisticFor(mode, input, warnings) {
  if (mode === "cds") {
    const perContainer = input.weight / input.containerCount;
    rangeWarning(perContainer, BALLISTIC.cds.load, "每包平均重量", warnings);
    rangeWarning(input.station, BALLISTIC.cds.stations, "站位", warnings);
    return {
      vd: forecastLinear(perContainer, BALLISTIC.cds.vd, BALLISTIC.cds.load),
      rf: forecastLinear(perContainer, BALLISTIC.cds.rf, BALLISTIC.cds.load),
      tfc: forecastLinear(perContainer, BALLISTIC.cds.tfc, BALLISTIC.cds.load),
      dq: forecastLinear(perContainer, BALLISTIC.cds.dq, BALLISTIC.cds.load),
      exit: forecastLinear(input.station, BALLISTIC.cds.exits, BALLISTIC.cds.stations)
    };
  }
  if (mode === "per") {
    rangeWarning(input.weight, BALLISTIC.personnel.load, "人員重量", warnings);
    return {
      vd: 180,
      rf: forecastLinear(input.weight, BALLISTIC.personnel[input.rfColumn], BALLISTIC.personnel.load),
      tfc: 5.4,
      dq: 0,
      exit: input.exitMethod === "DOOR" ? 3.2 : 3.8
    };
  }
  const recovery = BALLISTIC.heavy.recovery[input.recoveryCount];
  const fixed = BALLISTIC.heavy.fixed[input.recoveryCount];
  const extraction = BALLISTIC.heavy.extraction[input.extractionChute];
  const band = input.station <= 419 ? "a" : input.station <= 539 ? "b" : input.station <= 649 ? "c" : "d";
  rangeWarning(input.weight, recovery.load, "重裝備重量（回收傘）", warnings);
  rangeWarning(input.weight, extraction.load, "重裝備重量（抽出傘）", warnings);
  return {
    vd: fixed.vd,
    rf: forecastLinear(input.weight, recovery.rf, recovery.load),
    tfc: fixed.tfc,
    dq: fixed.dq,
    exit: forecastLinear(input.weight, extraction.bands[band], extraction.load)
  };
}

function readInputs() {
  const mode = $("mode").value;
  const windSpeed = numeric("windSpeed");
  const windDirectionValue = numeric("windDirection", false);
  if (windSpeed > 0 && windDirectionValue === null) throw new Error("風速大於0時必須輸入風向");
  const trueCourseInput = numeric("trueCourse");
  const trueCourse = trueCourseInput === 360 ? 360 : normalize360(trueCourseInput);
  if (trueCourseInput < 0 || trueCourseInput > 360) throw new Error("任務真向必須介於0至360度");
  if (windDirectionValue !== null && (windDirectionValue < 0 || windDirectionValue > 360)) throw new Error("風向必須介於0至360度");

  const input = {
    mode,
    missionName: $("missionName").value.trim() || "CARP Mission",
    weight: numeric("weight"),
    station: mode === "per" ? null : numeric("station"),
    dropAltitude: numeric("dropAltitude"),
    ias: numeric("ias"),
    temperature: numeric("temperature"),
    qnh: numeric("qnh"),
    terrainElevation: numeric("terrainElevation"),
    impactElevation: numeric("impactElevation"),
    trueCourse,
    windDirection: windDirectionValue ?? 0,
    windSpeed,
    piLat: parseDmm($("piLat").value, "lat"),
    piLon: parseDmm($("piLon").value, "lon"),
    forwardDistance: numeric("forwardDistance"),
    areaLeft: numeric("areaLeft"),
    areaRight: numeric("areaRight"),
    areaFront: numeric("areaFront"),
    areaBack: numeric("areaBack"),
    containerCount: numeric("containerCount"),
    loadName: $("loadName").value.trim(),
    rfColumn: $("rfColumn").value,
    exitMethod: $("exitMethod").value,
    recoveryCount: Number($("recoveryCount").value),
    extractionChute: $("extractionChute").value
  };
  if (input.weight <= 0 || input.dropAltitude <= 0 || input.ias <= 0) throw new Error("重量、空投高度與指示空速必須大於0");
  if (input.mode === "cds" && input.containerCount <= 0) throw new Error("貨物包數必須大於0");
  if ([input.forwardDistance,input.areaLeft,input.areaRight,input.areaFront,input.areaBack,input.windSpeed].some(v => v < 0)) throw new Error("距離與風速不可為負值");
  return input;
}

function calculate() {
  const input = readInputs();
  const warnings = [];
  const ballistic = ballisticFor(input.mode, input, warnings);

  const trueAltitude = input.dropAltitude + input.terrainElevation;
  const pressureVariation = (29.92 - input.qnh) * 1000;
  const pressureAltitude = trueAltitude + pressureVariation;
  const trueAltitudeTemperature = input.temperature - trueAltitude / 500;
  const tasBase = 1 - 0.00000687535 * pressureAltitude;
  if (tasBase <= 0) throw new Error("壓力高度超出TAS公式的有效範圍");
  const tas = input.ias * Math.sqrt(((trueAltitudeTemperature + 273.15) / 288.15) / (tasBase ** 5.2561));

  const adjustedRfBase = 1 - 0.00000687535 * (pressureAltitude - input.dropAltitude / 2);
  if (adjustedRfBase <= 0) throw new Error("高度超出下降率修正公式的有效範圍");
  const meanTemperatureK = ((input.temperature + trueAltitudeTemperature) / 2) + 273.15;
  const adjustedRf = ballistic.rf * Math.sqrt((meanTemperatureK / 288.15) / (adjustedRfBase ** 5.2561));
  const altitudeAboveImpact = trueAltitude - input.impactElevation;
  const stabilizationAltitude = altitudeAboveImpact - ballistic.vd;
  if (stabilizationAltitude < 0) throw new Error("空投高度過低：穩定高度小於0");
  const timeOfFall = stabilizationAltitude / adjustedRf;
  const ttf = timeOfFall + ballistic.tfc;
  const ftt = ballistic.exit + ballistic.dq;

  const relativeWind = degToRad(input.windDirection - input.trueCourse);
  const gsRaw = Math.sqrt(tas**2 + input.windSpeed**2 - 2*tas*input.windSpeed*Math.cos(relativeWind));
  const gs = Math.round(Math.round(gsRaw * 100) / 100);
  const ftdRaw = gs * ftt / 1.78;
  const ftd = Math.round(ftdRaw);
  const offset2 = Math.round(gs * Math.sin(degToRad(2)) * ttf / 1.78);
  const ht5 = Math.round(5 * (ttf + ftt) / 1.78);

  const along = ftd - input.windSpeed * Math.cos(relativeWind) * (ttf + ftt) / 1.78;
  const cross = input.windSpeed * Math.sin(relativeWind) * ttf / 1.78;
  const northYd = -along * Math.cos(degToRad(input.trueCourse)) - cross * Math.sin(degToRad(input.trueCourse));
  const eastYd = -along * Math.sin(degToRad(input.trueCourse)) + cross * Math.cos(degToRad(input.trueCourse));
  const carpDistance = Math.hypot(northYd, eastYd);
  const carpBearing = normalize360(radToDeg(Math.atan2(eastYd, northYd)));
  const carp = destination(input.piLat, input.piLon, carpBearing, carpDistance * YD_TO_M);

  return {input,warnings,ballistic,tas,gs,ttf,ftt,ftd,offset2,ht5,along,cross,carp};
}

function displacementText(value, type) {
  if (Math.abs(value) < 0.5) return type === "along" ? "PI" : "0";
  if (type === "along") return `${value >= 0 ? "近" : "遠"} ${Math.round(Math.abs(value))} yd`;
  return `${value >= 0 ? "R" : "L"} ${Math.round(Math.abs(value))} yd`;
}

function updateResults(result) {
  $("resultFtd").textContent = result.ftd;
  $("resultOffset").textContent = result.offset2;
  $("resultHt").textContent = result.ht5;
  $("resultAlong").textContent = displacementText(result.along,"along");
  $("resultCross").textContent = displacementText(result.cross,"cross");
  $("resultDmm").textContent = `${formatDmm(result.carp.lat,"lat")} / ${formatDmm(result.carp.lon,"lon")}`;
  $("resultDms").textContent = `${formatDms(result.carp.lat,"lat")} / ${formatDms(result.carp.lon,"lon")}`;
  $("resultKml").textContent = kmlCoord(result.carp);
  $("resultTas").textContent = `${result.tas.toFixed(1)} kt`;
  $("resultGs").textContent = `${result.gs} kt`;
  $("resultTtf").textContent = `${result.ttf.toFixed(2)} s`;
  $("resultFtt").textContent = `${result.ftt.toFixed(2)} s`;
  $("warningBox").hidden = result.warnings.length === 0;
  $("warningBox").textContent = result.warnings.join(" ");
  $("errorBox").hidden = true;
  $("downloadButton").disabled = false;
  $("fileName").textContent = `檔名：${safeFileName(result.input.missionName)}.kml`;
}

function clearResults(error) {
  for (const id of ["resultFtd","resultOffset","resultHt","resultAlong","resultCross","resultDmm","resultDms","resultKml","resultTas","resultGs","resultTtf","resultFtt"]) $(id).textContent = "—";
  $("errorBox").textContent = error.message;
  $("errorBox").hidden = false;
  $("warningBox").hidden = true;
  $("downloadButton").disabled = true;
  lastResult = null;
}

function recalculate() {
  try {
    lastResult = calculate();
    updateResults(lastResult);
  } catch (error) {
    clearResults(error instanceof Error ? error : new Error("計算失敗"));
  }
}

function createKml(result) {
  const {input,carp} = result;
  const pi = {lat:input.piLat,lon:input.piLon};
  const tLeft = offsetPoint(pi.lat,pi.lon,input.trueCourse,0,-40);
  const tRight = offsetPoint(pi.lat,pi.lon,input.trueCourse,0,40);
  const tStem = offsetPoint(pi.lat,pi.lon,input.trueCourse,-80,0);
  const x1a = destination(carp.lat,carp.lon,45,40*YD_TO_M);
  const x1b = destination(carp.lat,carp.lon,225,40*YD_TO_M);
  const x2a = destination(carp.lat,carp.lon,315,40*YD_TO_M);
  const x2b = destination(carp.lat,carp.lon,135,40*YD_TO_M);
  const forward = destination(carp.lat,carp.lon,input.trueCourse+180,input.forwardDistance*NM_TO_M);
  // For the PI area, "front" is the inbound/CARP side (reciprocal of true course),
  // while "back" continues along the entered true course.
  const leftFront = offsetPoint(pi.lat,pi.lon,input.trueCourse,-input.areaFront,-input.areaLeft);
  const rightFront = offsetPoint(pi.lat,pi.lon,input.trueCourse,-input.areaFront,input.areaRight);
  const rightBack = offsetPoint(pi.lat,pi.lon,input.trueCourse,input.areaBack,input.areaRight);
  const leftBack = offsetPoint(pi.lat,pi.lon,input.trueCourse,input.areaBack,-input.areaLeft);
  const name = escapeXml(input.missionName);

  return `<?xml version="1.0" encoding="UTF-8"?>\n`+
`<kml xmlns="http://www.opengis.net/kml/2.2">\n<Document>\n`+
`<name>${name}</name>\n`+
`<Style id="piT"><LineStyle><color>ff00ffff</color><width>4.5</width></LineStyle></Style>\n`+
`<Style id="carpX"><LineStyle><color>ff00ff00</color><width>4.5</width></LineStyle></Style>\n`+
`<Style id="route"><LineStyle><color>ffff00ff</color><width>3</width></LineStyle></Style>\n`+
`<Style id="dz"><LineStyle><color>ff00ffff</color><width>2.5</width></LineStyle><PolyStyle><color>0000ffff</color></PolyStyle></Style>\n`+
`<Placemark><name>PI T Crossbar</name><styleUrl>#piT</styleUrl><LineString><tessellate>1</tessellate><coordinates>${kmlCoord(tLeft)} ${kmlCoord(tRight)}</coordinates></LineString></Placemark>\n`+
`<Placemark><name>PI T Stem</name><styleUrl>#piT</styleUrl><LineString><tessellate>1</tessellate><coordinates>${kmlCoord(pi)} ${kmlCoord(tStem)}</coordinates></LineString></Placemark>\n`+
`<Placemark><name>CARP X 1</name><styleUrl>#carpX</styleUrl><LineString><tessellate>1</tessellate><coordinates>${kmlCoord(x1a)} ${kmlCoord(x1b)}</coordinates></LineString></Placemark>\n`+
`<Placemark><name>CARP X 2</name><styleUrl>#carpX</styleUrl><LineString><tessellate>1</tessellate><coordinates>${kmlCoord(x2a)} ${kmlCoord(x2b)}</coordinates></LineString></Placemark>\n`+
`<Placemark><name>CARP Forward Line</name><styleUrl>#route</styleUrl><LineString><tessellate>1</tessellate><coordinates>${kmlCoord(carp)} ${kmlCoord(forward)}</coordinates></LineString></Placemark>\n`+
`<Placemark><name>PI Area</name><styleUrl>#dz</styleUrl><Polygon><outerBoundaryIs><LinearRing><coordinates>${kmlCoord(leftFront)} ${kmlCoord(rightFront)} ${kmlCoord(rightBack)} ${kmlCoord(leftBack)} ${kmlCoord(leftFront)}</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark>\n`+
`</Document>\n</kml>`;
}

function escapeXml(text) {
  return String(text).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&apos;");
}

function safeFileName(name) {
  return String(name || "CARP Mission").replace(/[\\/:*?"<>|]/g,"_").trim() || "CARP Mission";
}

async function downloadKml(result) {
  const fileName = `${safeFileName(result.input.missionName)}.kml`;
  const blob = new Blob([createKml(result)], {type:"application/vnd.google-earth.kml+xml;charset=utf-8"});
  if (typeof File === "function" && navigator.share) {
    const file = new File([blob], fileName, {type:"application/vnd.google-earth.kml+xml"});
    if (!navigator.canShare || navigator.canShare({files:[file]})) {
      try {
        await navigator.share({files:[file],title:result.input.missionName});
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

function saveCurrentMode() {
  const mode = $("mode").value;
  const state = modeState[mode];
  for (const id of MODE_FIELDS) if ($(id)) state[id] = $(id).value;
}

function loadMode(mode) {
  const state = modeState[mode];
  for (const id of MODE_FIELDS) if ($(id) && state[id] !== undefined) $(id).value = state[id];
  document.querySelectorAll("[data-panel]").forEach(panel => panel.hidden = panel.dataset.panel !== mode);
  document.querySelector(".station-field").hidden = mode === "per";
  $("mode").value = mode;
  document.querySelectorAll(".segment").forEach(button => {
    const active = button.dataset.mode === mode;
    button.classList.toggle("active",active);
    button.setAttribute("aria-pressed",String(active));
  });
  recalculate();
}

document.querySelectorAll(".segment").forEach(button => button.addEventListener("click", () => {
  saveCurrentMode();
  loadMode(button.dataset.mode);
}));

$("carpForm").addEventListener("input", recalculate);
$("carpForm").addEventListener("change", recalculate);
$("carpForm").addEventListener("submit", async event => {
  event.preventDefault();
  recalculate();
  if (lastResult) await downloadKml(lastResult);
});

window.addEventListener("online", () => $("offlineStatus").textContent = "已連線");
window.addEventListener("offline", () => $("offlineStatus").textContent = "離線可用");

if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(()=>{}));

loadMode("cds");
