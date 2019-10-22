// thanks mozilla
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

// constants
var SIZE = 512;
var RESOLUTION = 1;

// settings
var DRAW_BORDERS = false;
var NUM_LEADERBOARD_ENTRIES = Math.min(SIZE*SIZE, 15);

var TOTAL_STAT_POINTS_PER_POKEMON = 100;

var TYPES = ['normal', 'fighting', 'flying', 'poison', 'ground',
             'rock', 'bug', 'ghost', 'steel', 'fire', 'water', 'grass',
             'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'];
var NUM_TYPES = TYPES.length;
var TYPE_COLORS = [
    [168,167,122],  // 00: normal
    [194,46,40],    // 01: fighting
    [169,143,243],  // 02: flying
    [163,62,161],   // 03: poison
    [226,191,101],  // 04: ground
    [182,161,54],   // 05: rock
    [166,185,26],   // 06: bug
    [115,87,151],   // 07: ghost
    [183,183,206],  // 08: steel
    [238,129,48],   // 09: fire
    [99,144,240],   // 10: water
    [122,199,76],   // 11: grass
    [247,208,44],   // 12: electric
    [249,85,135],   // 13: psychic
    [150,217,214],  // 14: ice
    [111,53,252],   // 15: dragon
    [112,87,70],    // 16: dark
    [214,133,173],  // 17: fairy
];
var TYPE_PIXELS = new Array(NUM_TYPES);

var TYPE_COMPARISON = [
    [1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 0.0, 0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],   // normal attacking
    [2.0, 1.0, 0.5, 0.5, 1.0, 2.0, 0.5, 0.0, 2.0, 1.0, 1.0, 1.0, 1.0, 0.5, 2.0, 1.0, 2.0, 0.5],   // fighting attacking
    [1.0, 2.0, 1.0, 1.0, 1.0, 0.5, 2.0, 1.0, 0.5, 1.0, 1.0, 2.0, 0.5, 1.0, 1.0, 1.0, 1.0, 1.0],   // flying attacking
    [1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 1.0, 0.5, 0.0, 1.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0],   // poison attacking
    [1.0, 1.0, 0.0, 2.0, 1.0, 2.0, 0.5, 1.0, 2.0, 2.0, 1.0, 0.5, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0],   // ground attacking
    [1.0, 0.5, 2.0, 1.0, 0.5, 1.0, 2.0, 1.0, 0.5, 2.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 1.0],   // rock attacking
    [1.0, 0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 1.0, 2.0, 1.0, 2.0, 1.0, 1.0, 2.0, 0.5],   // bug attacking
    [0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 0.5, 1.0],   // ghost attacking
    [1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 0.5, 0.5, 0.5, 1.0, 0.5, 1.0, 2.0, 1.0, 1.0, 2.0],   // steel attacking
    [1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 2.0, 1.0, 2.0, 0.5, 0.5, 2.0, 1.0, 1.0, 2.0, 0.5, 1.0, 1.0],   // fire attacking
    [1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 1.0, 1.0, 1.0, 2.0, 0.5, 0.5, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0],   // water attacking
    [1.0, 1.0, 0.5, 0.5, 2.0, 2.0, 0.5, 1.0, 0.5, 0.5, 2.0, 0.5, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0],   // grass attacking
    [1.0, 1.0, 2.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 0.5, 0.5, 1.0, 1.0, 0.5, 1.0, 1.0],   // electric
    [1.0, 2.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0, 0.0, 1.0],   // psychic
    [1.0, 1.0, 2.0, 1.0, 2.0, 1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 2.0, 1.0, 1.0, 0.5, 2.0, 1.0, 1.0],   // ice
    [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 0.0],   // dragon
    [1.0, 0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 0.5, 0.5],   // dark
    [1.0, 2.0, 1.0, 0.5, 1.0, 1.0, 1.0, 1.0, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 1.0],   // fairy
];



// window variables
var canvas;
var ctx;
var leaderboard;
// mouse event stuff
// selectedRowID is the hot-off-the-press current row the mouse is over
// targetRowID is the last checked selectedRowID
// (only checked at the beginning of every simulation call in case it changes midway through)
// oldRowID is the previous value of targetRowID once a new targetRowID is created
var MouseData = {isMouseInCanvas:false, newTarget:false, mouseX:0, mouseY:0, selectedRowID:-1, targetRowID:-1, oldRowID:-1}

