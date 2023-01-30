const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

//mostrar ocultar elemento
const addRemove = (element1, element2) =>{
    element1.classList.add("is-hidden")
    element2.classList.remove("is-hidden")
}


//mensajes error
const msj1 = "Pagina no disponible, vuelva intentar en unos minutos." ;
const msj2 = "Estamos procesando sus datos";
const msj3 = "Eliminando....";

//variables
const BASE_URL = "https://63cfafea8a780ae6e67a7e98.mockapi.io/";

let dataId = '';
let editing = false;
let list = [];
let list_category = [];
let list_location = [];
let list_seniority = [];

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
                $("#form-filter").classList.add("is-hidden")
                getJob(dataId)
            })
        }
    }
}

//filtra empleos segun input

const listFilter = async (filter)  =>{
    try {
        const response = await fetch(`${BASE_URL}jobs`);
        const jobs = await response.json();
        if(filter===$("#filter-category")){
        list = jobs.filter((job)=>(filter.value === job.category))
        }
        if(filter===$("#filter-seniority")){
            list = jobs.filter((job)=>(filter.value === job.seniority))
        }
        if(filter===$("#filter-location")){
            list = jobs.filter((job)=>(filter.value === job.location))
        }
    } 
    catch (error) {
        console.log(error);
        msjError(msj1)
    }
}

//filtra opciones de select para no repetirlas
const listFilters = (jobs, filter) =>{
    return jobs.reduce((acc, currentValue) => {
        const existe = acc.some((item) => item[filter] === currentValue[filter])
    
    if(!existe) {
        return [...acc, currentValue]
    }
    return acc
}, [])
}

//llenar select de filtros
const optionsFilters = () =>{
    $("#filter-category").innerHTML = `
        <option class="is-size-7">...</option>
    `
    $("#filter-seniority").innerHTML = `
        <option class="is-size-7">...</option>
    `
    $("#filter-location").innerHTML = `
        <option class="is-size-7">...</option>
    `
    for (const {category} of list_category) {
        $("#filter-category").innerHTML += `
            <option value="${category}" class="is-size-7">${category}</option>
        `
    }
    for (const {seniority} of list_seniority) {
        $("#filter-seniority").innerHTML += `
            <option value="${seniority}" class="is-size-7">${seniority}</option>
        `
    }
    for (const {location} of list_location) {
        $("#filter-location").innerHTML += `
            <option value="${location}" class="is-size-7">${location}</option>
        `
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
        <div class="content has-text-centered">
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
        addRemove($("#cont-cards"), $("#message"))
        $("#form-create-job").classList.add("is-hidden")
    })     
    //agregar evento al btn edit job  
    $(".btn-edit-job").addEventListener("click", () =>{ 
        $("#form-create-job").classList.remove("is-hidden")
        $("#btn-create-ok").setAttribute("data-id", id)
        editing = true
    })     
    editing = false       
}



//da valores a los inputs del empleo a editar 
const populateForm = ({name, description, location, seniority, category}) =>{
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
    addRemove($("#cont-cards"), $("#form-create-job"))
})

//cancela => crear
$("#btn-create-cancel").addEventListener("click",() =>{
    addRemove($("#form-create-job"), $("#cont-cards"))
})

//cancela => eliminar
$("#btn-delete-cancel").addEventListener("click", () =>{
    addRemove($("#message"), $("#cont-cards"))
    getJobs()
})

//muestra msj antes de eliminar 
$("#btn-delete-ok").addEventListener("click", () =>{
    deleteJob($("#btn-delete-ok").getAttribute("data-id"))
    
})

//select category
$("#filter-category").addEventListener("change", () =>{
    listFilter($("#filter-category"))    
})

//select seniority
$("#filter-seniority").addEventListener("change", () =>{
    listFilter($("#filter-seniority"), "seniority")
})

//select location
$("#filter-location").addEventListener("change", () =>{
    listFilter($("#filter-location"), "location")
})

//search filtros
$("#form-filter").addEventListener("submit", (e) =>{
    e.preventDefault()
    rendersJobs(list)
})

//cancelar filtros
$("#btn-clear").addEventListener("click", () =>{
    getJobs()
})

//home
$("#btn-home").addEventListener("click", () =>{
    recharge(1)
})

//agregar validacion de formulario clase 27/01