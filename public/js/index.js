const dropZone = document.querySelector(".drop-zone");
const browsebtn = document.querySelector(".browsebtn");
const fileinput = document.querySelector("#fileinput");

const bgProgress = document.querySelector(".bg-progress");
const progressPercent = document.querySelector("#progressPercent");
const progressContainer = document.querySelector(".progress-container");
const progressBar = document.querySelector(".progress-bar");
const status = document.querySelector(".status");

const sharingContainer = document.querySelector(".sharing-container");
const copyURLBtn = document.querySelector("#copyURLBtn");
const fileURL = document.querySelector("#fileURL");
const emailForm = document.querySelector("#emailForm");
const sendbtn = document.querySelector(".send-btn-container");
const toast = document.querySelector(".toast");
const btns = document.querySelector(".btns");

const host = 'https://inshare-easyfileshare.herokuapp.com';
const uploadURL = `${host}/api/files`;
const emailURL = `${host}/api/files/send`;
const maxAllowedSize = 100 * 1024 * 1024; //100mb



//-------------------dropZone---------------------------

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!dropZone.classList.contains('dragged')) {
        dropZone.classList.add('dragged')
    }
})

dropZone.addEventListener("dragleave", (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragged')

})


dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length === 1) {
        if (files[0].size < maxAllowedSize) {
            fileinput.files = files;
            uploadFile();
        } else {
            showToast("Max file size is 100MB");
        }
    } else if (files.length > 1) {
        showToast("You can't upload multiple files");
    }


    dropZone.classList.remove('dragged');

});

fileinput.addEventListener("change", (e) => {
    e.preventDefault();
    if (fileinput.files[0].size > maxAllowedSize) {
        showToast("Max file size is 100MB");
        fileinput.value = ""; // reset the input
        return;
    }
    uploadFile();
})

browsebtn.addEventListener("click", (e) => {
    e.preventDefault();
    fileinput.click()
});




//-------------------upload & progress---------------------------

const uploadFile = () => {
    const file = fileinput.files[0];
    const formData = new FormData()
    formData.append("myfile", file)
    progressContainer.style.display = "block";
    const xhr = new XMLHttpRequest();
    // listen for upload progress
    xhr.upload.onprogress = function (event) {
        // find the percentage of uploaded
        let percent = Math.round((100 * event.loaded) / event.total);
        progressPercent.innerText = percent;
        const scaleX = `scaleX(${percent / 100})`;
        bgProgress.style.transform = scaleX;
        progressBar.style.transform = scaleX;
    };

    // handle error
    xhr.upload.onerror = function () {
        showToast(`Error in upload: ${xhr.status}.`);
        fileinput.value = ""; // reset the input
    };

    // listen for response which will give the link
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            onFileUploadSuccess(xhr.responseText);
        }
    };

    xhr.open("POST", uploadURL);
    xhr.send(formData)

}

const onFileUploadSuccess = (res) => {
    fileinput.value = ""; // reset the input
    status.innerText = "Uploaded";
  
    // remove the disabled attribute from form btn & make text send
    btns.disabled=false;
    btns.innerText = "Send";
    progressContainer.style.display = "none"; // hide the box

    const { file: url } = JSON.parse(res);
    console.log(url);
    sharingContainer.style.display = "block";
    fileURL.value = url;

}



let toastTimer;
// the toast function
const showToast = (msg) => {
  clearTimeout(toastTimer);
  toast.style.display = "block"
  toast.innerText = msg;
  toast.classList.add("show");
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
    toast.style.display = "none"
  }, 2000);
  
};

// sharing container listenrs
copyURLBtn.addEventListener("click", () => {
    fileURL.select();
    document.execCommand("copy");
    showToast("Copied to clipboard");
});

fileURL.addEventListener("click", () => {
    fileURL.select();
});




emailForm.addEventListener("submit", async(e) => {
    e.preventDefault(); // stop submission
  
    // disable the button
    emailForm[2].setAttribute("disabled", "true");
    emailForm[2].innerText = "Sending";
  
    const url = fileURL.value;
    
  
    const formData = {
      "uuid": url.split("/").splice(-1, 1)[0],
      
      "emailFrom": emailForm.elements["from-email"].value,
      "emailTo": emailForm.elements["to-email"].value
    };
    // console.log(formData);
    await fetch(emailURL, {
      method: "POST",
     headers:{
          "Content-type": "application/json",
	       //"accept": "application/json"
     },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showToast("Email Sent");
          sharingContainer.style.display = "none"; // hide the box
        }
      });
  });
  


