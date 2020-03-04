let loggedInUser;
const commentBox = document.querySelector('.FixedHeightContainer')

//######################### Initial fetches ####################################
const getVideos = () => fetch('http://localhost:3000/videos').then(resp => resp.json())
const getUser = () => {return fetch('http://localhost:3000/users/').then( res => res.json())}
getVideos().then(videos => videos.forEach(renderVideo))
getUser().then( arrayOfUsers => {
    loggedInUser = arrayOfUsers[0]
 
    });

//####################### My Containers ########################################
const container = document.querySelector('#my-container') //big container
const mariMusicCon = document.querySelector("#mari-music") // aside container- list of music
const videoCon = document.querySelector('#video-container') // video container
// const commentContainer = document.querySelector("#comment-container") //commentContainer



//####################### creating a comment form ################################

function renderForm(videoObj){
    const form = document.createElement('form')
    form.id = "comment-form"
    const formDiv = document.querySelector('#form-div')
    // form.dataset.id = 
    const messageLabel = document.createElement("label")
    messageLabel.setAttribute("for", "message")
    messageLabel.textContent = "message:"
    const messageInput = document.createElement("input")
    messageInput.type = "textarea"
    messageInput.id = "message"
    const submitForm = document.createElement("input")
    submitForm.type = "submit"
    form.append(messageLabel, messageInput, submitForm)
    // commentContainer.innerHTML = `
    // <div class="FixedHeightContainer">
    // </div>
    // `
    formDiv.innerHTML = ""
    formDiv.append(form)
    form.addEventListener('submit', event => {
        event.preventDefault();
        formEventListener(event,videoObj)
        })
}

//#########################  BIG RENDER FUNCTION ##################################
//when a video object renders, it also renders the comment box associated with it

function renderVideo(videoObj){
    const videoDiv = document.createElement('div') //this is where the video lives
    videoDiv.id = "video-container" //this is the ID for it
    const titleLi = document.createElement('ul') //this creates the unordered list elements for each video on the aside container
    titleLi.innerHTML = `<h6>${videoObj.title}</h6>`
    mariMusicCon.append(titleLi) //aside container- appends each video's titleLi to the music container
    const header = document.querySelector('h1')

//######################### beginning of event listener - click on sidebar, video shows #########################
    titleLi.addEventListener('click', (event) => { //this event listener opens a video when titleLi is clicked
        event.preventDefault()
        commentBox.innerHTML = ""
        showVideo(event, videoObj)
        renderForm(videoObj)

        })
        
//########################### showVideo - pops up the video container ################################################
    function showVideo(event, videoObj){
        videoCon.innerHTML = `
        <div class="center">
        <h1 class="song-title">${videoObj.title}</h1>
        <iframe width="420" height="315"
        src="${videoObj.video_url}" allowfullscreen>
        </iframe>
        </div>
        `
//##################### this renders comments #####################################
        console.log(videoObj)
        videoObj.comments.forEach(comment => {
            let comm = comment.message
            let user = comment.username
            let date = comment.date
            const commUl = document.createElement('ul')
            const oldCommButton = document.createElement('button')
            oldCommButton.innerText = "X"
            console.log(oldCommButton)
            commUl.innerText = `
            ${user}: ${comm}
            ${date}
            `
            commUl.style = "font-size:10px"
            commUl.append(oldCommButton)
            commentBox.append(commUl)
            oldCommButton.addEventListener('click', event => {                   
                fetch(`http://localhost:3000/comments/${comment.id}`, {
                    method: "DELETE"
                })
                commUl.remove()
            })
        })
        
    }

//######################## end of showVideo function ##################################

}


//global variable for current video -- whichever one is being clicked would render form 
//###################### form event listener ##########################################

function formEventListener(event,videoObj){
    let newComment = event.target.message.value
    fetch("http://localhost:3000/comments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(
            {
                user_id: loggedInUser.id,
                message: newComment,
                video_id: videoObj.id
            })
        })
        .then(resp => resp.json())
        .then(comment => {
            const commentBox = document.querySelector('.FixedHeightContainer')
            const commentUl = document.createElement('ul')
            let newCommUl = document.createElement('Ul')
            newCommUl.innerText = `${comment.username}: ${comment.message}`
            commentUl.append(newCommUl)
            const commButton = document.createElement('button')
            commButton.innerText = "X"
            newCommUl.append(commButton)
            commentBox.append(newCommUl)
            commButton.addEventListener('click', e => {                   
                fetch(`http://localhost:3000/comments/${comment.id}`, {
                    method: "DELETE"
                })
                newCommUl.remove()
            })
        })
    
}
    //######################## end of form event listener ##################################
    
    
    // renderForm()
    