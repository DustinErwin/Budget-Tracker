/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var transactions = [];\nvar myChart;\nwindow.addEventListener(\"online\", function () {\n  var dbOpenRequest = window.indexedDB.open(\"budget\", 1);\n\n  dbOpenRequest.onsuccess = function () {\n    var db = dbOpenRequest.result;\n    var tx = db.transaction([\"budget\"]);\n    var objectStore = tx.objectStore(\"budget\");\n    var request = objectStore.getAll();\n\n    request.onerror = function (event) {\n      console.log(\"Unable to retrieve from IDB\", event);\n    };\n\n    request.onsuccess = function (event) {\n      console.log(request.result);\n      fetch(\"/api/transaction/bulk\", {\n        method: \"POST\",\n        body: JSON.stringify(request.result),\n        headers: {\n          Accept: \"application/json, text/plain, */*\",\n          \"Content-Type\": \"application/json\"\n        }\n      });\n      var requestDelete = db.transaction([\"budget\"], \"readwrite\").objectStore(\"budget\").clear();\n\n      requestDelete.onsuccess = function (event) {\n        console.log(\"Database removed!\");\n      };\n\n      console.log(\"Sent to MDB\", event);\n    };\n  };\n});\n\nfunction serviceWorker() {\n  if (\"serviceWorker\" in navigator) {\n    navigator.serviceWorker.register(\"./service-worker.js\", {\n      scope: \"/\"\n    }).then(function () {\n      return console.log(\"Service Worker registered successfully.\");\n    })[\"catch\"](function (error) {\n      return console.log(\"Service Worker registration failed:\", error);\n    });\n  }\n}\n\nserviceWorker();\nfetch(\"/api/transaction\").then(function (response) {\n  return response.json();\n}).then(function (data) {\n  // save db data on global variable\n  transactions = data;\n  populateTotal();\n  populateTable();\n  populateChart();\n});\n\nfunction populateTotal() {\n  // reduce transaction amounts to a single total value\n  var total = transactions.reduce(function (total, t) {\n    return total + parseInt(t.value);\n  }, 0);\n  var totalEl = document.querySelector(\"#total\");\n  totalEl.textContent = total;\n}\n\nfunction populateTable() {\n  var tbody = document.querySelector(\"#tbody\");\n  tbody.innerHTML = \"\";\n  transactions.forEach(function (transaction) {\n    // create and populate a table row\n    var tr = document.createElement(\"tr\");\n    tr.innerHTML = \"\\n      <td>\".concat(transaction.name, \"</td>\\n      <td>\").concat(transaction.value, \"</td>\\n    \");\n    tbody.appendChild(tr);\n  });\n}\n\nfunction populateChart() {\n  // copy array and reverse it\n  var reversed = transactions.slice().reverse();\n  var sum = 0; // create date labels for chart\n\n  var labels = reversed.map(function (t) {\n    var date = new Date(t.date);\n    return \"\".concat(date.getMonth() + 1, \"/\").concat(date.getDate(), \"/\").concat(date.getFullYear());\n  }); // create incremental values for chart\n\n  var data = reversed.map(function (t) {\n    sum += parseInt(t.value);\n    return sum;\n  }); // remove old chart if it exists\n\n  if (myChart) {\n    myChart.destroy();\n  }\n\n  var ctx = document.getElementById(\"myChart\").getContext(\"2d\");\n  myChart = new Chart(ctx, {\n    type: \"line\",\n    data: {\n      labels: labels,\n      datasets: [{\n        label: \"Total Over Time\",\n        fill: true,\n        backgroundColor: \"#6666ff\",\n        data: data\n      }]\n    }\n  });\n}\n\nfunction sendTransaction(isAdding) {\n  var nameEl = document.querySelector(\"#t-name\");\n  var amountEl = document.querySelector(\"#t-amount\");\n  var errorEl = document.querySelector(\".form .error\"); // validate form\n\n  if (nameEl.value === \"\" || amountEl.value === \"\") {\n    errorEl.textContent = \"Missing Information\";\n    return;\n  } else {\n    errorEl.textContent = \"\";\n  } // create record\n\n\n  var transaction = {\n    name: nameEl.value,\n    value: amountEl.value,\n    date: new Date().toISOString()\n  }; // if subtracting funds, convert amount to negative number\n\n  if (!isAdding) {\n    transaction.value *= -1;\n  } // add to beginning of current array of data\n\n\n  transactions.unshift(transaction); // re-run logic to populate ui with new record\n\n  populateChart();\n  populateTable();\n  populateTotal(); // also send to server\n\n  fetch(\"/api/transaction\", {\n    method: \"POST\",\n    body: JSON.stringify(transaction),\n    headers: {\n      Accept: \"application/json, text/plain, */*\",\n      \"Content-Type\": \"application/json\"\n    }\n  }).then(function (response) {\n    return response.json();\n  }).then(function (data) {\n    if (data.errors) {\n      errorEl.textContent = \"Missing Information\";\n    } else {\n      // clear form\n      nameEl.value = \"\";\n      amountEl.value = \"\";\n    }\n  })[\"catch\"](function (err) {\n    // fetch failed, so save in indexed db\n    saveRecord(transaction); // clear form\n\n    nameEl.value = \"\";\n    amountEl.value = \"\";\n  });\n}\n\ndocument.querySelector(\"#add-btn\").onclick = function () {\n  sendTransaction(true);\n};\n\ndocument.querySelector(\"#sub-btn\").onclick = function () {\n  sendTransaction(false);\n};\n\nfunction saveRecord(transaction) {\n  var open = window.indexedDB.open(\"budget\", 1);\n\n  open.onupgradeneeded = function (event) {\n    var db = event.target.result;\n\n    db.onerror = function (event) {\n      console.log(\"Error loading database\", event);\n    };\n\n    var objectStore = db.createObjectStore(\"budget\", {\n      keyPath: \"name\"\n    });\n    objectStore.createIndex(\"name\", \"name\", {\n      unique: false\n    });\n    objectStore.createIndex(\"value\", \"value\", {\n      unique: false\n    });\n    console.log(\"Objectstore created\");\n  };\n\n  open.onsuccess = function (event) {\n    var db = event.target.result;\n    var tx = db.transaction([\"budget\"], \"readwrite\");\n    tx.objectStore(\"budget\").add({\n      name: transaction.name,\n      value: transaction.value\n    });\n  };\n}\n\n//# sourceURL=webpack:///./index.js?");

/***/ })

/******/ });