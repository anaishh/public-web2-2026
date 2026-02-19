/**
 * Tema 3 - Ejemplo 3: Cliente HTTP con fetch nativo
 * 
 * Node.js 21+ incluye fetch de forma estable.
 * 
 * Ejecutar: npm run client
 * Nota: Primero ejecuta el servidor con: npm run routing
 */

const BASE_URL = 'http://localhost:3000/api';

// GET - Obtener todos los cursos
async function getAllCursos() {
  console.log('\n📚 GET /api/cursos');
  console.log('─'.repeat(40));
  
  try {
    const response = await fetch(`${BASE_URL}/cursos`);
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Cursos:', data);
    return data;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// GET con Query Params
async function getCursosFiltered() {
  console.log('\n🔍 GET /api/cursos?nivel=basico&orden=vistas');
  console.log('─'.repeat(40));
  
  try {
    const url = new URL(`${BASE_URL}/cursos`);
    url.searchParams.set('nivel', 'basico');
    url.searchParams.set('orden', 'vistas');
    
    const response = await fetch(url);
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Cursos filtrados:', data);
    return data;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// GET - Obtener curso por ID
async function getCursoById(id) {
  console.log(`\n📖 GET /api/cursos/${id}`);
  console.log('─'.repeat(40));
  
  try {
    const response = await fetch(`${BASE_URL}/cursos/${id}`);
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Curso:', data);
    return data;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// POST - Crear nuevo curso
async function createCurso(curso) {
  console.log('\n➕ POST /api/cursos');
  console.log('─'.repeat(40));
  console.log('Body:', curso);
  
  try {
    const response = await fetch(`${BASE_URL}/cursos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(curso)
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Creado:', data);
    return data;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// PATCH - Actualización parcial
async function patchCurso(id, cambios) {
  console.log(`\n🔧 PATCH /api/cursos/${id}`);
  console.log('─'.repeat(40));
  console.log('Cambios:', cambios);
  
  try {
    const response = await fetch(`${BASE_URL}/cursos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cambios)
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Resultado:', data);
    return data;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// DELETE - Eliminar curso
async function deleteCurso(id) {
  console.log(`\n🗑️ DELETE /api/cursos/${id}`);
  console.log('─'.repeat(40));
  
  try {
    const response = await fetch(`${BASE_URL}/cursos/${id}`, {
      method: 'DELETE'
    });
    
    console.log('Status:', response.status);
    console.log(response.status === 204 ? 'Curso eliminado' : 'Error');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Fetch con Timeout
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Timeout excedido');
    }
    throw error;
  }
}

// API externa de ejemplo
async function fetchExternalAPI() {
  console.log('\n🌐 Ejemplo con API externa (JSONPlaceholder)');
  console.log('─'.repeat(40));
  
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
    const posts = await response.json();
    
    console.log('Posts obtenidos:');
    posts.forEach(post => {
      console.log(`  - [${post.id}] ${post.title.substring(0, 40)}...`);
    });
    
    return posts;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Ejecutar ejemplos
async function main() {
  console.log('═'.repeat(50));
  console.log('   CLIENTE HTTP CON FETCH NATIVO (Node.js 21+)');
  console.log('═'.repeat(50));
  
  // Verificar conexión
  try {
    await fetch(`${BASE_URL}/cursos`);
  } catch {
    console.error('\n❌ No se puede conectar al servidor.');
    console.error('   Primero ejecuta: npm run routing\n');
    return;
  }
  
  await getAllCursos();
  await getCursosFiltered();
  await getCursoById(1);
  
  const nuevoCurso = await createCurso({
    titulo: 'TypeScript desde Cero',
    nivel: 'basico'
  });
  
  if (nuevoCurso) {
    await patchCurso(nuevoCurso.id, { vistas: 100 });
    await deleteCurso(nuevoCurso.id);
  }
  
  await fetchExternalAPI();
  
  console.log('\n' + '═'.repeat(50));
  console.log('   EJEMPLOS COMPLETADOS');
  console.log('═'.repeat(50) + '\n');
}

main();
