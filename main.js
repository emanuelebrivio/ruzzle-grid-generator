$(function () {
  
  var FINAL = [];
  
  function init() {
  
    var words = _.shuffle(['DIGITAL', 'COMMUNITY', 'ONLINE', 'COLLABORATION', 'TOOL', 'SOCIAL', 'NETWORK', 'UPDATE', 'TECHNOLOGY', 'CHAT', 'BLOG', 'FORUM', 'WIKI', 'AVATAR', 'SHARING', 'LIKE', 'EMAIL', 'MANAGER', 'MEDIA', 'STRATEGY', 'MODERATOR', 'AUTHOR', 'ADMIN', 'CULTURE', 'CODESIGN', 'CARE', 'ANALYTICS', 'LMS', 'GOVERNANCE', 'DATA', 'IOT']);

    var retryCount = 50;
    var gridSize = 8;
    var grid = [];
    var finalGrid = []
    var inserted = [];

    var printGrid = function () {
      var gridsystem = '';
      for (var i = 0; i < gridSize; i++) {
        gridsystem += '<tr>';
        for (var j = 0; j < gridSize; j++) {
          gridsystem += '<td>' + ((finalGrid[i][j] == '' ? ' ' : finalGrid[i][j])) + '</td>';
        }
        gridsystem += '</tr>';
      }
      document.getElementById('grid').innerHTML = gridsystem;
    }

    var canGo = function (where, x, y, letter) {
      if (where == 'right') { y += 1; }
      if (where == 'left') { y -= 1; }
      if (where == 'bottom') { x += 1; }
      if (where == 'top') { x -= 1; }

      if ((x >= 0 && x < gridSize && y >= 0 && y < gridSize) &&
          (grid[x][y] == '' || (letter && grid[x][y] == letter))) {
        return true;
      }
      return false;
    }

    var getParameters = function (empty, letter) {
      var sample = _.sample(empty);
      var sampleX = Math.floor(sample / gridSize);
      var sampleY = sample % gridSize;

      var direction = [];
      if (canGo('top', sampleX, sampleY, letter)) { direction.push('top'); }
      if (canGo('left', sampleX, sampleY, letter)) { direction.push('left'); }
      if (canGo('right', sampleX, sampleY, letter)) { direction.push('right'); }
      if (canGo('bottom', sampleX, sampleY, letter)) { direction.push('bottom'); }

      console.log('From', sampleX, sampleY, 'i can go', direction);

      return {
        directions: direction,
        x: sampleX,
        y: sampleY
      };
    }

    var setupGrid = function () {
      for (var i = 0; i < gridSize; i++) {
        var row = [];
        for (var j = 0; j < gridSize; j++) {
          row.push('');
        }
        finalGrid.push(row);
      }
    };




    setupGrid();

    _.each(words, function (word) {

      grid = _.clone(finalGrid, true);

      var count = 0;
      var flattenGrid = _.flatten(finalGrid);
      var empty = [];    
      _.map(flattenGrid, function (cell, id) { if (cell == '') { empty.push(id); }});

      console.log('Trying to insert Word', word);

      function inject(word, index, direction, x, y) {

        if (index == word.length) {

          // Word inserted
          console.log('Word inserted');
          inserted.push(word);
          finalGrid = _.clone(grid, true);
          grid = [];
          //printGrid();

          return;

        } else {

          if ((x < 0 || x >= gridSize || y < 0 || y >= gridSize) || (grid[x][y] != '' && grid[x][y] != word[index])) {

            if (count < retryCount) {
              count ++;
              console.log('Retry #' + count + ' of ' + retryCount, word);
              grid = _.clone(finalGrid, true);

              var params = getParameters(empty, word[0]);
              inject(word, 0, _.sample(params.directions), params.x, params.y);

            } else {
              console.log('Enough... change word');
            }
            return;
          }


          //Insert this letter
          grid[x][y] = word[index];

          if (direction == 'right' && y == gridSize - 1 ||
              direction == 'left' && y == 0 ||
              direction == 'bottom' && x == gridSize - 1 ||
              direction == 'top' && x == 0) {

            // I need to change direction
            var where;
            if (direction == 'top' || direction == 'bottom') {
              where = _.shuffle(['left', 'right']);
            } else {
              where = _.shuffle(['top', 'bottom']);
            }
            direction = canGo(where[0], x, y, word[index + 1]) ? where[0] : where[1];
          }

          if (direction == 'right') {
            inject(word, index + 1, direction, x, y + 1);
          }
          if (direction == 'left') {
            inject(word, index + 1, direction, x, y - 1);
          }
          if (direction == 'bottom') {
            inject(word, index + 1, direction, x + 1, y);
          }
          if (direction == 'top') {
            inject(word, index + 1, direction, x - 1, y);
          }
        }
      }

      var params = getParameters(empty, word[0]);

      inject(word, 0, _.sample(params.directions), params.x, params.y);

    });


    var alphabet = inserted.join('');
    for (var i = 0; i < gridSize; i++) {
      for (var j = 0; j < gridSize; j++) {
        if (finalGrid[i][j] == '') {
          finalGrid[i][j] = _.sample(alphabet);
        }
      }
    }


    console.log('Inserted words', inserted.length, inserted);
    printGrid();

    var simple = _.flatten(finalGrid);
    FINAL.push(simple);
    
  }  
  
  for (var t = 0; t < 100; t++) {
    init();
  }
  
  $('pre').html(JSON.stringify(FINAL));
  
    
});
