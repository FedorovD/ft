module.exports.name = 'add_table_users'

module.exports.up = async function (query) {
  await query(`CREATE TABLE users (
		id SERIAL primary key,
		username text not null,
		first_name text,
		last_name text,
		email text,
		hash text,
		is_activated boolean default false);`)
}
