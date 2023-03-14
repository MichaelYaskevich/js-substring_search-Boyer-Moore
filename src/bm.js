let fs = require('fs');
let arg = process.argv;
let k;
let str;
let char;
let subStr;
let strLen;
let subStrLen;
let N;
let i;
let array;
let j;
let rpr;

function read(inFile) {
    try {
        inText = fs.readFileSync(inFile, "utf-8");
        return inText;
    }
    catch (e) {
        return undefined;
    }
}

function MakeTableN(subStr) {
    subStrLen = subStr.length;
    N = new Array();
    for (j = 0; j < subStrLen; j++)
        N[subStr.charAt(j)] = j+1;
    return N;
}

function Check(subStr, k, l, subStrLen) {
    let j = 0; //T*[k..k + l − 1] = T[m − l + 1..m];
    while (k + l - 2 - j >= 0
        && subStr.charAt(k + l - 2 - j) == subStr.charAt(subStrLen - 1 - j)) {
        j++;
    }
    if (k + l - 2 - j < 0 || j >= l)
        return true;
    else
        return false;
}

function MakeTableRpr(subStr) {
    subStrLen = subStr.length;
    rpr = new Array(subStrLen);
    for (let l = 0; l <= subStrLen; l++) {
        k = subStrLen - l;
        while (true) {
            if (Check(subStr, k, l, subStrLen)) {
                if (k > 1 && subStr.charAt(k - 2) != subStr.charAt(subStrLen - l - 1) || k <= 1) {
                    rpr[l] = k;
                    break;
                }
            }
            k--;
        }
    }
    return rpr;
}

function Shift1(subStrLen, N, char, l) {
    if (N[char] == undefined)
        return Math.max(subStrLen - l, 1);
    return Math.max(subStrLen - N[char] - l, 1);
}

function Shift2(subStrLen, rpr, l) {
    return subStrLen - rpr[l] - l + 1;
}

function bm(strFile, substrFile) {
    str = read(strFile);
    if (str == undefined || str == "")
        return undefined;
    subStr = read(substrFile);
    if (subStr == undefined || subStr == "")
        return undefined;
    strLen = str.length;
    subStrLen = subStr.length;
    array = new Array();
    i = 0;
    const start = new Date().getTime();
    N = MakeTableN(subStr);
    rpr = MakeTableRpr(subStr);
    while (i < strLen - subStrLen + 2) {
        j = subStr.length - 1;
        while (str[i + j] == subStr[j]) {
            j--;
            if (j == -1) {
                array[array.length] = i;
                break;
            }
        }
        if (howManyEntriesShow != undefined && array.length == howManyEntriesShow)
            break;
        l = subStr.length - 1 - j;
        char = str.charAt(i + j);
        i += Math.max(Shift1(subStrLen, N, char, l), Shift2(subStrLen, rpr, l));
    }
    const end = new Date().getTime();

    if (time == true) console.log(`WorkTime: ${end - start}ms`);

    return array;
}

let flagsCount = 0;
let howManyEntriesShow;
let time = false;
function CheckFlags() {
    if (arg[2 + flagsCount] == "-n") {
        howManyEntriesShow = arg[2 + flagsCount + 1];
        flagsCount++;
        flagsCount++;
        CheckFlags();
    }
    else if (arg[2 + flagsCount] == "-t") {
        flagsCount++;
        time = true;
        CheckFlags();
    }
}
CheckFlags();

if (howManyEntriesShow == undefined || howManyEntriesShow > 0) {
    array = bm(arg[2 + flagsCount], arg[3 + flagsCount]);

    if (array == undefined) console.log("One of the files is empty or not exit");
    else {
        console.log("------Entries-----");
        if (howManyEntriesShow == undefined || howManyEntriesShow > array.length)
            howManyEntriesShow = array.length;
        for (let i = 0; i < howManyEntriesShow; i++) {
            console.log(`|            ${array[i]}           |`);
        }
        console.log("--------------------------");
    }
}
else {
    console.log("You told that you want to see 0 or less first entries,\
        so the algorithm didn't start")
}