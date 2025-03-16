import styled from "styled-components";

const Wrapper = styled.table`
  background: var(--background-secondary-color);
  border-radius: var(--border-radius);
  width: 100%;
  box-shadow: var(--shadow-2);
  border-collapse: collapse;

  th,
  td {
    padding: 1rem 1.5rem;
    text-align: left;
    border-bottom: 1px solid var(--grey-100);
  }

  tbody tr:hover {
    background: var(--grey-200);
  }

  .status-กำลังรักษาอยู่,
  .status-จบการรักษา {
    border-radius: var(--border-radius);
    text-transform: capitalize;
    letter-spacing: var(--letter-spacing);
    text-align: center;
    display: flex;
    padding: 0.5rem 1rem;
    margin: 0.5rem auto;
    width: fit-content;
    justify-content: center; /* เพิ่มบรรทัดนี้ */
    align-items: center; /* เพิ่มบรรทัดนี้ */
  }

  .status-กำลังรักษาอยู่ {
    background-color: #ffcccb; /* สีแดงอ่อน */
    color: #842029;
  }

  .status-จบการรักษา {
    background-color: #90ee90; /* สีเขียวอ่อน */
    color: #0f5132;
  }
  /* สไตล์สำหรับปุ่มการจัดการ */
  .actions .btn,
  button {
    display: block;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
    padding: 6px 6px;
    text-decoration: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 15px;
    width: 80px;
  }

  .edit-btn {
    background-color: #f1f1f1;
    color: #21b814;
    border: 1px solid #21b814;
    margin-bottom: 5px;
  }

  .delete-btn {
    background-color: #f1f1f1;
    color: #ff6a6a;
    border: 1px solid #ff6a6a;
    margin-bottom: 5px;
  }
`;

export default Wrapper;

