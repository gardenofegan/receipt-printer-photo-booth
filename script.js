(() => {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.
  
    const width = 320; // We will scale the photo width to this
    let height = 0; // This will be computed based on the input stream
  
    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.
  
    let streaming = false;
  
    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.
  
    let video = null;
    let canvas = null;
    let photo = null;
    let startButton = null;
    let photo1 = null;
    let photo2 = null;
    let photo3 = null;
    let printButton = null;
    let photoCount = 0;
  
    function showViewLiveResultButton() {
      if (window.self !== window.top) {
        // Ensure that if our document is in a frame, we get the user
        // to first open it in its own tab or window. Otherwise, it
        // won't be able to request permission for camera access.
        document.querySelector(".content-area").remove();
        const button = document.createElement("button");
        button.textContent = "View live result of the example code above";
        document.body.append(button);
        button.addEventListener("click", () => window.open(location.href));
        return true;
      }
      return false;
    }
  
    function startup() {
      if (showViewLiveResultButton()) {
        return;
      }
      video = document.getElementById("video");
      canvas = document.getElementById("canvas");
      photo = document.getElementById("photo");
      startButton = document.getElementById("start-button");
      photo1 = document.getElementById("photo1");
      photo2 = document.getElementById("photo2");
      photo3 = document.getElementById("photo3");
      printButton = document.getElementById("print-button");
  
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.error(`An error occurred: ${err}`);
        });
  
      video.addEventListener(
        "canplay",
        (ev) => {
          if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);
  
            // Firefox currently has a bug where the height can't be read from
            // the video, so we will make assumptions if this happens.
  
            if (isNaN(height)) {
              height = width / (4 / 3);
            }
  
            video.setAttribute("width", width);
            video.setAttribute("height", height);
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);
            streaming = true;
          }
        },
        false,
      );
  
      startButton.addEventListener(
        "click",
        (ev) => {
          takePicture();
          ev.preventDefault();
        },
        false,
      );
  
      printButton.addEventListener(
        "click",
        (ev) => {
          printPhotoStrip();
          ev.preventDefault();
        },
        false,
      );
  
      clearPhotos();
    }
  
    // Fill the photo with an indication that none has been
    // captured.
  
    function clearPhotos() {
      const context = canvas.getContext("2d");
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);
  
      const data = canvas.toDataURL("image/png");
      photo1.setAttribute("src", data);
      photo2.setAttribute("src", data);
      photo3.setAttribute("src", data);
    }
  
    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.
  
    function takePicture() {
      const context = canvas.getContext("2d");
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
  
        const data = canvas.toDataURL("image/png");
        if (photoCount === 0) {
          photo1.setAttribute("src", data);
          photoCount++;
        } else if (photoCount === 1) {
          photo2.setAttribute("src", data);
          photoCount++;
        } else if (photoCount === 2) {
          photo3.setAttribute("src", data);
          video.pause();
          printButton.style.display = "block";
        }
      } else {
        clearPhotos();
      }
    }
  
    function printPhotoStrip() {
      // Implement the logic to print the photo strip
      console.log("Printing photo strip...");
    }
  
    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener("load", startup, false);
  })();
  