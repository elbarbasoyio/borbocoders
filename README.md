<div id="top"></div>

# MaridApp
Es una aplicación web que permite que el camarero tome la comanda de una mesa desde un tablet o smartphone Android, y la envíe de manera instantanea a las impresoras y pantallas de las distintas zonas del restaurante como ser: cocina, barra y caja.

Su interfaz es muy intuitiva y fácil de usar. Permite un rápido aprendizaje sin sacrificar por ello funcionalidades.

<br>

## Fotos de Pantalla

![Login](readme/screenshots/login.png)
![Registro](readme/screenshots/registro.png)
![Admin](readme/screenshots/admin_home.png)
![Crear Mesa](readme/screenshots/admin_agregar_mesa.png)
![Eliminar Mesa](readme/screenshots/admin_eliminar_mesa.png)

<p align="right">(<a href="#top">volver a inicio</a>)</p>

<br>

## Pre-requisitos
* [Composer 2.1](https://getcomposer.org/download/) o superior

<p align="right">(<a href="#top">volver a inicio</a>)</p>

<br>

## Instalación
1. Crear un directorio donde alojar la aplicación
   ```sh
   mkdir maridapp
   ```

2. Clonar el repositorio de la aplicación en el directorio creado
   ```sh
   cd maridapp
   git clone https://github.com/Alaneta/borbocoders.git .
   ```

3. Instalar las dependencias de la aplicación
   ```sh
   composer install
   ```

4. Actualizar las dependencias instaladas
   ```sh
   composer update
   ```

5. Crear el archivo de variables de entorno
   ```sh
   cp .env.example .env
   ```

6. Reemplazar la información de conexión a la base de datos en el archivo .env
   ```sh
   DB_CONNECTION=mysql
   DB_HOST=mysql
   DB_PORT=3306
   DB_DATABASE=marida_app
   DB_USERNAME=<username>
   DB_PASSWORD=<password>
   ```
   El usuario y contraseña por defecto son:
   > usuario: sail

   > contraseña: password

7. Modificar la configuración del mail para poder realizar envíos de correo desde la aplicación. En el ejemplo, se incluye el SMTP de Gmail.

   Reemplazar `MAIL_USERNAME` y `MAIL_PASSWORD` con los datos de la cuenta de email
   ```sh
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=<email@email.com>
   MAIL_PASSWORD=<password>
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS=<email@email.com>
   MAIL_FROM_NAME=MaridApp
   ```

8. Generar la variable de entorno APP_KEY
   ```sh
   php artisan key:generate
   ```

9.  Iniciar los contenedores en modo desatendido
    ```sh
    ./vendor/bin/sail up -d
    ```

10. Instalar las dependencias requeridas
    ```sh
    ./vendor/bin/sail npm install
    ```

11. Generar las migraciones de la base de datos:
    ```sh
    ./vendor/bin/sail artisan migrate
    ```

La aplicación se estará ejecutando en el host local: http://localhost/login

<p align="right">(<a href="#top">volver a inicio</a>)</p>

<br>

### Creación de Tablas
Las siguientes consultas deben ser ejecutadas para crear las tablas en la base de datos requeridas por la aplicación

```sql
SET foreign_key_checks = 0;

CREATE TABLE `roles` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `enabled` tinyint NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `role_user` (
  `user_id` int unsigned NOT NULL,
  `role_id` int unsigned NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `fk_role_idx` (`role_id`),
  CONSTRAINT `fk_role_idx` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `fk_user_idx` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

CREATE TABLE `tables` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL,
  `name` varchar(45) NOT NULL,
  `state` enum('A','C') NOT NULL DEFAULT 'C',
  `enabled` tinyint NOT NULL DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `fx_user_idx` (`user_id`),
  CONSTRAINT `fx_user_idx` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
);

CREATE TABLE `menus` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `enabled` tinyint NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
);

CREATE TABLE `categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
);

CREATE TABLE `items` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `menu_id` int unsigned NOT NULL,
  `category_id` int unsigned NOT NULL,
  `name` varchar(45) NOT NULL,
  `description` varchar(150) NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `enabled` tinyint NOT NULL DEFAULT 1,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `fk_menu_idx` (`menu_id`),
  CONSTRAINT `fk_category_idx` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  CONSTRAINT `fk_menu_idx` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`)
);

CREATE TABLE `orders` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `table_id` int unsigned NOT NULL,
  `total` decimal(12,2) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fx_table_idx` (`table_id`),
  CONSTRAINT `fx_table_idx` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`)
);

CREATE TABLE `item_order` (
  `item_id` int unsigned NOT NULL,
  `order_id` int unsigned NOT NULL,
  `quantity` int unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`item_id`,`order_id`),
  CONSTRAINT `fk_item_idx` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`),
  CONSTRAINT `fk_order_idx` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
);

