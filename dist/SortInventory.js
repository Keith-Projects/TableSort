"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TableSort = /*#__PURE__*/function () {
  function TableSort(colHeader, colID, datatype) {
    _classCallCheck(this, TableSort);

    this.colHeader = colHeader != "" ? colHeader : "";
    this.colID = colID != "" ? colID : "";
    this.datatype = datatype != "" ? datatype : "";
    this.direction = "asc";
    this.colClicked = "";
    this.table = document.getElementsByTagName("table")[0];
  }

  _createClass(TableSort, [{
    key: "sortByNumber",
    value: function sortByNumber(curr, next, order) {
      var willSwitch = false;
      var currAlphaClear = curr.replace(/^a-zA-Z]/g, "");
      var nextAlphaClear = next.replace(/^a-zA-Z]/g, "");

      if (order == "asc") {
        if (currAlphaClear === nextAlphaClear) {
          var currNumber = parseInt(curr.replace(/[^0-9]/g, ""), 10);
          var nextNumber = parseInt(next.replace(/[^0-9]/g, ""), 10);

          if (currNumber > nextNumber) {
            willSwitch = true;
          }
        } else if (currAlphaClear > nextAlphaClear) {
          willSwitch = true;
        }
      } else {
        // descending
        if (currAlphaClear === nextAlphaClear) {
          var _currNumber = parseInt(curr.replace(/[^0-9]/g, ""), 10);

          var _nextNumber = parseInt(next.replace(/[^0-9]/g, ""), 10);

          if (_currNumber < _nextNumber) {
            willSwitch = true;
          }
        } else if (currAlphaClear < nextAlphaClear) {
          willSwitch = true;
        }
      }

      return willSwitch;
    }
  }, {
    key: "sortByString",
    value: function sortByString(curr, next, order) {
      var willSwitch = false;

      if (order == "asc") {
        if (curr > next) {
          willSwitch = true;
        }
      } else {
        if (curr < next) {
          willSwitch = true;
        }
      }

      return willSwitch;
    }
  }, {
    key: "sortByDate",
    value: function sortByDate(curr, next, order) {
      var willSwitch = false;
      var yearOne = new Date(curr).getFullYear();
      var yearTwo = new Date(next).getFullYear();
      var dayOne = new Date(curr).getDate();
      var dayTwo = new Date(next).getDate();
      var monthOne = new Date(curr).getMonth();
      var monthTwo = new Date(next).getMonth();

      if (order == "asc") {
        if (yearOne > yearTwo) {
          willSwitch = true;
        } else if (yearOne == yearTwo) {
          if (monthOne > monthTwo) {
            willSwitch = true;
          } else if (monthOne == monthTwo) {
            if (dayOne > dayTwo) {
              willSwitch = true;
            }
          }
        }
      } else {
        if (yearOne < yearTwo) {
          willSwitch = true;
        } else if (yearOne == yearTwo) {
          if (monthOne < monthTwo) {
            willSwitch = true;
          } else if (monthOne == monthTwo) {
            if (dayOne < dayTwo) {
              willSwitch = true;
            }
          }
        }
      }

      return willSwitch;
    }
  }, {
    key: "sortByCurrency",
    value: function sortByCurrency(curr, next, order) {
      var newCurr = Math.round(curr.replace(/[$,]/g, "").replace(/\s/g, ""));
      var newNext = Math.round(next.replace(/[$,]/g, "").replace(/\s/g, ""));
      var willSwitch = false;

      if (order == "asc") {
        if (newCurr > newNext) {
          willSwitch = true;
        }
      } else {
        if (newCurr < newNext) {
          willSwitch = true;
        }
      }

      return willSwitch;
    }
  }, {
    key: "createModal",
    value: function createModal() {
      var modalContainer = document.createElement("div");
      modalContainer.setAttribute("class", "modal");
      modalContainer.setAttribute("id", "spinner-dialog");
      modalContainer.setAttribute("tabindex", "-1");
      modalContainer.setAttribute("role", "dialog");
      var modalDialog = document.createElement("div");
      modalDialog.setAttribute("class", "modal-dialog modal-dialog-centered text-center");
      var spinner = document.createElement("span");
      spinner.setAttribute("class", "fa fa-spinner fa-spin fa-5x w-100 text-white");
      spinner.setAttribute("role", "alert");
      modalDialog.appendChild(spinner);
      modalContainer.appendChild(modalDialog);
      return modalContainer;
    }
  }, {
    key: "handleSessions",
    value: function handleSessions() {
      sessionStorage.setItem("colHeader", this.colHeader);
      sessionStorage.setItem("colID", this.colID);
      sessionStorage.setItem("datatype", this.datatype);
      sessionStorage.setItem("direction", this.direction);
      sessionStorage.setItem("colClicked", this.colClicked);
    }
  }, {
    key: "handleSortOnPageLoad",
    value: function handleSortOnPageLoad() {
      this.colHeader = sessionStorage.getItem("colHeader");
      this.colID = sessionStorage.getItem("colID");
      this.datatype = sessionStorage.getItem("datatype");
      this.direction = sessionStorage.getItem("direction");
      this.colClicked = sessionStorage.getItem("colClicked");
    }
  }, {
    key: "handleSortTable",
    value: function handleSortTable() {
      var table = document.getElementsByTagName("table")[0];
      var rows = this.table.rows;
      var i;
      var shouldSwitch = false;
      var switching = true;

      while (switching) {
        switching = false;

        for (i = 1; i < rows.length - 1; i++) {
          var current = rows[i].getElementsByTagName("TD")[this.colID];
          var next = rows[i + 1].getElementsByTagName("TD")[this.colID];

          switch (this.datatype) {
            case "number":
              var trimX = current.innerHTML.replace(/\s/g, "");
              var trimY = next.innerHTML.replace(/\s/g, "");
              shouldSwitch = this.sortByNumber(trimX, trimY, this.direction);
              break;

            case "string":
              shouldSwitch = this.sortByString(current.innerHTML.toLowerCase(), next.innerHTML.toLowerCase(), this.direction);
              break;

            case "date":
              shouldSwitch = this.sortByDate(current.innerHTML, next.innerHTML, this.direction);
              break;

            case "currency":
              shouldSwitch = this.sortByCurrency(current.innerHTML.toLowerCase(), next.innerHTML.toLowerCase(), this.direction);
              break;
          }

          if (shouldSwitch) {
            break;
          }
        }

        if (shouldSwitch) {
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
        }
      }

      if (this.direction == "asc") {
        this.direction = "desc";
      } else {
        this.direction = "asc";
      }

      if (!switching) {
        $("#spinner-dialog").modal("hide");
      }
    }
  }]);

  return TableSort;
}();

