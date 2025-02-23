import styled from "styled-components";

const SoftDelete = styled.button`
  background-color: #eeeded;
  color: gray;
  padding: 5px;
  border-collapse: collapse;
  border-radius: 10px;
  font-size: 18px;
  width: 6%;
  border: 0px;
  display: flex; /* เปลี่ยนเป็น flexbox */
  justify-content: center; /* จัดแนวกลางในแนวนอน */
  align-items: center; /* จัดแนวกลางในแนวตั้ง */
  margin-left: auto;
  margin-right: 10px;
  margin-top: 40px;
  cursor: pointer;
  float: right;
`;

export default SoftDelete;
