const showVdo = document.createElement("video");
const vdoGrid = document.getElementById("vdo-grid");

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    console.log(stream);
    addVideoStream(showVdo, stream);
  });

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  vdoGrid.append(video);
};
