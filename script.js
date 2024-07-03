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
  var maxLength = 12; // Максимальная длина выводимой строки

  if (output.length > maxLength) {
    output = output.substring(0, maxLength);
  }

  document.getElementById("output-value").innerText = output;
}

var lst = ["%", "/", "+", "-", "*", "^"];
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
          if (output.includes("^")) {
            var parts = output.split("^");
            result = Math.pow(parseFloat(parts[0]), parseFloat(parts[1]));
          } else if (output.includes("√")) {
            var number = output.split("√")[1];
            result = Math.sqrt(parseFloat(number));
          } else {
            result = eval(output.replace(/ans/g, ans)); // Заменить ans на его значение перед вычислением
          }

          if (result == undefined) {
            result = "NaN";
            output = "";
          }
          f = true;
          ans = result.toString(); // Обновить ans
          printOutput(result);
          printHistory(output.replace(/ans/g, ans) + "=" + ans); // Заменить ans на его значение в истории
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
