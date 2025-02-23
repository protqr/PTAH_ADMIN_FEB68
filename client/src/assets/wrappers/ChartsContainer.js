import styled from 'styled-components';

const Wrapper = styled.section`
  margin-top: 4rem;
  padding: 1rem; /* เพิ่ม padding เพื่อไม่ให้ชิดขอบ */
  text-align: center;
  overflow: hidden; /* ป้องกันไม่ให้เนื้อหาหลุด */

  button {
    background: transparent;
    border-color: transparent;
    text-transform: capitalize;
    color: var(--primary-500);
    font-size: 1.25rem;
    cursor: pointer;
  }

  h4 {
    text-align: center;
    margin-bottom: 0.75rem;
  }

`;


export default Wrapper;
