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
  // console.log(filtered_data.school_node);
  // console.log(filtered_data.department_map);

  const rmp_instance = new RateMyProfessor("City College of New York");
  const rmp_instance2 = new RateMyProfessor(
    "City College of New York",
    "Douglas Troeger"
  );

  console.log(rmp_instance);
  console.log(rmp_instance2);
})();

// this is the main class
class RateMyProfessor {
  public collegeName: string;
  public teacherName: string;

  constructor(college_name: string, teacher_name?: string) {
    // constructor version 2 if teacher_name doesn't exist
    if (teacher_name) {
      this.collegeName = college_name;
      this.teacherName = teacher_name;

      // otherwise, implement the constructor to update only the college name
    } else {
      this.collegeName = college_name;
    }
  }
}
