document.addEventListener('DOMContentLoaded', function() {
    let app;

    const newGameBtn = document.getElementById('newGameBtn');
    const leaderboardBtn = document.getElementById('leaderboardBtn');
    const restartBtn = document.getElementById('restartBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const continueBtn = document.getElementById('continueBtn');
    const editorBtn = document.getElementById('editorBtn');
    
    import('./app/PlayTetris.js').then(function(appClass) {
        app = new appClass.default();

        if(newGameBtn){
            newGameBtn.addEventListener('click', function() {
                if(app.appName !== 'Game'){
                    app.destroy();

                    import('./app/PlayTetris.js').then(function(gameClass){
                        app = new gameClass.default();

                        app.newGame();
                    });
                }else{
                    app.newGame();
                }
            });
        }
    
        if(restartBtn){
            restartBtn.addEventListener('click', function() {
                if(app.appName === 'Game'){
                    app.restartGame();
                }
            });
        }
    
        if(pauseBtn){
            pauseBtn.addEventListener('click', function() {
                if(app.appName === 'Game'){
                    app.pauseGame();
                }
            });
        }
    
        if(continueBtn){
            continueBtn.addEventListener('click', function() {
                if(app.appName === 'Game'){
                    app.continueGame();
                }
            });
        }
    
        if(leaderboardBtn){
            leaderboardBtn.addEventListener('click', function() {
                if(app.appName !== 'Leaderboard'){
                    app.destroy();

                    import('./app/LeaderBoard.js').then(function(leaderBoardClass){
                        app = new leaderBoardClass.default();
                    });
                }
            });
        }
        
        if(editorBtn){
            editorBtn.addEventListener('click', function() {
                
                if(app.appName !== 'Editor'){
                    app.destroy();

                    import('./app/Editor.js').then(function(editorClass){
                        app = new editorClass.default();
                    });
                }
            });
        }
    });

});
