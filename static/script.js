function drawSelectedRegion() {
    ctx.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);
    // render the selected region on the overlay canvas
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    overlayCtx.strokeStyle = 'red';
    overlayCtx.lineWidth = 2;
    overlayCtx.strokeRect(startX, startY, endX - startX, endY - startY);
    // Draw the overlay canvas on top of the video canvas
    ctx.drawImage(overlayCanvas, 0, 0);
}

document.addEventListener('DOMContentLoaded', function () {
    let videoFileInput = document.getElementById('videoFile');
    let videoCanvas = document.getElementById('videoCanvas');
    let ctx = videoCanvas.getContext('2d');
    let overlayCanvas = document.createElement('canvas'); // Create a new canvas for the overlay
    let overlayCtx = overlayCanvas.getContext('2d');
    let isDragging = false;
    let startX, startY, endX, endY;

    videoFileInput.addEventListener('change', function () {
        let videoFile = videoFileInput.files[0];
        let video = document.createElement('video');
        video.setAttribute('controls', 'true');
        let videoURL = URL.createObjectURL(videoFile);
        video.src = videoURL;

        video.play();

        document.body.appendChild(video);

        video.addEventListener('loadeddata', function () {
            videoCanvas.width = video.videoWidth;
            videoCanvas.height = video.videoHeight;
            overlayCanvas.width = video.videoWidth;
            overlayCanvas.height = video.videoHeight;

            video.addEventListener('playing', function () {
                function render() {

                    ctx.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);

                    ctx.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);
                    // Perform cropping or other actions here based on startX, startY, endX, endY
                    console.log('Selected region:', startX, startY, endX, endY);
                    // render the selected region on the overlay canvas
                    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
                    overlayCtx.strokeStyle = 'red';
                    overlayCtx.lineWidth = 2;
                    overlayCtx.strokeRect(startX, startY, endX - startX, endY - startY);
                    // Draw the overlay canvas on top of the video canvas
                    ctx.drawImage(overlayCanvas, 0, 0);

                    requestAnimationFrame(render);

                }

                render();
            });

            videoCanvas.addEventListener('mousedown', function (e) {
                isDragging = true;
                startX = e.clientX - videoCanvas.getBoundingClientRect().left;
                startY = e.clientY - videoCanvas.getBoundingClientRect().top;
            });

            videoCanvas.addEventListener('mousemove', function (e) {
                if (isDragging) {
                    endX = e.clientX - videoCanvas.getBoundingClientRect().left;
                    endY = e.clientY - videoCanvas.getBoundingClientRect().top;

                    drawSelectedRegion();
                }
            });

            videoCanvas.addEventListener('mouseup', function () {
                isDragging = false;
                
                // add coordinates to form
                let coordinates = document.getElementById('coordinates');
                coordinates.value = startX + ',' + startY + ',' + endX + ',' + endY;
                console.log(coordinates.value);

                drawSelectedRegion();
            });
        });
    });
});
