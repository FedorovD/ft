module.exports = class Account {
  constructor (db) {
    this.db = db
  }

  async userById (id) {
    return (await this.db.query('SELECT id, username, first_name, last_name, email, hash, profile_photo, is_admin FROM users WHERE id = $id', { id: id })).rows[0]
  }

  async isInvited (emailId) {
    return (await this.db.query('SELECT id, expired, user_from, user_id, email FROM invites WHERE id = $emailId', { emailId })).rows[0]
  }

  async userByEmailId (emailId) {
    return (await this.db.query('SELECT user_id, email_id, activation_date FROM keys WHERE email_id = $emailId', { emailId })).rows[0]
  }

  async userByName (username) {
    return (await this.db.query('SELECT id, username, first_name, last_name, hash, email, is_activated FROM users WHERE UPPER(username) = UPPER($username)', { username: username })).rows[0]
  }

  async userByEmail (email) {
    return (await this.db.query('SELECT id, username, first_name, last_name, hash, email, is_activated FROM users WHERE email = $email', { email })).rows[0]
  }

  async insertUser (user) {
    await this.db.query(`INSERT INTO users (username, first_name, last_name, email, hash, is_activated) 
VALUES($username, $firstname, $lastname, $email, $hash, true)`, user)
    return (await this.db.query(`SELECT id, is_activated FROM users WHERE username = $username`, user)).rows[0]
  }

  async isUser (username, email) {
    return (await this.db.query('SELECT id, username, first_name, last_name, hash, email FROM users WHERE UPPER(username) = UPPER($username) OR email = $email', { username, email })).rows[0]
  }

  // async userByProviderId (id, provider) {
  //   return (await this.db.query(`
  //           SELECT U.id, U.username, U.first_name, U.last_name, U.email
  //           FROM providers as P LEFT JOIN
  //                users as U ON U.id = P.user_id
  //           WHERE P.provider_user_id = $id AND P.provider_name = $provider`, { id: id, provider: provider })).rows[0]
  // }
}
