// Stores primary Classes and methods
import {
  search_school,
  retrieve_school_id,
  filter_school,
  SchoolSearch,
  test_interface,
  search_teacher,
  get_professor_rating,
} from "./features";
import * as fs from "fs";
(async function main() {
  // await test_interface();
  const search_school_data = await search_school("City College of New York");
  // console.log(search_school_data);
  // console.log(search_school_data.school_node);
  const filtered_data = await filter_school(
    search_school_data,
    "City College of New York"
  );

  let school_id = await retrieve_school_id("City College of New York");
  // console.log(school_id);
  // console.log(filtered_data.school_node);
  // console.log(filtered_data.department_map);

  const rmp_instance = new RateMyProfessor("City College of New York");
  const rmp_instance2 = new RateMyProfessor(
    "City College of New York",
    "Douglas Troeger"
  );

  let filtered_data_class = await rmp_instance.get_college_info_and_save(
    "random_json.json",
    true
  );

  const teacher_summary = await search_teacher(
    "Hamed Fazli",
    "City Collge of New York"
  );
  const professor_rating_list = await get_professor_rating(
    "Douglas Troeger",
    "City College of New York"
  );
  // console.log(filtered_data_class.department_map);
  // console.log(filtered_data_class.school_node);
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

  // get college summary
  public async get_college_info(retrieve_all: boolean): Promise<SchoolSearch> {
    if (retrieve_all) {
      return await search_school(this.collegeName);
    } else {
      return await filter_school(
        await search_school(this.collegeName),
        this.collegeName
      );
    }
  }

  public async get_college_info_and_save(
    file_name: string,
    retrieve_all: boolean
  ): Promise<SchoolSearch> {
    let retrieved_data = await this.get_college_info(retrieve_all);
    if (retrieve_all) {
      fs.writeFile(file_name, JSON.stringify(retrieved_data), (err) => {
        if (err) {
          console.error(`Error with saving data : ${err}`);
        }
        console.log("File created and saved data successfully!");
      });
    }

    return retrieved_data;
  }
}
