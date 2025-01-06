# 📊 API REST con Google Sheets

## ¿Qué hace el proyecto? 🤔
Este proyecto convierte una hoja de cálculo de Google Sheets en una base de datos accesible mediante una API REST.

Proporciona las siguientes funcionalidades:
1. **Leer todos los datos**: 📝 Obtiene todo el contenido de la hoja.
2. **Leer una fila específica**: 🔍 Busca y devuelve una fila basada en un valor clave.
3. **Escribir o actualizar una fila**: ✏️ Inserta datos nuevos o actualiza una fila existente si la clave ya está presente. Si al insertar una fila es la última fila disponible en la hoja, se agregarán automáticamente 1000 filas más para asegurar espacio.
4. **Eliminar una fila**: 🗑️ Borra una fila específica usando una clave.
5. **Control de unicidad**: 🔑 Garantiza que ciertos valores sean únicos en una columna definida.
6. **Autenticación por token**: 🔒 Requiere un token válido, almacenado en "Hoja 2", para autenticar las solicitudes.

## ¿Qué tecnologías usa? 🛠️
1. **Google Apps Script**:
   - Usado para escribir el backend del proyecto.
   - Permite integrar Google Sheets con un servicio web a través de una API REST.
2. **Google Sheets**:
   - Sirve como la base de datos para almacenar los datos.
3. **HTTP**:
   - Para realizar las solicitudes GET a la API generada.

## ¿Cómo está estructurado el código? 🧩
El código está organizado en varias funciones para manejar diferentes acciones:
1. **`doGet`**:
   - Punto de entrada que procesa las solicitudes entrantes y dirige la ejecución a la función correspondiente según el parámetro `action`.
2. **Funciones específicas**:
   - **`readData`**: 📄 Lee todos los datos de la hoja.
   - **`readDataByKey`**: 🔑 Busca una fila específica basada en una clave.
   - **`writeOrUpdateData`**: ✍️ Inserta una nueva fila o actualiza una existente. Si la hoja alcanza su límite de filas disponibles, se agregarán 1000 filas automáticamente. Controla que ciertos valores sean únicos en una columna definida.
   - **`deleteDataByKey`**: ❌ Elimina una fila específica basada en una clave.
   - **`isValidToken`**: 🔒 Valida que el token proporcionado exista en "Hoja 2".
3. **Gestión de errores**:
   - Maneja casos donde la hoja no exista, el token no sea válido o se incumplan las restricciones de unicidad.

## Ejemplos de uso 🚀
### Base URL del API:
`https://script.google.com/macros/s/AKfycbxyYEV4RU_wg-4Vot9HUxubr5hyx2F_OSXOnj2Ch2YwBGJ37t8spi30zK5fbfadUA_M/exec`

