const cl = console.log;

const inputForm = document.getElementById('inputForm')
const title = document.getElementById('title')
const body = document.getElementById('body')
const userId = document.getElementById('userId')
const AddObj = document.getElementById('AddObj')
const UpdateBtn = document.getElementById('UpdateObj')
const cardContainer = document.getElementById('cardContainer')
const spinner = document.getElementById('spinner')

let productArr = []

let BASE_URL = 'https://jsonplaceholder.typicode.com'

function snackbar(msg,icon){
    swal.fire({
        title : msg,
        icon : icon,
        timer : 3000
    })
}

function fetchposts(){
    spinner.classList.remove('d-none')
    let xhr = new XMLHttpRequest()

    let Post_url = `${BASE_URL}/posts`

    xhr.open('Get' ,Post_url)

    xhr.send(null)

    xhr.onload = function(){
        productArr = JSON.parse(xhr.response)
        cl(productArr)
        createcards(productArr.reverse())
    }

}
fetchposts();

function createcards(arr){
    let result = ''
    arr.forEach(ele => {
        result += `<div class="col-md-3 my-4" id=${ele.id}>
                <div class="card h-100">
                    <div class="card-header">
                        <h2>${ele.title}</h2>
                    </div>

                    <div class="card-body">
                        <p>${ele.body}</p>
                    </div>

                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-sm btn-outline-danger" onClick = 'onEdit(this)'>
                            Edit
                        </button>
                        <button class="btn btn-sm btn-outline-primary" onClick = 'onRemove(this)'>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
            `
    });
    cardContainer.innerHTML = result;

    spinner.classList.add('d-none')
}

function onSubmit(ele){
    spinner.classList.remove('d-none')

    ele.preventDefault();

    let Post_url = `${BASE_URL}/posts`

    let newObj = {
        userId : userId.value ,
        title : title.value ,
        body : body.value
    }

    productArr.unshift(newObj)

    // cl(productArr)

    let xhr = new XMLHttpRequest()

    xhr.open('GET' , Post_url)

    xhr.send(JSON.stringify(newObj))

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <=299){
            let responce = JSON.parse(xhr.response)

            let div = document.createElement('div')
            div.className = 'col-md-3 my-4'
            div.id = responce.id

            div.innerHTML = `
                <div class="card h-100">
                    <div class="card-header">
                        <h2>${newObj.title}</h2>
                    </div>

                    <div class="card-body">
                        <p>${newObj.body}</p>
                    </div>

                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-sm btn-outline-danger" onClick = 'onEdit(this)'>
                            Edit
                        </button>
                        <button class="btn btn-sm btn-outline-primary" onClick = 'onRemove(this)'>
                            Delete
                        </button>
                    </div>
                </div>
                `

                cardContainer.prepend(div)
                inputForm.reset()

                snackbar(`The new card ${responce.id} is added Successfully...! `, `success`)
        }
    }

    spinner.classList.add('d-none')
}

function onEdit(ele){
    spinner.classList.remove('d-none')

    let EditId = ele.closest('.col-md-3').id
    localStorage.setItem('EditId' , EditId)

    // let EditObj = productArr.find(p => p.id == EditId)

    let xhr = new XMLHttpRequest()

    let Post_url = `${BASE_URL}/posts/${EditId}`

    xhr.open('GET' , Post_url)

    xhr.send(null)

    xhr.onload = function(){
        
        let EditObj = JSON.parse(xhr.response)

        title.value = EditObj.title
        body.value = EditObj.body
        userId.value = EditObj.userId

        AddObj.classList.add('d-none')
        UpdateBtn.classList.remove('d-none')
    }

    spinner.classList.add('d-none')
}

function onUpdate(){
    spinner.classList.remove('d-none')

    let updateId = JSON.parse(localStorage.getItem('EditId'))

    let UpdateObj = {
        title : title.value ,
        body : body.value ,
        userId : userId.value ,
        id : updateId
    }

    let xhr = new XMLHttpRequest()

    let Put_url = `${BASE_URL}/posts/${updateId}`

    xhr.open('PUT',Put_url)

    xhr.send(JSON.stringify(UpdateObj))

    xhr.onload = function(){
        cl(xhr.responce)

        let div = document.getElementById(updateId)

        let h2 = div.querySelector('.card-header h2')

        h2.innerText = UpdateObj.title

        let p = div.querySelector('.card-body p')

        p.innerText = UpdateObj.body
        snackbar(`The Peoduct ${updateId} is Updated Successfully...! '.' success.`)

        inputForm.reset()
        AddObj.classList.remove('d-none')
        UpdateBtn.classList.add('d-none')
    }

    spinner.classList.add('d-none')
}

function onRemove(ele){
    spinner.classList.remove('d-none')

    let removeId = ele.closest('.col-md-3').id

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"

            }).then((result) => {
                
            if (result.isConfirmed){
            let Delete_url = `${BASE_URL}/posts/${removeId}`

            let xhr = new XMLHttpRequest()

            xhr.open('DELETE' , Delete_url)

            xhr.send(null)

            xhr.onload = function(){
                ele.closest('.col-md-3').remove()

                snackbar(`The Card ${removeId} is Removed Suuceesully..! ',' success`)
        }
        }
    })

    spinner.classList.add('d-none')
}


inputForm.addEventListener('submit' , onSubmit)
UpdateBtn.addEventListener('click' , onUpdate)