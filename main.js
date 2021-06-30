status = "";
objects = [];

function setup()
{
    canvas = createCanvas(500,350);
    canvas.center();

    video = createCapture(VIDEO);
    video.hide();
}

function modelLoaded()
{
    console.log("model loaded");
    status = true;
}

function start()
{
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "Status: Detecting Objects";
    object_name = document.getElementById("input1").value;
}

function gotResults(error, results)
{
    if(error)
    {
        console.log(error);
    }

    console.log(results);
    objects = results;
}

function draw()
{
    image(video, 0, 0, 600, 450);

    if(status != "")
    {
        objectDetector.detect(video, gotResults);
        for(i = 0; i < objects.length; i++)
        {
            document.getElementById("status").innerHTML = "Status: Objects Detected ";

            fill("lime");
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + "" + percent + "%" + objects[i].x + 15, objects[i].y + 15);
            noFill();
            stroke("lime");
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);

            if(objects[i].label == object_name)
            {
                video.stop();
                objectDetector.detect(gotResults);
                document.getElementById("status").innerHTML = object_name + " found";
                synth = window.speechSynthesis;
                utter_this = new SpeechSynthesisUtterance(object_name + "found");
                synth.speak(utter_this);
            }

            else
            {
                document.getElementById("status").innerHTML = object_name + " not found";
            }
        }
    }
}
