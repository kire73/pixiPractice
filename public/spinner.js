
let titleScreen = document.getElementById('titleScreen');

let type = "WebGL",
        assSet = [
        "/assets/images/wheel-center.png",
        "/assets/images/pointer.png",
        "/assets/images/white-slice-5000.png",
        "/assets/images/red-slice-200.png",
        "/assets/images/yellow-slice-400.png",
        "/assets/images/green-slice-2000.png",
        "/assets/images/blue-slice-1000.png",
        "/assets/images/glow.png",
        "/assets/images/sunburst.png",
        "/assets/images/background.png",
        "/assets/images/coin-anim.json",
    ];

    if(!PIXI.utils.isWebGLSupported()){
      type = "canvas"
    }
    

    let Application = PIXI.Application,
        loader = PIXI.loader,
        resources = PIXI.loader.resources,
        Sprite = PIXI.Sprite,
        Text = PIXI.Text,
        TextStyle = PIXI.TextStyle;

    let app = new Application({ 
        width: 256, 
        height: 256,                       
        antialias: true, 
        transparent: false, 
        resolution: 1
    });

    let panel = { 
        size: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        center: {
            width: window.innerWidth / 2,
            height: window.innerHeight / 2
        }
    }
    let spinSpeed = 0;
    let state = "stopped";

    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.autoResize = true;
    app.renderer.resize(window.innerWidth, window.innerHeight);

    document.body.appendChild(app.view);

    loader
    .add(assSet)
    .load(boardSetup);

    let clicking = new Howl({
        src: ["/assets/sounds/wheel-click.wav"],
        loop: true
    });
    let fulllStop = new Howl({
        src: ["/assets/sounds/wheel-landing.wav"]
    });
    let credits = new Howl({
        src: ["/assets/sounds/credits-rollup.wav"],
        volume: 0.6
    });
    let explode = new Howl({
        src: ["/assets/sounds/explosion.wav"]
    });

    let background, score, celebrate, sunburst, glow, wheel, slices, pointer, coinimate, coin1, coin2, coin3, coin4, coin5, coin6, sliceValues, sliceNames, forTheWin, ranDisplace;

    let scoreStyle = new TextStyle({
        fontFamily: "Arial",
        fontSize: 42,
        fill: "white",
        stroke: '#20b2aa',
        strokeThickness: 3,
        dropShadow: true,
        dropShadowColor: "#000000",
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
    });

    const playGame = () => {
        if (titleScreen.className === ""){
            titleScreen.className = "inPlay";
            loader.load(spriteSetup);
            celebrate.text = "";
            window.addEventListener('mouseup', spinSequence);
        } else console.log('Wait for it...');
    }

    function boardSetup() {
        
        score = new Text("", scoreStyle);
        celebrate = new Text("", scoreStyle);
        centerAnchor(celebrate);
        celebrate.position.set(panel.center.width, panel.size.height / 18);

        background = new Sprite(
            resources["/assets/images/background.png"].texture
        );

        background.width = panel.size.width;
        background.height = panel.size.height;
        score.width = app.screen.width * 0.18;
        score.height = app.screen.height * 0.1;
        celebrate.height = app.screen.height * 0.1;
        celebrate.width = app.screen.width * 0.34;
        //score.scale.set(1);
        scoreLmargin = app.screen.width * 0.003;
        scoreTmargin = app.screen.height * 0.0005;

        score.position.set(scoreLmargin, scoreTmargin);
        score.text = "Credits: 0000";

        app.stage.addChild(background);
        app.stage.addChild(score);
        app.stage.addChild(celebrate);

    }

    function spriteSetup() {
        sunburst = new Sprite(
            resources["/assets/images/sunburst.png"].texture
        );
        glow = new Sprite(
            resources["/assets/images/glow.png"].texture
        );
        wheel = new Sprite(
            resources["/assets/images/wheel-center.png"].texture
        );
        whiteSlice = new Sprite(
            resources["/assets/images/white-slice-5000.png"].texture
        );
        redSlice = new Sprite(
            resources["/assets/images/red-slice-200.png"].texture
        );
        yellowSlice = new Sprite(
            resources["/assets/images/yellow-slice-400.png"].texture
        );
        blueSlice = new Sprite(
            resources["/assets/images/blue-slice-1000.png"].texture
        );
        greenSlice = new Sprite(
            resources["/assets/images/green-slice-2000.png"].texture
        );
        redSlice2 = new Sprite(
            resources["/assets/images/red-slice-200.png"].texture
        );
        yellowSlice2 = new Sprite(
            resources["/assets/images/yellow-slice-400.png"].texture
        );
        blueSlice2 = new Sprite(
            resources["/assets/images/blue-slice-1000.png"].texture
        );
        pointer = new Sprite(
            resources["/assets/images/pointer.png"].texture
        );

        slices = [whiteSlice, redSlice, blueSlice, yellowSlice, greenSlice, redSlice2, blueSlice2, yellowSlice2];
        sliceNames = ["white", "red", "blue", "yellow", "green", "red2", "blue2", "yellow2"];
        sliceValues = [5000, 200, 1000, 400, 2000, 200, 1000, 400];

        coinimate = resources["/assets/images/coin-anim.json"].textures;

        wheel.width = panel.size.height / 6;
        wheel.height = wheel.width;
        pointer.width = wheel.width / 3;
        pointer.height = pointer.width * 0.8701;

        centerAnchor(wheel);
        centerAnchor(pointer);

        wheel.position.set(panel.center.width, panel.center.height);
        pointer.position.set(panel.center.width, panel.size.height / 8);

        initSlices(slices);
        
        app.stage.addChild(wheel);
        app.stage.addChild(pointer);
        app.ticker.add(delta => loopy(delta));
    }

    const loopy = (delt) => {
        if (state === "play"){
            slices.forEach((slice) => {
                slice.rotation += spinSpeed;
            });
            slowRoll();
        }
    };

    const spinSequence = () => {
        state = "play";
        forTheWin = probablyWon();
        console.log('Looking for ' + forTheWin);
        // Slice Vary:: + || - .39
        ranDisplace = randomInt(1, 39) / 100;
        spinSpeed = 0.4;
        window.removeEventListener('mouseup', spinSequence);
        clicking.play();
        clicking.rate(3.0);
    };

    const slowRoll = () => {
        let clickSpeed = spinSpeed + 0.7;
        // Full Rotation:: Math.PI * 2

        if (spinSpeed > 0.3){
            spinSpeed -= 0.001;
            clicking.rate(clickSpeed);
        } else if (spinSpeed > 0.1){
            spinSpeed -= 0.0015;
            clicking.rate(clickSpeed);
        } else if (spinSpeed > 0.05){
            spinSpeed -= 0.001;
            clicking.rate(clickSpeed);
        } else if (spinSpeed > 0.01){
            spinSpeed -= 0.0001;
            clicking.rate(clickSpeed);
        } else if (spinSpeed > 0.008){
            spinSpeed -= 0.0000125;
            clicking.rate(clickSpeed);
        } else if (spinSpeed > 0){

            let whosOnFirst =  sliceNames[checkTop()];
            if (forTheWin === whosOnFirst){
                let varyDistance = Math.floor(checkTop(sliceNames.indexOf(whosOnFirst)));
                if ( varyDistance == ranDisplace * 100){
                    spinSpeed = 0;
                }
            }
            clicking.rate(clickSpeed);


        } else if (spinSpeed <= 0){
            winSequence();
            clicking.stop();
            fulllStop.play();
        }
    }

    const probablyWon = () => {
        let winningNumber = randomInt(1, 354);

        if (winningNumber > 350){
            return 'white';
        } else if (winningNumber > 340){
            return 'green';
        } else if (winningNumber > 320){
            return 'blue';
        } else if (winningNumber > 300){
            return 'blue2';
        } else if (winningNumber > 250){
            return 'yellow';
        } else if (winningNumber > 200){
            return 'yellow2';
        } else if (winningNumber > 100){
            return 'red';
        } else if (100 >= winningNumber){
            return 'red2';
        }
    }

    const winSequence = () => {
        let wIndex = checkTop();
        let incScore = 0;
        let scoreMod;
        
        let scoreUp = setInterval(() => {
            credits.play();

            if (incScore < 10){
                scoreMod = "000";
            } else if (incScore < 100){
                scoreMod = "00";
            } else if (incScore < 1000){
                scoreMod = "0";
            } else if (incScore >= 1000){
                scoreMod = "";
            }
            score.text = `Score: ${scoreMod}${incScore++}`;
            if (incScore === sliceValues[wIndex] + 1){
                clearInterval(scoreUp);
                celebrate.text = `YOU WON ${scoreMod}${incScore - 1} CREDITS!`
                explode.play();
                titleScreen.className = "";
            }
        }, 10);
        
        state = "stopped";

    };

    const checkTop = (dist) => {
        let wins = [];
        for (let i in slices){
            let rotated = slices[i].angle,
                fullRotate = Math.floor(rotated / 360),
                nextStop = 360 - (rotated % 360),
                lastStop = Math.abs(360 - nextStop),
                closestPoint = Math.min(nextStop, lastStop);
            wins.push(closestPoint);
        }
        let wIndex = wins.indexOf(Math.min(...wins));
        
        let winningSlice = slices[wIndex];
        let wiName = sliceNames[wIndex];
        //console.log("WINNER: " + wiName, "distance: " + wins[wIndex]);
        if (dist) {
            return wins[dist];
        } else return wIndex;
    }

    const forceStop = () => {
        spinSpeed = 0;
    };

    const centerAnchor = (anchorIt) => {
        anchorIt.anchor.x = 0.5;
        anchorIt.anchor.y = 0.5;
    }

    const initSlices = (slices) => {
        for (let i = 0; i < slices.length; i++){
            let slice = slices[i];

            slice.anchor.x = 0.5;
            slice.anchor.y = 1;

            slice.height = wheel.height * 2.3;
            slice.width = slice.height * 0.77083;

            slice.position.set(panel.center.width, panel.center.height);
            slice.rotation = (1 + i) * 0.785;
            app.stage.addChild(slice);
        }
    }

    const randomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    function pushSlices(pushAmount) {
        slices.forEach((slice) => {
            slice.rotation += pushAmount;
        });
    }

    document.addEventListener('keyup', (event) => {
        if (event.code === "Space") forceStop();
    });

