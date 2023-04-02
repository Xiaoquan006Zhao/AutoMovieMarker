import { createAddDeleteOpenButton } from "./movieOverlay";
import { emotions } from "./markersPage";

const tableFilterRow = document.querySelector("#filters");

export function resetFilter() {
  while (tableFilterRow.firstChild) {
    tableFilterRow.removeChild(tableFilterRow.firstChild);
  }

  addFilter();
  applyFilters();
}

// helper method for applyFilters
function hideColumns(table, columnsNotToHide) {
  var columnCount = table.rows[0].cells.length;

  for (var i = 1; i < columnCount; i++) {
    var cell = table.rows[0].cells[i];
    var columnIndex = i;

    if (
      columnsNotToHide.length !== 0 &&
      columnsNotToHide.indexOf(columnIndex) === -1
    ) {
      cell.style.display = "none";
      for (var j = 0; j < table.rows.length; j++) {
        table.rows[j].cells[i].style.display = "none";
      }
    } else {
      cell.style.display = "";
      for (var j = 0; j < table.rows.length; j++) {
        table.rows[j].cells[i].style.display = "";
      }
    }
  }
}

// helper method for applyFilters
function hideRows(table, rowsToHide) {
  // Loop through each row in the table body
  const rows = table.getElementsByTagName("tr");
  for (let i = 1; i < rows.length; i++) {
    // Check if the row index should be hidden
    if (rowsToHide.includes(i)) {
      // Hide the row by setting its display property to "none"
      rows[i].style.display = "none";
    } else {
      // Show the row by resetting its display property
      rows[i].style.display = "";
    }
  }
}

// helper method for applyFilters
function getFilterValues() {
  var filters = document.querySelectorAll("#filters .table-filter");
  var filterValues = [];

  for (let i = 0; i < filters.length; i++) {
    if (!filters[i].disabled) {
      var filter = filters[i];
      var selectElems = filter.querySelectorAll("select");
      var inputElem = filter.querySelector("input");
      var filterObj = {};

      filterObj.type = selectElems[0].value;
      filterObj.logic = selectElems[1].value;
      filterObj.input = inputElem.value;

      filterValues.push(filterObj);
    }
  }

  return filterValues;
}

export function applyFilters() {
  const mainTable = document.querySelector("tbody").parentElement;

  const filterValues = getFilterValues().filter(
    (filter) => filter.input !== ""
  );

  // Hide columns
  const columnsNotToHide = [];
  filterValues.forEach((filter) => {
    if (filter.type === "Movie") {
      console.log("movie");
    }

    if (filter.type === "Emotion") {
      const filterEmotions = emotions.filter((emotion) =>
        filter.logic === "contains"
          ? emotion.toLowerCase().includes(filter.input.toLowerCase())
          : emotion.toLowerCase() === filter.input.toLowerCase()
      );

      filterEmotions.forEach((emotion) => {
        const index = emotions.indexOf(emotion);
        if (!columnsNotToHide.includes(index)) {
          columnsNotToHide.push(index);
        }
      });
    }
  });

  // Hide rows only if the columns are being filtered
  // but hiderows need to be outside to restore the default display mode
  const rowsToHide = [];

  if (columnsNotToHide.length !== 0) {
    const rows = document.querySelector("tbody").querySelectorAll("tr");
    for (let i = 0; i < rows.length; i++) {
      let hideRow = true;
      for (let j = 0; j < columnsNotToHide.length; j++) {
        if (rows[i].cells[columnsNotToHide[j]].textContent.trim() !== "") {
          hideRow = false;
          break;
        }
      }
      if (hideRow) {
        // rows are selected from tbody, thus an extra emotions role need to be offset
        rowsToHide.push(i + 1);
      }
    }
  }

  if (filterValues.length !== 0 && columnsNotToHide.length === 0) {
    document.querySelector("#filter-warning").classList.remove("hidden");
  } else {
    document.querySelector("#filter-warning").classList.add("hidden");
  }

  hideRows(mainTable, rowsToHide);
  hideColumns(mainTable, columnsNotToHide);
}

function deleteFilter(e) {
  const thFilter = e.target.closest(".table-filter");
  const parent = thFilter.parentElement;
  parent.removeChild(thFilter);

  if (!parent.firstChild) {
    addFilter();
  }
  applyFilters();
}

function disableFilter(e) {
  const thFilter = e.target.closest(".table-filter");

  const disabled = thFilter.disabled;
  thFilter.disabled = !disabled;

  const buttons = thFilter.querySelectorAll("select");
  buttons.forEach((button) => {
    button.disabled = !disabled;
  });

  const input = thFilter.querySelector("input");
  input.disabled = !disabled;
  applyFilters();
}

export function addFilter() {
  const thFilter = document.createElement("th");
  thFilter.classList.add("table-filter");

  const divSelect = document.createElement("div");
  divSelect.classList.add("select-filter");

  const typeInput = document.createElement("select");

  const optionEmotion = document.createElement("option");
  optionEmotion.value = "Emotion";
  optionEmotion.text = "Emotion";
  typeInput.appendChild(optionEmotion);

  const optionMovie = document.createElement("option");
  optionMovie.value = "Movie";
  optionMovie.text = "Movie";
  typeInput.appendChild(optionMovie);

  const logicInput = document.createElement("select");

  const optionContains = document.createElement("option");
  optionContains.value = "contains";
  optionContains.text = "Contains";
  logicInput.appendChild(optionContains);

  const optionIs = document.createElement("option");
  optionIs.value = "is";
  optionIs.text = "Is";
  logicInput.appendChild(optionIs);

  const valueInput = document.createElement("input");
  valueInput.setAttribute("type", "text");

  typeInput.addEventListener("change", applyFilters);
  logicInput.addEventListener("change", applyFilters);
  valueInput.addEventListener("input", applyFilters);

  divSelect.append(typeInput, logicInput);
  thFilter.append(divSelect, valueInput);

  const buttonSetup = [];
  buttonSetup.push({
    content: "+",
    callback: addFilter,
  });
  buttonSetup.push({
    content: "x",
    callback: deleteFilter,
  });
  buttonSetup.push({
    content: "-",
    callback: disableFilter,
  });

  thFilter.addEventListener("mouseenter", (e) => {
    createAddDeleteOpenButton(thFilter, buttonSetup);
  });

  thFilter.addEventListener("mouseout", (e) => {
    const parent = e.currentTarget;
    const relatedTarget = e.relatedTarget;

    // Check if the relatedTarget is a child of BodyTr
    if (!parent.contains(relatedTarget)) {
      parent.removeChild(parent.lastChild);
    }
  });

  thFilter.disabled = false;
  tableFilterRow.appendChild(thFilter);
  valueInput.focus();
}
