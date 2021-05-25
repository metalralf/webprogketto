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
                app.newGame();
            });
        }
    
        if(restartBtn){
            restartBtn.addEventListener('click', function() {
                app.restartGame();
            });
        }
    
        if(pauseBtn){
            pauseBtn.addEventListener('click', function() {
                app.pauseGame();
            });
        }
    
        if(continueBtn){
            continueBtn.addEventListener('click', function() {
                app.continueGame();
            });
        }
    
        if(leaderboardBtn){
            leaderboardBtn.addEventListener('click', function() {
                app.leaderboard();
            });
        }
        
        if(editorBtn){
            editorBtn.addEventListener('click', function() {
                app.destroy();

                import('./app/Editor.js').then(function(editorClass){
                    app = new editorClass.default();
                });
            });
        }
    });

});
