
function readJSONPrList() {
    fetch('./versione ekom senza pesi.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        productDataToSearch = data
       
        // Puoi lavorare con i dati JSON qui
    })
    .catch(error => {
        console.error('Errore nella lettura del file JSON:', error);
    });
}
function testFnWithFakeDataGenerated() {
    let amount = 10
    let fakeData= {

        product: 'a',
        weight: 'b',
        amount: 'c'
    }
        
    for(let i=0; i <amount; i++) {
        sheet.push(fakeData)
    }
}
let productDataToSearch = []
readJSONPrList(); 

function findProducts() {
    const productListBox = document.getElementById('productList');
    const searchInput = document.getElementById('searchInput');
    productListBox.childNodes? productListBox.innerHTML = '' : null
    console.log(productListBox.childNodes)
    console.log(searchInput.value.toUpperCase())
   let result = productDataToSearch.filter(prod => prod.product.includes(searchInput.value.toUpperCase()))
   console.log(result)
   if (result) {
    result.forEach(pr => {
        const productBtn = document.createElement('button')
        productBtn.classList.add('pr-btn') 
        productBtn.addEventListener('click', ()=> {selectProduct(pr.product)})
        productBtn.textContent = pr.product;
       productListBox.appendChild(productBtn);
    })
   }
 
}

///////////////////////////////////// added by GPT
function tempFn() {
    // Ottieni il riferimento all'elemento input
const dateInput = document.getElementById('dateInput');

// Aggiungi un gestore di eventi per l'evento 'input'
dateInput.addEventListener('input', function() {
    console.log(this.value)
    // Ottieni il valore inserito dall'utente
    const inputDate = this.value.trim();

    // Verifica se il valore inserito corrisponde al formato data YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(inputDate)) {
        // Se il formato è corretto, verifica se è una data valida
        const parts = inputDate.split('-');
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Mese è 0-based
        const day = parseInt(parts[2]);
        const testDate = new Date(year, month, day);

        if (testDate.getFullYear() === year && testDate.getMonth() === month && testDate.getDate() === day) {
            // Se è una data valida, puoi fare qualcosa con essa
            console.log('Data valida:', testDate.toDateString());
            return testDate.toDateString()
        } else {
            // Se non è una data valida, mostra un messaggio di errore
            console.error('Data non valida.');
        }
    } else {
        // Se il formato non è corretto, mostra un messaggio di errore
        console.error('Formato data non valido. Utilizza il formato YYYY-MM-DD.');
    }
})
}

/////////////////////////////////////
function getExpiringData() {
    const expiringDataInput = document.getElementById('expiringData');
    //expiringData = expiringDataInput.value
    expiringData = tempFn()
    formAdvancementSteps('step-1', 'step-2', expiringData);
}

let singleProduct = '';
let finalProductList=[];

function selectProduct(inputElement, mod) {

    if(mod){
        const inputMode = document.getElementById('inputMode');
        singleProduct = inputMode.value; 
        console.log(inputMode)
    }else {
        singleProduct = inputElement;
    }
    formAdvancementSteps('step-2', 'step-3', singleProduct);

}

function pushProductsInSheet() {
    let weightInput = document.getElementById('weightPr');
    let piecesInput = document.getElementById('pieceNumber');

    let weight = weightInput.value
    //let pieces = piecesInput.value

    let finalProduct = { product: singleProduct, weight};
    sheet.push(finalProduct)
    formAdvancementSteps('step-3', 'step-2', finalProduct.product);
}

function formAdvancementSteps(step1,step2, variableToCheck){
  
    const previousStep = document.getElementById(`${step1}`);
    const nextStep = document.getElementById(`${step2}`);
    variableToCheck !== ''? [previousStep.style.display = 'none', nextStep.style.display = 'block'] : null;
}

//sheet functions
let sheet = [];
let expiringData = '';

function dataGenerator(date, productNumber){
    let dates =[]
   console.log(date)
    for(let i=0; i <productNumber; i++) {
        if(!date){
            
            let dateGenerate = new Date();
            let day = String(dateGenerate.getDate()).padStart(2, '0');
            let month =  String(dateGenerate.getMonth() + 1).padStart(2, '0'); 
            dates.push(`${day}/${month}`);
        } else {
            
            let d = date.slice(5).split('-')
        
            console.log(`${d[1]}/${d[0]}`)
            dates.push(`${d[1]}/${d[0]}`);
           
        }
    }
    return dates
}

