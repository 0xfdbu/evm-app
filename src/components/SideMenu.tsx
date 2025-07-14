import { Link } from "react-router-dom";

const SideMenu = () => (
  <div className="side-menu-wrapper">
    <div className="d-flex align-self-center my-4">
      <h2 className='mb-0'>Open Forum</h2>
    </div>

    <div className="mb-4">
      <ul className="list-group list-group-flush">
        <li className="list-group-item p-0">
          <Link to="/" className="d-block px-3 py-2 text-decoration-none text-dark">Home</Link>
        </li>
        <li className="list-group-item p-0">
          <Link to="/create" className="d-block px-3 py-2 text-decoration-none text-dark">Create Post</Link>
        </li>
        <li className="list-group-item p-0">
          <Link to="/profile" className="d-block px-3 py-2 text-decoration-none text-dark">Profile (Coming soon)</Link>
        </li>
        {/* Add more menu items as needed */}
      </ul>
    </div>
  </div>
);

export default SideMenu;
