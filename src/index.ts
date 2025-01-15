import {
  search_school,
  retrieve_school_id,
  filter_school,
  search_teacher,
  get_professor_rating,
  get_professor_list_by_school,
  API_LINK,
  TEACHER_BODY_QUERY,
  TEACHER_COMMENTS,
  TEACHER_RATING,
  TEACHER_RATING_QUERY,
  TEACHER_LIST_QUERY,
  GET_TEACHER_ID_QUERY,
  SCHOOL_BODY_QUERY,
  TEACHER_LIST,
  HEADERS,
} from "./features";

import type {
  TeacherList,
  TeacherRatings,
  SchoolSearch,
  SchoolSummary,
  School,
  SchoolNode,
  Department,
  ProfessorRating,
  TeacherSearch,
  TeacherNode,
} from "./types";

import * as fs from "fs";

export {
  search_school,
  retrieve_school_id,
  filter_school,
  search_teacher,
  get_professor_rating,
  get_professor_list_by_school,
  API_LINK,
  TEACHER_BODY_QUERY,
  TEACHER_COMMENTS,
  TEACHER_RATING,
  TEACHER_RATING_QUERY,
  TEACHER_LIST_QUERY,
  GET_TEACHER_ID_QUERY,
  SCHOOL_BODY_QUERY,
  TEACHER_LIST,
  HEADERS,
};

export type {
  TeacherList,
  TeacherRatings,
  SchoolSearch,
  SchoolSummary,
  School,
  SchoolNode,
  Department,
  ProfessorRating,
  TeacherSearch,
  TeacherNode,
};

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

  public async get_professor_info() {
    if (!this.teacherName) {
      console.error(
        "Name of professor is empty, please add professor name before continuing!"
      );
    } else {
      return await search_teacher(this.teacherName, this.collegeName);
    }
  }

  public async get_professor_info_and_save(file_name: string) {
    const professor_info = await this.get_professor_info();
    fs.writeFile(file_name, JSON.stringify(professor_info), (err) => {
      if (err) {
        console.error("There was an error saving the data", err);
      } else {
        console.log("Successfully saved data to file!");
      }
    });
    return professor_info;
  }
}
