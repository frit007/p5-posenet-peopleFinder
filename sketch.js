let socket;

var personFinder

people = [];
function setup() {
    createCanvas(600, 600)
    socket = io.connect("http://localhost:3000");

    personFinder = new PeopleFinder(socket);

    personFinder.onNewPoses((newPeople) => {
        people = newPeople;
        
        // console.log("people", people)
    })
}

function draw() {
    background(20)
    // ellipse(300, 300, 100, 100)
    

    personFinder.deltaPeople().forEach(person => {
        // console.log(person.nose)
        // stroke('red')
        // person.rightWrist.draw();
        // person.leftWrist.draw()
        r = random(255); // r is a random number between 0 - 255
        g = random(100,255); // g is a random number betwen 100 - 200
        b = random(255); // b is a random number between 0 - 100
        person.draw(color(r,g,b))
    })
}