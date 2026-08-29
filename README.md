# introduccion-desarrollo-web

"Veterinaria La Mary"

### Integrantes Grupo 10:

- Guadalupe Cristina Chalup
- Braian Galvan
- Yanina Gisel Galvan
- María Belen Hermida
- Sonia Monte

## Enlace a GITHUB

https://github.com/galvanyani95/introduccion-desarrollo-web.git

## Consignas:

El trabajo consiste en crear una página web para la veterinaria “La Mary” que permita mostrar información del lugar y de sus veterinarios, incluyendo su especialidad y precio de consulta.
Además, los administradores podrán registrar mascotas, sacar turnos y llevar la historia clínica de cada mascota. El sistema también tendrá filtros para buscar veterinarios y turnos más fácilmente.
Para realizarlo vamos a utilizar HTML, CSS, JavaScript y Bootstrap, guardando algunos datos en LocalStorage y obteniendo información de una API REST mediante

## Registrar los siguientes datos:

## De las Mascotas:

- idMascota: string con uid identificatorio.
- nombreMascota: string.
- nombreDuenio: string.
- color: string.
- edad: número entero.
- peso: número decimal.
- imagenMascota: string con la imagen en formato Base64.
  ## De los Veterinarios:
- idVeterinario: string con uid identificatorio.
- matricula: número entero.
- nombre: string.
- especializacion: string.
- valorConsulta: número decimal.
  ## De los Turnos:
- idTurno: string con uid identificatorio.
- fechaHora: fecha y hora del turno.
- mascota: identificador de la entidad Mascota.
- veterinario: identificador de la entidad Veterinario.
  ## De la Historia Clínica:
- idHistoriaClinica: string con uid identificatorio.
- mascota: identificador de la entidad Mascota (a quién pertenece).
- veterinario: identificador de la entidad Veterinario (quién atendió).
- fechaHora: fecha y hora de la atención.
- observaciones: string (notas libres del profesional).
  ## REQUERIMIENTOS
  Se debe contar con interfaces de usuario interactivas que permitan acceder a las siguientes
  opciones:
  ## veterinaria (Rol Visitante)
- Portada, incluyendo el listado de profesionales disponibles con su especialización y valor de
  consulta
- Información institucional
- Contacto

  ## Administradores de la veterinaria (Rol Administrador)

- Para todas las entidades:
  o Listar en formato tabla los datos registrados.
- En referencia a los Veterinarios:
  o Registrar uno nuevo.
  o Editar los datos de uno existente.
  o Eliminar un veterinario.
- En referencia a las Mascotas:
  o Registrar una nueva.
  o Editar los datos de una existente.
  o Eliminar una mascota.

- En referencia a los Turnos:
  o Registrar nuevos turnos para cada veterinario.
  o Eliminar turnos existentes.

- En referencia a la Historia Clínica:
  o Registrar nuevas entradas asociadas a una mascota y un veterinario.
  o Visualizar el historial completo de una mascota

  ## OPCIONALES VALORABLES

  ## 1ra entrega:REQUERIMIENTOS A CUMPLIMENTAR

- Crear un documento (página web) de Inicio o Portada.
- Crear un documento (página web) de Información Institucional.
- Crear un documento (página web) de Contacto.
- Cada documento deberá contar con un menú de navegación en la parte superior y un pie de página en
  la parte inferior.
- Los documentos deberán estar vinculados entre sí mediante enlaces (<a>), de modo que se pueda
  navegar desde cualquiera de ellos hacia los demás.
- Los enlaces deberán utilizar rutas relativas y el menú de navegación deberá replicarse en todos los
  documentos.
- Se deberá utilizar Vite como servidor de desarrollo. Para ello, dentro de la carpeta del proyecto, se
  instalará la dependencia con el comando npm install -D vite y luego levantar el servidor con
  npx vite.

## 1 ENTREGA DE AVANCES 8-9-2026
- Guadalupe Cristina Chalup
- Braian Galvan
- Yanina Gisel Galvan