// image stuff
var image;
var image_data;

// simulation variables
var grid;
var count; // used for leaderboard
var types_cache; // used for leaderboard
var started = false;
var counter = 0; // number of ticks in the simulation
var isFinished = false;


function initialize() {
    if (RESOLUTION < 1) {
        console.error('resolution less than one');
        return;
    } else if (RESOLUTION !== Math.floor(RESOLUTION)) {
        console.error('resolution must be a positive integer');
        return;
    }

    leaderboard = document.getElementById('leaderboard');

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.lineWidth = 1;

    canvas.width = SIZE * RESOLUTION;
    canvas.height = SIZE * RESOLUTION;

    // used as a buffer, drawn directly to canvas
    image = ctx.createImageData(SIZE*RESOLUTION, SIZE*RESOLUTION);
    image_data = image.data;
    for (var i = 3; i < image_data.length; i+=4) {
        image_data[i] = 255;
    }

    for (var i = 0; i < NUM_TYPES; i++) {
        TYPE_PIXELS[i] = ctx.createImageData(1, 1);
        TYPE_PIXELS[i].data[0] = TYPE_COLORS[i][0];
        TYPE_PIXELS[i].data[1] = TYPE_COLORS[i][1];
        TYPE_PIXELS[i].data[2] = TYPE_COLORS[i][2];
        TYPE_PIXELS[i].data[3] = 255; // alpha
    }

    // keeps track of how many of each ID there are (can't use shortcut due to call stack issues)
    count = new Array(SIZE*SIZE);
    for (var i = 0; i < SIZE*SIZE; i++) {
        count[i] = 1; // one of every pokemon starting out
    }

    types_cache = new Array(SIZE*SIZE);

    // create pokemon
    grid = new Array(SIZE);
    for (var j = 0; j < SIZE; j++) {
        grid[j] = new Array(SIZE);
        for (var i = 0; i < SIZE; i++) {
            grid[j][i] = new Pokemon(j*SIZE + i);
            grid[j][i].enemies = 4; // surrounding four squares contain enemy pokemon

            // draw pokemon
            drawPokemon(grid[j][i], i, j);

            types_cache[j*SIZE+i] = {type1: grid[j][i].type1, type2: grid[j][i].type2};
        }
    }

    // draw pokemon initially

    //set events
    canvas.addEventListener('mouseenter', function(evt) {
        MouseData.isMouseInCanvas = true;
    }, false);
    canvas.addEventListener('mouseleave', function(evt) {
        MouseData.isMouseInCanvas = false;
    }, false);
    canvas.addEventListener('mousemove', function(evt) {
        var rect = canvas.getBoundingClientRect();
        MouseData.mouseX = Math.floor((evt.clientX - rect.left) / RESOLUTION);
        MouseData.mouseY = Math.floor((evt.clientY - rect.top) / RESOLUTION);
        updateDisplay();
    }, false);


    // html stuff
    createRankTable();
    createTypeChart();

    // start da loop!
    started = true;
    requestAnimFrame(update);
}


function update() {
    // do stuff
    if (!isFinished) {
        if (counter % 1 === 0) {
            simulate(counter);
            draw();
        }
    }
    if (true) {
        updateDisplay();
    }
    counter++;
    requestAnimFrame(update);
}

function draw() {
    ctx.putImageData(image, 0, 0);
}

