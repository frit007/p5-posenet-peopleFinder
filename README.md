# p5-posenet-peopleFinder

## Depends on
To make it easy to use, the library assumes p5 is available.
- socket.io
- p5
- posenet (recommended runway install https://runwayml.com/)

# Usage
```
// connect to the runway port
socket = io.connect("http://localhost:3000");
personFinder = new PeopleFinder(socket);

// p5 draw
function draw() {
  // deltaPeople is a delta between the 2 last position(this makes the posenet updates delayed)
  // if you want the latest results you can access presonFinder.currentPeople
  personFinder.deltaPeople().forEach(person => {
    // draw a person (for debugging)
    person.draw();
    
    // draw a head around the nose
    circle(person.nose.x, person.nose.y, 100);
  })
}
```
## Person Points
Every point it p5.vector (https://p5js.org/reference/#/p5.Vector)

Peron points taken from https://github.com/tensorflow/tfjs-models/blob/master/posenet/README.md

| Part |
| -- |
| nose |
| leftEye |
| rightEye |
| leftEar |
| rightEar |
| leftShoulder |
| rightShoulder |
| leftElbow |
| rightElbow |
| leftWrist |
| rightWrist |
| leftHip |
| rightHip |
| leftKnee |
| rightKnee |
| leftAnkle |
| rightAnkle |

## Quirks
Since personfinder cannot tell which person is who, it sorts them based on their nose position.