var sortObj = new TableSort("", "", "");
document.body.parentNode.insertBefore(sortObj.createModal(), document.body[0]);
sortObj.table.rows[0].addEventListener("click", function (event) {
  sortObj.colHeader = event.target.innerHTML;
  sortObj.colID = $("#".concat(event.target.id)).index();
  sortObj.datatype = event.target.dataset.datatype;

  if (sortObj.table.rows[0].getElementsByTagName("th").length != sortObj.table.rows[1].getElementsByTagName("td").length) {
    var tdArray = Array.from(sortObj.table.rows[1].getElementsByTagName("td"));
    tdArray.forEach(function (item) {
      if (item.dataset.hiddenfromsort) {
        sortObj.colID++;
      }
    });
  }

  if (sortObj.colClicked != sortObj.colHeader) {
    sortObj.direction = "asc";
    sortObj.colClicked = sortObj.colHeader;
  }

  sortObj.handleSessions();
  $("#spinner-dialog").modal({
    backdrop: "static",
    keyboard: false
  });
  setTimeout("sortObj.handleSortTable();", 11);
});
addEventListener("load", function () {
  if (sessionStorage.getItem("colHeader")) {
    sortObj.handleSortOnPageLoad();
    $("#spinner-dialog").modal({
      backdrop: "static",
      keyboard: false
    });
    setTimeout("sortObj.handleSortTable();", 11);
  }
});