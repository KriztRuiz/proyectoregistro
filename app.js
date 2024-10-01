const formulario = document.getElementById('formulario');

formulario.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(formulario);

  try {
    const response = await fetch('https://tu-backend-desplegado.com/upload', {
      method: 'POST',
      body: formData
    });

    const result = await response.text();
    alert(result);
  } catch (error) {
    console.error('Error:', error);
    alert('Error al enviar los datos');
  }
});
