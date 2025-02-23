import styled from 'styled-components';

const Wrapper = styled.aside`
  display: none;
  @media (min-width: 992px) {
    display: block;
    box-shadow: 1px 0px 0px 0px rgba(0, 0, 0, 0.1);
    .sidebar-container {
      background: var(--background-secondary-color);
      min-height: 100vh;
      height: 100%;
      width: 240px;
      margin-left: -250px;
      transition: margin-left 0.3s ease-in-out;
    }
    .content {
      position: fixed;
      top: 0;
    }
    .show-sidebar {
      margin-left: 0;
    }
    header {
      height: 6rem;
      display: flex;
      align-items: center;
      padding-left: 2.5rem;
    }
    .nav-links {
      padding-top: 2rem;
      display: flex;
      flex-direction: column;
      padding-bottom: 50rem;
      background-color: #87cefa;
    }
    .nav-link {
      display: flex;
      align-items: center;
      color: white;
      padding: 1rem 0;
      padding-left: 2.5rem;
      padding-right: 2.5rem;
      padding-bottom: 1.5rem;
      text-transform: capitalize;
      transition: padding-left 0.3s ease-in-out;
    }
    .nav-link:hover {
      padding-left: 3rem;
      color: #1878b4;
      transition: var(--transition);
      /* border-bottom: 2px solid white; */
    }
    .icon {
      font-size: 1.5rem;
      margin-right: 1rem;
      display: grid;
      place-items: center;
    }
    .active {
      color: #1878b4;
    }
    .pending {
      background: var(--background-color);
    }
  }
`;
export default Wrapper;
