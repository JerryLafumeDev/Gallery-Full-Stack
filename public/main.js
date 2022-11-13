
let numOfImages = Number(document.querySelector('.numOfMyImages').innerText)

if(numOfImages < 1){
  document.querySelector('.addImgForm').classList.remove('invis')
}

document.querySelector('.addImgBtn').addEventListener('click', ()=>{
  document.querySelector('.addImgForm').classList.toggle('invis')
})
document.querySelector('.close').addEventListener('click', ()=>{
  document.querySelector('.addImgForm').classList.toggle('invis')
})
// function askForImg(){
//   let url = prompt('Enter the link(URL) to the img you would like to add the gallery')
//   let name = prompt('What is the name of this image?')
//   let num = 0 
//   fetch('images', {
//     method: 'POST',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify({
//       'name': name,
//       'img' : url ,
//       'likes': num
//     })
//   })
//   .then(response => {
//     if (response.ok) return response.json()
//   })
//   .then(data => {
//     console.log(data)
//     window.location.reload(true)
//   })
// }

let hearts = document.querySelectorAll('#heart')
  hearts.forEach(heart => {
  heart.addEventListener('click', liked)
})


function liked(e){   
    let postId = e.target.parentElement.parentElement.children[2].innerText
    console.log(postId)
  fetch('liked', {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'postId': postId
    })
  })
  .then(response => {
    if (response.ok) return response.json()
  })
  .then(data => {
    console.log(data)
    window.location.reload(true)
  })
  
}


var trash = document.getElementsByClassName("trash");

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('trash', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'url': img
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
