// Stores primary Classes and methods
import {
  search_school,
  retrieve_school_id,
  filter_school,
  SchoolSearch,
  search_teacher,
  get_professor_rating,
  get_professor_list_by_school,
} from "./features";
import * as fs from "fs";

// (async function main() {
//   // await test_interface();
//   const search_school_data = await search_school("City College of New York");
//   // console.log(search_school_data);
//   // console.log(search_school_data.school_node);
//   const filtered_data = await filter_school(
//     search_school_data,
//     "City College of New York"
//   );

//   let school_id = await retrieve_school_id("City College of New York");
//   // console.log(school_id);
//   // console.log(filtered_data.school_node);
//   // console.log(filtered_data.department_map);

//   const rmp_instance = new RateMyProfessor("City College of New York");
//   const rmp_instance2 = new RateMyProfessor(
//     "City College of New York",
//     "Douglas Troeger"
//   );

//   console.log(rmp_instance);
//   rmp_instance.set_college("Baruch College");
//   console.log(rmp_instance);
//   await rmp_instance.get_comments_by_professor();

//   rmp_instance.set_professor_name("Kutub Thakur");
//   console.log(rmp_instance);

//   const professor_comments =
//     await rmp_instance.get_comments_by_professor_and_save(
//       "professor_comments.json"
//     );
//   console.log(professor_comments);

//   // let professor_list = await rmp_instance.get_professor_list();
//   // console.log(professor_list);

//   // let filtered_data_class = await rmp_instance.get_college_info_and_save(
//   //   "random_json.json",
//   //   true
//   // );

//   // let professor_list = await rmp_instance.get_professor_list();
//   // // console.log(professor_list);

//   // let professor_list_saved = await rmp_instance.get_professor_list_and_save(
//   //   "professor_list.json"
//   // );
//   // console.log(professor_list_saved);

//   // const teacher_summary = await search_teacher(
//   //   "Hamed Fazli",
//   //   "City Collge of New York"
//   // );
//   // const professor_ratings = await get_professor_rating(
//   //   "Douglas Troeger",
//   //   "City College of New York"
//   // );

//   // const professor_list = await get_professor_list_by_school(
//   //   "City College of New York"
//   // );

//   // console.log(professor_list);

//   // console.log(professor_ratings);
// })();

// this is the main class
export class RateMyProfessor {
  public collegeName: string;
  public teacherName: string | any;

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

  public async get_professor_list() {
    return await get_professor_list_by_school(this.collegeName);
  }

  public async get_professor_list_and_save(file_name: string) {
    const professor_list = await this.get_professor_list();

    fs.writeFile(file_name, JSON.stringify(professor_list), (err) => {
      if (err) {
        console.error(`Error with saving data : ${err}`);
      }
      console.log("File created and saved data successfully!");
    });

    return professor_list;
  }

  public set_college(new_college_name: string) {
    this.collegeName = new_college_name;
  }

  public set_professor_name(new_professor_name: string) {
    this.teacherName = new_professor_name;
  }

  public set_college_and_professor_name(
    college_name: string,
    professor_name: string
  ) {
    this.set_college(college_name);
    this.set_professor_name(professor_name);
  }

  public async get_comments_by_professor() {
    if (!this.teacherName) {
      console.error(
        "Name of professor is empty, please add professor name before continuing!"
      );
    } else {
      return await get_professor_rating(this.teacherName, this.collegeName);
    }
  }

  public async get_comments_by_professor_and_save(file_name: string) {
    let professor_comments = await this.get_comments_by_professor();
    fs.writeFile(file_name, JSON.stringify(professor_comments), (err) => {
      if (err) {
        console.error("There was an error saving the data", err);
      } else {
        console.log("Successfully saved data to file!");
      }
    });

    return professor_comments;
  }
}
