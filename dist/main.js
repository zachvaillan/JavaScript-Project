/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./map */ \"./src/map.js\");\n/* harmony import */ var _players__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./players */ \"./src/players.js\");\n\r\n\r\n\r\nclass Game {\r\n\r\n    constructor(map = new _map__WEBPACK_IMPORTED_MODULE_0__.default(), players = new _players__WEBPACK_IMPORTED_MODULE_1__.default()){\r\n        this.mapGrid = map;\r\n        this.gameWindowElement = document.getElementById('game-window');\r\n\r\n        this.players = players;\r\n        this.turn = 0;\r\n        this.currentPlayer = this.players.array[this.turn]; \r\n        this.currentAttackable = null;\r\n\r\n        this.claimTerritoryPhase = true; // for beginning of game, once off does not come back\r\n        this.initialPlacementPhase = false; // for beginning of game, once turned on then off does not come back\r\n        this.armyPlacementPhase = false;\r\n        this.battlePhase = false;\r\n        this.territorySelected = false;\r\n        this.fortifyPhase = false;\r\n\r\n        this.createMap();\r\n    }\r\n\r\n    createMap(){\r\n        this.gameWindowElement.appendChild(this.mapGrid.mapElement);\r\n    }\r\n\r\n    // Add event listener to every div\r\n\r\n    assignEventListeners(){\r\n        Object.keys(this.mapGrid.hashOfTiles).forEach(pointer => {\r\n            let tile = this.mapGrid.hashOfTiles[pointer];\r\n            tile.tileElement.addEventListener(\"click\", () => this.clickableAction(tile))\r\n        })\r\n    }\r\n\r\n    // Evaluate the current state to see what a click on the div is responsible for doing\r\n\r\n    clickableAction(tile){\r\n        if(this.claimTerritoryPhase === true){\r\n            this.handleClaimTerritory(tile);\r\n        } else if(this.initialPlacementPhase === true){\r\n            this.placeTroopsOnClick(tile);\r\n        } else if(this.battlePhase === true){\r\n            if (tile.owner === this.currentPlayer && this.territorySelected === false){\r\n                this.getAttackableTerritories(tile);\r\n                console.log(this.currentAttackable)\r\n            } else if(this.territorySelected === true && this.currentAttackable.includes(tile)){\r\n                console.log(\"second click!\")\r\n            } \r\n        } \r\n    }\r\n\r\n    makeOwnedTerritoriesClickable(){\r\n        this.currentPlayer.territories.forEach(territory => {\r\n            territory.tileElement.classList.add(\"clickable\");\r\n        })\r\n    }\r\n\r\n    // claim a territory in claim territory phase, then check to see if all \r\n    // territories are claimed\r\n\r\n\r\n    handleClaimTerritory(tile){\r\n        if (!tile.status){\r\n            tile.claimTile(this.currentPlayer.team);\r\n            tile.receiveOwner(this.currentPlayer);\r\n\r\n\r\n            this.currentPlayer.addTerritory(tile);\r\n\r\n            tile.status = true;\r\n            tile.claimable();\r\n            \r\n            this.allTerritoriesClaimed();\r\n            \r\n            this.nextPlayer();\r\n        }   \r\n    }\r\n\r\n    // check to see if claim territory phase is over, then update the current phase\r\n    // Also set\r\n\r\n    allTerritoriesClaimed(){\r\n        let claimedCount = 0;\r\n        Object.keys(this.mapGrid.hashOfTiles).forEach( pointer => {\r\n            let tile = this.mapGrid.hashOfTiles[pointer];\r\n            if (tile.status === true){\r\n                claimedCount += 1;\r\n            }\r\n        })\r\n        if (claimedCount === this.mapGrid.size){\r\n            this.claimTerritoryPhase = false; // this will NOT be REACTIVATED\r\n            this.initialPlacementPhase = true; \r\n            this.addEndTurnButton();\r\n        } \r\n    }\r\n\r\n    placeTroopsOnClick(tile){\r\n        if (this.currentPlayer === tile.owner && this.currentPlayer.availabeUnits > 0){\r\n            this.currentPlayer.placeUnit();\r\n            tile.receiveUnits();\r\n        }\r\n    }\r\n\r\n    initialPlacementOverCheck(){\r\n        let countCheck = 0;\r\n        this.players.array.forEach(player => {\r\n            if (player.availabeUnits === 0){\r\n                countCheck += 1;\r\n            }\r\n        })\r\n        console.log(countCheck)\r\n        if (countCheck === this.players.array.length){\r\n            this.initialPlacementPhase = false; // this will NOT be REACTIVATED\r\n            this.battlePhase = true;\r\n            this.addEndAttackButton();\r\n        }\r\n    }\r\n\r\n    getAttackableTerritories(tile){\r\n        this.currentAttackable = this.mapGrid.getAdjacentEnemies(tile, this.currentPlayer);\r\n        tile.tileElement.classList.add(\"selected\");\r\n        this.territorySelected = true;\r\n    }\r\n\r\n    // switch player, and reset this.currentPlayer \r\n\r\n    nextPlayer(){\r\n        if (this.turn === 3){\r\n            this.turn = 0;\r\n        }\r\n        else {\r\n            this.turn += 1;\r\n        }\r\n\r\n        if(this.initialPlacementPhase === true){\r\n            this.initialPlacementOverCheck();\r\n        }\r\n\r\n        this.currentPlayer = this.players.array[this.turn];\r\n        console.log(this.currentPlayer.team);\r\n    }\r\n\r\n    endAttack(){\r\n        this.battlePhase = false;\r\n        this.fortifyPhase = true;\r\n    }\r\n\r\n    addEndTurnButton(){\r\n        let endTurnButton = document.createElement(\"button\");\r\n        endTurnButton.innerHTML = \"End Turn\";\r\n        endTurnButton.onclick = () => this.nextPlayer();\r\n        endTurnButton.classList.add(\"end-turn-btn\");\r\n        this.gameWindowElement.appendChild(endTurnButton);\r\n    }\r\n\r\n    addEndAttackButton(){\r\n        let endTurnButton = document.createElement(\"button\");\r\n        endTurnButton.innerHTML = \"End Attack\";\r\n        endTurnButton.onclick = () => this.endAttack();\r\n        endTurnButton.classList.add(\"end-attack-btn\");\r\n        this.gameWindowElement.appendChild(endTurnButton);\r\n    }\r\n\r\n  \r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Game);\n\n//# sourceURL=webpack:///./src/game.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ \"./src/game.js\");\n\r\n\r\ndocument.addEventListener(\"DOMContentLoaded\", () => {  \r\n\r\n    let game = new _game__WEBPACK_IMPORTED_MODULE_0__.default();\r\n    game.assignEventListeners();\r\n    \r\n});\r\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/map.js":
/*!********************!*\
  !*** ./src/map.js ***!
  \********************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _tile_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./tile.js */ \"./src/tile.js\");\n\r\n\r\nclass Map {\r\n    \r\n    constructor(){\r\n        this.mapElement = document.createElement('div');\r\n        this.mapElement.classList.add('map');\r\n        this.hashOfTiles = {};\r\n        this.keyMaker = 0;\r\n\r\n        for (let row = 0; row < 2; row++){\r\n            for (let col = 0; col < 2; col++){\r\n                let pos = [row, col];\r\n                let newTile = new _tile_js__WEBPACK_IMPORTED_MODULE_0__.default(pos);\r\n                this.hashOfTiles[this.keyMaker] = newTile;\r\n                this.keyMaker += 1;\r\n                this.mapElement.appendChild(newTile.tileElement);\r\n            }\r\n        }\r\n\r\n        console.log(this.hashOfTiles);\r\n        this.size = Object.keys(this.hashOfTiles).length;\r\n    }\r\n\r\n    getAdjacentEnemies(tile, currentPlayer){\r\n        let adjacent = tile.grabAdjacentTiles();\r\n        let enemies = [];\r\n\r\n        Object.keys(this.hashOfTiles).forEach(pointer => {\r\n            let compareTile = this.hashOfTiles[pointer];\r\n            if(compareTile.color !== currentPlayer.team) {\r\n                adjacent.forEach(adj => {\r\n                    if(adj[0] === compareTile.pos[0] && adj[1] === compareTile.pos[1]){\r\n                        enemies.push(compareTile);\r\n                    }\r\n                })\r\n            }\r\n        })\r\n        return enemies;\r\n    }\r\n\r\n    getAdjacentFriendly(tile, currentPlayer){\r\n        let adjacent = tile.grabAdjacentTiles();\r\n        let friendlies = [];\r\n\r\n        Object.keys(this.hashOfTiles).forEach(pointer => {\r\n            let compareTile = this.hashOfTiles[pointer];\r\n            if(compareTile.color === currentPlayer.team) {\r\n                adjacent.forEach(adj => {\r\n                    if(adj[0] === compareTile.pos[0] && adj[1] === compareTile.pos[1]){\r\n                        friendlies.push(compareTile);\r\n                    }\r\n                })\r\n            }\r\n        })\r\n        return friendlies;\r\n    }\r\n\r\n    \r\n\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Map);\n\n//# sourceURL=webpack:///./src/map.js?");

