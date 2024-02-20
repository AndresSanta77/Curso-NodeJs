import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '123456789',
  database: 'moviesdb'
}
const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      const [genres] = await connection.query(
        'SELECT id, name FROM genre WHERE LOWER(name) = ?;', [lowerCaseGenre]
      )

      if (genres.length === 0) return [({ message: 'Genre not found' })]

      const [movieGenre] = await connection.query(
        `SELECT BIN_TO_UUID(movie.id) id , movie.title, movie.year, movie.director, movie.duration, movie.poster, movie.rate 
        FROM movie
        JOIN movie_genre ON BIN_TO_UUID(movie.id) = BIN_TO_UUID(movie_genre.movie_id)
        JOIN genre ON movie_genre.genre_id = genre.id
        WHERE genre.name = ?;`,
        [lowerCaseGenre]
      )

      return movieGenre
    }

    const [movie] = await connection.query(
      `SELECT BIN_TO_UUID (id) id , title, year, director,
       duration, poster, rate FROM movie;`
    )
    return movie
  }

  static async getById ({ id }) {
    const [movie] = await connection.query(
      'SELECT BIN_TO_UUID(id) id , title, year, director, duration, poster, rate FROM movie WHERE id = UUID_TO_BIN(?);',
      [id]
    )
    // console.log(movie.length)
    if (movie.length === 0) return [({ message: 'Movie not found' })]

    return movie[0]
  }

  static async create ({ input }) {
    const {
      genre: genreInput,
      title,
      year,
      director,
      duration,
      rate,
      poster
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    // Crear la conexión de genre con movie (tabla movie_genre)
    for (let i = 0; i < genreInput.length; i++) {
      const lowerCaseGenre = genreInput[i].toLowerCase()

      const [genresId] = await connection.query(
        'SELECT id FROM genre WHERE LOWER(name) = ?;',
        [lowerCaseGenre]
      )
      // console.log(genresId[0].id)
      // console.log(uuid)
      try {
        await connection.query(
          `INSERT INTO movie_genre (movie_id, genre_id) VALUES 
          (UUID_TO_BIN("${uuid}"), ${genresId[0].id})`
        )
      } catch (e) {
        // Puede enviar información sencible
        // console.log('ERORRRR' + e)
        throw new Error('Error creating movie')
      }
    }

    // AGREGAR LA PELICULA A LA TABLA movie
    try {
      await connection.query(
      ` INSERT INTO movie (id, title, year, director, duration, poster, rate) 
        VALUES(UUID_TO_BIN("${uuid}"),?,?,?,?,?,?); `,
      [title, year, director, duration, poster, rate]
      )
    } catch (e) {
      // Puede enviar información sencible
      throw new Error('Error creating movie')
    }

    // DEVUELVE LA PELICULA AGREGADA
    const [movies] = await connection.query(
      'SELECT BIN_TO_UUID(id) id , title, year, director, duration, poster, rate FROM movie WHERE id = UUID_TO_BIN(?);',
      [uuid]
    )

    return movies[0]
  }

  static async delete ({ id }) {
    const [movie] = await connection.query(
      `SELECT BIN_TO_UUID(id) id , title, year, director, duration,poster, rate 
      FROM movie WHERE id = UUID_TO_BIN(?);`,
      [id]
    )
    if (movie.length === -1) return false

    try {
      // Eliminar movie de la tabla movie
      await connection.query(
        `DELETE FROM movie 
        WHERE id = UUID_TO_BIN(?);`,
        [id]
      )
      // Eliminar relacion de la movie con los generos
      // de la tabla movie_genre
      await connection.query(
        `DELETE FROM movie_genre 
        WHERE movie_id = UUID_TO_BIN(?);`,
        [id]
      )
      return [({ message: 'Elimined exit' })]
    } catch (e) {
      throw new Error('Error elimined movie')
    }
  }

  static async update ({ id, input }) {
    const [movie] = await connection.query(
      `SELECT BIN_TO_UUID(id) id , title, year, director, duration,poster, rate 
      FROM movie WHERE id = UUID_TO_BIN(?);`,
      [id]
    )
    if (movie.length === -1) return false

    const {
      title,
      year,
      director,
      duration,
      rate,
      poster
    } = input

    const ArrayUpdate = [title, year, director, duration, rate, poster]
    const ArrayUpdateType = ['title', 'year', 'director', 'duration', 'rate', 'poster']

    for (let i = 0; i < ArrayUpdate.length; i++) {
      if (ArrayUpdate[i] !== undefined) {
        try {
          await connection.query(
            `UPDATE movie SET ${ArrayUpdateType[i]} = ?
            WHERE id = UUID_TO_BIN(?); `,
            [ArrayUpdate[i], id]
          )
        } catch (e) {
          throw new Error('Error creating movie')
        }
        console.log(ArrayUpdate[i])
        console.log(ArrayUpdateType[i])
      }
    }
    const [movie2] = await connection.query(
      `SELECT BIN_TO_UUID(id) id , title, year, director, duration,poster, rate 
      FROM movie WHERE id = UUID_TO_BIN(?);`,
      [id]
    )
    if (movie2.length === -1) return false
    return movie2[0]
  }
}
