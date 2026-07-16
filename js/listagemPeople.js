const listagemSec = document.getElementById("listagem")
const table = listagemSec.querySelector("table")
const tbody = table.querySelector("tbody")
const trTemp  = tbody.querySelector("template")

updateListagem()

async function updateListagem(){
    const pessoas = await fetch("http://localhost:3000/people").then(async (res)=> await res.json())
    renderPeople(pessoas)

    document.querySelectorAll(".delButton").forEach(button=>{
        button.addEventListener("click", async (e)=>{
            const idItem = e.target.closest("tr").dataset.id
            
            var res = await fetch("http://localhost:3000/people?id="+idItem,{
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            updateListagem()
        })
    })
}
function renderPeople(people){
    tbody.innerHTML = ''
    let content = "" 
    people.forEach((person) => {
        const dataCartao = person.datacartao ? new Date(person.datacartao ) :null
        const birthday = person.birthday ? new Date(person.birthday) : null
        content += `
        <tr data-id="${person.id}">
            <td>${person.name}</td>
            <td>${person.cpf}</td>
            <td>${birthday ? birthday.toLocaleDateString("pt-BR") : ""}</td>
            <td>${person.numcartao ?? ""}</td>
            <td>${dataCartao ? dataCartao.toLocaleDateString("pt-BR") : ""}</td>
            <td>${person.cvvcartao ?? ""}</td>
            <td>
                <button class="editButton">Editar</button>
                <button class="delButton">Deletar</button>
            </td>
        </tr>
        `
    });
    tbody.innerHTML=content
}

const form = document.querySelector(".addForm")

form.addEventListener("submit", async (e)=>{
    e.preventDefault()

    const name = document.getElementById("nameInp").value
    const cpf = document.getElementById("cpfInp").value
    const rg = document.getElementById("rgInp").value
    const birthday = document.getElementById("birthdayInp").value
    const cel = document.getElementById("celInp").value
    const numCartao = document.getElementById("numCartaoInp").value
    const venc = document.getElementById("vencInp").value
    const cvv = document.getElementById("cvvInp").value

    if(cpf=="") return alert("Preencha o CPF")
    if(name=="") return alert("Preencha o Nome")

    var res = await fetch("http://localhost:3000/people",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify( {
            "name": name,
            "cpf": cpf,
            "rg": rg != "" ? rg : null,
            "birthday": birthday!="" ? birthday : null,
            "telefone": cel!="" ? cel : null,
            "numCartao": numCartao!="" ? numCartao : null,
            "dataCartao": venc != "" ? venc+"-01" : null,
            "cvvCartao": venc != "" ? cvv : null

        })
    })

    if(!res.ok){
        return alert("Ocorreu um erro ao salvar os dados")
    }

    document.getElementById("nameInp").value = ""
    document.getElementById("cpfInp").value = ""
    document.getElementById("rgInp").value = ""
    document.getElementById("birthdayInp").value = ""
    document.getElementById("celInp").value = ""
    document.getElementById("numCartaoInp").value = ""
    document.getElementById("vencInp").value = ""
    document.getElementById("cvvInp").value = ""
})