INSERT INTO roles (name, enabled, created_at, updated_at) VALUES ('Admin', 1, now(), now());
INSERT INTO roles (name, enabled, created_at, updated_at) VALUES ('Mozo', 1, now(), now());
INSERT INTO roles (name, enabled, created_at, updated_at) VALUES ('Cocina', 1, now(), now());
INSERT INTO roles (name, enabled, created_at, updated_at)  VALUES ('Barra', 1, now(), now());

INSERT INTO categories (name, created_at, updated_at) VALUES ('Bebida', now(), now());
INSERT INTO categories (name, created_at, updated_at) VALUES ('Comida', now(), now());
INSERT INTO categories (name, created_at, updated_at) VALUES ('Postre', now(), now());

INSERT INTO menus (name, enabled, created_at, updated_at)  VALUES ('Menu Principal', 1, now(), now());
```

<p align="right">(<a href="#top">volver a inicio</a>)</p>

<br>

### Usuario Administrador
Una vez creadas y pobladas las tablas con datos, ingresar a http://localhost/register y crear un usuario con rol Admin.
Cabe destacar que esto solo se puede hacer porque fue comentada la parte del código que valida el ingreso de cualquier persona a esa sección.

Para restaurar esa funcionalidad una vez creado el usuario administrador se debe realizar la siguiente modificación en `routes/auth.php`:
```sh
Route::get('/register', [RegisteredUserController::class, 'create']) 
                ->middleware(['auth', 'roles:Admin'])
                ->name('register');

Route::post('/register', [RegisteredUserController::class, 'store'])
                ->middleware(['auth', 'roles:Admin']);
```

<p align="right">(<a href="#top">volver a inicio</a>)</p>

<br>

## Inicio y Detenimiento de Contenedores
Para iniciar todos los contenedores
```sh
./vendor/bin/sail up
```

Para iniciar todos los contenedores en modo desatendido
```sh
./vendor/bin/sail up -d
```

Para detener todos los contenedores
```sh
./vendor/bin/sail stop
```

Para eliminar volúmenes
```sh
./vendor/bin/sail down -v
```

<p align="right">(<a href="#top">volver a inicio</a>)</p>

<br>


## Modificar Estilos y Funciones
Para modificar estilos y funciones, se deben modificar los archivos: main.scss, card.scss, app.css y app.js. Por razones de rendimiento, estos archivos se compilan a través de Laravel Mix, generándose de esta manera el archivo webpack.mix.js.

Para compilar los archivos se debe ejecutar el comando:
```sh
   npm run dev
```
En su defecto, si se desea que los cambios se monitoreen de manera constante y se compile automáticamente se debe ejecutar el comando:
```sh
   npm run watch
```

<p align="right">(<a href="#top">volver a inicio</a>)</p>


<br>

## Construida con:
| [![Laravel](readme/logos/laravel-2.svg)](https://laravel.com/) | [![PHP](readme/logos/php-1.svg)](https://www.php.net/) | [![MySQL](readme/logos/mysql-2.svg)](https://www.mysql.com/) | [![Composer](readme/logos/composer.svg)](https://getcomposer.org/) | [![Sass](readme/logos/sass-1.svg)](https://sass-lang.com/) | [![jQuery](readme/logos/jquery-1.svg)](https://jquery.com/) | [![Bootstrap](readme/logos/bootstrap-5-1.svg)](https://getbootstrap.com/) |
|---|---|---|---|---|---|---|

<p align="right">(<a href="#top">volver a inicio</a>)</p>

<br>

## Autores
* **Alan Camussi** - Desarrollo - [Alaneta](https://github.com/Alaneta)
* **Leonardo Rivas** - Desarrollo - [elbarbasoyio](https://github.com/elbarbasoyio)
* **Marcelo Alfonso** - Documentación - [gringusss](https://github.com/gringusss)
* **Candela Nuñez** - Documentación
* **Fernando Lagoa** - Documentación - [LagFer](https://github.com/LagFer)
* **Alejandro Naifuino** - Documentación - [alenaifuino](https://github.com/alenaifuino)

<p align="right">(<a href="#top">volver a inicio</a>)</p>

<br>

## Licencia

Este proyecto está bajo la Licencia MIT. Archivo [LICENSE](LICENSE) para detalles.

<p align="right">(<a href="#top">volver a inicio</a>)</p>
