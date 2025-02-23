import { useState } from "react";

import BarChart from "./BarChart";
import AreaChart from "./AreaChart";
import Wrapper from "../wrappers/ChartsContainer";

const ChartsContainer = ({ data, title }) => {
  const [barChart, setBarChart] = useState(true);

  return (
    <Wrapper>
      <h4>{title}</h4>
      <button type="button" onClick={() => setBarChart(!barChart)}>
        {barChart ? "Bar Chart" : "Area Chart"}
      </button>
      {barChart ? <BarChart data={data} /> : <AreaChart data={data} />}
    </Wrapper>
  );
};

export default ChartsContainer;
