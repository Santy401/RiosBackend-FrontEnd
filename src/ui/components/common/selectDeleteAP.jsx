import "../components/styles/DeleteAP.css";
import PropTypes from "prop-types";
import { useEffect } from "react";

const SelectDeleteAP = ({ companies = [], areas = [], onDeleteCompany, onDeleteArea }) => {
  useEffect(() => {
    localStorage.setItem("companies", JSON.stringify(companies));
    localStorage.setItem("areas", JSON.stringify(areas));
  }, [companies, areas]);

  return (
    <div>
      <div className="backdrop"></div>
      <div className="deleteAP">
        <div className="section">
          <h4>Empresas</h4>
          {companies.length === 0 ? (
            <p>No creadas.</p>
          ) : (
            <ul className="list">
              {companies.map((company, index) => (
                <li key={index} className="listItem">
                  <div>
                    <span>{company}</span>
                    <button
                      className="deleteButton"
                      onClick={() => onDeleteCompany(company)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="section">
          <h4>Áreas</h4>
          {areas.length === 0 ? (
            <p>No creadas.</p>
          ) : (
            <ul className="list">
              {areas.map((area, index) => (
                <li key={index} className="listItem">
                  <div>
                    <span>{area}</span>
                    <button
                      className="deleteButton"
                      onClick={() => onDeleteArea(area)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

SelectDeleteAP.propTypes = {
  companies: PropTypes.arrayOf(PropTypes.string).isRequired,
  areas: PropTypes.arrayOf(PropTypes.string).isRequired,
  onDeleteCompany: PropTypes.func.isRequired,
  onDeleteArea: PropTypes.func.isRequired,
};

export default SelectDeleteAP;
