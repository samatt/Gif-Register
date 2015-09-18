import processing.serial.*;

Serial myPort;  // Create object from Serial class
int val;      // Data received from the serial port

import processing.video.*;
Capture gif;
import processing.net.*;

Client c;
String data;

int countdowntimer = 5;
int globalframecount = 0;
int capnum = 0;
PImage a1;
PImage a2;
PImage a3;
PImage a4;
PImage a5;

PFont f;

void setup() {
  size(655, 505  );
  
  f = loadFont("Futura-CondensedExtraBold-180.vlw");
  textFont(f);

  String portName = Serial.list()[11];
myPort = new Serial(this, portName, 9600);
//String[] ports = Serial.list();

//for (int i=0 ;i<ports.length; i++){
//println(ports[i]);
//println(i);
//}
//  frameRate(25);
println(portName);
  String[] cameras = Capture.list();

  if (cameras.length == 0) {
    //println("There are no cameras available for capture.");
    exit();
  } else {
    //println("Available cameras:");
    for (int i = 0; i < cameras.length; i++) {
      //println(cameras[i]);
    }

    // The camera can be initialized directly using an 
    // element from the array returned by list():
    gif = new Capture(this, cameras[0]);
    gif.start();
  }

}


void draw() {
  //Serial
  //println(myPort);
   if (c != null && (c.available() > 0)) { // If there's incoming data from the client...
    data = c.readString(); // ...then grab it and print it
    println(data);
  }
  if ( myPort.available() > 0) {  // If data is available,
    val = myPort.read();         // read it and store it in val
    
  }

  //cam
  if (gif.available() == true) {
    gif.read();
  }
  //image(gif, 0, 0);
  // The following does the same, and is faster when just drawing the image
  // without any additional resizing, transformations, or tint.
  set(0, 0, gif);

  //fill(255);
  //    text ("GIF", width/2-125, height/2-25);
  //    text ("Register", width/2-300, height/2+125);

  //Start counter
  if (val == 1) {
    globalframecount = 1;
  } 
  //else {                       // If the serial value is not 0,
  //  fill(204);                 // set fill to light gray
  //}

  if (globalframecount == 25) {
    countdowntimer = 4;
  }
  if (globalframecount == 50) {
    countdowntimer = 3;
  }
  if (globalframecount == 75) {
    countdowntimer = 2;
  }
  if (globalframecount == 100) {
    countdowntimer = 1;
  }
  //if (globalframecount == 125) {
  //  countdowntimer = 0;
  //}
  
  if ((globalframecount < 125) & (globalframecount >0)) {
    image (gif, 0, 0);
    globalframecount++;
    textFont(f, 180);
      fill(255);
      text (str(countdowntimer), width/2, height/2);
  }


  if ((globalframecount >= 124) & (globalframecount <= 400)) {
    image (gif, 0, 0);
    
    if (globalframecount == 124) {
      background(255);
    }
    if (globalframecount == 125) {
      saveFrame(capnum+".png");
      a1 = loadImage(capnum+".png");
      capnum++;
    }
    
    if (globalframecount == 149) {
      background(255);
    }
    if (globalframecount == 150) {
      saveFrame(capnum+".png");
      a2 = loadImage(capnum+".png");
      capnum++;
    }
    
    if (globalframecount == 174) {
      background(255);
    }
    if (globalframecount == 175) {
      saveFrame(capnum+".png");
      a3 = loadImage(capnum+".png");
      capnum++;
    }
    
    if (globalframecount == 199) {
      background(255);
    }
    if (globalframecount == 200) {
      saveFrame(capnum+".png");
      a4 = loadImage(capnum+".png");
      capnum++;
    }
    
    if (globalframecount == 224) {
      background(255);
    }
    if (globalframecount == 225) {
      saveFrame(capnum+".png");
      a5 = loadImage(capnum+".png");
      capnum++;
    }

    if ((globalframecount >= 226) & (globalframecount < 399)) {
      textFont(f, 180);
      fill(255);
      text ("YAY!", width/2-205, height/2+50);
      //globalframecount = -1;
      capnum = 0;

    }
    if(globalframecount >300){
      globalframecount =-1;
      val =0;
      pingServer();
    }
//globalframecount = -1;

    //delay(50);
    globalframecount++;
    countdowntimer = 5;
  }
  println(globalframecount);
  
}

void pingServer(){
  c = new Client(this, "localhost", 3000); // Connect to server on port 80
  c.write("GET /capture HTTP/1.0\r\n"); // Use the HTTP "GET" command to ask for a Web page
  c.write("\r\n");
}