function getHistory() {
  return document.getElementById("history-value").innerText;
}

function printHistory(num) {
  document.getElementById("history-value").innerText = num;
}

function getOutput() {
  return document.getElementById("output-value").innerText;
}

function printOutput(num) {
  var output = num.toString();
  var maxLength = 20;
  var outputElement = document.getElementById("output-value");

  if (output.length > maxLength) {
    output = output.substring(0, maxLength);
  }

  outputElement.innerText = output;
}

function roundResult(num) {
  var precision = 9; // Количество знаков после запятой
  return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
}

var lst = ["%", "/", "+", "-", "*", "^", "√"];
var f = false;
var ans = ""; // Переменная для хранения результата последнего вычисления
var toggleSignCount = 0; // Счетчик для чередования знака
var operator = document.getElementsByClassName("number");

for (var i = 0; i < operator.length; i++) {
  operator[i].addEventListener("click", function () {
    var buttonClicked = this.id;

    if (buttonClicked == "clear") {
      printHistory("");
      printOutput("");
      ans = ""; // Сбросить ans
      toggleSignCount = 0; // Сбросить счетчик знаков
    } else if (buttonClicked == "backspace") {
      var output = getOutput();
      if (output) {
        output = output.substring(0, output.length - 1);
        printOutput(output);
      }
    } else if (buttonClicked == "=") {
      try {
        var output = getOutput();
        var history = getHistory();

        if (output == "NaN" || output == "" || f) {
          f = false;
          printOutput("");
          printHistory("");
        } else {
          var result;
          // Замена оператора ^ на **
          output = output.replace(/\^/g, "**");

          // Замена символа √ с выражениями в скобках и числами
          output = output.replace(/√\(([^)]+)\)/g, function(match, group) {
            return "Math.sqrt(" + group + ")";
          });
          output = output.replace(/√(\d+(\.\d+)?)/g, function(match, number) {
            return "Math.sqrt(" + number + ")";
          });

          result = eval(output.replace(/ans/g, ans)); 
          result = roundResult(result); // Округление результата

          if (result == undefined || isNaN(result)) {
            result = "NaN";
            output = "";
          }
          f = true;
          ans = result.toString(); 
          printOutput(result);
          printHistory(output.replace(/ans/g, ans) + "=" + ans); 
        }
      } catch (error) {
        printOutput("NaN");
        printHistory("");
      }
    } else if (buttonClicked == "toggleSign") {
      var output = getOutput();
      if (output) {
        toggleSignCount++;
        if (toggleSignCount % 2 == 1) {
          // Нечетное количество нажатий - добавляем минус
          if (output[0] !== '-') {
            output = '-' + output;
          } else {
            output = output.substring(1);
          }
        } else {
          // Четное количество нажатий - убираем минус
          if (output[0] === '-') {
            output = output.substring(1);
          }
        }
        printOutput(output);
      }
    } else {
      var output = getOutput().toString();
      if (output.length == 0 && lst.includes(buttonClicked)) {
        printOutput("");
        printHistory("");
        f = false;
      } else {
        if (f || output == "NaN") {
          if (!lst.includes(buttonClicked)) {
            if (buttonClicked == "sqrt") {
              output = "√";
            } else {
              output = buttonClicked;
            }
            printHistory("");
          } else {
            output = output + buttonClicked.toString();
          }
          f = false;
        } else {
          if (output.length > 0) {
            if (buttonClicked == "sqrt") {
              output = "√" + output;
            } else {
              if (output.length >= 20 && !lst.includes(buttonClicked)) {
                return;
              }
              output = output + buttonClicked.toString();
            }
          } else {
            if (buttonClicked == "sqrt") {
              output = "√";
            } else {
              output = buttonClicked;
            }
          }
        }
        console.log(output);

        printOutput(output);
        if (output.includes("√")) {
          printHistory("sqrt(" + output.split("√")[1] + ")");
        } else {
          printHistory(output);
        }
      }
    }
  });
}
