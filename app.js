const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const addRemove = (element1, element2) =>{
    element1.classList.add("is-hidden")
    element2.classList.remove("is-hidden")
}

const BASE_URL = "https://63cfafea8a780ae6e67a7e98.mockapi.io/";

//mostrar vista de "empleos"
const renderJobs = async () => {
    try {
        const response = await fetch(`${BASE_URL}jobs`);
        const jobs = await response.json();
        $("#cont-cards").innerHTML = '';
        for (const {name, description, location, seniority, category} of jobs) {
            $("#cont-cards").innerHTML += `    
            <div class="card column is-3 m-2 p-3 ">
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
                <div class="control">
                    <button id="btn-details" class="button is-small is-link">
                        See details
                    </button>
                </div>
            </div>`
        }

    } catch (error) {
        $("#cont-cards").innerHTML = `
        <article class="message is-danger">
            <div class="message-body ">
                <p>Pagina no disponible, vuelva intentar en unos minutos.</p>
            </div>
        </article>`;
    }
}

renderJobs()

// Crear nuevo empleo
const createJobs = async () =>{
    try {
        const job = {
            name: $("#input-name").value,
            description: $("#input-description").value,
            location: $("#input-location").value,
            seniority: $("#input-seniority").value,
            category: $("#input-category").value,
        }
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
        
    }
}

//Eventos
$("#form-create-job").addEventListener("submit", (e) => {
    e.preventDefault();
    createJobs()
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

