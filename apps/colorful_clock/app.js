//var http = require("http");
const fontFace = "Dylex7x13";
const locale = require("locale");
const Layout = require("Layout");
const storage = require("Storage");
require("FontDylex7x13").add(Graphics);

//require("https://github.com/espruino/EspruinoDocs/blob/master/devices/PCD8544.js");
//var  on = false;

let tens = ["", "", "twenty", "thirty", "forty", "fifty"];
let ones = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
let days = [
  "",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
let months = [
  "",
  "jan.",
  "feb.",
  "mar.",
  "apr.",
  "may",
  "june",
  "july",
  "aug.",
  "sept.",
  "oct.",
  "nov.",
  "dec.",
];
let singles = ["o'", "oh", "aught"];

// weather icons from https://icons8.com/icon/set/weather/color
let sunIcon = require("heatshrink").decompress(
  atob(
    "mEwwhC/AH4AbhvQC6vd7ouVC4IwUCwIwUFwQwQCYgAHDZQXc9wACC6QWDDAgXN7wXF9oXPCwowDC5guGGAYXMCw4wCC5RGJJAZGTJBiNISIylQVJrLCC5owGF65fXR7AwBC5jvhC7JIILxapDFxAXOGAy9KC4owGBAQXODAgHDC54AHC8T0FAAQSOGg4qPGA4WUGAIuVC7AA/AH4AEA="
  )
);

let partSunIcon = require("heatshrink").decompress(
  atob(
    "mEwwhC/AH4AY6AWVhvdC6vd7owUFwIABFiYAFGR4Xa93u9oXTCwIYDC6HeC4fuC56MBC4ySOIwpIQXYQXHmYABRpwXECwQYKF5HjC4kwL5gQCAYYwO7wqFAAowK7wWKJBgXLJBPd6YX/AAoVMAAM/Cw0DC5yRHCx5JGFyAwGCyIwFC/4XyR4inXa64wRFwowQCw4A/AH4AkA"
  )
);

let cloudIcon = require("heatshrink").decompress(
  atob(
    "mEwwhC/AH4A/AH4AtgczmYWWDCgWDmcwIKAuEGBoSGGCAWKC7BIKIxYX6CpgABn4tUSJIWPJIwuQGAwWRGAoX/C+SPEU67XXGCIuFGCAWHAH4A/AH4A/ADg="
  )
);

let snowIcon = require("heatshrink").decompress(
  atob(
    "mEwwhC/AH4AhxGAC9YUBC4QZRhAVBAIWIC6QAEI6IYEI5cIBgwWOC64NCKohHPNox3RBgqnQEo7XPHpKONR5AXYAH4ASLa4XWXILiBC6r5LDBgWWDBRrKC5hsCEacIHawvMCIwvQC5QvQFAROEfZ5ADLJ4YGCywvVI7CPGC9IA/AH4AF"
  )
);

let rainIcon = require("heatshrink").decompress(
  atob(
    "mEwwhC/AH4AFgczmYWWDCgWDmcwIKAuEGBoSGGCAWKC7BIKIxYX6CpgABn4tUSJIWPJIwuQGAwWRGAoX/C+SPEU67XXGCIuFGCAWHAGeIBJEIwAVJhGIC5AJBC5QMJEJQMEC44JBC6QSCC54FHLxgNBBgYSEDgKpPMhQXneSwuUAH4A/AA4="
  )
);

let stormIcon = require("heatshrink").decompress(
  atob(
    "mEwwhC/AFEzmcwCyoYUgYXDmYuVGAY0OFwocHC6pNLCxYXYJBQXuCxhhJRpgYKCyBKFFyIXFCyJIFC/4XaO66nU3eza6k7C4IWFGBwXBCwwwO3ewC5AZMC6RaCIxZiI3e7AYYwRCQIIBC4QwPIQIpDC5owDhYREIxgAEFIouNC4orDFyBGBGAcLC6BaFhYWRLSRIFISQXcCyqhRAH4Az"
  )
);

// err icon - https://icons8.com/icons/set/error
let errIcon = require("heatshrink").decompress(
  atob(
    "mEwwkBiIA/AH4AZUAIWUiAXBWqgXXdIYuVGCgXBgICCIyYXCJCQTDC6QrEMCQSEJCQRFC6ApGJCCiDDQSpQFAYXEJBqNGJCA/EC4ZIOEwgXFJBgNEAhKlNAgxIKBgoXEJBjsLC5TsIeRycMBhRrMMBKzQEozjOBxAgHGww+IA6wfSH4hnIC47OMSJqlRIJAXCACIXaGoQARPwwuTAH4A/ABw"
  )
);

// config stuff
let twentyFourHourTime = false;
let useFahrenheit = false;
let hourColor = "#F00";
let minuteColor = "#FFF";

// layout
var clockLayout = new Layout({
  type: "v",
  lazy: true,
  c: [
    { type: "txt", font: "30%", label: "12:00", id: "hour"},
    { type: "txt", font: "20%", label: "12:00", id: "minute" },
    {type: "img",  id: "weatherIcon", src: sunIcon},
    { type: "txt", font: "6x8", label: "", id: "tempandwind" },
    { type: "txt", font: "6x8", label: "The Date", id: "date" },
  ],
});

function drawClock() {
  const d = new Date();
  let hour = d.getHours();
  let minute = d.getMinutes();
  let minuteString = ones[minute];

  if (minute > 0 && minute < 10) {
    minuteString = singles[1] + " " + minuteString;
  } else if (minute > 19) {
    const firstDigitStr = String(minute)[0];
    const firstDigitNum = Number(firstDigitStr);

    minuteString = tens[firstDigitNum] + "\n" + ones[minute % 10];
  }

  let timeString = "";

  if (false == twentyFourHourTime && hour > 12) {
    hour = hour - 12;
  }

  if (hour == 12 && minute == 0) {
    timeString = "noon";
  } else if (hour == 0 && minute == 0) {
    timeString = "midnight";
  } else if (hour != 12 && hour != 0 && minute == 0) {
    timeString = ones[hour] + "\n o'clock";
  } else {
    timeString = ones[hour]; // + " \n" + minuteString;
  }

  getDay();
  getWeather();
  clockLayout.hour.halign = "-1";
  clockLayout.hour.col = hourColor;
  clockLayout.hour.label = timeString;

  clockLayout.minute.halign = "-1";
  clockLayout.minute.col = minuteColor;
  clockLayout.minute.label = minuteString;
  // g.setColor(255,0,0);
  // g.setFont(fontFace,2);
  // g.drawString(timeString, 1, 35);
  // g.setColor(0,0,0);
  // g.setFont(fontFace,2);
  // g.drawString(minuteString, 1, 65);
  clockLayout.clear();
  clockLayout.render();
}

function getDay() {
  const d = new Date();
  let dayOfWeek = d.getDay();
  let dayOfMonth = d.getDate();
  let month = months[d.getMonth()];
  let dayString = days[dayOfWeek];

  g.setFont(fontFace, 1);
  // g.drawString(
  //   dayString + ", " + month + " " + dayOfMonth + " " + d.getFullYear(),
  //   1,
  //   160
  // );
  clockLayout.date.label = locale.date(d, 1).toUpperCase();
}

function getWeather() {
  var weatherJson = storage.readJSON("weather.json");
  if (weatherJson && weatherJson.weather) {
    var currentWeather = weatherJson.weather;
        const wind = locale.speed(currentWeather.wind).match(/^(\D*\d*)(.*)$/);
    let temp = locale
      .temp(currentWeather.temp - 273.15)
      .match(/^(\D*\d*)(.*)$/);

    clockLayout.tempandwind.label = temp[1] + " " + temp[2];
    const code = currentWeather.code || -1;
    if (code > 0) {
      clockLayout.weatherIcon.src = chooseIconByCode(code);
    } else {
      clockLayout.weatherIcon.src = chooseIcon(currentWeather.txt);
    }

  }
}

/**
Choose weather icon to display based on condition.
Based on function from the Bangle weather app so it should handle all of the conditions
sent from gadget bridge.
*/
function chooseIcon(condition) {
  condition = condition.toLowerCase();
  if (condition.includes("thunderstorm")) return stormIcon;
  if (
    condition.includes("freezing") ||
    condition.includes("snow") ||
    condition.includes("sleet")
  ) {
    return snowIcon;
  }
  if (condition.includes("drizzle") || condition.includes("shower")) {
    return rainIcon;
  }
  if (condition.includes("rain")) return rainIcon;
  if (condition.includes("clear")) return sunIcon;
  if (condition.includes("few clouds")) return partSunIcon;
  if (condition.includes("scattered clouds")) return cloudIcon;
  if (condition.includes("clouds")) return cloudIcon;
  if (
    condition.includes("mist") ||
    condition.includes("smoke") ||
    condition.includes("haze") ||
    condition.includes("sand") ||
    condition.includes("dust") ||
    condition.includes("fog") ||
    condition.includes("ash") ||
    condition.includes("squalls") ||
    condition.includes("tornado")
  ) {
    return cloudIcon;
  }
  return cloudIcon;
}

/*
 * Choose weather icon to display based on weather conditition code
 * https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
 */
function chooseIconByCode(code) {
  const codeGroup = Math.round(code / 100);
  switch (codeGroup) {
    case 2:
      return stormIcon;
    case 3:
      return rainIcon;
    case 5:
      return rainIcon;
    case 6:
      return snowIcon;
    case 7:
      return cloudIcon;
    case 8:
      switch (code) {
        case 800:
          return sunIcon;
        case 801:
          return partSunIcon;
        default:
          return cloudIcon;
      }
    default:
      return cloudIcon;
  }
}

g.clear();

var drawTimeout;

//update watchface in next minute
function queueDraw() {
  if (drawTimeout) clearTimeout(drawTimeout);
  drawTimeout = setTimeout(function () {
    drawTimeout = undefined;
    drawClock();
    queueDraw();
  }, 60000 - (Date.now() % 60000));
}

g.setBgColor(0,0,0);
queueDraw();
drawClock();
Bangle.loadWidgets();
Bangle.setUI("clock");
Bangle.drawWidgets();
