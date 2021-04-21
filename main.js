document.addEventListener('DOMContentLoaded', function() {
    let app;

    const btns = document.getElementsByTagName('button');
    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener('click', function(evt) {
            destroyApp(app);

            import('./app/' + btns[i].getAttribute('data-module') + '.js').then(function(appClass) {
                app = new appClass.default(getParameters(appClass.default));
            });
        });

        btns[i].addEventListener('focus', function(evt) {
            this.blur();
        });
    }
});

function destroyApp(app) {
    if (app) {
        app.destroy();
    }
}

function getParameters(appType){
    const defaultParameters = {
        target: "app",
        statBar: "stats"
    }

    console.log(appType);

    switch (appType.name){
        case 'GuessingGame':
            defaultParameters.min = 100;
            defaultParameters.max = 200;
            break;
    }

    return defaultParameters;
}
