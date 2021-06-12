'use strict';

import Rails from "@rails/ujs";

// TODO: add form select for capturing device

let mediaRecorder;
let recordedBlobs;
let gumVideo;

const initRecorder = () => {

    const errorMsgElement = document.querySelector("span#errorMsg");
    const recordedVideo = document.querySelector("video#recorded");
    const videoSelect = document.querySelector("select#videoSource");
    const videoForm = document.querySelector("form#video-form");

    function gotDevices(deviceInfos) {
        const videoValue = videoSelect.value;
        while (videoSelect.firstChild) {
            videoSelect.remove(videoSelect.firstChild);
        }
        for (let i = 0; i < deviceInfos.length; ++i) {
            const deviceInfo = deviceInfos[i];
            const option = document.createElement("option");
            option.value = deviceInfo.deviceId;
            if (deviceInfo.kind === "videoinput") {
                option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
                videoSelect.appendChild(option);
            } else {
                console.log("Some other kind of source/device: ", deviceInfo);
            }
        }
        if (Array.prototype.slice.call(videoSelect.childNodes).some(n => n.value === videoValue)) {
            videoSelect.value = videoValue; 
        }
    }

    navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

    const recordButton = document.querySelector("button#record");
    recordButton.addEventListener('click', () => {
        if (recordButton.textContent === 'Start recording') {
            startRecording();
        } else {
            stopRecording();
            recordButton.textContent = 'Start recording';
            playButton.disabled = false;
            downloadButton.disabled = false;
            uploadButton.disabled = false;
        }
    });

    const playButton = document.querySelector("button#play");
    playButton.addEventListener('click', () => {
        const superBuffer = new Blob(recordedBlobs, { type: "video/webm" });
        recordedVideo.src = null;
        recordedVideo.srcObject = null;
        recordedVideo.src = window.URL.createObjectURL(superBuffer);
        recordedVideo.controls = true;
        recordedVideo.play();
    });

    const downloadButton = document.querySelector("button#download");
    downloadButton.addEventListener('click', () => {
        console.log("Recorded mimeType: ", mediaRecorder.mimeType);
        const mimeType = mediaRecorder.mimeType.split(';', 1)[0];
        const blob = new Blob(recordedBlobs, { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;

        // grab the extension from mimeType
        /*
        const idx = /\//g.exec(mimeType).index + 1;
        const fileName = 'CapturedVideo'.concat('.', mimeType.slice(idx));
        */
        const fileName = "CapturedVideo".concat('.', "webm");

        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    });

    const uploadButton = document.querySelector("button#upload");
    uploadButton.addEventListener('click', () => {
        const mimeType = mediaRecorder.mimeType.split(';', 1)[0];
        const blob = new Blob(recordedBlobs, { type: mimeType });
        uploadToServer(blob);
    });

    function handleDataAvailable(event) {
        console.log('handleDataAvailable', event);
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    }

    function startRecording() {
        recordedBlobs = [];
        
        try {
            mediaRecorder = new MediaRecorder(window.stream);
        } catch (e) {
            console.error("Exception while creating MediaRecorder: ", e);
            errorMsgElement.innerHTML = `Exception while creating MediaRecorder ${JSON.stringify(e)}`;
            return ;
        }

        console.log("Created MediaRecorder ", mediaRecorder);
        recordButton.textContent = 'Stop recording';
        playButton.disabled = true;
        downloadButton.disabled = true;
        uploadButton.disabled = true;
        mediaRecorder.onstop = (event) => {
            console.log("Recorder stopped: ", event);
            console.log("Recorded blobs: ", recordedBlobs);
        };
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start();
        console.log("MediaRecorder started", mediaRecorder);
    }

    function stopRecording() {
        mediaRecorder.stop();
    }

    function handleError(error) {
        console.log("navigator.MediaDevices.getUserMedia error: ", error.message, error.name);
    }

    function handleSuccess(stream) {
        recordButton.disabled = false;
        console.log('getUserMedia() got stream: ', stream);
        window.stream = stream;

        //const gumVideo = document.querySelector("video#gum");
        gumVideo = document.querySelector("video#gum");
        gumVideo.srcObject = stream;
    }

    function uploadToServer(videoData) {
        const formData = new FormData(videoForm);
        formData.append('video[file]', videoData, 'video.mp4');
        gumVideo.srcObject.getTracks().forEach(track => track.stop());
        Rails.ajax({
            url: "/videos",
            type: "post",
            data: formData
        })
    }

    async function startCamera(constraints) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            handleSuccess(stream);
        } catch (e) {
            console.error("navigator.getUserMedia error: ", e);
            errorMsgElement.innerHTML = `navigator.getUserMedia error: ${e.toString()}`;
        }
    }

    document.querySelector("button#start").addEventListener('click', async () => {
        if (window.stream) {
            window.stream.getTracks().forEach(track => {
                track.stop()
            });
        }
        document.querySelector("button#start").disabled = true;
        videoSelect.disabled = true;
        const videoSource = videoSelect.value;
        const constraints = {
            audio: true,
            video: {deviceId: videoSource ? {exact: videoSource} : undefined}
        };
        console.log("Using media constraints: ", constraints);
        await startCamera(constraints);
    });

    recordButton.disabled = true;
    playButton.disabled = true;
    downloadButton.disabled = true;
    uploadButton.disabled = true;
}

export { initRecorder };
