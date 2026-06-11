import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllExams } from '../../api/apiService';

const CATEGORY_ICONS = {
  'SSC': '🏛️',
  'Banking': '🏦',
  'Defence': '🛡️',
  'Railways': '🚆',
  'Civil Services': '⚖️',
  'Teaching': '👨‍🏫',
  'Engineering': '⚙️',
  'Medical': '⚕️',
  'Law': '📜',
  'State Exams': '📍'
};

const ExamsMegaMenu = ({ onClose }) => {
  const navigate = useNavigate();
  const [examData, setExamData] = useState({});
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      // Fetch a large batch to populate the menu heavily
      const response = await getAllExams({ size: 300, sort: 'popularity' });
      const exams = response.data.content || [];
      
      // Group by category
      const grouped = exams.reduce((acc, exam) => {
        if (!acc[exam.category]) {
          acc[exam.category] = [];
        }
        acc[exam.category].push(exam);
        return acc;
      }, {});
      
      // Sort categories
      const sortedCategories = Object.keys(grouped).sort();
      
      setExamData(grouped);
      setCategories(sortedCategories);
      if (sortedCategories.length > 0) {
        setActiveCategory(sortedCategories[0]);
      }
    } catch (error) {
      console.error("Failed to load mega menu data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExamClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/exams/${id}`);
    if (onClose) onClose();
  };

  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/exams?category=${encodeURIComponent(category)}`);
    if (onClose) onClose();
  };

  return (
    <div className="mega-menu glass-panel shadow-lg animate-fade-in" onMouseLeave={onClose}>
      <div className="mega-menu-inner">
        {/* Left Pane: Categories */}
        <div className="category-pane">
          <h6 className="mega-menu-title text-muted mb-3 px-3">Browse Categories</h6>
          {loading ? (
            <div className="px-3 text-muted">Loading categories...</div>
          ) : (
            <ul className="category-list m-0 p-0">
              {categories.map((cat) => (
                <li 
                  key={cat} 
                  className={`category-item ${activeCategory === cat ? 'active' : ''}`}
                  onMouseEnter={() => setActiveCategory(cat)}
                  onMouseDown={(e) => handleCategoryClick(e, cat)}
                >
                  <span className="me-2">{CATEGORY_ICONS[cat] || '📚'}</span>
                  {cat} Exams
                  <i className="bi bi-chevron-right ms-auto" style={{ fontSize: '0.8rem', opacity: activeCategory === cat ? 1 : 0.4 }}></i>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right Pane: Dynamic Exams Grid */}
        <div className="exams-pane">
          {activeCategory && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mega-menu-title m-0 text-gradient-primary">
                  Top {activeCategory} Exams
                </h6>
                <span 
                  className="text-primary fw-bold" 
                  style={{ fontSize: '0.85rem', cursor: 'pointer' }}
                  onMouseDown={(e) => handleCategoryClick(e, activeCategory)}
                >
                  View All &rarr;
                </span>
              </div>
              
              <div className="exams-grid">
                {examData[activeCategory]?.slice(0, 15).map(exam => (
                  <div 
                    key={exam.id} 
                    className="exam-grid-item"
                    onMouseDown={(e) => handleExamClick(e, exam.id)}
                  >
                    <div className="fw-semibold text-truncate">{exam.name}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{exam.conductingBody}</div>
                  </div>
                ))}
              </div>
              
              {examData[activeCategory]?.length > 15 && (
                <div className="mt-3 text-center">
                   <div 
                      className="text-muted" 
                      style={{ fontSize: '0.85rem', cursor: 'pointer' }}
                      onMouseDown={(e) => handleCategoryClick(e, activeCategory)}
                   >
                     + {examData[activeCategory].length - 15} more in this category
                   </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamsMegaMenu;
