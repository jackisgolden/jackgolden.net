import './App.css';
import Header from './components/Header';
import Carousel from './components/Carousel';
import projects from './data/projects.json'; // Import the projects data

function App() {
  return (
    <div className="App">
      <Header />
      <Carousel projects={projects} />
    </div>
  );
}

export default App;
