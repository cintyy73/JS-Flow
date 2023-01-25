const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const addRemove = (element1, element2) =>{
    element1.classList.add("is-hidden")
    element2.classList.remove("is-hidden")
}

const BASE_URL = "https://63cfafea8a780ae6e67a7e98.mockapi.io/";
let dataId = '';
let isDetails = false;

//obtener todos los empleos
const getJobs = async () => {
    try {
        const response = await fetch(`${BASE_URL}jobs`);
        const jobs = await response.json();
        rendersJobs(jobs)
    } 
    catch (error) {
        $("#cont-cards").innerHTML = `
        <article class="message is-danger">
            <div class="message-body ">
                <p>Pagina no disponible, vuelva intentar en unos minutos.</p>
            </div>
        </article>`;
    }
    finally{
        isDetails=false
    }
}

getJobs()

//mostrar vista de "empleos"

const rendersJobs = (jobs) => {
    $("#cont-cards").innerHTML = '';
    for (const {name, description, location, seniority, category, id} of jobs) {
        $("#cont-cards").innerHTML += `    
        <div id="cont-card" data-card=${id} class="card column is-3 m-2 p-3 ">
            <div class="content">
                <div class="media">
                    <p id="name" class="subtitle is-5">${name}</p>
                </div>
            </div>
            <div class="content">
                <p id="description" class="is-size-7">${description}</p>
            </div>
            <div id="tags" class="media">
                <p class="has-text-dark is-size-7 has-background-primary p-1 m-1" id="location">${location}</p>
                <p class="has-text-dark is-size-7 has-background-primary p-1 m-1" id="seniority">${seniority}</p>
                <p class="has-text-dark is-size-7 has-background-primary p-1 m-1" id="category">${category}</p>
            </div>
            <div id="container-buttons" class="control">
                <button data-id="${id}" class="button btn-details is-small is-link">
                    See details
                </button>
                <div class="control " data-id="${id}">
                    <button class="button  is-hidden btn-msj-delete is-small is-danger">Delete Job</button>
                </div>
            </div>
        </div>`
        //Doy evento para ver detalles de empleo
        for (const button of $$(".btn-details")) {
            button.addEventListener("click", () =>{ 
                dataId = button.getAttribute("data-id")
                seeDetails($$("#cont-card"))
                isDetails = true
                if(isDetails) {
                    button.textContent = "Edit Job"
                    button.classList.remove("is-link")
                    button.classList.add("is-primary")
                }
                else{                       
                    button.textContent = "See Details"
                    button.classList.remove("is-primary")
                    button.classList.add("is-link")
                }
            })
        }
    }
}

        //evento para mostrar mensaje de confirmacion para eliminar empleo

        // for (const button of $$(".btn-msj-delete")) { //no funciona!!!!!!! 
        //     if(isDetails){
                
        //         button.classList.remove("is-hidden")
        //     }
        //     else{                   
        //         button.classList.add("is-hidden")
        //         $("#message").classList.add("is-hidden")
        //     }
        //     button.addEventListener("click", () =>{ 
        //         $("#message").classList.remove("is-hidden")
        //     }  )     
        // }

// Crear nuevo empleo
const registerJob = async () =>{
    try{
        const job = getJobForm()
        const response = await fetch(`${BASE_URL}jobs`, {
            method: "PST",
            body: JSON.stringify(job),
            headers: {
                "Content-Type": "Application/json"
            }
        })
        const jobs = await response.json();
    } 
    catch(error){
        console.log(error)  
        msjError()    
    }
    finally{
        recharge()
    }
}

const seeDetails = (cards) => { 
    // es correcto? o se hace con un nuevo fetch???????
    for (const card of cards) {
        card.classList.add("is-hidden")
        if (card.getAttribute("data-card") === dataId) {
            card.classList.remove("is-hidden")
        }            
    }
}

//empleo base
const getJobForm = () =>{
    const job = {
        name: $("#input-name").value,
        description: $("#input-description").value,
        location: $("#input-location").value,
        seniority: $("#input-seniority").value,
        category: $("#input-category").value,
    }
    return job
}

const msjError = () =>{
    $("#cont-cards").innerHTML = `
    <article class="message is-danger">
        <div class="message-body ">
            <p>Pagina no disponible, vuelva intentar en unos minutos.</p>
        </div>
    </article>`;
}

//Recarga la pagina luego de 3 segundos x si hay error puede mostrar msj
const recharge = () =>{
    return new Promise((resolve)=>
    {
        setTimeout(() => {
            resolve(window.location.href = "index.html")
        },3000)
    })
}

//Eventos
$("#form-create-job").addEventListener("submit", (e) => {
    e.preventDefault();
    registerJob()
    addRemove($("#form-create-job"), $("#cont-cards"))
})

$("#btn-create-job").addEventListener("click",() =>{
    console.log("object");
    addRemove($("#cont-cards"), $("#form-create-job"))
})

$("#btn-create-cancel").addEventListener("click",() =>{
    console.log("object");
    addRemove($("#form-create-job"), $("#cont-cards"))
})


