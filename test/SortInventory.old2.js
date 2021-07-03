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
    let regAlphaCheck = /^a-zA-Z]/g;
    let regNumberCheck = /[^0-9]/g;
    let currAlphaClear = curr.replace(regAlphaCheck, "");
    let nextAlphaClear = next.replace(regAlphaCheck, "");
    if (order == "asc") {
      // ascending
      if (currAlphaClear === nextAlphaClear) {
        let currNumber = parseInt(curr.replace(regNumberCheck, ""), 10);
        let nextNumber = parseInt(next.replace(regNumberCheck, ""), 10);
        if (currNumber === nextNumber) {
          willSwitch = false;
        } else {
          if (currNumber > nextNumber) {
            willSwitch = true;
          }
        }
        willSwitch =
          
            ? false
            : 
            ? true
            : false;
      } else {
        willSwitch = currAlphaClear > nextAlphaClear ? true : false;
      }
    } else {
      // descending
      if (currAlphaClear === nextAlphaClear) {
        let currNumber = parseInt(curr.replace(regNumberCheck, ""), 10);
        let nextNumber = parseInt(next.replace(regNumberCheck, ""), 10);
        willSwitch =
          currNumber === nextNumber
            ? false
            : currNumber < nextNumber
            ? true
            : false;
      } else {
        willSwitch = currAlphaClear < nextAlphaClear ? true : false;
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
            shouldSwitch = this.sortByNumber(
              Number(trimX),
              Number(trimY),
              this.direction
            );
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

  $("#spinner-dialog").modal({ backdrop: "static", keyboard: false });
  setTimeout("sortObj.handleSortTable();", 11);
});
