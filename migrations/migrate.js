const fs = require('fs')
require.extensions['.sql'] = (module, filename) => { module.exports = fs.readFileSync(filename, 'utf8') }
require.extensions['.html'] = (module, filename) => { module.exports = fs.readFileSync(filename, 'utf8') }

const {Client} = require('pg')
const _config = require('../config').get('db')
const isProd = require('../config').isProd
const db = require('../server/db')
const query = db.query

let modules = [
  ...require('./migrations/init')
]

const {engines} = require('./../package.json')
const engineVersion = engines.node
if (process.version !== engineVersion) {
  console.error('***************************************************************************')
  console.error(`* Required node version ${engineVersion} not satisfied with current version ${process.version}. *`)
  console.error('***************************************************************************')
  process.exit(1)
}

(async function () {
  await checkConnection()
  await createDBIfNotExist()
  await createMigrationsTable()
  try {
    await applyMigrations()
  } catch (err) {
    process.exit(1)
  }
})()

async function checkConnection () {
  const client = new Client({
    user: _config.user,
    host: _config.host,
    database: 'postgres',
    password: _config.password,
    port: _config.port
  })

  return new Promise((resolve, rej) => {
    async function connectionTry (attempt) {
      try {
        console.log(`${attempt + 1} db check!`)
        await client.connect()
        resolve()
      } catch (err) {
        if (attempt < 10) {
          setTimeout(() => {
            connectionTry(attempt + 1)
          }, 2000)
        } else {
          process.exit(1)
        }
      }
    }
    connectionTry(0)
  })
}

async function createDBIfNotExist () {
  const client = new Client({
    user: _config.user,
    host: _config.host,
    database: 'postgres',
    password: _config.password,
    port: _config.port
  })

  await client.connect()
  let dbsResult = await client.query(`SELECT datname FROM pg_database where datname = $1`, [_config.database])
  if (dbsResult.rows.length === 0) {
    await client.query(`CREATE DATABASE ${_config.database};`)
  }

  client.end()
}

async function createMigrationsTable () {
  let result = await query(`SELECT table_name FROM information_schema.tables
	                        WHERE table_schema='public' AND table_type='BASE TABLE' AND table_name = '_migrations';`)

  if (!result.rows[0]) {
    await query(`create table _migrations ( name varchar(40), time_of_migration timestamp )`)
  }
}

async function applyMigrations () {
  let changed = false
  for (let i = 0; i < modules.length; i++) {
    let migration = modules[i]

    if (isProd && migration.notForProd) continue

    if (!(await isMigrationHasBeenApplied(migration.name))) {
      await migration.up(query, db)

      let now = new Date()

      await query(`INSERT INTO _migrations (name, time_of_migration) VALUES($name, $now);`, {
        name: migration.name,
        now: now
      })

      console.log(`Migration "${migration.name}" has been applied`)
      changed = true
    }
  }
  if (!changed) {
    console.log(`DB is up to date!`)
  }
  process.exit(0)
}

async function isMigrationHasBeenApplied (name) {
  let result
  result = await query('SELECT name FROM _migrations WHERE name = $name', {name: name})

  return Boolean(result.rows[0])
}
