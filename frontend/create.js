document.getElementById("submit").addEventListener("click", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value
    const content = document.getElementById("content").value
    const username = document.getElementById("username").value
    const email = document.getElementById("email").value

    // Check if all fields are filled
    if (!title || !content || !username || !email) {
        alert("Please fill in all fields before submitting.");
        return;
    }

    const response = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, username, email })
    })

    const result = await response.json()
    //console.log(response)
    if (result.success) {
        alert(result.message);
    } else {
        alert(result.message);
        //console.log(result.message)
    }
})