function simulate(counter) {

    var hasWinnerBeenFound = true;
    var prevID = grid[0][0].id;

    // var index = 0;


    // mouse target stuff for updating pixels for newly moused over table rows
    if (MouseData.targetRowID !== MouseData.selectedRowID) {
        MouseData.oldRowID = MouseData.targetRowID; // need to clear out the old row as well
        MouseData.targetRowID = MouseData.selectedRowID;
    }

    for (var j = 0; j < SIZE; j++) {
        for (var i = 0; i < SIZE; i++) {
            var attacker = grid[j][i];
            // check if winner has been found yet
            if (attacker.id !== prevID) {
                hasWinnerBeenFound = false;
            }

            // pokemon with at least one hostile neighbor can attack
            if (attacker.enemies > 0) {
                act(i, j, attacker);
            }
            // table mouseover redraw stuff
            if (MouseData.newTarget && (MouseData.targetRowID === attacker.id || MouseData.oldRowID === attacker.id)) {
                // redraw
                drawPokemon(attacker, i, j); // TODO: hardcode to draw black for selectedRowID and color for oldRowID?
            }

            // pokemon regenerate a bit of HP each round
            attacker.hp += attacker.hp_max / 40;
            if (attacker.hp > attacker.hp_max) {
                attacker.hp = attacker.hp_max;
            }

        }
    }

    if (MouseData.targetRowID === MouseData.selectedRowID) {
        MouseData.newTarget = false; // don't check for targets if the mouse hasn't moved since previous loop
    }



    if (hasWinnerBeenFound) {
        isFinished = true;
        console.log('WINNER FOUND');
        console.log('id: \t',grid[0][0].id);
        console.log('type:\t',TYPES[grid[0][0].type1] + (grid[0][0].type2 !== undefined ? '/' + TYPES[grid[0][0].type2] : ''));
        console.log('hp: \t',grid[0][0].hp_max);
        console.log('atk:\t',grid[0][0].atk);
        console.log('def:\t',grid[0][0].def);
        console.log('spd:\t',grid[0][0].spd);

        // set image (will be black if winner-to-be was highlighted the previous iteration)
        if (MouseData.selectedRowID === grid[0][0].id) {
            var type1Color = TYPE_COLORS[grid[0][0].type1];
            var type2Color = grid[0][0].type2;
            if (type2Color === undefined) {
                type2Color = type1Color;
            } else {
                type2Color = TYPE_COLORS[type2Color];
            }
            var counter = 0;
            for (var j = 0; j < SIZE*RESOLUTION; j++) {
                for (var i = 0; i < SIZE*RESOLUTION; i++) {
                    if ((i+j)%4 === 0) {
                        image_data[counter] = type2Color[0];
                        image_data[counter+1] = type2Color[1];
                        image_data[counter+2] = type2Color[2];
                    } else {
                        image_data[counter] = type1Color[0];
                        image_data[counter+1] = type1Color[1];
                        image_data[counter+2] = type1Color[2];
                    }
                    counter += 4;
                }
            }
        }
    }

    // leaderboard table
    if (counter % 20 === 0 || isFinished) {
        var topPerformers = new Array(NUM_LEADERBOARD_ENTRIES);
        for (var i = 0; i < NUM_LEADERBOARD_ENTRIES; i++) {
            topPerformers[i] = i;
        }
        topPerformers.sort(function(a, b) {return count[a]-count[b]});
        for (var i = NUM_LEADERBOARD_ENTRIES; i < SIZE*SIZE; i++) {
            if (count[i] > count[topPerformers[0]]) {
                topPerformers[0] = i;
                topPerformers.sort(function(a, b) {return count[a]-count[b]});
            }
        }
        // update table
        var table = document.getElementById('leaderboard');
        for (var i = 1, row; row = table.rows[i]; i++) {
            if (count[topPerformers[NUM_LEADERBOARD_ENTRIES-i]] === 0) {
                row.cells[0].innerText = '';
                row.cells[1].innerText = '';
                row.cells[2].innerText = '';
                row.style.background = 'none';
                row.style['background-image'] = 'none';
            } else {
                var slotID = topPerformers[NUM_LEADERBOARD_ENTRIES-i]
                row.cells[0].innerText = slotID;
                row.cells[1].innerText = TYPES[types_cache[slotID].type1] +
                                         (types_cache[slotID].type2 === undefined ? '' : '/' + TYPES[types_cache[slotID].type2]);
                row.cells[2].innerText = count[slotID];
                var type1ColorStr = RGBStringFromArray(TYPE_COLORS[types_cache[slotID].type1]);
                var type2ColorStr = types_cache[slotID].type2;
                if (type2ColorStr === undefined) { // single type
                    row.style.background = type1ColorStr;
                    row.style['background-image'] = 'none';
                } else { // double type
                    type2ColorStr = RGBStringFromArray(TYPE_COLORS[type2ColorStr]);
                    row.style.background = 'none';
                    row.style['background-image'] = 'linear-gradient( \
                        to right top, \
                        transparent 33%, \
                        ' + type2ColorStr + ' 33%, \
                        ' + type1ColorStr + ' 66%, \
                        transparent 33% \
                    )';
                    row.style['background-size'] = '3px 3px';
                }

            }
        }
    }
}
initialize();

