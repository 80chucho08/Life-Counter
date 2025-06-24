import { useEffect, useState } from 'react';
import './App.css';
import FlipCard from './components/FlipCard';





function App() {
  const [birthTime, setBirthTime] = useState(() => {
    return localStorage.getItem('horaNacimiento') || '00:00';
  });


  const [birthDate, setBirthDate] = useState(() => {
    return localStorage.getItem('fechaNacimiento') || '';
  });
  const [tiempo, setTiempo] = useState(null);

  useEffect(() => {
    if (!birthDate) return; // Si no hay fecha de nacimiento, no hacemos nada

    const interval = setInterval(() => {
      const partes = birthDate.split('-');

      // Creamos fecha UTC sin influencia del horario de verano
      const utcDate = new Date(Date.UTC(
        Number(partes[0]),
        Number(partes[1]) - 1,
        Number(partes[2]),
        0, 0, 0, 0
      ));
      const [hora, minuto] = birthTime.split(':').map(Number);

      // Reconstruimos la fecha en horario local sin DST
      const inicio = new Date(
        utcDate.getFullYear(),
        utcDate.getMonth(),
        utcDate.getDate(),
        hora,
        minuto,
        0,
        0
      );

      const ahora = new Date();

      let ms = ahora - inicio;

      const milisegundos = ms % 1000;
      ms = Math.floor(ms / 1000);

      const segundos = ms % 60;
      ms = Math.floor(ms / 60);

      const minutos = ms % 60;
      ms = Math.floor(ms / 60);

      const horas = ms % 24;
      ms = Math.floor(ms / 24);

      // Cálculo de años, meses y días exactos
      let años = ahora.getFullYear() - inicio.getFullYear();
      let meses = ahora.getMonth() - inicio.getMonth();
      let dias = ahora.getDate() - inicio.getDate();

      if (dias < 0) {
        meses--;
        const ultimoMes = new Date(ahora.getFullYear(), ahora.getMonth(), 0);
        dias += ultimoMes.getDate();
      }

      if (meses < 0) {
        años--;
        meses += 12;
      }

      setTiempo({ años, meses, dias, horas, minutos, segundos, milisegundos });
    }, 50);

    return () => clearInterval(interval);
  }, [birthDate, birthTime]);



  return (
    <div className="App">

      <header className="app-header">
        <h1 className='titulo'>Temporizador de Vida</h1>
      </header>

      <main>
        <div className='contenedor-input'>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => {
              const valor = e.target.value;
              const Seleccionada = new Date(`${valor}T${birthTime}`);
              const ahora = new Date();

              if (Seleccionada > ahora) {
                alert('La fecha y hora seleccionadas no pueden ser futuras.');
                return;
              }

              setBirthDate(valor);
              localStorage.setItem('fechaNacimiento', valor);
            }}
          />
          <input
            type="time"
            value={birthTime}
            onChange={(e) => {
              setBirthTime(e.target.value);
              localStorage.setItem('horaNacimiento', e.target.value);
            }}
          />

        </div>

        {!birthDate && <p>Selecciona tu fecha de nacimiento para comenzar</p>}

        {tiempo && (
          <div className="flip-clock-container">
            <FlipCard label="Años" value={tiempo.años} />
            <FlipCard label="Meses" value={tiempo.meses} />
            <FlipCard label="Días" value={tiempo.dias} />
            <FlipCard label="Horas" value={tiempo.horas} />
            <FlipCard label="Minutos" value={tiempo.minutos} />
            <FlipCard label="Segundos" value={tiempo.segundos} />
          </div>
        )}

        <button onClick={() => {
          localStorage.removeItem('fechaNacimiento');
          setBirthDate('');
          localStorage.removeItem('horaNacimiento');
          setBirthTime('00:00');

          setTiempo(null);
        }}>Borrar fecha</button>
      </main>

      <footer className="app-footer">
        <p>© 2025 Jesús Carbajal – Desarrollo Web React</p>
        <div className="footer-links">
          <a href="https://github.com/80chucho08" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/jesusalfonsonc" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </footer>

    </div>
  );

}


export default App;
