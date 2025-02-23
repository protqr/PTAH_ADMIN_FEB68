import styled from "styled-components";

const Wrapper = styled.section`
  nav {
    width: var(--fluid-width);
    max-width: var(--max-width);
    margin: 0 auto;
    height: var(--nav-height);
    display: flex;
    align-items: center;
  }
  .page {
    min-height: calc(100vh - var(--nav-height));
    display: grid;
    align-items: center;
    margin-top: -3rem;
  }
  h1 {
    font-weight: 700;
    span {
      color: rgb(100, 196, 255);
    }
    margin-bottom: 1.5rem;
  }
  h5 {
    margin-bottom: 30px;
    line-height: 50px;
    color: #535353;
  }
  p {
    line-height: 2;
    color: var(--text-secondary-color);
    margin-bottom: 1.5rem;
    max-width: 35em;
  }
  .register-link {
    margin-right: 1rem;
  }
  .main-img {
    display: none;
    height: 400px;
  }
  .btn {
    padding: 0.75rem 1rem;
    width: 28%;
    text-align: center;
    background-color: rgb(100, 196, 255);
  }
  .btn:hover {
    background-color: rgb(149, 214, 255);
    color: aliceblue;
  }
  @media (min-width: 992px) {
    .page {
      grid-template-columns: 1fr 500px;
      column-gap: 3rem;
    }
    .main-img {
      display: block;
    }
  }
`;
export default Wrapper;
