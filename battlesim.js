// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});


var TOTAL_STATS = 100;

// var HP_MIN  = 17;
// var ATK_MIN = 18;
// var DEF_MIN = 17;
// var SPD_MIN = 17;
var HP_MIN  = 19;
var ATK_MIN = 19;
var DEF_MIN = 19;
var SPD_MIN = 20;

var arr1 = [];
var arr3 = [];

calculateBestStats();
calculateBestStats3(28,24,27,21);

console.log('arr1:', arr1.length);
console.log('arr3:', arr3.length);
for (var i = 0; i < arr1.length; i++) {
    var hasMatch = false;
    for (var j = 0; j < arr3.length; j++) {
        if (arr1[i].equals(arr3[j])) {
            hasMatch = true;
            break;
        }
    }
    if (!hasMatch) {
        console.log('in arr1, but not arr3:', arr1[i]);
    }
}
for (var i = 0; i < arr3.length; i++) {
    var hasMatch = false;
    for (var j = 0; j < arr1.length; j++) {
        if (arr3[i].equals(arr1[j])) {
            hasMatch = true;
            break;
        }
    }
    if (!hasMatch) {
        console.log('in arr3, but not arr1:', arr3[i]);
    }
}









function calculateBestStats() {
    var hp, atk, def, spd;
    var hp2, atk2, def2, spd2;
    var hp3, atk3, def3, spd3;
    var bestScore = 0;
    var numWins = 0;
    var numTies = 0;

    var count = 0;
    var count2 = 0;
    var t1 = performance.now();
    for(hp = HP_MIN; hp <= TOTAL_STATS-ATK_MIN-DEF_MIN-SPD_MIN; hp++) {
      for(atk = ATK_MIN; atk < TOTAL_STATS-hp-DEF_MIN-SPD_MIN; atk++) {
        for(def = DEF_MIN; def < TOTAL_STATS-hp-atk-SPD_MIN; def++) {
            spd = TOTAL_STATS-hp-atk-def;
            count++;
            // console.log([hp, atk, def, spd]);
            count2 = 0;
            var score = 0;
            var wins = 0;
            var ties = 0;
            for(hp2 = HP_MIN; hp2 < TOTAL_STATS-ATK_MIN-DEF_MIN-SPD_MIN; hp2++) {
              for(atk2 = ATK_MIN; atk2 < TOTAL_STATS-hp2-DEF_MIN-SPD_MIN; atk2++) {
                for(def2 = DEF_MIN; def2 < TOTAL_STATS-hp2-atk2-SPD_MIN; def2++) {
                    spd2 = TOTAL_STATS-hp2-atk2-def2;
                    count2++;
                    var results = battleSim(hp, atk, def, spd, hp2, atk2, def2, spd2);
                    score += results;
                    if (results > 0) {
                      wins++;
                    } else if (results === 0) {
                      ties++;
                    }
                }
              }
            }
            if (wins > numWins) {
            //   console.log(wins + ':\t' + hp + ', ' + atk + ', ' + def + ', ' + spd);
              bestScore = score;
              hp3 = hp;
              atk3 = atk;
              def3 = def;
              spd3 = spd;
              numWins = wins;
              numTies = ties;
          }
        //   else if (wins === numWins) console.log(wins, [hp, atk, def, spd]);

        }
      }
    }
    var t2 = performance.now();

    console.log('count: ' + count);
    console.log('count2: ' + count2);
    console.log('best score: ' + bestScore);
    console.log(numWins + ' wins, ' + numTies + ' ties, ' + (count-numWins-numTies) + ' losses');
    console.log(Math.round((numWins/count)*10000)/100 + '% win percentage');
    console.log('hp:  ' + hp3);
    console.log('atk: ' + atk3);
    console.log('def: ' + def3);
    console.log('spd: ' + spd3);
    console.log('time elapsed: ' + (t2-t1));
}
function calculateBestStats2() {
    var hp, atk, def, spd;
    var hp2, atk2, def2, spd2;
    var hp3, atk3, def3, spd3;
    var bestScore = 0;
    var numWins = 0;
    var numTies = 0;

    var count = 0;
    var count2 = 0;
    var t1 = performance.now();
    for(hp = HP_MIN; hp <= TOTAL_STATS-ATK_MIN-DEF_MIN-SPD_MIN; hp++) {
      for(atk = ATK_MIN; atk < TOTAL_STATS-hp-DEF_MIN-SPD_MIN; atk++) {
        for(def = DEF_MIN; def < TOTAL_STATS-hp-atk-SPD_MIN; def++) {
            spd = TOTAL_STATS-hp-atk-def;
            count++;
            // console.log([hp, atk, def, spd]);
            count2 = 0;
            var score = 0;
            var wins = 0;
            var ties = 0;
            for(hp2 = HP_MIN; hp2 < TOTAL_STATS-ATK_MIN-DEF_MIN-SPD_MIN; hp2++) {
              for(atk2 = ATK_MIN; atk2 < TOTAL_STATS-hp2-DEF_MIN-SPD_MIN; atk2++) {
                for(def2 = DEF_MIN; def2 < TOTAL_STATS-hp2-atk2-SPD_MIN; def2++) {
                    spd2 = TOTAL_STATS-hp2-atk2-def2;
                    count2++;
                    var results = battleSim2(hp, atk, def, spd, hp2, atk2, def2, spd2);
                    score += results;
                    if (results > 0) {
                      wins++;
                    } else if (results === 0) {
                      ties++;
                    }
                }
              }
            }
            if (wins > numWins) {
                // console.log(wins + ':\t' + hp + ', ' + atk + ', ' + def + ', ' + spd);              bestScore = score;
              bestScore = score;
              hp3 = hp;
              atk3 = atk;
              def3 = def;
              spd3 = spd;
              numWins = wins;
              numTies = ties;
            }
            // else if (wins === numWins) console.log(wins, [hp, atk, def, spd]);

        }
      }
    }
    var t2 = performance.now();

    console.log('count: ' + count);
    console.log('count2: ' + count2);
    console.log('best score: ' + bestScore);
    console.log(numWins + ' wins, ' + numTies + ' ties, ' + (count-numWins-numTies) + ' losses');
    console.log(Math.round((numWins/count)*10000)/100 + '% win percentage');
    console.log('hp:  ' + hp3);
    console.log('atk: ' + atk3);
    console.log('def: ' + def3);
    console.log('spd: ' + spd3);
    console.log('time elapsed: ' + (t2-t1));
}

