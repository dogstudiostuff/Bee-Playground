const newKey = new URLSearchParams(location.hash.slice(1)).get('api_key');
if (newKey !== null) {
    key = newKey
}

async function getVideo() {
    const video = document.getElementById("result")
    video.style.backgroundColor = "#002ca7"
    video.src = ""
    const response = await fetch(
        `https://gen.pollinations.ai/image/${encodeURI(document.getElementById("prompt").value)}?model=veo&audio=true&aspectRatio=16:9&duration=8`,
        {
            headers: {
                Authorization: "Bearer " + key
            }
        }
    )

    const blob = await response.blob()
    video.style.backgroundColor = "#242424"
    return URL.createObjectURL(blob)
}

async function displayVideo() {
    const video = document.getElementById("result")
    video.src = await getVideo()
    video.play()
}

async function authenticate() {
    window.location.href = `https://enter.pollinations.ai/authorize?redirect_url=${encodeURIComponent(location.href)}`;
}

document.getElementById("clickme").addEventListener("click", displayVideo)

document.getElementById("authenticate").addEventListener("click", authenticate)

try {
    if (key === "test") {
        console.log("authenticated")
    }
} catch {
    document.getElementById("clickme").innerText = "Authenticate First!"
    document.getElementById("clickme").disabled = true
    console.warn("not authenticated!")
}