-- Eliminación de la base de datos
DROP DATABASE IF EXISTS moviesdb;
-- Creación de la base de datos
CREATE DATABASE moviesdb;

-- USAR
USE moviesdb;

-- Crear la tabla movies
CREATE TABLE IF NOT EXISTS movie (
	id 			BINARY(16) 		PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    title 		VARCHAR(255)	NOT NULL,
    year 		INT 			NOT NULL,
    director 	VARCHAR(255)    NOT NULL,
    duration 	INT 			NOT NULL,
    poster 		TEXT					,
    rate 		DECIMAL(2,1)	UNSIGNED NOT NULL
);

CREATE TABLE IF NOT EXISTS genre (
	id 		INT 			AUTO_INCREMENT 	PRIMARY KEY,
	name	VARCHAR(255)  	NOT NULL 		UNIQUE
);

CREATE TABLE IF NOT EXISTS movie_genre (
	movie_id	BINARY(16) 	REFERENCES movies(id),
	genre_id 	INT 		REFERENCES genres(id),
    PRIMARY KEY (movie_id,genre_id)
);

-- SELECT * FROM genre;
-- SELECT id FROM movie WHERE title = 'Inception'
-- SELECT BIN_TO_UUID (id) id , title, year, director, duration, poster, rate FROM movie;

INSERT INTO genre (name) VALUES ('drama'),('action'),('crime'),('adventure'),('sci-Fi'),('romance');

INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES 
(UUID_TO_BIN(UUID()),"Inception",2010,"Christopher Nolan",148,"https://m.media-amazon.com/images/I/91Rc8cAmnAL._AC_UF1000,1000_QL80_.jpg",8.8),
(UUID_TO_BIN(UUID()),"The Shawshank Redemption",1994,"Frank Darabont Nolan",142,"https://i.ebayimg.com/images/g/4goAAOSwMyBe7hnQ/s-l1200.webp",9.3),
(UUID_TO_BIN(UUID()),"The Dark Knight",2008,"Christopher Nolan",152,"https://i.ebayimg.com/images/g/yokAAOSw8w1YARbm/s-l1200.jpg",9.0);

INSERT INTO movie_genre (movie_id, genre_id) VALUES 
((SELECT id FROM movie WHERE title = 'Inception'),(SELECT id FROM genre WHERE name = "sci-Fi")),
((SELECT id FROM movie WHERE title = 'Inception'),(SELECT id FROM genre WHERE name = "adventure")),
((SELECT id FROM movie WHERE title = 'Inception'),(SELECT id FROM genre WHERE name = "action")),
((SELECT id FROM movie WHERE title = 'The Dark Knight'),(SELECT id FROM genre WHERE name = "action")),
((SELECT id FROM movie WHERE title = 'The Dark Knight'),(SELECT id FROM genre WHERE name = "crime")),
((SELECT id FROM movie WHERE title = 'The Dark Knight'),(SELECT id FROM genre WHERE name = "drama")),
((SELECT id FROM movie WHERE title = 'The Shawshank Redemption'),(SELECT id FROM genre WHERE name = "drama"));

/* -- ---- CONSULTA PARA BUSCAR POR GENERO EN LAS PELICULAS 
SELECT BIN_TO_UUID(movie.id) id, movie.title, movie.year, movie.director, movie.duration, movie.poster, movie.rate 
FROM movie
JOIN movie_genre ON BIN_TO_UUID(movie.id) = BIN_TO_UUID(movie_genre.movie_id)
JOIN genre ON movie_genre.genre_id = genre.id
WHERE genre.name = "CRIME"; 
*/
/* -- ---- CONSULTA PARA TRAER LA RELACION DEL GENERO CON EL NOMBRE DE LA PELICULA
SELECT BIN_TO_UUID(movie_genre.movie_id) movie_id, movie_genre.genre_id,  movie.title, genre.name  
FROM movie
JOIN movie_genre ON BIN_TO_UUID(movie.id) = BIN_TO_UUID(movie_genre.movie_id)
JOIN genre ON movie_genre.genre_id = genre.id;
*/
/* -- ---- CONSULTA PARA ELIMINAR UNA PELICULA DE LA BASE DE DATOS
DELETE FROM movie WHERE id = UUID_TO_BIN("ab3d5420-cf85-11ee-bf5e-4cedfb09524f");
DELETE FROM movie_genre WHERE movie_id = UUID_TO_BIN("fa736148-cfa3-11ee-bf5e-4cedfb09524f");
*/
/* -- ---- CONSULTA PARA ACTUALIZAR CUALQUIER DATO EN UNA PELICULA
UPDATE movie SET year = 2000 WHERE id = UUID_TO_BIN("130c2e8f-cfa6-11ee-bf5e-4cedfb09524f");
*/


