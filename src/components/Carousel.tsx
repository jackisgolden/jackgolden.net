import React, { useState, useEffect } from 'react';
import './Carousel.css';
import ReactMarkdown from 'react-markdown';

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

  useEffect(() => {
    setSelectedProject(projects[0]);
  }, [projects]);

  return (
    <div className="card">
      <div className="carousel">
        <h2>{selectedProject.title}</h2>
        <img src={selectedProject.image} alt="Project" className="carousel-image" />
        <ReactMarkdown className="project-description">
          {selectedProject.description}
        </ReactMarkdown>
        <div className="project-links">
          {projects.map((project, index) => (
            <button key={index} onClick={() => setSelectedProject(project)}>
              {project.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
