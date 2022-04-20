let messages = [];
let allTags = [];
let selectedTags = [];
let currentMessageIndex = 0;

(async function () {
    let urlMessages = "http://localhost:3000/public/json/messagesJson.json";
    let urlAllTags = "http://localhost:3000/public/json/tagsJsonData.json";
    let settings = { method: "Get" };

    //todo promise.all
    let [receivingMessages, receivingTags] = await Promise.all([fetch(urlMessages, settings), fetch(urlAllTags, settings)]);
    messages = await receivingMessages.json();
    allTags = await receivingTags.json();
    for (let i = 0; i < messages.length; i++) {
        selectedTags.push([]);
    }

    drawAllTags();
    drawMessage();
    drawSelectedTags();
})();

function drawAllTags() {
    let tagsContainer = document.getElementById("allTagsContainer");
    let selectedTagsContainer = document.getElementById("selectedTagsContainer");
    tagsContainer.innerHTML = "";

    allTags.forEach((originTagData) => {
        let originalTag = document.createElement("button");
        originalTag.innerHTML = originTagData.name;
        tagsContainer.appendChild(originalTag);
        originalTag.dataset.id = originTagData.id;

        originalTag.addEventListener("click", function click() {
            let selectedTag = this.cloneNode(true);
            this.style.display = "none";
            selectedTagsContainer.appendChild(selectedTag);
            selectedTags[currentMessageIndex].push(originTagData);

            selectedTag.addEventListener("click", function () {
                originalTag.style.display = "block";
                selectedTags[currentMessageIndex] = selectedTags[currentMessageIndex].filter(currentSelectedTags => currentSelectedTags.id !== originTagData.id);
                this.remove();
            });
        });
    })

    selectedTags[currentMessageIndex].forEach(selectedTag => {
        let originTagHtml = document.querySelectorAll(`[data-id='${selectedTag.id}']`);
        if (originTagHtml.length > 0)
            originTagHtml[0].style.display = "none";
    })
};

function drawMessage() {
    let messagesContainer = document.querySelector("#messagesContainer");
    let incomingMessage = document.createElement("span");

    incomingMessage.innerHTML = messages[currentMessageIndex].text;
    messagesContainer.appendChild(incomingMessage);
    incomingMessage.dataset.id = messages[currentMessageIndex].id;

    let next = document.querySelector("#next");
    next.disabled = messages.length === 1;

    next.onclick = function nextMessage() {
        currentMessageIndex++;
        if (currentMessageIndex === messages.length - 1) {
            next.disabled = true;
        }
        incomingMessage.dataset.id = messages[currentMessageIndex].id;
        incomingMessage.innerHTML = messages[currentMessageIndex].text;
        previous.disabled = false;
        drawSelectedTags();
        drawAllTags();
    };

    let previous = document.querySelector("#previous");
    previous.disabled = true;

    previous.onclick = function previousMessage() {
        currentMessageIndex--;
        if (currentMessageIndex === 0) {
            previous.disabled = true;
        }
        incomingMessage.dataset.id = messages[currentMessageIndex].id;
        incomingMessage.innerHTML = messages[currentMessageIndex].text;
        next.disabled = false;
        drawSelectedTags();
        drawAllTags();
    };
};

function drawSelectedTags() {
    let selectedTagsContainer = document.querySelector("#selectedTagsContainer");
    selectedTagsContainer.innerHTML = "";
    selectedTags[currentMessageIndex].forEach((selectedTagData) => {
        let selectedTag = document.createElement("button");
        selectedTag.innerHTML = selectedTagData.name;
        selectedTagsContainer.appendChild(selectedTag);

        selectedTag.addEventListener("click", function () {
            let originTagHtml = document.querySelectorAll(`[data-id='${selectedTagData.id}']`);
            if (originTagHtml.length > 0)
                originTagHtml[0].style.display = "block";
            selectedTags[currentMessageIndex] = selectedTags[currentMessageIndex].filter(currentSelectedTags => currentSelectedTags.id !== selectedTagData.id);
            this.remove();
        });
    });
}

function exportTags() {
    let reorganizedSelectedTags = null;
    reorganizedSelectedTags = selectedTags.map((tagsArray, messageIndex) => {
        return {
            "messageText": messages[messageIndex].text,
            "tags": tagsArray
        };
    })


    let dataStr = JSON.stringify(reorganizedSelectedTags, null, " ");
    let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    let exportFileDefaultName = 'selectedTags.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}