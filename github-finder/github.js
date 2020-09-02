// Setting Git Api
class GitHub {
    constructor(){
        this.client_id = 'd1b36acf984f11956a56'
        this.client_secret = 'c55895796b536eeae3871236ef77e9c4b0638b21'
        this.repos_count = 5
        this.repos_sort = 'created: asc'
    }

    async getUser(user){
        const profileResponse = await fetch(`https://api.github.com/users/${user}?client_id=${this.client_id}&client_sercet=${this.client_secret}`)

        const reposResponse = await fetch(`https://api.github.com/users/${user}/repos?per_page=${this.repos_count}&sort=${this.repos_sort}& client_id=${this.client_id}&client_sercet=${this.client_secret}`)

        const profile = await profileResponse.json()

        const repos = await reposResponse.json()
        
        return {
            profile,
            repos
        }
    }

}