// create a new pokemon
function Pokemon(id) {
    this.id = id;
    this.type1 = Math.floor(Math.random()*NUM_TYPES);
    // some pokemon have two types
    if (Math.random() < 0.1) {
        do {
            this.type2 = Math.floor(Math.random()*NUM_TYPES);
        } while(this.type1 == this.type2);
    } else {
        this.type2 = undefined;
    }

    // base stats
    this.hp_max = 0;
    this.atk = 0;
    this.def = 0;
    this.spd = 0;
    // TODO: better algorithm for random assignment
    for (var i = 0; i < TOTAL_STAT_POINTS_PER_POKEMON; i++) {
        switch(Math.floor(Math.random()*4)) {
            case 0: this.hp_max++;  break;
            case 1: this.atk++;     break;
            case 2: this.def++;     break;
            case 3: this.spd++;     break;
            default: console.error('error assigning stat points to new pokemon');
        }
    }
    this.hp_max *= 5;
    this.hp = this.hp_max;

    return this;
}

Pokemon.prototype.getAttackerMultiplier = function(defender) {
    // no 'moves', pokemon chooses to attack with most effective type it has
    var m1 = TYPE_COMPARISON[this.type1][defender.type1];
    if (defender.type2 !== undefined) {
        m1 *= TYPE_COMPARISON[this.type1][defender.type2];
    }
    var m2 = 0;
    if (this.type2 !== undefined) {
        m2 = TYPE_COMPARISON[this.type2][defender.type1];
        if (defender.type2 !== undefined) {
            m2 *= TYPE_COMPARISON[this.type2][defender.type2];
        }
    }
    return Math.max(m1, m2);
}


function updateDisplay() {
    if (started) {
        var pokemon = grid[MouseData.mouseY][MouseData.mouseX];
        var text = 'ID: ' + pokemon.id + ' (' + TYPES[pokemon.type1] +
                   (pokemon.type2 !== undefined ? '/' + TYPES[pokemon.type2] : '') + ')';
        text += '\nHealth: ' + Math.floor(pokemon.hp) + '/' + pokemon.hp_max;
        text += '\nAttack: ' + pokemon.atk;
        text += '\nDefense: ' + pokemon.def;
        text += '\nSpeed: ' + pokemon.spd;
        document.getElementById('data').innerText = text;
    }
}