function calculateBestStats3(hp, atk, def, spd) {
    var hp2, atk2, def2, spd2;

    var count = 0;
    var count2 = 0;
    var t1 = performance.now();
            // console.log([hp, atk, def, spd]);
            var score = 0;
            var wins = 0;
            var ties = 0;
            for(hp2 = HP_MIN; hp2 < TOTAL_STATS-ATK_MIN-DEF_MIN-SPD_MIN; hp2++) {
              for(atk2 = ATK_MIN; atk2 < TOTAL_STATS-hp2-DEF_MIN-SPD_MIN; atk2++) {
                for(def2 = DEF_MIN; def2 < TOTAL_STATS-hp2-atk2-SPD_MIN; def2++) {
                    spd2 = TOTAL_STATS-hp2-atk2-def2;
                    count2++;
                    var results = battleSim2(hp, atk, def, spd, hp2, atk2, def2, spd2);
                    score += results;
                    if (results > 0) {
                      wins++;
                    } else if (results === 0) {
                      ties++;
                    }
                }
              }
            }
    var t2 = performance.now();

    console.log('count2: ' + count2);
    console.log('this score: ' + score);
    console.log(wins + ' wins, ' + ties + ' ties, ' + (count2-wins-ties) + ' losses');
    console.log(Math.round((wins/count2)*10000)/100 + '% win percentage');
    console.log('hp:  ' + hp);
    console.log('atk: ' + atk);
    console.log('def: ' + def);
    console.log('spd: ' + spd);
    console.log('time elapsed: ' + (t2-t1));
}




function hitsToKill(A_hp, A_atk, A_def, A_spd, D_hp, D_atk, D_def, D_spd) {
  return D_hp*5 / (15*A_atk/D_def * Math.max(1, A_spd/D_spd/2));
}

