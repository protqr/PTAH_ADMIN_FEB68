import styled from "styled-components";

const Wrapper = styled.section`
  display: grid;
  row-gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
  }
  @media (min-width: 1120px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  .stat-item-wrapper {
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

export default Wrapper;