function createProductTable(productList){
    const dataBox=document.getElementById('data')
    const productBox=document.getElementById('product')
    const weightBox=document.getElementById('weight')
    const amountBox=document.getElementById('amount')
      //  const testest=document.getElementById('foglioProd')
        
   
    productList.forEach(element => {
        function createNode(elementName, elementBox){
            let child = document.createElement('p');
            child.append(elementName);
            elementBox.appendChild(child);
        }
        createNode(element.data, dataBox)
        createNode(element.product, productBox)
        createNode(element.weight, weightBox)
        createNode(element.amount, amountBox)
       
       
       
    });
    
}


function itemGenerator(dates,item){
    
    item.forEach((el,index) => {
        el.data = dates[index];
    });
    return item;
}

let productListCompleted=[];
const generateBtn = document.getElementById('generateBtn')
function sheetGenerator() {
    console.log(sheet)
    let dates = [];
    if(sheet.length > 0) {
        dates = dataGenerator( expiringData, sheet.length);
       productListCompleted.push(...itemGenerator(dates, sheet));
       formAdvancementSteps('step-2', 'step-1', sheet[0].product);
       sheet = [];
       console.log(productListCompleted)
       if(productListCompleted.length >=1 && productListCompleted[0].product){
      
         recapList() 
        generateBtn.classList.remove('d-none')
    }
    }
    
    
}

const recapBox = document.getElementById('recapBox');
function recapList() {
    
   recapBox.childNodes? recapBox.innerHTML = '' : null
    productListCompleted.forEach(d=> {
        const pElement = document.createElement('p');
        const btnElement = document.createElement('button');
        btnElement.classList.add('pr-btn')
        btnElement.append('cancella')
        btnElement.addEventListener('click', ()=>{
            let result = productListCompleted.find(pr =>pr.product === d.product && pr.data === d.data && pr.weight === d.weight)

            if(result) {
              const index =  productListCompleted.indexOf(result);

              let  stringFromObject = `${result.product}-${d.weight}-${result.data}`;

              let paragraphs = recapBox.getElementsByTagName('p');
              let paragraphsArr = Array.from(paragraphs)
             let arfind =  paragraphsArr.find(parag => parag.textContent.includes(stringFromObject))

             if(arfind) {
                 productListCompleted.length >0? productListCompleted.length ===1? (productListCompleted.splice(index, 1),arfind.remove(),generateBtn.classList.add('d-none')) : (productListCompleted.splice(index, 1),arfind.remove()) : generateBtn.classList.add('d-none');
              }

            }
        })
        pElement.classList.add('margin10')
        pElement.append(`${d.product}-${d.weight}-${d.data}`)
        pElement.appendChild(btnElement)
        recapBox.appendChild(pElement); 
       

    })
}
function generateCSV() {
    recapBox.childNodes? recapBox.innerHTML = '' : null

// Estrai le chiavi del primo oggetto come intestazioni CSV
const intestazioni = Object.keys(productListCompleted[0]);
const intestazioni2 = ['prodotto', 'peso', 'data']
// Genera il contenuto CSV
let csvContent = '';
csvContent += intestazioni2.join(',') + '\n'; // Intestazioni
productListCompleted.forEach(oggetto => {
    csvContent += intestazioni.map(key => oggetto[key]).join(',') + '\n'; // Dati
});

// Crea un oggetto Blob contenente il CSV
const blob = new Blob([csvContent], { type: 'text/csv' });

// Crea un URL per il Blob
const url = URL.createObjectURL(blob);

// Crea un link per il download del file CSV
const link = document.createElement('a');
link.href = url;
link.download = 'dati.csv'; // Nome del file CSV
link.textContent = 'Download CSV';
link.addEventListener('click' , () => restart())

// Aggiungi il link al documento
const finalLink = document.body.appendChild(link);
const restartBtn = document.getElementById('restart')
finalLink? (generateBtn.classList.add('d-none'), restartBtn.classList.remove('d-none')) : null


}

function restart() {
    window.location.reload();
}

