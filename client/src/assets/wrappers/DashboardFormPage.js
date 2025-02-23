import styled from 'styled-components';

const Wrapper = styled.section`
  border-radius: var(--border-radius);
  width: 90%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  background: var(--background-secondary-color);
  padding: 3rem 2rem 4rem;
  border-radius: 20px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
    rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  .form-title {
    margin-bottom: 2rem;
    text-align: center;
  }
  .form {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    max-width: 100%;
    width: 100%;
  }
  .form-row {
    margin-bottom: 0;
    margin-top: 10px;
    margin-bottom: 30px;
  }
  .form-center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
  }

  .form-btn {
    text-align: center;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    width: 30%;
    background-color: #87cefa;
  }
  .remove-btn {
    text-align: center;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    width: 10%;
    background-color: #c6c6c6;
    border-collapse: collapse;
    border: 1px solid white;
    border-radius: 5px;
    cursor: pointer;
  }
  .image-previews,
  .video-previews {
    text-align: center;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
  }
  .row {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  h4 {
    text-align: center;
  }

  .thumbnail {
    width: 400px;
    height: 200px;
    object-fit: cover; /* เพื่อให้ภาพถูกครอบตัดในขนาด 100x100 โดยไม่เสียอัตราส่วน */
  }

  .image-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .thumbnail-video {
    width: 400px;
    height: 200px;
    object-fit: cover; /* เพื่อให้ภาพถูกครอบตัดในขนาด 100x100 โดยไม่เสียอัตราส่วน */
  }

  .video-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (min-width: 992px) {
    .form-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      column-gap: 1rem;
    }
    .column1 {
      float: left;
      width: 45%;
      margin-right: 21px;
    }
    .column2 {
      float: right;
      width: 45%;
      margin-right: 23px;
    }

    /* Clear floats after the columns */
    .row:after {
      display: table;
      clear: both;
      width: 100%;
    }
  }
  @media (min-width: 1120px) {
    .form-center {
      grid-template-columns: 1fr 1fr 1fr;
    }
    .column1 {
      float: left;
      width: 45%;
      margin-right: 21px;
    }
    .column2 {
      float: right;
      width: 45%;
      margin-right: 23px;
    }

    /* Clear floats after the columns */
    .row:after {
      content: "";
      display: table;
      clear: both;
    }
  }
`;

export default Wrapper;
