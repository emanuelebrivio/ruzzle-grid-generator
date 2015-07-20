$(function () {

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
    if (where == 'right') {
      y += 1;
    }
    if (where == 'left') {
      y -= 1;
    }
    if (where == 'bottom') {
      x += 1;
    }
    if (where == 'top') {
      x -= 1;
    }
    
    if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
      if (grid[x][y] == '') {
        return true;
      }
      if (letter && grid[x][y] == letter) {
        return true;
      }
      return false;
    } else {
      return false;
    }
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
        
    var flattenGrid = _.flatten(finalGrid);
    var empty = [];    
    _.map(flattenGrid, function (cell, id) { if (cell == '') { empty.push(id); }});

    console.log('Trying to insert Word', word);
    
    var count = 0;
    
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
          
          if (count <= retryCount) {
            count ++;
            console.log('Retry #' + count + ' of ' + retryCount, word);
            grid = _.clone(finalGrid, true);
            
            var sample = _.sample(empty);
            var sampleX = Math.floor(sample / gridSize);
            var sampleY = sample % gridSize;

            var direction = [];
            if (canGo('top', sampleX, sampleY)) { direction.push('top'); }
            if (canGo('left', sampleX, sampleY)) { direction.push('left'); }
            if (canGo('right', sampleX, sampleY)) { direction.push('right'); }
            if (canGo('bottom', sampleX, sampleY)) { direction.push('bottom'); }

            console.log('I can go', direction, sampleX, sampleY);

            inject(word, 0, _.sample(direction), sampleX, sampleY);
            
          } else {
            console.log('Enough... change word');
          }
          return;
        }
        
        grid[x][y] = word[index];

        //console.log('Inserted', word[index]);


        if (direction == 'right' && y != gridSize - 1 ||
            direction == 'left' && y != 0 ||
            direction == 'bottom' && x != gridSize - 1 ||
            direction == 'top' && x != 0) {

          // I can continue on this direction

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

        } else {
          var where;
          if (direction == 'top' || direction == 'bottom') {
            where = _.shuffle(['left', 'right']);
          } else {
            where = _.shuffle(['top', 'bottom']);
          }
          var newD = canGo(where[0], x, y, word[index + 1]) ? where[0] : where[1];

          if (newD == 'right') {
            inject(word, index + 1, newD, x, y + 1);
          }
          if (newD == 'left') {
            inject(word, index + 1, newD, x, y - 1);
          }
          if (newD == 'bottom') {
            inject(word, index + 1, newD, x + 1, y);
          }
          if (newD == 'top') {
            inject(word, index + 1, newD, x - 1, y);
          }
        }
      }
    }
  
    var sample = _.sample(empty);
    var sampleX = Math.floor(sample / gridSize);
    var sampleY = sample % gridSize;
    
    var direction = [];
    if (canGo('top', sampleX, sampleY)) { direction.push('top'); }
    if (canGo('left', sampleX, sampleY)) { direction.push('left'); }
    if (canGo('right', sampleX, sampleY)) { direction.push('right'); }
    if (canGo('bottom', sampleX, sampleY)) { direction.push('bottom'); }
    
    console.log('I can go', direction, sampleX, sampleY);
    
    inject(word, 0, _.sample(direction), sampleX, sampleY);
    
  });
  
  
  console.log('Inserted words', inserted.length, inserted);
  printGrid();
  
});
