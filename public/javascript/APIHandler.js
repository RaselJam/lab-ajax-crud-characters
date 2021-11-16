class APIHandler {
	constructor(baseUrl) {
		this.BASE_URL = baseUrl
		this.axios = axios.create({
			baseURL: baseUrl,
		})
	}

	async getFullList() {
		try {
			return await this.axios.get('/characters')
		} catch (error) {
			return error
		}
	}

	async getOneRegister(id) {
		if (isNaN(+id)) return 'please provide a number'
		try {
			return await this.axios.get(`/characters/${id}`)
		} catch (error) {
			return error
		}
	}

	async createOneRegister(character) {
		//Dummy random Id:
		const randomId = Math.floor(Math.random() * 10 * Math.random() * 3)
		character.id = randomId
		try {
			return await this.axios.post('/characters', character)
		} catch (error) {
			return error
		}
	}

	async updateOneRegister(character) {
		try {
			let result = await this.axios.post(`/characters/`, character)
			console.log('onUpdate', result)
			return
		} catch (error) {
			return error
		}
	}

	async deleteOneRegister(id) {
		console.log('deleteing ....', id)
		if (isNaN(+id)) return 'please provide a number'
		try {
			let res = await this.axios.delete(`/characters/${id}`)
			return res.status
		} catch (error) {
			return error
		}
	}
}
