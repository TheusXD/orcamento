class Despesas {
	constructor(ano , mes , dia , tipo , descricao , valor){
	this.ano = ano
	this.mes = mes
	this.dia = dia
	this.tipo = tipo
	this.descricao = descricao 
	this.valor = valor	
	}

	validarDados(){
		for (let i in this){
			if (this[i] == undefined  || this[i] == '' || this[i] == null ){
				return false
			}
		}
		return true
	}
}

class Bd{

	constructor(){
		let id = localStorage.getItem('id')

		if(id ===null){
			localStorage.setItem('id', 0)
		}
	}

	getProximoId(){
		let proximoid = localStorage.getItem('id')
		return parseInt(proximoid)+1
	}

	/* função para chamada do item localStorage e usando o metodo setitem , passando 
	como parametro despesa e convertendo esse item para json*/
	 gravar(d){
		
		let id = this.getProximoId()

		localStorage.setItem(id , JSON.stringify(d))

		localStorage.setItem('id' , id)
	}

	recuperarTodosRegistros(){

		//array de despesa
		let despesas = Array()



		let id= localStorage.getItem('id')
		//recupera todas as desepsas cadastradas em localstorage
		for(let i =1 ; i <= id ; i++){

			//recuperar a dispesa
			let despesa = JSON.parse(localStorage.getItem(i))

			//existe a possibilidade de haver indices que foram removidos
			//neste caso nós vamos pular esses indices

			if(despesa === null){
				continue
			}

			despesa.id = i

			despesas.push(despesa)
		}

		return despesas
	}
	pesquisar(despesa){

		let despesasFiltradas = Array()
		despesasFiltradas =this.recuperarTodosRegistros()

		//ano
		if(despesa.ano != ''){
		despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
	}
		//mes
		if(despesa.mes != ''){
		despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
	}

		//dia
		if(despesa.dia != ''){
		despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
	}

		//tipo
		if(despesa.tipo != ''){
		despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
	}

		//descricao
		if(despesa.descricao != ''){
		despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
	}

		//valor
		if(despesa.valor != ''){
		despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
	}

		return despesasFiltradas
 
		
	}

	remover(id){
		localStorage.removeItem(id)
	}
}

let bd = new Bd()


function cadastrarDespesa(){

	let ano =document.getElementById('ano')
	let mes =document.getElementById('mes')
	let dia =document.getElementById('dia')
	let tipo =document.getElementById('tipo')
	let descricao =document.getElementById('descricao')
	let valor =document.getElementById('valor')	


	let despesa = new Despesas(ano.value ,mes.value , dia.value , tipo.value , descricao.value , valor.value)


	if(despesa.validarDados()){
		 bd.gravar(despesa)

		 document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		 document.getElementById('modal_titulo_div').className = 'modal-header text-success' 
		 document.getElementById('modal_conteudo').innerHTML = 'Dispesa foi cadastrada com sucesso'
		 document.getElementById('modal_btn').innerHTML = 'Voltar'
		 document.getElementById('modal_btn').className = 'btn btn-success'
		 
		 
		//dialog success
		$('#modalRegistraDispesa').modal('show')

		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value	= ''
	}else {
		
		document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		 document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação verifique se os campos foram preenchidos corretamente'
		 document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
		 document.getElementById('modal_btn').className = 'btn btn-danger'
		 
		//dialog error
		$('#modalRegistraDispesa').modal('show')
	}
	
}

function carregaListasDespesas(despesas = Array() , filtro = false){
	if(despesas.length == 0 && filtro == false){
	despesas =bd.recuperarTodosRegistros()
	}

	var total = 0
	var contador = 0

	//selecionando o elemento tbody da tabela
	let listaDespesas = document.getElementById('listaDespesas')
	listaDespesas.innerHTML = ''


	//percorrer o array despesas, listando cada despesa de forma dinamica
	despesas.forEach(function(d){

		//criando a linha/tr
		let linha = listaDespesas.insertRow()

		//criar as colunas/td
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 
		
		//ajustar o tipo
		switch(d.tipo){
			case '1' : d.tipo ='Alimentação'
				break
			case '2' : d.tipo = 'Educação'
				break
			case '3' : d.tipo = 'Lazer'
				break
			case '4' : d.tipo = 'Saúde'
				break	
			case '5' : d.tipo = 'Transporte'
				break
		}


		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = `R$ ${d.valor}`


		//criar o botão de exclusão

		let btn = document.createElement('button')
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fas fa-trash-alt"></i>'
		btn.id = 'id_despesa_' + d.id
		btn.onclick = function(){ 
		// remover as despesas
						
			let id = this.id.replace('id_despesa_' , '')
			alert('Filtro removido ')
			bd.remover(id)

			window.location.reload()



		}
		linha.insertCell(4).append(btn)

		contador++
        total += Number(d.valor);
        console.log(total)

        if (contador == despesas.length) {
			linha = listaDespesas.insertRow();
			linha.insertCell(0).innerHTML = ``
			linha.insertCell(1).innerHTML = ``
			linha.insertCell(2).innerHTML = `<b class="text-dark">Total</b>`
			linha.insertCell(3).innerHTML = `<b class="text-dark">R$ ${total}</b>`
			linha.insertCell(4).innerHTML = ``

			
		}
	})
	
}


function pesquisarDispesa(){
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	let despesa = new Despesas(ano , mes , dia , tipo ,descricao ,valor)

	let despesas = bd.pesquisar(despesa)
	 


	carregaListasDespesas(despesas , true)
	
}






