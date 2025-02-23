import { FormRow, FormRowSelect } from ".";
import Wrapper from "../wrappers/SearchContainer";
import { Form, useSubmit } from "react-router-dom";
import {
  NOTIFY_SORT_BY,
  POSTURES_SORT_BY,
} from "../../../../utils/constants";
import { useAllNotificationContext } from "../../pages/AllNotification";
import { debounce } from "../../utils/debounce";

const SearchNotification = () => {
  const { searchValues } = useAllNotificationContext();
  const { search = "", sort = "" } = searchValues || {};
  const submit = useSubmit();

  return (
    <Wrapper>
      <Form className="form">
        <div className="form-center">
          <FormRow
            labelText="ค้นหา"
            type="search"
            name="search"
            defaultValue={search}
            onChange={debounce((form) => {
              submit(form);
            })}
          />

          <FormRowSelect
            labelText="เรียงลำดับ"
            name="sort"
            defaultValue={sort}
            list={[...Object.values(NOTIFY_SORT_BY)]}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
        </div>
      </Form>
    </Wrapper>
  );
};
export default SearchNotification;