function battleSim(A_hp, A_atk, A_def, A_spd, D_hp, D_atk, D_def, D_spd) {
  var A_hpmax = A_hp*5;
  var D_hpmax = D_hp*5;
  A_hp = A_hpmax;
  D_hp = D_hpmax;

  var A_dmg = 15*A_atk/D_def * Math.max(1, D_spd/A_spd/2);
  var D_dmg = 15*D_atk/A_def * Math.max(1, A_spd/D_spd/2);

  if (A_spd > D_spd) {
    while(true) {
      D_hp -= A_dmg;
      if (D_hp <= 0) {
        return A_hp/A_hpmax;
      }
      A_hp -= D_dmg;
      if (A_hp < 0) {
        // console.log('loss:', [A_hpmax, A_atk, A_def, A_spd], [D_hpmax, D_atk, D_def, D_spd]);
        return -D_hp/D_hpmax;
      }
      // regen
      A_hp = Math.min(A_hpmax, A_hp + A_hpmax/40);
      D_hp = Math.min(D_hpmax, D_hp + D_hpmax/40);
    }
  } else if (A_spd < D_spd) {
    while(true) {
      A_hp -= D_dmg;
      if (A_hp < 0) {
        return -D_hp/D_hpmax;
      }
      D_hp -= A_dmg;
      if (D_hp <= 0) {
        return A_hp/A_hpmax;
      }
      // regen
      A_hp = Math.min(A_hpmax, A_hp + A_hpmax/40);
      D_hp = Math.min(D_hpmax, D_hp + D_hpmax/40);
    }
  } else {
    while(true) {
      A_hp -= D_dmg;
      D_hp -= A_dmg;
      if (A_hp <= 0 && D_hp <= 0) {
          if (A_hpmax === 28*5 && A_atk === 24 && A_def === 27 && A_spd === 21)
            arr1.push([D_hpmax/5, D_atk, D_def, D_spd]);
        return 0;
      } else if (D_hp <= 0) {
        return A_hp/A_hpmax;
      } else if (A_hp < 0) {
        return -D_hp/D_hpmax;
      }
      // regen
      A_hp = Math.min(A_hpmax, A_hp + A_hpmax/40);
      D_hp = Math.min(D_hpmax, D_hp + D_hpmax/40);
    }
  }
  console.log("I should never execute!");
  return null;
}

function battleSim2(A_hp, A_atk, A_def, A_spd, D_hp, D_atk, D_def, D_spd) {
  var A_hpmax = A_hp*5;
  var D_hpmax = D_hp*5;
  A_hp = A_hpmax;
  D_hp = D_hpmax;

  var A_dmg = 15*A_atk/D_def * Math.max(1, D_spd/A_spd/2);
  var D_dmg = 15*D_atk/A_def * Math.max(1, A_spd/D_spd/2);

  // edge cases: damage lower than regeneration rate
  if (A_dmg <= D_hpmax/40) {
      if (D_dmg <= A_hpmax/40) {
          return 0; // tie, no one can win
      } else {
          return -1; // landslide victory for D
      }
  } else if (D_dmg <= A_hpmax/40) {
      return 1; // landside victory for A
  }

  var A_hitsToDie = A_hpmax*39/40 / (D_dmg - A_hpmax/40); // hits needed to kill A
  var D_hitsToDie = D_hpmax*39/40 / (A_dmg - D_hpmax/40); // hits needed to kill B
  var A_ceil = Math.ceil(A_hitsToDie);
  var D_ceil = Math.ceil(D_hitsToDie);

  if (A_spd > D_spd) {
      if (A_ceil >= D_ceil) { // if equal, A hits first, so D loses
          return 1;
      } else {
        //   console.log('loss:', [A_hpmax, A_atk, A_def, A_spd], [D_hpmax, D_atk, D_def, D_spd]);
          return -1;
      }
  } else if (A_spd === D_spd) {
      // note that in this case A and D attack simulaneously
      if (A_ceil === D_ceil) {
          arr3.push([D_hpmax/5, D_atk, D_def, D_spd]);
          return 0; // tie
      } else if (A_ceil > D_ceil) {
          return 1;
      } else {
          return -1;
      }
  } else { // A_spd < D_spd
      if (D_ceil >= A_ceil) { // if equal, D hits first, so A loses
          return -1;
      } else {
          return 1;
      }
  }
  console.error('This shouldn\'t happen');
  return null;
}