function createTypeChart() {
    var table = document.createElement('table');
    table.style['border-collapse'] = 'collapse';
    table.style['text-align'] = 'center';
    var tableBody = document.createElement('tbody');
    // top row
    var header = document.createElement('tr');
    // blank cell
    header.appendChild(document.createElement('td'));
    for (var i = 0; i < NUM_TYPES; i++) {
        var cell = document.createElement('td');
        cell.style.background = RGBStringFromArray(TYPE_COLORS[i]);
        cell.style['border-right'] = '1px solid black';
        cell.innerText = TYPES[i];
        header.appendChild(cell);
    }
    tableBody.appendChild(header);

    // main rows
    for (var i = 0; i < NUM_TYPES; i++) {
        var row = document.createElement('tr');
        var left = document.createElement('td');
        left.style.background = RGBStringFromArray(TYPE_COLORS[i]);
        left.style['border-bottom'] = '1px solid black';
        left.innerText = TYPES[i];
        row.appendChild(left);

        for (var j = 0; j < NUM_TYPES; j++) {
            var cell = document.createElement('td');
            var multiplier = TYPE_COMPARISON[i][j];
            // TODO: use functions instead
            switch(multiplier) {
                case 0.0: cell.style.background = 'black'; break;
                case 0.5: cell.style.background = 'red'; break;
                case 1.0: cell.style.background = 'white'; break;
                case 2.0: cell.style.background = 'green'; break;
                default: console.error('unknown multiplier'); cell.style.background = 'grey'; break;
            }
            if (multiplier !== 1) {
                cell.style.color = 'white';
            }
            cell.style.border = '1px solid black';
            cell.innerText = (multiplier === 0.5 ? '½' : multiplier) + 'x';

            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    }
    table.appendChild(tableBody);
    document.body.appendChild(table);
}



function createRankTable(data) {
    var table = document.getElementById('leaderboard');
    var tableBody = document.createElement('tbody');
    // top row
    var header = document.createElement('tr');
    // blank cell
    var td = document.createElement('td');
    td.innerText = 'ID'
    td.style.width = '61px !important'; // to keep the corduroy aligned
    header.appendChild(td);
    td = document.createElement('td');
    td.innerText = 'Type'
    td.style.width = '124px';
    header.appendChild(td);
    td = document.createElement('td');
    td.innerText = 'Population'
    td.style.width = '80px';
    header.appendChild(td);
    tableBody.appendChild(header);

    for (var i = 0; i < NUM_LEADERBOARD_ENTRIES; i++) {
        var row = document.createElement('tr');
        for (var j = 0; j < 3; j++) {
            row.appendChild(document.createElement('td'));
        }

        row.addEventListener('mouseenter', function(evt) {
            MouseData.selectedRowID = parseInt(evt.target.cells[0].innerText);
            MouseData.newTarget = true; // tell simulation loop to redraw the pixels
        }, false);
        row.addEventListener('mouseleave', function(evt) {
            MouseData.selectedRowID = -1;
            MouseData.newTarget = true; // tell simulation loop to redraw the pixels
        }, false);

        tableBody.appendChild(row);
    }
    table.appendChild(tableBody);

}

function RGBStringFromArray(array) {
    return 'rgb(' + array[0] + ', ' + array[1] + ', ' + array[2] + ')';
}




function act(i, j, attacker) {
    // find weakest adjacent cell
    var bestAttackerMultiplier = -1;
    var defender;
    var bestDirections = [];

    var isAttacking = 0;

    // right
    defender = grid[j][(i+1) % SIZE];
    if (defender.id !== attacker.id) {
        isAttacking += 1;
        var multiplier = attacker.getAttackerMultiplier(defender);
        if (multiplier > bestAttackerMultiplier) {
            bestAttackerMultiplier = multiplier;
            bestDirections = [0];
        } else if (multiplier === bestAttackerMultiplier) {
            bestDirections.push(0);
        }
    }
    // left
    defender = grid[j][(i-1+SIZE) % SIZE];
    if (defender.id !== attacker.id) {
        isAttacking += 2;
        var multiplier = attacker.getAttackerMultiplier(defender);
        if (multiplier > bestAttackerMultiplier) {
            bestAttackerMultiplier = multiplier;
            bestDirections = [1];
        } else if (multiplier === bestAttackerMultiplier) {
            bestDirections.push(1);
        }
    }
    // up
    defender = grid[(j+1) % SIZE][i];
    if (defender.id !== attacker.id) {
        isAttacking += 4;
        var multiplier = attacker.getAttackerMultiplier(defender);
        if (multiplier > bestAttackerMultiplier) {
            bestAttackerMultiplier = multiplier;
            bestDirections = [2];
        } else if (multiplier === bestAttackerMultiplier) {
            bestDirections.push(2);
        }
    }
    // down
    defender = grid[(j-1+SIZE) % SIZE][i];
    if (defender.id !== attacker.id) {
        isAttacking += 8;
        var multiplier = attacker.getAttackerMultiplier(defender);
        if (multiplier > bestAttackerMultiplier) {
            bestAttackerMultiplier = multiplier;
            bestDirections = [3];
        } else if (multiplier === bestAttackerMultiplier) {
            bestDirections.push(3);
        }
    }

    attacker.isAttacking = isAttacking;
    // attack!
    if (bestAttackerMultiplier === -1) {
        console.log('this shouldn\'t happen');
    }
    if (bestAttackerMultiplier !== -1) {
        // choose direction
        var defX, defY;
        switch(bestDirections[Math.floor(Math.random()*bestDirections.length)]) {
            case 0: defX = (i+1) % SIZE; defY = j; break;
            case 1: defX = (i-1+SIZE) % SIZE; defY = j; break;
            case 2: defX = i; defY = (j+1) % SIZE; break;
            case 3: defX = i; defY = (j-1+SIZE) % SIZE; break;
            default: console.error('can\'t find a valid target');
        }
        defender = grid[defY][defX];


        // chance of dodging
        if (Math.random() < attacker.spd / defender.spd / 2) {
            defender.hp -= 15 * attacker.atk * bestAttackerMultiplier / defender.def;
        }
        // TODO: fix this so that everyone attacks before converting
        if (defender.hp <= 0) {
            // need to save ID for enemy count checking with neighbors later on
            var previousID = defender.id;
            // update count
            count[defender.id]--;
            count[attacker.id]++;

            // make defender a new instance of attacker
            defender.id = attacker.id;
            defender.type1 = attacker.type1;
            defender.type2 = attacker.type2;
            defender.hp_max = attacker.hp_max;
            defender.hp = attacker.hp;
            defender.atk = attacker.atk;
            defender.def = attacker.def;
            defender.spd = attacker.spd;

            // defender has to calculate number of enemies and update the count of its neighbors
            defender.enemies = 0;
            // note that surrounding allies (of which there will be at least one) now have one less enemy as well
            var neighbor = grid[defY][(defX+1) % SIZE];
            // TODO: use a loop here instead of copy/pasting the same code 4 times?
            if (neighbor.id === defender.id) {
                neighbor.enemies--;
            } else {
                defender.enemies++;
                if (neighbor.id === previousID) {
                    neighbor.enemies++;
                }
            }
            neighbor = grid[defY][(defX-1+SIZE) % SIZE];
            if (neighbor.id === defender.id) {
                neighbor.enemies--;
            } else {
                defender.enemies++;
                if (neighbor.id === previousID) {
                    neighbor.enemies++;
                }
            }
            neighbor = grid[(defY+1) % SIZE][defX];
            if (neighbor.id === defender.id) {
                neighbor.enemies--;
            } else {
                defender.enemies++;
                if (neighbor.id === previousID) {
                    neighbor.enemies++;
                }
            }
            neighbor = grid[(defY-1+SIZE) % SIZE][defX];
            if (neighbor.id === defender.id) {
                neighbor.enemies--;
            } else {
                defender.enemies++;
                if (neighbor.id === previousID) {
                    neighbor.enemies++;
                }
            }

            // redraw enemy image data
            // copy proper bytes to image
            drawPokemon(defender, defX, defY);

        }
    }
}

function drawPokemon(pokemon, i, j) {

    var palette;
    if (MouseData.targetRowID === pokemon.id) {
        palette = [0,0,0];
    } else if (pokemon.type2 !== undefined && (i+j)*RESOLUTION % 4 === 0) {
        palette = TYPE_COLORS[pokemon.type2];
    } else {
        palette = TYPE_COLORS[pokemon.type1];
    }

    // get index on imagebuffer
    var index = (j * SIZE*RESOLUTION + i) * RESOLUTION * 4;

    if (RESOLUTION === 1) { // one pixel resolution
        image_data[index] = palette[0];
        image_data[index+1] = palette[1];
        image_data[index+2] = palette[2];
    } else { // larger than one pixel resolution
        if (image_data[index]   !== palette[0] ||
            image_data[index+1] !== palette[1] ||
            image_data[index+2] !== palette[3]) {
                // only recolor squares that have changed
                // TODO: move to defeated pokemon section?
                // need secondary palette
                var palette2;
                if (MouseData.targetRowID === pokemon.id) {
                    palette2 = [0,0,0];
                } else if (pokemon.type2 !== undefined) {
                    palette = TYPE_COLORS[pokemon.type1];
                    palette2 = TYPE_COLORS[pokemon.type2];
                } else {
                    palette2 = TYPE_COLORS[pokemon.type1];
                }
                var modOffset = (i+j)*RESOLUTION;
                for (var y = 0; y < RESOLUTION; y++) {
                    for (var x = 0; x < RESOLUTION; x++) {
                        var trueIndex = index + x*4 + y*RESOLUTION*SIZE*4;
                        if ((modOffset+x+y) % 4 === 0) {
                            image_data[trueIndex] = palette2[0];
                            image_data[trueIndex + 1] = palette2[1];
                            image_data[trueIndex + 2] = palette2[2];
                        } else {
                            image_data[trueIndex] = palette[0];
                            image_data[trueIndex + 1] = palette[1];
                            image_data[trueIndex + 2] = palette[2];
                        }
                    }
                }
        }
    }

}
