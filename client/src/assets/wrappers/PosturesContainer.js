import styled from "styled-components";

const Wrapper = styled.section`
  margin-top: 4rem;
  text-align: center;
  h2 {
    text-align: center;
  }

  .postures-table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    thead {
      background-color: #87ceff;
      padding: 5px;
      tr {
        th {
          padding: 1rem;
          text-align: center;
          font-weight: 600;
          padding: 10px;
        }
      }
    }
    tbody {
      tr {
        &:nth-of-type(even) {
          background-color: #d4ecfb;
        }
        td {
          padding: 1rem;
          border-bottom: 1px solid #eaeaea;
          border: none;
        }
        .editbtnja {
          margin-right: 0.5rem;
          padding: 5px;
          background-color: white;
          color: #21b814;
          border-radius: 10px;
          border: 1px solid #21b814;
          width: 55px;
        }
        .delbtnja {
          margin-right: 0.5rem;
          padding: 5px;
          background-color: white;
          color: #ff6a6a;
          border-radius: 10px;
          border: 1px solid #ff6a6a;
          width: 55px;
        }
      }
    }
  }

  @media (min-width: 768px) {
    .postures-table {
      thead {
        tr {
          th {
            padding: 0.5rem 1rem;
          }
        }
      }
      tbody {
        tr {
          td {
            padding: 0.5rem 1rem;
          }
        }
      }
    }
  }
`;
export default Wrapper;
