let socket;

var personFinder

function setup() {
    createCanvas(600, 600)
    socket = io.connect("http://localhost:3000");

    personFinder = new PeopleFinder(socket);
}

function draw() {
    background(20)

    personFinder.deltaPeople().forEach(person => {
        r = random(255);
        g = random(100,255);
        b = random(255);
        person.draw(color(r,g,b))
    })
}