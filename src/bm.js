let fs = require('fs');
let arg = process.argv;
let result;


function read(input_file) {
    try {
        return fs.readFileSync(input_file, "utf-8");
    }
    catch (e) {
        return undefined;
    }
}

function makeRightmostOccurancesTable(substr) {
    // Таблица крайних правых входений символов в подстроку makeRightmostOccurancesTable
    let substrLen = substr.length;
    let table = new Array();
    for (let j = 0; j < substrLen; j++)
        table[substr.charAt(j)] = j+1;
    return table;
}

function check(substr, k, match_len, substr_len) {
    // Проверяет условие T*[k..k + l − 1] = T[m − l + 1..m], где T* = AT, где A - последовательность любых символов (*) длины |T|.
    // И условие T[k-1] != T[m-l] при k > 1.
    let j = 0;
    let right = k + match_len - 2
    while (right - j >= 0
        && substr.charAt(right - j) == substr.charAt(substr_len - 1 - j)) {
        j++;
    }
    if ((right - j < 0 || j >= match_len) // Если right - j < 0, то далее один из участников сравнения будет *, что приведет к равенству.
        && (k > 1 && substr.charAt(k - 2) != substr.charAt(substr_len - match_len - 1) || k <= 1))
        return true;
    else
        return false;
}

function makeRprTable(substr) {
    // Создает rightmost plausible reoccurrence (rpr) таблицу.
    let substr_len = substr.length;
    let rpr = new Array(substr_len);
    for (let match_len = 0; match_len <= substr_len; match_len++) {
        let k = substr_len - match_len;
        while (true) {
            if (check(substr, k, match_len, substr_len)) {
                rpr[match_len] = k;
                break;
            }
            k--;
        }
    }
    return rpr;
}

function getShift1(substr_len, ro_table, char, match_len) {
    return ro_table[char] == undefined
        ? Math.max(substr_len - match_len, 1)
        : Math.max(substr_len - ro_table[char] - match_len, 1);
}

function getShift2(substr_len, rpr, match_len) {
    return substr_len - rpr[match_len] - match_len + 1;
}

function boyerMooreAlgo(str, substr) {
    // Ищет подстроку в строке алгоритмом Бойера Мура.
    let str_len = str.length;
    let substr_len = substr.length;
    let result = new Array();
    let i = 0;
    
    const start = new Date().getTime();
    let ro_table = makeRightmostOccurancesTable(substr);
    let rpr_table = makeRprTable(substr);
    while (i < str_len - substr_len + 2) {
        let j = substr.length - 1;
        while (str[i + j] == substr[j]) {
            j--;
            if (j == -1) {
                result[result.length] = i;
                break;
            }
        }
        if (count_of_entries != undefined && result.length == count_of_entries)
            break;
        let match_len = substr.length - 1 - j;
        let char = str.charAt(i + j);
        i += Math.max(
            getShift1(substr_len, ro_table, char, match_len), 
            getShift2(substr_len, rpr_table, match_len));
    }
    const end = new Date().getTime();

    if (time == true) console.log(`WorkTime: ${end - start}ms`);

    return result;
}

let flags_count = 0;
let count_of_entries;
let time = false;
function checkFlags() {
    if (arg[2 + flags_count] == "-n") {
        count_of_entries = arg[2 + flags_count + 1];
        flags_count++;
        flags_count++;
        checkFlags();
    }
    else if (arg[2 + flags_count] == "-t") {
        flags_count++;
        time = true;
        checkFlags();
    }
}
checkFlags();

if (count_of_entries == undefined || count_of_entries > 0) {
    let str = read(arg[2 + flags_count]);
    let substr = read(arg[3 + flags_count]);
    if (str == undefined || str == "" || substr == undefined || substr == "")
        result = undefined;
    else
        result = boyerMooreAlgo(str, substr);

    if (result == undefined) console.log("One of the files is empty or not exit");
    else {
        console.log("------Entries-----");
        if (count_of_entries == undefined || count_of_entries > result.length)
            count_of_entries = result.length;
        for (let i = 0; i < count_of_entries; i++) {
            console.log(`|            ${result[i]}           |`);
        }
        console.log("--------------------------");
    }
}
else {
    console.log("You told that you want to see 0 or less first entries,\
        so the algorithm didn't start")
}