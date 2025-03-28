const { ipcRenderer } = require("electron");
fs = require('fs');
const { parentPort } = require("process");

var files = [];
var datas =[]; 

document.getElementById("loadFile").addEventListener("click", async () => {
  var filePath = await ipcRenderer.invoke("select-file");
  if (filePath) {
    loadRecursive(filePath)
    tableHTML = generateTable();

    document.getElementById("tableview").innerHTML = tableHTML;
  }
});

function loadRecursive(filePath) {
  console.log(filePath)
  const jsonDataArray = JSON.parse(fs.readFileSync(filePath));
  if (jsonDataArray) {
    files.unshift(filePath)
    datas.unshift(jsonDataArray)
    
    if (jsonDataArray.inherits){
      const parentFilePath = getParentFilePath(filePath, jsonDataArray.inherits + ".json");
      loadRecursive(parentFilePath);
    }
  }
}

function getParentFilePath(currentFilePath, parentFileName) {
  const path = require("path");
  const dir = path.dirname(currentFilePath);
  return path.join(dir, parentFileName);
}

function generateTable() {
  let tableHTML = '<table border="1"><thead><tr>';
  let headers = new Set();

  datas.forEach(item => {
      Object.keys(item).forEach(key => headers.add(key));
  });

  headers.forEach(header => {
      tableHTML += `<th>${header}</th>`;
  });
  tableHTML += '</tr></thead><tbody>';

  datas.forEach(item => {
      tableHTML += '<tr>';
      headers.forEach(header => {
          let value = item[header] ? JSON.stringify(item[header]) : '';
          tableHTML += `<td>${value}</td>`;
      });
      tableHTML += '</tr>';
  });

  tableHTML += '</tbody></table>';
  return tableHTML;
}