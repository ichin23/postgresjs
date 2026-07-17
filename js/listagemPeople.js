import {setSize, sizeMain} from  './layout.js'

const BASE_URL = "https://postgresjs.onrender.com"

const main = document.querySelector("main")
const listagemSec = document.getElementById("listagem")
const table = listagemSec.querySelector("table")
const tbody = table.querySelector("tbody")
const trTemp  = tbody.querySelector("template")

let updatingId = null;
let isUpdating = false;

updateListagem().then(()=>{setSize(sizeMain*0.4)})

async function updateListagem(){
    const order = document.getElementById("orderInp").value
    console.log(order)
    const pessoas = await fetch(`${BASE_URL}/people?order=`+order).then(async (res)=> await res.json())
    renderPeople(pessoas)
    

    document.querySelectorAll(".delButton").forEach(button=>{
        button.addEventListener("click", async (e)=>{
            const idItem = e.target.closest("tr").dataset.id
            
            var res = await fetch(`${BASE_URL}/people?id=`+idItem,{
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            updateListagem()
        })
    })

    document.querySelectorAll(".editButton").forEach(button=>{
        button.addEventListener("click", async (e)=>{
            updatingId = e.target.closest("tr").dataset.id
            editPerson(updatingId)
            isUpdating=true;
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
            <td>#${person.id}</td>
            <td>${person.name}</td>
            <td>${formatarCpf(person.cpf)}</td>
            <td>${birthday ? birthday.toLocaleDateString("pt-BR") : ""}</td>
            <td>${formatarCartao(person.numcartao) ?? ""}</td>
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

document.getElementById("cpfInp").addEventListener("input", (ev)=>{
    ev.target.value = formatarCpf(ev.target.value)
})

document.getElementById("rgInp").addEventListener("input", (ev)=>{
    ev.target.value = formatarRG(ev.target.value)
})

document.getElementById("celInp").addEventListener("input", (ev)=>{
    ev.target.value = formatarCelular(ev.target.value)
})

document.getElementById("numCartaoInp").addEventListener("input", (ev)=>{
    ev.target.value = formatarCartao(ev.target.value)
})

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

    if(cpf=="" || cpf.length != 14) return alert("Preencha o CPF corretamente")
    if(name=="") return alert("Preencha o Nome")

    if(rg.length!=13 && rg!="") return alert("RG Inválido")
    if(cel.length!=15 && cel!="") return alert("Celular Inválido")
    if(numCartao!="" && (numCartao.length!=19 || venc == "" || !(cvv.length==3 || cvv.length==4) )) return alert("Dados do cartão inválidos")

    var res = await fetch(isUpdating? `${BASE_URL}/people/${isUpdating ? updatingId : ""}` : `${BASE_URL}/people`,{
        method: isUpdating ? "PUT" : "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify( {
            "name": name,
            "cpf": cpf.replace(/\D/g, ''),
            "rg": rg != "" ? rg.replace(/[-.]/g, '') : null,
            "birthday": birthday!="" ? birthday : null,
            "telefone": cel!="" ? cel.replace(/\D/g, '') : null,
            "numCartao": numCartao!="" ? numCartao.replace(/\D/g, '') : null,
            "dataCartao": venc != "" ? venc+"-01" : null,
            "cvvCartao": venc != "" ? cvv.replace(/\D/g, '') : null

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

    document.querySelector(".cancelButton").classList.add("hide")
    isUpdating=false
    updatingId=null
    updateListagem()
})

document.querySelector(".cancelButton").addEventListener("click", ()=>{
    limparCampos()
    document.querySelector(".cancelButton").classList.add("hide")
    isUpdating=false
    updatingId=null
})

document.getElementById("orderInp").addEventListener("change", ()=>{
    updateListagem();
})

async function editPerson(id){
    const person = await fetch(`${BASE_URL}/people/`+id).then(async (res)=>await res.json())

    if(!person.name) return;

    document.querySelector(".cancelButton").classList.remove("hide")
    document.getElementById("nameInp").value = person.name
    document.getElementById("cpfInp").value = formatarCpf(person.cpf)
    document.getElementById("rgInp").value = person.rg? formatarRG(person.rg) : ""
    document.getElementById("birthdayInp").value = person.birthday? person.birthday.split("T")[0] : null
    document.getElementById("celInp").value = formatarCelular(person.telefone??"")
    document.getElementById("numCartaoInp").value = formatarCartao(person.numcartao??"")
    document.getElementById("vencInp").value = person.datacartao?.slice(0, 7) ?? ""
    document.getElementById("cvvInp").value = person.cvvcartao
}

function limparCampos(){
    document.getElementById("nameInp").value = ""
    document.getElementById("cpfInp").value = ""
    document.getElementById("rgInp").value = ""
    document.getElementById("birthdayInp").value = ""
    document.getElementById("celInp").value = ""
    document.getElementById("numCartaoInp").value = ""
    document.getElementById("vencInp").value = ""
    document.getElementById("cvvInp").value = ""
}

function formatarCpf(cpf) {
  return cpf
    .replace(/\D/g, '') // Remove tudo que não é dígito
    .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto entre o terceiro e o quarto dígitos
    .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto entre o terceiro e o quarto dígitos de novo
    .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Coloca um hífen entre o terceiro e o quarto dígitos
    .replace(/(-\d{2})\d+?$/, '$1'); // Limita o hífen aos dois últimos dígitos
}

function formatarRG(cpf) {
  return cpf
    .replace(/(([a-zA-Z]){2})(\d)/, '$1-$3') // Coloca ponto entre o terceiro e o quarto dígitos
    .replace(/-(\d{2})(\d)/, '-$1.$2') // Coloca ponto entre o terceiro e o quarto dígitos de novo
    .replace(/.(\d{3})(\d{3})/, '.$1.$2') // Coloca ponto entre o terceiro e o quarto dígitos de novo
    .slice(0, 13)
}

function formatarCelular(cpf) {
  return cpf
    .replace(/\D/g, '') // Remove tudo que não é dígito
    .replace(/(\d{2})(\d)/, '($1) $2') // Coloca ponto entre o terceiro e o quarto dígitos
    .replace(/(\d{5})(\d)/, '$1-$2') // Coloca ponto entre o terceiro e o quarto dígitos de novo
    .slice(0, 15)
}

function formatarCartao(cpf) {
  return cpf
    .replace(/\D/g, '') // Remove tudo que não é dígito
    .replace(/^(\d{4})(\d)/, "$1 $2")
    .replace(/^(\d{4})\s(\d{4})(\d)/, "$1 $2 $3")
    .replace(/^(\d{4})\s(\d{4})\s(\d{4})(\d)/, "$1 $2 $3 $4")
    .substring(0, 19);
}
