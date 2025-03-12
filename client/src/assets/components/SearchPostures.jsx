// SearchMissions.jsx
import { FormRow, FormRowSelect, SubmitBtn } from ".";
import Wrapper from "../wrappers/SearchContainer";
import { Form, useSubmit } from "react-router-dom";
// Assuming you have new constants for missions. Otherwise, you can re-use the posture constants.
import { TYPEPOSTURES, MISSIONS_SORT_BY } from "../../../../utils/constants";
import { useAllPostureContext } from "../../pages/AllPosture";

const SearchMissions = () => {
  const { searchValues } = useAllPostureContext();
  const { search = "", missionType = "", sort = "" } = searchValues || {};
  const submit = useSubmit();

  const debounce = (onChange) => {
    let timeout;
    return (e) => {
      const form = e.currentTarget.form;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onChange(form);
      }, 2000);
    };
  };

  return (
    <Wrapper>
      <Form className="form">
        <div className="form-center">
          <FormRow
            labelText="ค้นหา"
            type="search"
            name="search"
            defaultValue={search}
            onChange={debounce((form) => submit(form))}
          />

          <FormRowSelect
            labelText="ประเภทภารกิจ"
            name="missionType"
            list={["ทั้งหมด", ...Object.values(TYPEPOSTURES)]}
            defaultValue={missionType}
            onChange={(e) => submit(e.currentTarget.form)}
          />

          <FormRowSelect
            labelText="เรียงลำดับ"
            name="sort"
            defaultValue={sort}
            list={[...Object.values(MISSIONS_SORT_BY)]}
            onChange={(e) => submit(e.currentTarget.form)}
          />
        </div>
      </Form>
    </Wrapper>
  );
};

export default SearchMissions;
