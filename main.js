$(function () {

  var words = ['CULTURE', 'MONOCHRONIC', 'POLICHRONIC', 'ARTEFACTS', 'VALUES', 'BEHAVIOURS', 'PROXEMICS', 'GLOBAL', 'RELATIONS', 'TASKS', 'ORIENTATION', 'TABOO', 'ADAPTATION', 'ATTITUDE', 'BELIEFS'];
  var gridSize = 8;
  
  
  
  
  var randohm = function (max) {
    var newRandom = Math.floor((Math.random() * (max * 5)) % max);
    console.log(newRandom);
  }
  
  
  
  
  var grid = [];
  
  for (var i = 0; i < gridSize; i++) {
    var row = [];
    for (var j = 0; j < gridSize; j++) {
      row.push('');
    }
    grid.push(row);
  }
  
  console.log('Empty grid', grid);
  
  //_.each(words, function (word) {
    var word = 'CULTURE';
    console.log('Trying to insert Word', word);
    
    function inject(word, index, directions, where, x, y) {
      if (index == word.length) {
        // Word inserted
        console.log('Word inserted');
        return;
      }
      
      if (where == directions.length) {
      }
      
      if (grid[x][y] == '') {
        grid[x][y] = word[index];
        
        if (directions[where] == 'right' && x != gridSize - 1 ||
            directions[where] == 'left' && x != 0 ||
            directions[where] == 'bottom' && y != gridSize - 1 ||
            directions[where] == 'top' && y != 0) {
          
          // I can continue on this direction
        
        } else {
          // Change direction
          console.log('Change direction');
          where += 1;
        }
          
        if (directions[where] == 'right') {
          inject(word, index + 1, directions, where, x + 1, y);
        }
        if (directions[where] == 'left') {
          inject(word, index + 1, directions, where, x - 1, y);
        }
        if (directions[where] == 'bottom') {
          inject(word, index + 1, directions, where, x, y + 1);
        }
        if (directions[where] == 'top') {
          inject(word, index + 1, directions, where, x, y - 1);
        }
        
      } else {
        // Reset directions
        console.log('Reset directions');
        inject(word, index + 1, directions, 0, x, y);
      }
    }
    
    inject(word, 0, ['top','left','right','bottom'], 0, 3, 4);
    
  //});
  
  var gridsystem = '';
  for (var i = 0; i < gridSize; i++) {
    for (var j = 0; j < gridSize; j++) {
      gridsystem += grid[i][j] + ',';
    }
    gridsystem += '\n';
  }
  console.log('gridsystem', gridsystem);
  
});
