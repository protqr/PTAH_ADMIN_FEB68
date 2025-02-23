import styled from "styled-components";

const Wrapper = styled.section`
  text-align: center;
  /* กำหนดสไตล์ทั่วไปสำหรับตาราง */
  table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
      rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
    border-radius: 20px;
    margin-top: 30px;
    background-color: white;
  }

  /* สไตล์สำหรับหัวข้อตาราง */
  thead th {
    color: #333;
    text-align: center;
    padding: 20px;
    background-color: #b1e0fe;
  }
  .nopat {
    border-radius: 20px 0px 0px 0px;
  }
  .mang {
    border-radius: 0px 20px 0px 0px;
  }

  /* สไตล์สำหรับแถวในตาราง */
  tbody tr {
    border-bottom: 1px solid #dddddd;
  }

  /* สไตล์สำหรับเซลล์ในตาราง */
  tbody td {
    padding: 12px 15px;
    /* border-right: 1px solid #e1e1e1;
    border-left: 1px solid #e1e1e1; */
  }

  /* สไตล์สำหรับข้อความสถานะของผู้ป่วย */
  .status {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 5px;
    color: #fff;
    margin-top: 33px;
  }

  .status-Active {
    background-color: #5cb85c;
  }

  .status-Inactive {
    background-color: #d9534f;
  }

  /* สไตล์สำหรับปุ่มการจัดการ */
  /* .actions .btn {
    display: block;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
    padding: 8px;
    text-decoration: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 15px;
    width: 80px;
  } */

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
    font-size: medium;
  }

  /* แต่งแบบปุ่มเพิ่มเติม */
  .add-btn {
    background-color: #5cb85c; /* สีเขียว */
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    text-decoration: none;
    font-size: 16px;
    display: inline-block;
    margin: 10px 0;
  }

  /* ตัวอย่างแถบสีบนตาราง */
  .table-header {
    background-color: #4c6ef5;
    color: white;
    padding: 15px;
    font-size: 18px;
  }

  .status-กำลังรักษาอยู่ {
    background-color: #ffcccb; /* สีแดงอ่อน */
    color: #842029;
  }

  .status-จบการรักษา {
    background-color: #90ee90; /* สีเขียวอ่อน */
    color: #0f5132;
  }


  /* .patients {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 2rem;
  } 
   @media (min-width: 1120px) {
    .patients {
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
  } */
  /* .postures {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 2rem;
  }
  @media (min-width: 1120px) {
    .postures {
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
  } */
`;
export default Wrapper;
