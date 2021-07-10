class TableSort {
  constructor(colHeader, colID, datatype) {
    this.colHeader = colHeader != "" ? colHeader : "";
    this.colID = colID != "" ? colID : "";
    this.datatype = datatype != "" ? datatype : "";
    this.direction = "asc";
    this.colClicked = "";
    this.table = document.getElementsByTagName("table")[0];
  }

  sortByNumber(curr, next, order) {
    let willSwitch = false;
    let currAlphaClear = curr.replace(/^a-zA-Z]/g, "");
    let nextAlphaClear = next.replace(/^a-zA-Z]/g, "");
    if (order == "asc") {
      if (currAlphaClear === nextAlphaClear) {
        let currNumber = parseInt(curr.replace(/[^0-9]/g, ""), 10);
        let nextNumber = parseInt(next.replace(/[^0-9]/g, ""), 10);
        if (currNumber > nextNumber) {
          willSwitch = true;
        }
      } else if (currAlphaClear > nextAlphaClear) {
        willSwitch = true;
      }
    } else {
      // descending
      if (currAlphaClear === nextAlphaClear) {
        let currNumber = parseInt(curr.replace(/[^0-9]/g, ""), 10);
        let nextNumber = parseInt(next.replace(/[^0-9]/g, ""), 10);
        if (currNumber < nextNumber) {
          willSwitch = true;
        }
      } else if (currAlphaClear < nextAlphaClear) {
        willSwitch = true;
      }
    }
    return willSwitch;
  }

  sortByString(curr, next, order) {
    let willSwitch = false;
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

  sortByDate(curr, next, order) {
    let willSwitch = false;
    let yearOne = new Date(curr).getFullYear();
    let yearTwo = new Date(next).getFullYear();
    let dayOne = new Date(curr).getDate();
    let dayTwo = new Date(next).getDate();
    let monthOne = new Date(curr).getMonth();
    let monthTwo = new Date(next).getMonth();
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

  sortByCurrency(curr, next, order) {
    let newCurr = Math.round(curr.replace(/[$,]/g, "").replace(/\s/g, ""));
    let newNext = Math.round(next.replace(/[$,]/g, "").replace(/\s/g, ""));
    let willSwitch = false;
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

  createModal() {
    let modalContainer = document.createElement("div");
    modalContainer.setAttribute("class", "modal");
    modalContainer.setAttribute("id", "spinner-dialog");
    modalContainer.setAttribute("tabindex", "-1");
    modalContainer.setAttribute("role", "dialog");

    let modalDialog = document.createElement("div");
    modalDialog.setAttribute(
      "class",
      "modal-dialog modal-dialog-centered text-center"
    );

    let spinner = document.createElement("span");
    spinner.setAttribute(
      "class",
      "fa fa-spinner fa-spin fa-5x w-100 text-white"
    );
    spinner.setAttribute("role", "alert");

    modalDialog.appendChild(spinner);
    modalContainer.appendChild(modalDialog);

    return modalContainer;
  }

  handleSessions() {
    sessionStorage.setItem("colHeader", this.colHeader);
    sessionStorage.setItem("colID", this.colID);
    sessionStorage.setItem("datatype", this.datatype);
    sessionStorage.setItem("direction", this.direction);
    sessionStorage.setItem("colClicked", this.colClicked);
  }

  handleSortOnPageLoad() {
    this.colHeader = sessionStorage.getItem("colHeader");
    this.colID = sessionStorage.getItem("colID");
    this.datatype = sessionStorage.getItem("datatype");
    this.direction = sessionStorage.getItem("direction");
    this.colClicked = sessionStorage.getItem("colClicked");
  }

  handleSortTable() {
    let table = document.getElementsByTagName("table")[0];
    let rows = this.table.rows;
    let i;
    let shouldSwitch = false;
    let switching = true;
    while (switching) {
      switching = false;

      for (i = 1; i < rows.length - 1; i++) {
        let current = rows[i].getElementsByTagName("TD")[this.colID];
        let next = rows[i + 1].getElementsByTagName("TD")[this.colID];

        switch (this.datatype) {
          case "number":
            let trimX = current.innerHTML.replace(/\s/g, "");
            let trimY = next.innerHTML.replace(/\s/g, "");
            shouldSwitch = this.sortByNumber(trimX, trimY, this.direction);
            break;

          case "string":
            shouldSwitch = this.sortByString(
              current.innerHTML.toLowerCase(),
              next.innerHTML.toLowerCase(),
              this.direction
            );
            break;

          case "date":
            shouldSwitch = this.sortByDate(
              current.innerHTML,
              next.innerHTML,
              this.direction
            );
            break;

          case "currency":
            shouldSwitch = this.sortByCurrency(
              current.innerHTML.toLowerCase(),
              next.innerHTML.toLowerCase(),
              this.direction
            );
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
}

const sortObj = new TableSort("", "", "");
document.body.parentNode.insertBefore(sortObj.createModal(), document.body[0]);

sortObj.table.rows[0].addEventListener("click", function (event) {
  sortObj.colHeader = event.target.innerHTML;
  sortObj.colID = $(`#${event.target.id}`).index();
  sortObj.datatype = event.target.dataset.datatype;

  if (
    sortObj.table.rows[0].getElementsByTagName("th").length !=
    sortObj.table.rows[1].getElementsByTagName("td").length
  ) {
    let tdArray = Array.from(sortObj.table.rows[1].getElementsByTagName("td"));
    tdArray.forEach((item) => {
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

  $("#spinner-dialog").modal({ backdrop: "static", keyboard: false });
  setTimeout("sortObj.handleSortTable();", 11);
});

addEventListener("load", function () {
  if (sessionStorage.getItem("colHeader")) {
    sortObj.handleSortOnPageLoad();
    $("#spinner-dialog").modal({ backdrop: "static", keyboard: false });
    setTimeout("sortObj.handleSortTable();", 11);
  }
});