/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\nclass Player {\r\n\r\n    constructor(team){\r\n        this.territories = [];\r\n        this.territoryPositions = [];\r\n\r\n        this.team = team;\r\n        this.availabeUnits = 9;\r\n        this.allUnits = 0;\r\n\r\n        this.unitsSelected = 0;\r\n    }\r\n\r\n    addTerritory(tile){\r\n        this.territories.push(tile);\r\n        this.territoryPositions.push(tile.pos);\r\n    }\r\n\r\n    placeUnit(){\r\n        this.availabeUnits -= 1;\r\n    }\r\n\r\n    grabUnits(){\r\n        this.unitsSelected += 1;\r\n    }\r\n\r\n   \r\n\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);\n\n//# sourceURL=webpack:///./src/player.js?");

/***/ }),

/***/ "./src/players.js":
/*!************************!*\
  !*** ./src/players.js ***!
  \************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\n/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ \"./src/player.js\");\n\r\n\r\nconst TEAMS = [\r\n    \"red\",\r\n    \"green\",\r\n    \"blue\",\r\n    \"yellow\",\r\n]\r\n\r\nclass Players {\r\n\r\n    constructor(){\r\n        this.array = [];\r\n\r\n        for (let i = 0; i < 4; i++){\r\n            this.array.push(new _player__WEBPACK_IMPORTED_MODULE_0__.default(TEAMS[i]));\r\n        }\r\n    }\r\n\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Players);\n\n//# sourceURL=webpack:///./src/players.js?");

/***/ }),

