import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  .patient-icon {
    font-size: 1rem;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    svg {
      color: var(--text-secondary-color);
    }
  }
  .patient-text {
    text-transform: capitalize;
  }
`;
export default Wrapper;
