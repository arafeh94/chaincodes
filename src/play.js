"use strict";

function score() {
    const spawn = require('child_process').spawn;
    const spawnSync = require('child_process').spawnSync;
    let jsonData = JSON.stringify([[1, 1, 1], [1, 1, 1]]);
    console.log("scoring data:", jsonData);
    const child = spawnSync('python3', ['/scripts/quality.py', jsonData]);
    const out = child.stdout.toString();
    console.log("python results:", out);
    try {
        return JSON.parse(out);
    } catch (e) {
        console.log("error while scoring", e);
        return [];
    }
}


score();