/***/ "./src/tile.js":
/*!*********************!*\
  !*** ./src/tile.js ***!
  \*********************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_exports__, __webpack_require__.r, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => __WEBPACK_DEFAULT_EXPORT__\n/* harmony export */ });\nclass Tile {\r\n\r\n    constructor(pos){\r\n        this.pos = pos;\r\n        this.status = false;\r\n\r\n        this.owner = null;\r\n        this.units = 0;\r\n        this.color = null;\r\n\r\n        this.tileElement = document.createElement('div');\r\n        this.tileElement.classList.add('tile');\r\n\r\n        this.unitsElement = document.createElement('div');\r\n        this.unitsElement.classList.add('units')\r\n        this.tileElement.appendChild(this.unitsElement);\r\n\r\n        this.moveableTiles = [];\r\n\r\n        this.claimable();\r\n    }\r\n\r\n    claimTile(team){\r\n        this.tileElement.classList.add(team);\r\n    }\r\n\r\n    claimable(){\r\n        if (!this.status) {\r\n            this.tileElement.classList.add('clickable')\r\n        } else {\r\n            this.tileElement.classList.remove('clickable');\r\n        }\r\n    }\r\n\r\n    receiveOwner(player){\r\n        this.owner = player;\r\n        this.color = player.team;\r\n    }\r\n\r\n    receiveUnits(count = 1){\r\n        this.units += count;\r\n        this.unitsElement.innerHTML = this.units;\r\n    }\r\n\r\n    removeUnits(count = 1){\r\n        this.units -= count;\r\n        this.unitsElement.innerHTML = this.units;\r\n    }\r\n\r\n    isValidPos(pos){\r\n        if ((pos[0] >= 0 && pos[0] < 4) && (pos[1] >= 0 && pos[1] < 4)){\r\n            return true;\r\n        } else {\r\n            return false;\r\n        }\r\n    }\r\n\r\n    grabAdjacentTiles(){\r\n        let possibles = [];\r\n        let validMoves = [];\r\n\r\n        let right = ([this.pos[0] + 1, this.pos[1]]);\r\n        let left = ([this.pos[0] - 1, this.pos[1]]);\r\n        let up = ([this.pos[0], this.pos[1] + 1]);\r\n        let down = ([this.pos[0], this.pos[1] - 1]);\r\n        possibles.push(right, left, up, down, this.pos);\r\n\r\n        possibles.forEach(possibility => {\r\n            if(this.isValidPos(possibility)){\r\n                validMoves.push(possibility);\r\n            }\r\n        })\r\n        this.moveableTiles = validMoves;\r\n        return this.moveableTiles;\r\n    }\r\n\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Tile);\n\n//# sourceURL=webpack:///./src/tile.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/index.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;