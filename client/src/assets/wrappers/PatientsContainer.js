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

  margin-top: 4rem;
  h2 {
    text-transform: none;
  }
  & > h5 {
    font-weight: 700;
    margin-bottom: 1.5rem;
  }

  .missions-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    padding: 1rem;
  }

  .mission-card {
    background: var(--background-secondary-color);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    box-shadow: var(--shadow-2);
  }

  .mission-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    h3 {
      margin: 0;
      color: var(--primary-500);
    }
  }

  .mission-actions {
    display: flex;
    gap: 0.5rem;
    
    .btn {
      padding: 0.25rem 0.5rem;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: var(--border-radius);
    }

    .edit-btn {
      background: var(--primary-500);
      color: white;
    }

    .delete-btn {
      background: var(--red-dark);
      color: white;
    }
  }

  .mission-details {
    margin-bottom: 1.5rem;
    p {
      margin: 0.5rem 0;
    }
  }

  .submissions-section {
    border-top: 1px solid var(--grey-100);
    padding-top: 1rem;
    
    h4 {
      color: var(--primary-500);
      margin-bottom: 1rem;
    }
  }

  .submissions-list {
    display: grid;
    gap: 1rem;
  }

  .submission-item {
    background: var(--background-color);
    padding: 1rem;
    border-radius: var(--border-radius);
    
    p {
      margin: 0.5rem 0;
    }
  }

  .media-preview {
    margin-top: 0.5rem;
    
    img, video {
      max-width: 100%;
      border-radius: var(--border-radius);
      margin-top: 0.5rem;
    }
  }

  @media (min-width: 992px) {
    .missions-container {
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    }
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
