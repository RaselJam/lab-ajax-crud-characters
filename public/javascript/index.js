const charactersAPI = new APIHandler('https://minions-api.herokuapp.com')
//All this may seem over kill, but the Idea is making it extendable for feature Dynamic From generating  ting,
//and Retriving data from Form.
window.addEventListener('load', () => {
	document.getElementById('fetch-all').addEventListener('click', async function (event) {
		let container = document.querySelector('#listContainer')
		console.log(container)
		let toPrint = ''

		let result = await charactersAPI.getFullList()
		//TODO ask TA why it return flase on checking Array.isArray(result.data)
		//	console.log( typeof result.data)

		if (result.length === 0) {
			container += toPrint
			console.log('error')
			return
		}
		result.data.forEach((c) => {
			toPrint += getCharacterDisplay(c)
		})
		container.innerHTML = toPrint
	})

	document.getElementById('fetch-one').addEventListener('click', async function (event) {
		const targetId = document.querySelector('#id-fetch').value
		let result = await charactersAPI.getOneRegister(targetId)
		if (!result.data) return
		let { cartoon, id, name, occupation, weapon } = result.data
		populateCharacter({ cartoon, id, name, occupation, weapon })
	})

	document.getElementById('delete-one').addEventListener('click', async function (event) {
		const id = document.querySelector('#id-delete').value
		let result = await charactersAPI.deleteOneRegister(id)
		if (result !== 200) {
			console.log(`Error on Deleting, tried to delete id: ${id} Error message from server : `, result)
		}
		alert(result === 200 ? 'Deleted' : 'Some error happend ,look at console')
	})

	document.getElementById('edit-character-form').addEventListener('submit', async function (event) {
		event.preventDefault()
		let inputs = getInputsElemntsFromEdit()
		console.log('inputs :s', inputs)
		let character = getValuesFromInputs(inputs)
		let result = await charactersAPI.updateOneRegister(character)
	})

	document.getElementById('new-character-form').addEventListener('submit', async function (event) {
		let inputs = getInputsElemntsFromNew()

		let character = getValuesFromInputs(inputs)

		let result = await charactersAPI.createOneRegister(character)
		//if(result.status===***)
		console.log('Result on Adding from Server: ', result)
	})
})
document.getElementById('reset-all').addEventListener('click', function (event) {
	resetList()
})
//helpers :
function resetList() {
	document.querySelector('#listContainer').innerHTML = `<div class="character-info">
    <div class="name">Character Name</div>
    <div class="occupation">Character Occupation</div>
    <div class="cartoon">Is a Cartoon?</div>
    <div class="weapon">Character Weapon</div>
    </div>`
}
function populateCharacter(character) {
	//console.log('Casted and passed as ', character)
	let container = document.querySelector('#listContainer')
	container.innerHTML = getCharacterDisplay(character)
	let inputs = getInputsElemntsFromEdit()
	// console.log(inputs)
	putValuesToInputs(inputs, character)
}
function getCharacterDisplay(character) {
	return `<div class="character-info">
     <div class="id">Id: ${character.id}</div>
     <div class="name">Name: ${character.name}</div>
     <div class="occupation">occupation: ${character.occupation}</div>
     <div class="cartoon">Is cartoon? ${character.cartoon}</div>
     <div class="weapon">Weapon ${character.weapon}</div>
     </div>`
}
/**
 *TODO refactor to make it generic to acccept any form, with out HARDCODED Input Ids
 * @returns an object with [Key as Name of the input] and the value the whole InputHTMLElemnt
 */
function getInputsElemntsFromEdit() {
	let id = document.querySelector('#id-edit')
	let name = document.querySelector('#name-edit')
	let occupation = document.querySelector('#occupation-edit')
	let weapon = document.querySelector('#weapon-edit')
	let cartoon = document.querySelector('#cartoon-edit')
	let result = { id, name, occupation, weapon, cartoon }

	return result
}
//This is not tested yet : but it supoesed to replase these two functions : getInputsElemntsFromEdit, getInputsElemntsFromNew
function getInputsFromAnyForm(form) {
	let result = {}
	try {
		for (let i = 0; i < form.elements.length; i++) {
			//discardinginputs buttons or any other irrelevante inputs
			if (form.elements[i].name !== '') {
				result[form.elements[i].name] = form.elements[i]
			}
		}
	} catch (error) {
		result.error = error
		console.log(error)
	}
	return result
}
//TODO Remove duplicate Code, refactor the above function and this one and make Single generic Function
function getInputsElemntsFromNew() {
	let name = document.querySelector('#name-new')
	let occupation = document.querySelector('#occupation-new')
	let weapon = document.querySelector('#weapon-new')
	let cartoon = document.querySelector('#cartoon-new')
	let result = { id, name, occupation, weapon, cartoon }
	return result
}
function getValuesFromInputs(inputList) {
	let result = {}
	for (const [key, value] of Object.entries(inputList)) {
		if (inputList[key].type === 'checkbox') {
			console.log('value:', value)
			result[key] = value.checked
		} else result[key] = value.value
	}
	console.log('Casted from Inputs edit', result)
	return result
}
function putValuesToInputs(inputsList, character) {
	for (const [key, value] of Object.entries(inputsList)) {
		if (inputsList[key].type === 'checkbox') {
			inputsList[key].checked = character.cartoon
			console.log(inputsList[key])
		} else inputsList[key].value = character[key]
	}
}
