class Person {
    nose;
    leftEye;
    rightEye;
    leftEar;
    rightEar;
    leftShoulder;
    rightShoulder;
    leftElbow;
    rightElbow;
    leftWrist;
    rightWrist;
    leftHip;
    rightHip;
    leftKnee;
    rightKnee;
    leftAnkle;
    rightAnkle;

    constructor(array) {
        if(array){
            for(let i = 0; i < array.length; i++) {
                let name = this.points[i];
                let points = array[i]
                
                this[name] = createVector(points[0], points[1]);
            }
        }
    }

    toArray() {
        return this.points.map((point) => {
            return point.toArray();
        })
    }

    draw(color) {
        var headSize = Math.abs(this.leftEar.x - this.rightEar.x);
        push()
        noFill();
        stroke(color || 255);
        circle(this.nose.x, this.nose.y, headSize);
        // right arm
        line(this.rightWrist.x, this.rightWrist.y, this.rightElbow.x, this.rightElbow.y);
        line(this.rightShoulder.x, this.rightShoulder.y, this.rightElbow.x, this.rightElbow.y);

        // left arm
        line(this.leftWrist.x, this.leftWrist.y, this.leftElbow.x, this.leftElbow.y);
        line(this.leftShoulder.x, this.leftShoulder.y, this.leftElbow.x, this.leftElbow.y);


        line(this.rightShoulder.x, this.rightShoulder.y, this.leftShoulder.x, this.leftShoulder.y);
        
        line(this.rightShoulder.x, this.rightShoulder.y, this.rightHip.x, this.rightHip.y);
        line(this.leftShoulder.x, this.leftShoulder.y, this.leftHip.x, this.leftHip.y);

        line(this.rightHip.x, this.rightHip.y, this.rightKnee.x, this.rightKnee.y)
        
        this.drawLineBetweenVector(this.leftHip, this.leftKnee)

        pop()
    }

    drawLineBetweenVector(v1,v2) {
        line(v1.x,v1.y,v2.x,v2.y);
    }

    points = [
        "nose",
        "leftEye",
        "rightEye",
        "leftEar",
        "rightEar",
        "leftShoulder",
        "rightShoulder",
        "leftElbow",
        "rightElbow",
        "leftWrist",
        "rightWrist",
        "leftHip",
        "rightHip",
        "leftKnee",
        "rightKnee",
        "leftAnkle",
        "rightAnkle",
    ]
}

// https://github.com/tensorflow/tfjs-models/tree/master/posenet
class PeopleFinder {
    socket
    height;
    width;

    lastUpdatedAt;
    lastPeople = [];
    currentPeople = [];
    timeBetweenUpdates = [];

    callback;

    constructor(socket, height, width) 
    {
        this.height = height || window.height || 400;
        this.width = width || window.width || 400;
        this.socket = socket;

        this.lastUpdatedAt = Date.now()
        this.registerListeners();
    }

    registerListeners() {
        this.socket.on('data', (data) => {
            if(data.poses) {
                var people = data.poses
                    .map(this.fixPoseData)
                    .map((array) => new Person(array))
                    .sort((a,b) => a.nose.x - b.nose.x)

                if(this.callback) {
                    this.callback(people);
                }

                if(this.timeBetweenUpdates.length > 5) {
                    this.timeBetweenUpdates.pop();
                }
                this.timeBetweenUpdates.unshift(Date.now() - this.lastUpdatedAt);
                this.lastUpdatedAt = Date.now();
                this.lastPeople = this.currentPeople;
                this.currentPeople = people;
            }
        })

    }

    onNewPoses(callback) {
        this.callback = callback;
    }

    deltaPeople() {
        var normalUpdateTime = this.timeBetweenUpdates.reduce((prev,curr) => prev+curr,0) / this.timeBetweenUpdates.length;
        var timePassed = Date.now() - this.lastUpdatedAt;
        return this.currentPeople.map((person, index) => {
            let previousPerson = this.lastPeople[index];
            if(!previousPerson) {
                return person;
            }

            var deltaPerson = new Person();
            
            deltaPerson.points.forEach((key) => {
                // console.log("prevPerson", previousPerson, key, deltaPerson);
                deltaPerson[key] = createVector(
                    map(timePassed, 0, normalUpdateTime, previousPerson[key].x, person[key].x),
                    map(timePassed, 0, normalUpdateTime, previousPerson[key].y, person[key].y)
                    )
            })

            return deltaPerson;
        })

    }

    fixPoseData(arr) {
        // console.log(arr)
        return arr.map(pos => [
            pos[0] * width,
            pos[1] * height
        ])
    }
}