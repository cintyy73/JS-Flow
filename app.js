const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const addRemove = (element1, element2) =>{
    element1.classList.add("is-hidden")
    element2.classList.remove("is-hidden")
}

const BASE_URL = "https://63cfafea8a780ae6e67a7e98.mockapi.io/";

let dataId = '';
let editing = false;

const msj1 = "Pagina no disponible, vuelva intentar en unos minutos." 
const msj2 = "Estamos procesando sus datos"
const msj3 = "Aguarde unos seguncos, mientras eliminamos sus datos"

//obtener todos los empleos
const getJobs = async () => {
    try {
        const response = await fetch(`${BASE_URL}jobs`);
        const jobs = await response.json();
        rendersJobs(jobs)
    } 
    catch (error) {
        msjError(msj1)
    }
}

getJobs()

//obtener un empleo
const getJob = async (id) =>{
    try {
        const response = await fetch(`${BASE_URL}jobs/${id}`);
        const job = await response.json();
        seeDetaislJob(job)
        populateForm(job)
    } catch (error) {
        msjError(msj2)
    }
}

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

        // evento para ver detalles de empleo
        for (const button of $$(".btn-details")) {
            button.addEventListener("click", () =>{ 
                dataId = button.getAttribute("data-id")
                getJob(dataId)
            })
        }
    }
}

// Crear nuevo empleo
const registerJob = async () =>{
    try{
        const job = getJobForm()
        const response = await fetch(`${BASE_URL}jobs`, {
            method: "POST",
            body: JSON.stringify(job),
            headers: {
                "Content-Type": "Application/json"
            }
        })
        const jobs = await response.json();
    } 
    catch(error){
        console.log(error)  
        msjError(msj2)    
    }
    finally{
        recharge(2)
    }
}

//Eliminar un empleo
deleteJob = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}jobs/${id}`,{
            method: "DELETE",
        });
    } 
    finally{
        recharge(1)
    }
}

//ver detalles de empleo
const seeDetaislJob = ({name, description, location, seniority, category, id}) =>{
    $("#cont-cards").innerHTML = `    
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
        <div id="container-buttons" class="buttons control">
            <button data-id="${id}" class="button btn-edit-job is-small is-primary">
                Edit Job
            </button>
            <div class="control" >
                <button data-id="${id}" class="button btn-msj-delete is-small is-danger">Delete Job</button>
            </div>
        </div>
    </div>`
    
    //evento para mostrar mensaje de confirmacion para eliminar empleo
    $(".btn-msj-delete").addEventListener("click", () =>{ 
            $("#btn-delete-ok").setAttribute("data-id", id)
            $("#message").classList.remove("is-hidden")
        })     
    //agregar evento al btn edit job  
    $(".btn-edit-job").addEventListener("click", () =>{ 
        $("#form-create-job").classList.remove("is-hidden")
        $("#btn-create-ok").setAttribute("data-id", id)
        editing = true
     })     
     editing = false       
    }

//guardar datos de empleo editado
updateJobEdit = async (id) =>{
    try{
        const job = getJobForm()
        const response = await fetch(`${BASE_URL}jobs/${id}`, {
            method: "PUT",
            body: JSON.stringify(job),
            headers: {
                "Content-Type": "Application/json"
            },
        })
        const jobs = await response.json();
        } 
        catch(error){
            console.log(error)  
            msjError()    
        }
        finally{
            recharge(1)
        }
    }

//da valores a los inputs del empleo a editar
const populateForm = ({name, description, seniority, category, location}) =>{
    $("#input-name").value = name
    $("#input-description").value = description
    $("#input-location").value = location
    $("#input-seniority").value =  seniority
    $("#input-category").value = category
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

//mensaje de error
const msjError = (msj) =>{
    $("#cont-cards").innerHTML = `
    <article class="message is-danger">
        <div class="message-body ">
            <p>${msj}</p>
        </div>
    </article>`;
}

//Recarga la página luego de determinados segundos (según parámetro) 
const recharge = (time) =>{
    return new Promise((resolve)=>
    {
        setTimeout(() => {
            resolve(window.location.href = "index.html")
        },time)
    })
}

//Eventos

//formulario: editar / crear
$("#form-create-job").addEventListener("submit", (e) => {
    e.preventDefault();
    if(editing){
        console.log("editando")
        getJobForm()
        updateJobEdit($("#btn-create-ok").getAttribute("data-id"))
    }
    else{
        registerJob()
        addRemove($("#form-create-job"), $("#cont-cards"))
    }
})

//crear 
$("#btn-create-job").addEventListener("click",() =>{
    console.log("object");
    addRemove($("#cont-cards"), $("#form-create-job"))
})

//cancela => crear
$("#btn-create-cancel").addEventListener("click",() =>{
    console.log("object");
    addRemove($("#form-create-job"), $("#cont-cards"))
})

//cancela => eliminar
$("#btn-delete-cancel").addEventListener("click", () =>{
    $("#message").classList.add("is-hidden")
    getJobs()
})

//muestra msj antes de eliminar 
$("#btn-delete-ok").addEventListener("click", () =>{
    deleteJob($("#btn-delete-ok").getAttribute("data-id"))
    $("#message").classList.add("is-hidden")
})