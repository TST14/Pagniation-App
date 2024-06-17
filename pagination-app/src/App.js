import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // State to store all employees
  const [employees, setEmployees] = useState([]);
  // State to store employees of the current page
  const [currentEmployees, setCurrentEmployees] = useState([]);

  // State to handle pagination data
  const [pagination, setPagination] = useState({
    currentPage: 0,
    itemsPerPage: 10,
  });

  // Function to set the employees for the current page
  const updateCurrentPageEmployees = () => {
    const startIndex = pagination.currentPage * pagination.itemsPerPage;
    const newCurrentEmployees = employees.slice(
      startIndex,
      startIndex + pagination.itemsPerPage
    );
    setCurrentEmployees(newCurrentEmployees);
  };

  // Function to fetch employees from the API
  const loadEmployees = async () => {
    try {
      const response = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      alert("Failed to fetch data");
    }
  };

  // Function to handle page navigation
  const navigate = (direction) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: prev.currentPage + direction,
    }));
  };

  // Fetch employees on component mount
  useEffect(() => {
    loadEmployees();
  }, []);

  // Update current employees whenever employees or pagination changes
  useEffect(() => {
    updateCurrentPageEmployees();
  }, [pagination, employees]);

  return (
    <section className="main-container">
      <h1>Employee Data Table</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.role}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4}></td>
          </tr>
        </tfoot>
      </table>
      <div>
        <button
          disabled={pagination.currentPage === 0}
          className="btn"
          onClick={() => navigate(-1)}
        >
          Previous
        </button>
        <span className="btn">{pagination.currentPage + 1}</span>
        <button
          disabled={
            pagination.currentPage ===
            Math.ceil(employees.length / pagination.itemsPerPage) - 1
          }
          className="btn"
          onClick={() => navigate(1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default App;