### **1. Leer todos los datos** 📝
**URL:**  
[`https://script.google.com/macros/s/AKfycbxyYEV4RU_wg-4Vot9HUxubr5hyx2F_OSXOnj2Ch2YwBGJ37t8spi30zK5fbfadUA_M/exec?action=read&sheet=Hoja 1&token=tu_token`](https://script.google.com/macros/s/AKfycbxyYEV4RU_wg-4Vot9HUxubr5hyx2F_OSXOnj2Ch2YwBGJ37t8spi30zK5fbfadUA_M/exec?action=read&sheet=Hoja%201&token=tu_token)

**Descripción:**  
Obtiene todos los datos de la hoja llamada `Hoja 1` si el token es válido.

---

### **2. Leer una fila específica** 🔍
**URL:**  
[`https://script.google.com/macros/s/AKfycbxyYEV4RU_wg-4Vot9HUxubr5hyx2F_OSXOnj2Ch2YwBGJ37t8spi30zK5fbfadUA_M/exec?action=readByKey&sheet=Hoja 1&key=id&value=3&token=tu_token`](https://script.google.com/macros/s/AKfycbxyYEV4RU_wg-4Vot9HUxubr5hyx2F_OSXOnj2Ch2YwBGJ37t8spi30zK5fbfadUA_M/exec?action=readByKey&sheet=Hoja%201&key=id&value=3&token=tu_token)

**Descripción:**  
Busca una fila donde la columna `id` tenga el valor `3` en la hoja `Hoja 1` si el token es válido.

---

### **3. Escribir o actualizar datos** ✏️
**URL:**  
[`https://script.google.com/macros/s/AKfycbxyYEV4RU_wg-4Vot9HUxubr5hyx2F_OSXOnj2Ch2YwBGJ37t8spi30zK5fbfadUA_M/exec?action=write&sheet=Hoja 1&id=3&name=Charlie&email=charlie@example.com&token=tu_token`](https://script.google.com/macros/s/AKfycbxyYEV4RU_wg-4Vot9HUxubr5hyx2F_OSXOnj2Ch2YwBGJ37t8spi30zK5fbfadUA_M/exec?action=write&sheet=Hoja%201&id=3&name=Charlie&email=charlie@example.com&token=tu_token)

**Descripción:**  
- Si `id=3` ya existe, actualiza la fila correspondiente con los valores proporcionados (`name=Charlie`, `email=charlie@example.com`).
- Si `id=3` no existe, inserta una nueva fila con esos datos.
- Si la hoja alcanza el límite de filas, agrega automáticamente 1000 filas nuevas.
- Verifica que `email` sea único antes de insertarlo.

---

### **4. Eliminar una fila** 🗑️
**URL:**  
[`https://script.google.com/macros/s/AKfycbxyYEV4RU_wg-4Vot9HUxubr5hyx2F_OSXOnj2Ch2YwBGJ37t8spi30zK5fbfadUA_M/exec?action=delete&sheet=Hoja 1&key=id&value=3&token=tu_token`](https://script.google.com/macros/s/AKfycbxyYEV4RU_wg-4Vot9HUxubr5hyx2F_OSXOnj2Ch2YwBGJ37t8spi30zK5fbfadUA_M/exec?action=delete&sheet=Hoja%201&key=id&value=3&token=tu_token)

**Descripción:**  
Elimina la fila donde la columna `id` tenga el valor `3` en la hoja `Hoja 1` si el token es válido.

---

## Configuración adicional 🔧
### 1. **Token de autenticación** 🔒
- Los tokens permitidos deben estar almacenados en **"Hoja 2"**.
- Puedes escribirlos en cualquier celda de esta hoja. El script buscará en todas las celdas disponibles.
- Ejemplo de contenido de "Hoja 2":

| Token      |
|------------|
| token123   |
| otroToken  |
| token456   |

---

### 2. **Control de unicidad** 🔑
- La columna a validar como única está configurada en el código.
- Puedes pasar el nombre de la columna como parámetro en el código para verificar valores únicos.

---

## ¿Cómo ponerlo a andar? ⚙️
### 1. **Configurar el entorno** 🛠️
1. Copia el [Spreadsheet base de ejemplo](https://docs.google.com/spreadsheets/d/1QxiSrIysDOWQM6ZTtydEePrzv2IZGsUoa28TwpVS8NY/edit?usp=sharing).
   - Guarda una copia en tu cuenta de Google Drive.
   - Asegúrate de que la hoja principal tenga el nombre `Hoja 1` (o actualiza los parámetros en las solicitudes de la API si usas otro nombre).
   - Configura una hoja secundaria llamada `Hoja 2` para los tokens.
2. En la hoja base, asegúrate de tener columnas clave como `id`, `name`, y `email` para aprovechar todas las funcionalidades.

---

### 2. **Configurar el script** 🖥️
1. Abre el menú `Extensiones > Apps Script` en la hoja copiada.
2. Pega el código proporcionado en el editor de Apps Script.
3. Publica el script como una Web App:
   - Haz clic en `Deploy > New deployment`.
   - Selecciona `Web App`.
   - Configura los permisos de acceso como "Cualquiera con el enlace".
   - Copia la URL generada.

---

### 3. **Probar la API** 🚀
Usa herramientas como `Postman`, `cURL`, o directamente el navegador para realizar solicitudes HTTP usando la URL generada y los ejemplos proporcionados.

---

## Contribuciones 🤝
1. Forkea este repositorio.
2. Realiza mejoras, correcciones o añade funcionalidades adicionales.
3. Envía un Pull Request explicando tus cambios.

---

## Licencia 📜
Este proyecto está licenciado bajo la [Licencia Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

Eres libre de:
- Compartir: copiar y redistribuir el material en cualquier medio o formato.
- Adaptar: remezclar, transformar y construir sobre el material para cualquier propósito, incluso comercialmente.

**Bajo las siguientes condiciones:**
- **Atribución**: Debes dar crédito adecuado, proporcionar un enlace a la licencia e indicar si se realizaron cambios. Puedes hacerlo de cualquier forma razonable, pero no de una manera que sugiera que tienes el apoyo del licenciante.
