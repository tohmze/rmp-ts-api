// Stores primary Classes and methods
import { test_interface } from "./features";
import { search_school } from "./features";
import { filter_school } from "./features";
(async function main() {
  // await test_interface();
  const search_school_data = await search_school("City College of New York");
  // console.log(search_school_data);
  // console.log(search_school_data.school_node);
  const filtered_data = await filter_school(
    search_school_data,
    "City College of New York"
  );
  console.log(filtered_data.school_node);
  console.log(filtered_data.department_map);
})();
