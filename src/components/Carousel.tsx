import React, { useState, useEffect } from 'react';
import './Carousel.css';
import { useSpring, animated } from 'react-spring';
import ReactMarkdown from 'react-markdown';
import linearGIF from '../assets/gif/linearPreview.gif';
import flowerGIF from '../assets/gif/flowerPreview.gif'

const getImageUrl = (fileName: string) => {
  const imagePath = Object.keys(images).find(path => path.includes(fileName));
  return imagePath ? images[imagePath] : null;
};

interface Project {
  title: string;
  description: string;
  image: string;
}

interface Props {
  projects: Project[];
}

const Carousel: React.FC<Props> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const props = useSpring({
    opacity: hovered ? 1 : 0,
    transform: `translate3d(${hovered ? 0 : -50}px,0,0)`,
  });

  useEffect(() => {
    setSelectedProject(projects[index]);
  }, [projects, index]);

  const nextProject = () => {
    setIndex((index + 1) % projects.length);
  };

  const previousProject = () => {
    setIndex((index - 1 + projects.length) % projects.length);
  };

  return (
    <div className="card" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="carousel">
        {projects.map((project, i) => (
          <img
            key={i}
            src={project.image}
            alt="Project"
            className={`carousel-image ${i !== index ? 'frozen' : ''}`}
            style={{ transform: `rotateY(${(i - index) * 30}deg) translateZ(300px)` }}
          />
        ))}
      </div>

      <animated.div className="project-info" style={props}>
        <h2>{selectedProject.title}</h2>
        <ReactMarkdown>{selectedProject.description}</ReactMarkdown> {/* Here's the change */}
      </animated.div>

      <div className="controls">
        <button onClick={previousProject}>Previous</button>
        {projects.map((_, i) => (
          <span key={i} className={`dot ${i === index ? 'active' : ''}`} onClick={() => setIndex(i)} />
        ))}
        <button onClick={nextProject}>Next</button>
      </div>
    </div>
  );
};

export default Carousel;
