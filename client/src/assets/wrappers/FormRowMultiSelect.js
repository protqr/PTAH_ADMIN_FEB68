import styled from 'styled-components';

const Wrapper = styled.main`
  .dropdown-button {
    background-color: #f4f4f4;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid #87cefa;
  }
  .dropdown-button:hover {
    background-color: #dcdcdc;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid #87cefa;
    cursor: pointer;
  }

  .basic-multi-select {
    margin-top: 10px; /* ปรับ margin ด้านบนของ select */
    width: 100%; /* ทำให้ความกว้างของ select ครอบคลุมพื้นที่ */
  }

  .select__menu {
    position: relative;
    top: 100%; /* ปรับตำแหน่ง dropdown ให้อยู่ใต้ input */
    z-index: 9999; /* เพื่อให้ dropdown อยู่ด้านบน */
  }
`;

export default Wrapper;