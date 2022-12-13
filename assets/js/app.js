const inpCpl     = document.querySelector('#clp');
const selMoney   = document.querySelector('#money');
const btnCal     = document.querySelector('#btnCal');
const result     = document.querySelector('#result');
const canGrafica = document.querySelector("#grafico").getContext("2d");

const promiseGrafic = (Tdat, Tva) =>
    new Promise((resolve) =>{

        const datos     = {
            label: "Valores del Mes",
            data: Tva,
            backgroundColor: 'green',
            boderColor:'red',
            boderWidth:2,
        
        };
        
        new Chart(canGrafica, {
            type:'line',
            data:{
                labels: Tdat,
                datasets:[
                    datos,
                ]
            },
        });
    });

const today = new Date();
const day   = today.getDate();
const month = today.getMonth() + 1;
const year  = today.getFullYear();  
const mtoday = `${year}-${month}-${day}`;

const indicadores = ['uf', 'ivp', 'dolar', 'dolar_intercambio', 'euro', 'ipc', 'utm', 'imacec', 'tpm', 'libra_cobre', 'tasa_desempleo', 'bitcoin'];

for(let indi of indicadores){
    money.innerHTML += `
    <option value="${indi}">${indi}</option>
    `;
}

const getIndicador = async (money,clp) => {
    try{
        const res  = await fetch("https://mindicador.cl/api/"+money);
        const data = await res.json();
        
        data.serie.forEach((element) => {
            const splitDate = element.fecha.split('T');
            const date  = splitDate[0];
  
            if(date===mtoday)
            {   
                const worth = clp/element.valor;
                const val = worth.toFixed(2);

                result.innerHTML=`
                    <p class='mt-3'>Resultado:$ ${val}</p>
                `;
            }
        });

        let Tdate = '[""';
        let Tval  = '[""';
        data.serie.forEach((element) => {
            const splitDate = element.fecha.split('T');

            const date  = splitDate[0];
            Tdate = Tdate +',"'+ date+'"' ;

            const val = element.valor;
            Tval = Tval +',"'+ val+'"' ;
        });

        const Tdat = Tdate +']'; 
        const Tva = Tval +']'; 

        promiseGrafic(Tdat,Tva);

    }catch(error){
        console.log(error);
    }
}

btnCal.addEventListener("click", () => {
    const money = selMoney.value;
    const clp   = inpCpl.value;

    if(money != '' && clp!= '')
    {
        getIndicador(money,clp);
    }
    else
    {
        result.innerHTML = '<p class="bg-danger mt-4">Complete la Informacion</p>';
    }
});